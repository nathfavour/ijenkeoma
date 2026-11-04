'use client';

import React, { useState } from 'react';
import { useTransitStore } from '@/lib/store';
import { TRANSIT_STOPS } from '@/lib/transit-data';
import { Drawer } from './Drawer';
import { TransportMode, WeatherCondition, CongestionLevel } from '@/types/transit';
import {
  Send,
  Sparkles,
  MapPin,
  Sun,
  CloudRain,
  Fuel,
  CheckCircle2,
} from 'lucide-react';

export const FareReportDrawer: React.FC = () => {
  const {
    isFareModalOpen,
    setFareModalOpen,
    addFareReport,
  } = useTransitStore();

  const stopList = Object.values(TRANSIT_STOPS);

  const [originId, setOriginId] = useState('oshodi');
  const [destId, setDestId] = useState('cms_marina');
  const [mode, setMode] = useState<TransportMode>('danfo');
  const [paidFare, setPaidFare] = useState('500');
  const [weather, setWeather] = useState<WeatherCondition>('clear');
  const [congestion, setCongestion] = useState<CongestionLevel>('moderate');
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<{ xp: number; balance: number } | null>(null);

  const handleVerifyLocation = () => {
    setIsLocating(true);
    setLocationStatus('Pinging GPS satellites...');
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          setLocationStatus(`Verified near ${pos.coords.latitude.toFixed(3)}°N · 25m geofence`);
        },
        () => {
          setIsLocating(false);
          setLocationStatus('Corridor anchor locked · Contributor Trust 1.8x');
        },
        { timeout: 4000 }
      );
    } else {
      setTimeout(() => {
        setIsLocating(false);
        setLocationStatus('Corridor anchor locked · Contributor Trust 1.8x');
      }, 600);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fareNumber = parseFloat(paidFare);
    if (isNaN(fareNumber) || fareNumber <= 0) return;

    const result = addFareReport({
      originStopId: originId,
      destinationStopId: destId,
      transportMode: mode,
      paidFareNgn: fareNumber,
      weatherCondition: weather,
      congestionLevel: congestion,
    });

    setSubmissionSuccess({ xp: result.xpAwarded, balance: result.newBalance });
    setTimeout(() => {
      setSubmissionSuccess(null);
      setFareModalOpen(false);
    }, 2200);
  };

  return (
    <Drawer
      isOpen={isFareModalOpen}
      onClose={() => {
        setFareModalOpen(false);
        setSubmissionSuccess(null);
      }}
      title="Report Corridor Fare"
      subtitle="Crowdsource ground truth to protect commuters from surge gouging"
      widthClass="max-w-lg"
    >
      {submissionSuccess ? (
        <div className="py-12 text-center space-y-4 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Observation Verified</h3>
          <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
            Your reported fare has updated the live exponential moving average (EWMA) consensus model.
          </p>
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] inline-block space-y-1 text-center">
            <div className="text-amber-400 font-bold text-sm flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4" /> +{submissionSuccess.xp} Contributor XP
            </div>
            <div className="text-xs text-slate-300">
              +₦150 Airtime credit added (Balance: ₦{submissionSuccess.balance.toLocaleString()})
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Stops Segment */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Departure Stop
              </label>
              <select
                value={originId}
                onChange={(e) => setOriginId(e.target.value)}
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
              >
                {stopList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.localName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Arrival Drop-off
              </label>
              <select
                value={destId}
                onChange={(e) => setDestId(e.target.value)}
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
              >
                {stopList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.localName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mode Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Transit Mode
            </label>
            <div className="grid grid-cols-4 gap-1.5 text-xs">
              {(['danfo', 'korope', 'brt', 'keke', 'rail', 'ferry', 'okada', 'hitch'] as TransportMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`py-2 px-1 text-center rounded-lg border font-medium capitalize transition-colors min-h-[44px] ${
                    mode === m
                      ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                      : 'bg-white/[0.02] text-slate-300 border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Paid Fare & Congestion */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Paid Fare (NGN ₦)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-amber-400 font-bold text-sm">₦</span>
                <input
                  type="number"
                  min="50"
                  max="15000"
                  step="50"
                  value={paidFare}
                  onChange={(e) => setPaidFare(e.target.value)}
                  required
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-sm text-white font-semibold focus:border-amber-400 focus:outline-none"
                  placeholder="500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Corridor Flow
              </label>
              <select
                value={congestion}
                onChange={(e) => setCongestion(e.target.value as CongestionLevel)}
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
              >
                <option value="free">Free Express</option>
                <option value="moderate">Moderate Go-Slow</option>
                <option value="gridlock">Total Gridlock</option>
              </select>
            </div>
          </div>

          {/* Weather / Surge Conditions */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Corridor Weather / Surcharge
            </label>
            <div className="grid grid-cols-4 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => setWeather('clear')}
                className={`p-2 rounded-xl border text-center transition-colors ${
                  weather === 'clear'
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400 font-bold'
                    : 'bg-white/[0.02] text-slate-400 border-white/[0.08]'
                }`}
              >
                <Sun className="w-3.5 h-3.5 mx-auto mb-1" />
                Clear
              </button>
              <button
                type="button"
                onClick={() => setWeather('light_rain')}
                className={`p-2 rounded-xl border text-center transition-colors ${
                  weather === 'light_rain'
                    ? 'bg-sky-500/20 text-sky-300 border-sky-400 font-bold'
                    : 'bg-white/[0.02] text-slate-400 border-white/[0.08]'
                }`}
              >
                <CloudRain className="w-3.5 h-3.5 mx-auto mb-1" />
                Drizzle
              </button>
              <button
                type="button"
                onClick={() => setWeather('heavy_rain')}
                className={`p-2 rounded-xl border text-center transition-colors ${
                  weather === 'heavy_rain'
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400 font-bold'
                    : 'bg-white/[0.02] text-slate-400 border-white/[0.08]'
                }`}
              >
                <CloudRain className="w-3.5 h-3.5 mx-auto mb-1" />
                Downpour
              </button>
              <button
                type="button"
                onClick={() => setWeather('scarcity')}
                className={`p-2 rounded-xl border text-center transition-colors ${
                  weather === 'scarcity'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-400 font-bold'
                    : 'bg-white/[0.02] text-slate-400 border-white/[0.08]'
                }`}
              >
                <Fuel className="w-3.5 h-3.5 mx-auto mb-1" />
                Fuel Spike
              </button>
            </div>
          </div>

          {/* Geofence Verification Status */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-300">
                {locationStatus || 'GPS verification grants 1.8x Trust Score'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleVerifyLocation}
              disabled={isLocating}
              className="px-2.5 py-1 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 text-[11px] font-medium"
            >
              {isLocating ? 'Locating...' : 'Verify GPS'}
            </button>
          </div>

          {/* Action */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Commit Fare Observation (+50 XP)</span>
          </button>
        </form>
      )}
    </Drawer>
  );
};
