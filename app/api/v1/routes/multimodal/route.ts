import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_JOURNEYS } from '@/lib/transit-data';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');

  return NextResponse.json({
    status: 'success',
    total_journeys: INITIAL_JOURNEYS.length,
    journeys: INITIAL_JOURNEYS,
    filter_applied: { origin, destination },
    generated_at: new Date().toISOString(),
  });
}
