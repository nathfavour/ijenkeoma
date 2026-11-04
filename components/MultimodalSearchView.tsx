'use client';

import React, { useState } from 'react';
import { useTransitStore } from '@/lib/store';
import { TRANSIT_STOPS } from '@/lib/transit-data';
import { RouteCard } from './RouteCard';
import { LiveCongestionMap } from './LiveCongestionMap';
import { TransportMode } from '@/types/transit';
import {
  Search,
  ArrowUpDown,
  MapPin,
  Navigation,
  Bookmark,
  PlusCircle,
  Compass,
} from 'lucide-react';
import Image from 'next/image';

export const MultimodalSearchView: React.FC = () => {
  const {
    journeys,
    savedJourneys,
    setFareModalOpen,
  } = useTransitStore();

  const stopList = Object.values(TRANSIT_STOPS);

  const [originId, setOriginId] = useState('ikeja_underbridge');
  const [destId, setDestId] = useState('cms_marina');
  const [modeFilter, setModeFilter] = useState<'all' | TransportMode>('all');
  const [sortBy, setSortBy] = useState<'fastest' | 'cheapest' | 'transfers'>('fastest');
  const [viewSavedOnly, setViewSavedOnly] = useState(false);

  const handleSwapStops = () => {
    const temp = originId;
    setOriginId(destId);
    setDestId(temp);
  };

  const displayedJourneys = (viewSavedOnly ? savedJourneys : journeys)
    .filter((j) => {
      if (modeFilter === 'all') return true;
      return j.segments.some((s) => s.mode === modeFilter);
    })
    .sort((a, b) => {
      if (sortBy === 'cheapest') return a.totalFareNgn - b.totalFareNgn;
      if (sortBy === 'transfers') return a.transfersCount - b.transfersCount;
      return a.totalDurationMin - b.totalDurationMin;
    });

  return (
    <div className="space-y-12 animate-in fade-in">
      
      {/* Editorial Hero Section with Cultural Soul & Spatial Breadth */}
      <section className="relative rounded-3xl bg-[#0B0D16] border border-white/[0.08] p-8 md:p-12 overflow-hidden shadow-2xl">
        
        {/* Subtle radial ambient atmosphere */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2.5 text-xs text-amber-400 font-semibold uppercase tracking-widest">
            <Compass className="w-4 h-4" />
            <span>{`Ìjènkéọ́mā · Safe Journey Across Africa's Megacities`}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight text-balance leading-[1.15]">
            The living multimodal transit grid of Lagos.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed text-balance max-w-2xl">
            Navigate effortlessly between yellow Danfos, Red & Blue electric rail, BRT corridors, and LAGFERRY catamarans. Ground-truth fares verified by daily commuters.
          </p>
        </div>

        {/* Clean, Tactile Search Module */}
        <div className="mt-8 rounded-2xl bg-[#080910] border border-white/[0.08] p-5 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-3 items-center">
            
            {/* Origin Stop */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Origin Junction / Stop</span>
              </label>
              <select
                value={originId}
                onChange={(e) => setOriginId(e.target.value)}
                className="w-full bg-[#111422] border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-medium focus:border-amber-400 focus:outline-none min-h-[48px]"
              >
                {stopList.map((stop) => (
                  <option key={stop.id} value={stop.id}>
                    {stop.name} ({stop.localName})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <button
              onClick={handleSwapStops}
              className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors self-end md:self-center min-w-[48px] min-h-[48px] flex items-center justify-center"
              title="Swap origin and destination"
              aria-label="Swap origin and destination"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>

            {/* Destination Stop */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>Destination Landmark</span>
              </label>
              <select
                value={destId}
                onChange={(e) => setDestId(e.target.value)}
                className="w-full bg-[#111422] border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-medium focus:border-amber-400 focus:outline-none min-h-[48px]"
              >
                {stopList.map((stop) => (
                  <option key={stop.id} value={stop.id}>
                    {stop.name} ({stop.localName})
                  </option>
                ))}
              </select>
            </div>

            {/* Action */}
            <div className="self-end">
              <button
                onClick={() => {}}
                className="w-full md:w-auto px-7 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98] min-h-[48px] shadow-lg shadow-amber-400/10"
              >
                <Search className="w-4 h-4" />
                <span>Explore Corridors</span>
              </button>
            </div>

          </div>

          {/* Quiet Filter Row */}
          <div className="mt-5 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-slate-500 text-[11px] font-medium mr-1">Modes:</span>
              {(['all', 'danfo', 'rail', 'ferry', 'brt', 'keke'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setModeFilter(m)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                    modeFilter === m
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white bg-white/[0.03] border border-white/[0.06]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06] text-[11px]">
                <button
                  onClick={() => setSortBy('fastest')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    sortBy === 'fastest' ? 'bg-white/[0.1] text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Fastest
                </button>
                <button
                  onClick={() => setSortBy('cheapest')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    sortBy === 'cheapest' ? 'bg-white/[0.1] text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cheapest
                </button>
                <button
                  onClick={() => setSortBy('transfers')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    sortBy === 'transfers' ? 'bg-white/[0.1] text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Fewest Transfers
                </button>
              </div>

              <button
                onClick={() => setViewSavedOnly(!viewSavedOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                  viewSavedOnly
                    ? 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white border-white/[0.06]'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Saved Offline ({savedJourneys.length})</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lagos Multimodal Interactive Congestion Map */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Metropolitan Transit Canvas
            </h2>
            <p className="text-xs text-slate-400">
              Live flow vectors across Lagos Island, Victoria Island, and the Mainland
            </p>
          </div>

          <button
            onClick={() => setFareModalOpen(true)}
            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Fare for Any Corridor</span>
          </button>
        </div>

        <LiveCongestionMap />
      </section>

      {/* Journey Options List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {viewSavedOnly ? 'Saved Offline Corridors' : 'Recommended Multimodal Journeys'}
            </h2>
            <p className="text-xs text-slate-400">
              {displayedJourneys.length} optimal route configurations calculated for current commute conditions
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {displayedJourneys.map((journey) => (
            <RouteCard key={journey.id} journey={journey} />
          ))}
        </div>
      </section>

    </div>
  );
};
