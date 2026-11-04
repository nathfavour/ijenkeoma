'use client';

import React, { useState } from 'react';
import { useTransitStore } from '@/lib/store';
import { TRANSIT_STOPS } from '@/lib/transit-data';
import { Drawer } from './Drawer';
import { Volume2, Sun, Moon, MapPin, Check, Compass, Radio } from 'lucide-react';
import Image from 'next/image';

export const VisualProofingDrawer: React.FC = () => {
  const {
    isProofingModalOpen,
    setProofingModalOpen,
    visualProofingStopId,
  } = useTransitStore();

  const [lightingMode, setLightingMode] = useState<'day' | 'night'>('day');
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const stop = (visualProofingStopId && TRANSIT_STOPS[visualProofingStopId])
    ? TRANSIT_STOPS[visualProofingStopId]
    : TRANSIT_STOPS.oshodi;

  const handlePlayAudio = (cue: string) => {
    setIsPlayingAudio(cue);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cue);
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(null);
      utterance.onerror = () => setIsPlayingAudio(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(null), 2400);
    }
  };

  return (
    <Drawer
      isOpen={isProofingModalOpen}
      onClose={() => {
        setProofingModalOpen(false);
        setConfirmed(false);
      }}
      title={stop.name}
      subtitle={`Visual Window Proofing · ${stop.localName}`}
      widthClass="max-w-xl"
    >
      <div className="space-y-6">
        
        {/* Physical Landmark Window Viewport */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video shadow-2xl">
          <Image
            src={stop.landmarkImageUrl}
            alt={stop.name}
            fill
            className={`object-cover transition-all duration-700 ${
              lightingMode === 'night'
                ? 'brightness-50 contrast-125 saturate-125'
                : 'brightness-95 contrast-105'
            }`}
            referrerPolicy="no-referrer"
            priority
          />

          {/* Danfo Window Glass HUD Overlay */}
          <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                Danfo Window View
              </span>
              <span className="text-[10px] font-mono text-white/90 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                {stop.coordinates.lat.toFixed(4)}°N, {stop.coordinates.lng.toFixed(4)}°E
              </span>
            </div>

            <div className="text-center">
              <div className="inline-block px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] text-white/90 border border-white/10">
                Align landmark out vehicle window
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                Hub: {stop.neighborhood}
              </span>
              <span className="bg-amber-400/20 text-amber-300 font-semibold px-2 py-0.5 rounded backdrop-blur-sm border border-amber-400/30">
                Verified Transit Node
              </span>
            </div>
          </div>

          {/* Lighting Mode Switcher in Image Corner */}
          <div className="absolute top-3 right-3 flex items-center bg-black/80 backdrop-blur-md p-1 rounded-lg border border-white/15 pointer-events-auto">
            <button
              onClick={() => setLightingMode('day')}
              className={`p-1.5 rounded-md transition-colors ${
                lightingMode === 'day' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Daylight conditions"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingMode('night')}
              className={`p-1.5 rounded-md transition-colors ${
                lightingMode === 'night' ? 'bg-sky-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Night / Evening commute"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Physical Description Callout */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1.5">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Drop-off Context</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {stop.landmarkDescription}
          </p>
        </div>

        {/* Recognition Cues */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Physical Landmarks To Spot
          </h4>
          <div className="space-y-2">
            {stop.visualCues.map((cue, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-200"
              >
                <span className="w-5 h-5 rounded-full bg-amber-400/10 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{cue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conductor Callout Prompts */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Conductor Calls & Audio Prompts
          </h4>
          <div className="space-y-2">
            {stop.audioCues.map((cue, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs"
              >
                <div className="flex items-center gap-2.5 pr-3 text-slate-300">
                  <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="italic font-serif text-amber-100">{cue}</span>
                </div>
                <button
                  onClick={() => handlePlayAudio(cue)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/20 transition-colors shrink-0"
                >
                  {isPlayingAudio === cue ? 'Playing...' : 'Play Prompt'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Affirmation Confirmation */}
        <div className="pt-2">
          <button
            onClick={() => setConfirmed(true)}
            disabled={confirmed}
            className={`w-full py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              confirmed
                ? 'bg-emerald-600/90 text-white cursor-default'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 active:scale-[0.98]'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{confirmed ? 'Landmark Confirmed Out Window' : 'I Spot This Landmark'}</span>
          </button>
        </div>

      </div>
    </Drawer>
  );
};
