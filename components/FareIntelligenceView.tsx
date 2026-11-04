'use client';

import React, { useState } from 'react';
import { useTransitStore } from '@/lib/store';
import { calculateConsensusPrice } from '@/lib/consensus-engine';
import { TransportMode, WeatherCondition } from '@/types/transit';
import {
  ShieldCheck,
  PlusCircle,
  CloudRain,
  Sun,
  Fuel,
  Users,
  Flame,
  ArrowRight,
} from 'lucide-react';

export const FareIntelligenceView: React.FC = () => {
  const {
    fareReports,
    currentWeather,
    setCurrentWeather,
    setFareModalOpen,
  } = useTransitStore();

  const [selectedMode, setSelectedMode] = useState<TransportMode>('danfo');
  const [renderTime] = useState(() => Date.now());

  const consensusResult = calculateConsensusPrice(fareReports, selectedMode, currentWeather, renderTime);

  return (
    <div className="space-y-10 animate-in fade-in">
      
      {/* Title & Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <ShieldCheck className="w-4 h-4" />
            <span>EWMA Consensus Engine (45m Decay Half-Life)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Ground-Truth Fare & Surge Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl font-normal leading-relaxed">
            Consensus pricing derived from real commuter submissions, filtering out arbitrary price gouging, rain markups, and fuel spikes.
          </p>
        </div>

        <button
          onClick={() => setFareModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/10 active:scale-[0.98] transition-transform min-h-[48px] shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Paid Fare</span>
        </button>
      </div>

      {/* Mode Selector and Weather Condition Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0B0D16] p-3.5 rounded-2xl border border-white/[0.08]">
        
        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['danfo', 'korope', 'brt', 'keke', 'rail', 'ferry', 'okada'] as TransportMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 min-h-[42px] ${
                selectedMode === mode
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white bg-white/[0.02] border border-white/[0.06]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Live Weather Surge Simulation Bar */}
        <div className="flex items-center gap-1.5 bg-[#07090F] p-1.5 rounded-xl border border-white/[0.08] self-start md:self-auto text-xs">
          <button
            onClick={() => setCurrentWeather('clear')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              currentWeather === 'clear' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
          <button
            onClick={() => setCurrentWeather('heavy_rain')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              currentWeather === 'heavy_rain' ? 'bg-indigo-500/20 text-indigo-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Heavy Rain (+45%)</span>
          </button>
          <button
            onClick={() => setCurrentWeather('scarcity')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              currentWeather === 'scarcity' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Fuel className="w-3.5 h-3.5" />
            <span>Fuel Spike</span>
          </button>
        </div>

      </div>

      {/* Consensus Metrics Main Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Consensus Fair Price Card */}
        <div className="rounded-2xl bg-[#0E111A] border border-white/[0.08] p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Consensus Corridor Fare
            </span>
            <span className={`text-[11px] font-semibold tracking-wider ${
              consensusResult.confidence === 'VERIFIED' ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {consensusResult.confidence}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 tabular-nums">
              ₦{consensusResult.consensusFareNgn.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-normal">fair corridor average</span>
          </div>

          <div className="text-xs text-slate-300 pt-1">
            Expected Band:{' '}
            <strong className="text-white tabular-nums">
              ₦{consensusResult.lowBoundNgn} – ₦{consensusResult.highBoundNgn}
            </strong>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed pt-3 border-t border-white/[0.06]">
            Calculated across verified {selectedMode} trips in the last 45-minute decay window.
          </p>
        </div>

        {/* Volatility & Surge Analysis */}
        <div className="rounded-2xl bg-[#0E111A] border border-white/[0.08] p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Volatility & Surge Factor
            </span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
              {consensusResult.surgeMultiplier}x
            </span>
            <span className="text-xs text-slate-400 font-normal">Surge Multiplier</span>
          </div>

          <div className="space-y-2 text-xs pt-1">
            <div className="flex justify-between text-slate-300">
              <span>Weather / Rain Markup:</span>
              <span className="font-semibold text-amber-400 tabular-nums">
                +{consensusResult.consensusFactors.weatherMarkupPct}%
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Variance Index:</span>
              <span className="font-semibold text-white tabular-nums">
                {consensusResult.volatilityIndex}/100
              </span>
            </div>
          </div>
        </div>

        {/* Contributor Rigor */}
        <div className="rounded-2xl bg-[#0E111A] border border-white/[0.08] p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Mathematical Model
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="space-y-2 text-xs text-slate-300 pt-1">
            <div className="flex justify-between">
              <span>Active Reports:</span>
              <span className="font-mono text-white tabular-nums">{consensusResult.totalSubmissions}</span>
            </div>
            <div className="flex justify-between">
              <span>Weighted Trust Volume:</span>
              <span className="font-mono text-amber-400 tabular-nums">{consensusResult.weightedSubmissions}</span>
            </div>
            <div className="flex justify-between">
              <span>Half-life Decay:</span>
              <span className="text-slate-400">45 minutes</span>
            </div>
            <div className="flex justify-between">
              <span>Latest Sync:</span>
              <span className="text-white font-mono">{consensusResult.lastReportAgeMinutes}m ago</span>
            </div>
          </div>
        </div>

      </div>

      {/* Live Crowdsourced Feed */}
      <div className="rounded-2xl bg-[#0E111A] border border-white/[0.08] p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white">Live Ground-Truth Submissions</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {fareReports.length} reports logged today
          </span>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {fareReports.map((report) => {
            const ageMins = Math.max(1, Math.round((renderTime - report.timestamp) / (60 * 1000)));
            return (
              <div key={report.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white uppercase text-[11px] px-2 py-0.5 rounded bg-white/[0.05]">
                      {report.transportMode}
                    </span>
                    <span className="font-semibold text-slate-200">
                      {report.originStopId.toUpperCase()} ↔ {report.destinationStopId.toUpperCase()}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400 capitalize">{report.congestionLevel} traffic</span>
                  </div>
                  <div className="text-slate-400 text-[11px] flex items-center gap-2">
                    <span>Reported by <strong className="text-slate-300 font-medium">{report.contributorName}</strong></span>
                    <span className="text-slate-600">·</span>
                    <span className="text-emerald-400">Trust {(report.contributorTrustScore * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:text-right">
                  <div>
                    <span className="text-base font-bold text-amber-400 tabular-nums">
                      ₦{report.paidFareNgn.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{ageMins}m ago</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
