'use client';

import React from 'react';
import { PriceConfidence } from '@/types/transit';
import { ShieldCheck, AlertTriangle, HelpCircle } from 'lucide-react';

interface FareBadgeProps {
  confidence: PriceConfidence;
  className?: string;
}

export const FareBadge: React.FC<FareBadgeProps> = ({ confidence, className = '' }) => {
  switch (confidence) {
    case 'VERIFIED':
      return (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md ${className}`}
          title="Consensus verified by multiple recent commuter GPS reports with low variance"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>VERIFIED</span>
        </span>
      );
    case 'VOLATILE':
      return (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-md ${className}`}
          title="Rapid price swings detected due to rain, fuel hike, or corridor rush surge"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>VOLATILE</span>
        </span>
      );
    case 'ESTIMATED':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-900 border border-slate-700/60 px-2 py-0.5 rounded-md ${className}`}
          title="Estimated from historical corridor schedules and regulated LAMATA baselines"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>ESTIMATED</span>
        </span>
      );
  }
};
