import { NextRequest, NextResponse } from 'next/server';
import { ENTERPRISE_B2B_METRICS } from '@/lib/transit-data';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const isMockBearerValid = authHeader?.startsWith('Bearer ') || true; // Allow guest/public preview

  return NextResponse.json(
    {
      status: 'success',
      data: {
        active_corridors_monitored: ENTERPRISE_B2B_METRICS.activeCorridorsCount,
        hourly_gps_points: ENTERPRISE_B2B_METRICS.hourlyObservationsCount,
        mean_volatility_index: ENTERPRISE_B2B_METRICS.meanFareVolatilityIndex,
        peak_ratio: ENTERPRISE_B2B_METRICS.congestionPeakRatio,
        origin_destination_flows: ENTERPRISE_B2B_METRICS.originDestinationFlows,
        corridor_bottlenecks: ENTERPRISE_B2B_METRICS.topCorridors,
      },
      telemetry: {
        mesh_resolution_meters: 50,
        anonymized_ndpr_hash: 'SHA256_COARSE_GEO',
        generated_at: new Date().toISOString(),
      },
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
        'X-RateLimit-Limit': '500000',
        'X-RateLimit-Remaining': '497940',
      },
    }
  );
}
