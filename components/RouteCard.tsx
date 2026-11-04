'use client';

import React, { useState } from 'react';
import { MultimodalJourney, TransportMode } from '@/types/transit';
import { useTransitStore } from '@/lib/store';
import {
  Clock,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Eye,
  Bus,
  Train,
  Ship,
  Footprints,
  Compass,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface RouteCardProps {
  journey: MultimodalJourney;
  onSelect?: () => void;
  isSelected?: boolean;
}

export const getModeIcon = (mode: TransportMode) => {
  switch (mode) {
    case 'rail':
      return <Train className="w-4 h-4 text-sky-400" />;
    case 'ferry':
      return <Ship className="w-4 h-4 text-cyan-400" />;
    case 'brt':
      return <Bus className="w-4 h-4 text-rose-400" />;
    case 'danfo':
    case 'korope':
      return <Bus className="w-4 h-4 text-amber-400" />;
    case 'walk':
      return <Footprints className="w-4 h-4 text-slate-400" />;
    default:
      return <Compass className="w-4 h-4 text-emerald-400" />;
  }
};

export const RouteCard: React.FC<RouteCardProps> = ({
  journey,
  onSelect,
  isSelected = false,
}) => {
  const {
    savedJourneys,
    toggleSaveJourney,
    setVisualProofingStopId,
    setProofingModalOpen,
  } = useTransitStore();

  const [expanded, setExpanded] = useState(false);

  const isSaved = savedJourneys.some((j) => j.id === journey.id);

  const handleOpenProofing = (stopId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setVisualProofingStopId(stopId);
    setProofingModalOpen(true);
  };

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl transition-all duration-300 border cursor-pointer overflow-hidden ${
        isSelected
          ? 'bg-[#111422] border-amber-400/80 shadow-2xl shadow-amber-500/10'
          : 'bg-[#0E111A]/90 hover:bg-[#121624] border-white/[0.07] hover:border-white/15'
      }`}
    >
      {/* Card Header: Metadata using clean typographic separators */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="font-semibold text-amber-300 uppercase tracking-wider text-[11px]">
            {journey.recommendedFor === 'fastest' && 'Fastest Route'}
            {journey.recommendedFor === 'scenic_water' && 'Lagoon Water Link'}
            {journey.recommendedFor === 'comfort_rail' && 'Electrified Rail'}
            {journey.recommendedFor === 'cheapest' && 'Lowest Fare Band'}
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>{journey.segments.length} Transit Legs</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>{journey.transfersCount} Transfers</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Subtle text confidence status */}
          <span className={`text-[11px] font-semibold tracking-wider ${
            journey.confidenceBadge === 'VERIFIED'
              ? 'text-emerald-400'
              : journey.confidenceBadge === 'VOLATILE'
              ? 'text-amber-400'
              : 'text-slate-400'
          }`}>
            {journey.confidenceBadge} CONSENSUS
          </span>

          {/* Bookmark offline toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveJourney(journey);
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              isSaved
                ? 'text-amber-400 bg-amber-400/10'
                : 'text-slate-500 hover:text-white hover:bg-white/[0.06]'
            }`}
            title={isSaved ? 'Saved offline' : 'Save route offline'}
            aria-label="Save route offline"
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Journey Overview */}
      <div className="p-6 md:p-7 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
              {journey.title}
            </h3>
            <p className="text-xs md:text-sm text-slate-400 font-normal leading-relaxed">
              {journey.tagline}
            </p>
          </div>

          {/* Fare & Duration Group */}
          <div className="flex items-center gap-6 shrink-0 pt-2 md:pt-0">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-medium">
                Consensus Fare
              </span>
              <div className="text-2xl font-extrabold text-amber-400 tabular-nums">
                ₦{journey.totalFareNgn.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 tabular-nums">
                Band: ₦{journey.fareRange.min} - ₦{journey.fareRange.max}
              </span>
            </div>

            <div className="border-l border-white/[0.08] pl-6">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-medium">
                Transit Time
              </span>
              <div className="text-2xl font-bold text-white tabular-nums flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                {journey.totalDurationMin}m
              </div>
              <span className="text-[11px] text-slate-500 tabular-nums">
                ~{journey.totalWaitMin}m waiting
              </span>
            </div>
          </div>
        </div>

        {/* Multimodal Steps Timeline Row */}
        <div className="flex items-center gap-2.5 flex-wrap pt-1">
          {journey.segments.map((seg, idx) => (
            <React.Fragment key={seg.id}>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-200">
                {getModeIcon(seg.mode)}
                <span className="capitalize font-semibold text-white">{seg.mode}</span>
                <span className="text-slate-400 text-[11px] tabular-nums">· {seg.durationMin}m</span>
              </div>
              {idx < journey.segments.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Expandable Step-by-Step Instructions & Landmarks */}
        <div className="pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="flex items-center gap-2 text-xs font-semibold text-amber-400/90 hover:text-amber-300 py-1 transition-colors"
          >
            <span>{expanded ? 'Hide segment directions' : `View ${journey.segments.length} segment instructions & window landmarks`}</span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expanded && (
            <div className="mt-4 space-y-4 pt-4 border-t border-white/[0.08] animate-in fade-in">
              {journey.segments.map((seg, idx) => (
                <div
                  key={seg.id}
                  className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 text-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-400/10 text-amber-400 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-white">
                        {seg.fromStop.name} → {seg.toStop.name}
                      </span>
                    </div>
                    <span className="font-bold text-amber-400 tabular-nums">
                      ₦{seg.fareNgn}
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed font-normal">
                    {seg.instructions}
                  </p>

                  {seg.localAdvice && (
                    <div className="p-2.5 rounded-lg bg-amber-400/[0.06] border border-amber-400/15 text-[11px] text-amber-200/90 leading-relaxed">
                      <strong>Conductor Tip:</strong> {seg.localAdvice}
                    </div>
                  )}

                  {/* Trigger Visual Proofing Drawer */}
                  <div className="pt-2 flex items-center justify-between border-t border-white/[0.06]">
                    <span className="text-[11px] text-slate-400">
                      Drop-off: <strong className="text-white">{seg.toStop.localName}</strong>
                    </span>
                    <button
                      onClick={(e) => handleOpenProofing(seg.toStop.id, e)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-semibold text-xs border border-amber-400/20 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Window Drop-off</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
