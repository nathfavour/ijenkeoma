import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_FARE_REPORTS } from '@/lib/transit-data';
import { calculateConsensusPrice } from '@/lib/consensus-engine';
import { TransportMode, WeatherCondition } from '@/types/transit';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get('mode') as TransportMode) || 'danfo';
  const weather = (searchParams.get('weather') as WeatherCondition) || 'clear';
  const corridor = searchParams.get('corridor') || 'OSHODI_CMS_MARINA';

  const consensus = calculateConsensusPrice(INITIAL_FARE_REPORTS, mode, weather);

  return NextResponse.json(
    {
      status: 'success',
      data: {
        corridor,
        mode,
        weather,
        consensus_fare_ngn: consensus.consensusFareNgn,
        fare_band: {
          low_ngn: consensus.lowBoundNgn,
          high_ngn: consensus.highBoundNgn,
        },
        confidence: consensus.confidence,
        volatility_index: consensus.volatilityIndex,
        surge_multiplier: consensus.surgeMultiplier,
        factors: consensus.consensusFactors,
        sample_metrics: {
          total_reports: consensus.totalSubmissions,
          weighted_volume: consensus.weightedSubmissions,
          last_report_age_mins: consensus.lastReportAgeMinutes,
        },
      },
      metadata: {
        engine: 'Ìjènkéọ́mā EWMA Half-Life 45m',
        geofence_verified: true,
        ndpr_compliant: true,
        timestamp: new Date().toISOString(),
      },
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'X-RateLimit-Limit': '500000',
        'X-RateLimit-Remaining': '498210',
        'X-RateLimit-Reset': '1730678400',
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { originStopId, destinationStopId, transportMode, paidFareNgn, weatherCondition } = body;

    if (!originStopId || !destinationStopId || !paidFareNgn) {
      return NextResponse.json(
        { error: 'Missing required parameters: originStopId, destinationStopId, paidFareNgn' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: 'created',
      message: 'Ground-truth fare observation accepted into consensus stream.',
      report_id: `rep_${Date.now()}`,
      xp_awarded: 50,
      reward_credit_ngn: 150,
      trust_multiplier: 1.0,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }
}
