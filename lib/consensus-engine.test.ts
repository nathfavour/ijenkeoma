import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateConsensusPrice, calculateTimeDecayWeight } from './consensus-engine';
import { FareReport } from '@/types/transit';

describe('Consensus Pricing Algorithm', () => {
  it('calculates exponential time decay weight correctly for 45-min half life', () => {
    const now = 1000000;
    const exactHalfLifeTimestamp = now - 45 * 60 * 1000;
    const weight = calculateTimeDecayWeight(exactHalfLifeTimestamp, now);
    // Weight at half-life should be approximately 0.5
    assert.ok(Math.abs(weight - 0.5) < 0.01, 'Weight at half-life must be approx 0.5');
  });

  it('rejects outliers beyond standard deviation thresholds', () => {
    const now = Date.now();
    const reportsWithOutlier: FareReport[] = [
      {
        id: '1',
        routeCode: 'TEST',
        originStopId: 'oshodi',
        destinationStopId: 'cms',
        transportMode: 'danfo',
        paidFareNgn: 500,
        weatherCondition: 'clear',
        congestionLevel: 'free',
        timeOfDay: 'midday',
        timestamp: now - 5000,
        contributorName: 'Alice',
        contributorTrustScore: 1.5,
        isVerified: true,
      },
      {
        id: '2',
        routeCode: 'TEST',
        originStopId: 'oshodi',
        destinationStopId: 'cms',
        transportMode: 'danfo',
        paidFareNgn: 550,
        weatherCondition: 'clear',
        congestionLevel: 'free',
        timeOfDay: 'midday',
        timestamp: now - 8000,
        contributorName: 'Bob',
        contributorTrustScore: 1.2,
        isVerified: true,
      },
      {
        id: 'outlier',
        routeCode: 'TEST',
        originStopId: 'oshodi',
        destinationStopId: 'cms',
        transportMode: 'danfo',
        paidFareNgn: 45000, // Extortion outlier
        weatherCondition: 'clear',
        congestionLevel: 'free',
        timeOfDay: 'midday',
        timestamp: now - 2000,
        contributorName: 'BadActor',
        contributorTrustScore: 0.5,
        isVerified: false,
      },
    ];

    const result = calculateConsensusPrice(reportsWithOutlier, 'danfo', 'clear', now);
    // Outlier ₦45,000 must be rejected; consensus should be around ₦500-₦550
    assert.ok(result.consensusFareNgn < 1000, 'Consensus should reject outlier');
    assert.ok(result.consensusFareNgn >= 500, 'Consensus should be bounded by valid reports');
  });

  it('applies weather markup under heavy rain', () => {
    const now = Date.now();
    const baseReports: FareReport[] = [
      {
        id: '1',
        routeCode: 'TEST',
        originStopId: 'oshodi',
        destinationStopId: 'cms',
        transportMode: 'danfo',
        paidFareNgn: 500,
        weatherCondition: 'clear',
        congestionLevel: 'free',
        timeOfDay: 'midday',
        timestamp: now - 5000,
        contributorName: 'Alice',
        contributorTrustScore: 1.5,
        isVerified: true,
      },
      {
        id: '2',
        routeCode: 'TEST',
        originStopId: 'oshodi',
        destinationStopId: 'cms',
        transportMode: 'danfo',
        paidFareNgn: 500,
        weatherCondition: 'clear',
        congestionLevel: 'free',
        timeOfDay: 'midday',
        timestamp: now - 6000,
        contributorName: 'Bob',
        contributorTrustScore: 1.2,
        isVerified: true,
      },
    ];

    const rainResult = calculateConsensusPrice(baseReports, 'danfo', 'heavy_rain', now);
    assert.ok(rainResult.surgeMultiplier >= 1.45, 'Heavy rain markup should be at least 45%');
    assert.ok(rainResult.highBoundNgn > rainResult.consensusFareNgn, 'High bound should expand with volatility');
  });
});
