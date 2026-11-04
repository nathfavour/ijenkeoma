import { FareReport, PriceConfidence, TransportMode, WeatherCondition } from '@/types/transit';

export interface ConsensusResult {
  consensusFareNgn: number;
  lowBoundNgn: number;
  highBoundNgn: number;
  confidence: PriceConfidence;
  totalSubmissions: number;
  weightedSubmissions: number;
  surgeMultiplier: number;
  volatilityIndex: number; // 0 to 100
  lastReportAgeMinutes: number;
  consensusFactors: {
    weatherMarkupPct: number;
    rushMarkupPct: number;
    fuelScarcityMarkupPct: number;
  };
}

/**
 * Computes Exponential Time Decay Weight
 * Half-life: 45 minutes = 2,700,000 ms
 */
export function calculateTimeDecayWeight(reportTimestamp: number, now: number = Date.now()): number {
  const HALF_LIFE_MS = 45 * 60 * 1000;
  const ageMs = Math.max(0, now - reportTimestamp);
  const lambda = Math.LN2 / HALF_LIFE_MS;
  return Math.exp(-lambda * ageMs);
}

/**
 * Dynamic Consensus Pricing Engine using EWMA with Trust Score & Timestamp Decay
 */
export function calculateConsensusPrice(
  reports: FareReport[],
  mode: TransportMode,
  currentWeather: WeatherCondition = 'clear',
  now: number = Date.now()
): ConsensusResult {
  const relevantReports = reports.filter((r) => r.transportMode === mode);

  if (relevantReports.length === 0) {
    // Default baseline heuristics for mode when zero live crowdsourced reports
    const modeBaseFares: Record<TransportMode, number> = {
      danfo: 400,
      korope: 350,
      brt: 300,
      keke: 250,
      okada: 500,
      rail: 600,
      ferry: 1500,
      hitch: 800,
      walk: 0,
    };
    const base = modeBaseFares[mode] || 400;
    return {
      consensusFareNgn: base,
      lowBoundNgn: Math.round(base * 0.9),
      highBoundNgn: Math.round(base * 1.2),
      confidence: 'ESTIMATED',
      totalSubmissions: 0,
      weightedSubmissions: 0,
      surgeMultiplier: 1.0,
      volatilityIndex: 12,
      lastReportAgeMinutes: 999,
      consensusFactors: {
        weatherMarkupPct: 0,
        rushMarkupPct: 0,
        fuelScarcityMarkupPct: 0,
      },
    };
  }

  // 1. Outlier Rejection via Interquartile Range (IQR) or deviation
  const rawFares = relevantReports.map((r) => r.paidFareNgn).sort((a, b) => a - b);
  const median = rawFares[Math.floor(rawFares.length / 2)];
  const validReports = relevantReports.filter((r) => {
    // Drop obvious anomalies (< ₦50 or > ₦25,000 for standard intra-city leg)
    if (r.paidFareNgn < 50 || r.paidFareNgn > 25000) return false;
    // Drop reports beyond 3.5x median deviation
    return Math.abs(r.paidFareNgn - median) <= median * 2.5;
  });

  const reportsToUse = validReports.length > 0 ? validReports : relevantReports;

  // 2. Compute Weighted EWMA
  let totalWeightedFare = 0;
  let totalWeight = 0;
  let weightedSquares = 0;
  let newestTimestamp = 0;

  for (const report of reportsToUse) {
    const timeWeight = calculateTimeDecayWeight(report.timestamp, now);
    const trustWeight = Math.max(0.5, Math.min(2.5, report.contributorTrustScore));
    const verifiedBonus = report.isVerified ? 1.25 : 1.0;
    const finalWeight = timeWeight * trustWeight * verifiedBonus;

    totalWeightedFare += report.paidFareNgn * finalWeight;
    totalWeight += finalWeight;
    weightedSquares += Math.pow(report.paidFareNgn, 2) * finalWeight;

    if (report.timestamp > newestTimestamp) {
      newestTimestamp = report.timestamp;
    }
  }

  const consensus = totalWeight > 0 ? totalWeightedFare / totalWeight : median;

  // Weighted standard deviation for volatility
  const variance = totalWeight > 0 ? Math.max(0, weightedSquares / totalWeight - Math.pow(consensus, 2)) : 0;
  const stdDev = Math.sqrt(variance);
  const coeffOfVariation = consensus > 0 ? (stdDev / consensus) * 100 : 0;

  // 3. Surge and Weather Factor analysis
  let weatherMarkup = 0;
  if (currentWeather === 'heavy_rain') weatherMarkup = 45;
  else if (currentWeather === 'light_rain') weatherMarkup = 20;
  else if (currentWeather === 'scarcity') weatherMarkup = 60;

  // 4. Price Confidence Classification
  let confidence: PriceConfidence = 'ESTIMATED';
  if (reportsToUse.length >= 4 && coeffOfVariation < 18) {
    confidence = 'VERIFIED';
  } else if (coeffOfVariation >= 25 || weatherMarkup >= 35) {
    confidence = 'VOLATILE';
  } else if (reportsToUse.length >= 2) {
    confidence = 'VERIFIED';
  }

  const roundedConsensus = Math.round(consensus / 50) * 50;
  const lowBound = Math.max(100, Math.round((consensus - stdDev * 0.8) / 50) * 50);
  const highBound = Math.round((consensus + stdDev * 1.1 + (weatherMarkup * consensus) / 100) / 50) * 50;

  const ageMinutes = newestTimestamp > 0 ? Math.max(1, Math.round((now - newestTimestamp) / (60 * 1000))) : 999;

  return {
    consensusFareNgn: roundedConsensus,
    lowBoundNgn: Math.min(lowBound, roundedConsensus),
    highBoundNgn: Math.max(highBound, roundedConsensus),
    confidence,
    totalSubmissions: reportsToUse.length,
    weightedSubmissions: Number(totalWeight.toFixed(2)),
    surgeMultiplier: Number((1 + weatherMarkup / 100).toFixed(2)),
    volatilityIndex: Math.min(100, Math.round(coeffOfVariation)),
    lastReportAgeMinutes: ageMinutes,
    consensusFactors: {
      weatherMarkupPct: weatherMarkup,
      rushMarkupPct: 15,
      fuelScarcityMarkupPct: currentWeather === 'scarcity' ? 40 : 0,
    },
  };
}
