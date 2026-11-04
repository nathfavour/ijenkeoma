'use client';

import React, { useState } from 'react';
import { useTransitStore } from '@/lib/store';
import { TransportMode } from '@/types/transit';
import {
  Flame,
  Compass,
  Eye,
  Radio,
} from 'lucide-react';

interface MapStop {
  id: string;
  name: string;
  localName: string;
  x: number; // percentage in SVG canvas (0-100)
  y: number; // percentage in SVG canvas (0-100)
  type: string;
  modes: TransportMode[];
  congestion: 'free' | 'moderate' | 'gridlock';
}

const MAP_STOPS: MapStop[] = [
  { id: 'ikeja_underbridge', name: 'Ikeja Along', localName: 'Underbridge / Computer Village', x: 28, y: 22, type: 'danfo_park', modes: ['danfo', 'korope', 'keke'], congestion: 'moderate' },
  { id: 'oshodi', name: 'Oshodi Interchange', localName: 'Oshodi Oke / Terminals 1-3', x: 42, y: 38, type: 'interchange', modes: ['danfo', 'brt', 'rail'], congestion: 'gridlock' },
  { id: 'yaba_tejuosho', name: 'Yaba / Tejuosho', localName: 'Red Line & Market', x: 50, y: 55, type: 'interchange', modes: ['rail', 'danfo', 'brt'], congestion: 'free' },
  { id: 'cms_marina', name: 'CMS Marina Waterfront', localName: 'Blue Line & LAGFERRY Pier', x: 62, y: 72, type: 'interchange', modes: ['rail', 'ferry', 'brt'], congestion: 'free' },
  { id: 'mile2', name: 'Mile 2 Gateway', localName: 'Blue Line Terminus', x: 20, y: 65, type: 'interchange', modes: ['rail', 'ferry', 'danfo'], congestion: 'free' },
  { id: 'ikorodu_jetty', name: 'Ikorodu Waterfront', localName: 'Ipakodo Ferry & BRT', x: 80, y: 15, type: 'ferry_jetty', modes: ['ferry', 'brt'], congestion: 'free' },
  { id: 'lekki_phase1', name: 'Lekki Phase 1', localName: 'Admiralty / 1st Gate', x: 74, y: 78, type: 'keke_junction', modes: ['korope', 'keke', 'hitch'], congestion: 'moderate' },
  { id: 'ajah_jubilee', name: 'Ajah Jubilee Bridge', localName: 'Underbridge Terminal', x: 90, y: 85, type: 'interchange', modes: ['danfo', 'korope', 'keke'], congestion: 'gridlock' },
];

export const LiveCongestionMap: React.FC = () => {
  const {
    setVisualProofingStopId,
    setProofingModalOpen,
  } = useTransitStore();

  const [activeLayer, setActiveLayer] = useState<'all' | 'rail' | 'water' | 'danfo'>('all');
  const [heatmapVisible, setHeatmapVisible] = useState(true);
  const [hoveredStop, setHoveredStop] = useState<MapStop | null>(null);

  const handleStopClick = (stopId: string) => {
    setVisualProofingStopId(stopId);
    setProofingModalOpen(true);
  };

  return (
    <div className="relative rounded-3xl bg-[#090C14] border border-white/[0.08] overflow-hidden shadow-2xl flex flex-col">
      
      {/* Top Cartographic Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-[#090C14]/90 border-b border-white/[0.06] z-10">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              Lagos Multimodal Transit Mesh
            </h4>
            <p className="text-[11px] text-slate-400">
              Click any stop node to slide open window landmark proofing
            </p>
          </div>
        </div>

        {/* Clean Filter Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs">
            <button
              onClick={() => setActiveLayer('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                activeLayer === 'all'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Tracks
            </button>
            <button
              onClick={() => setActiveLayer('rail')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                activeLayer === 'rail'
                  ? 'bg-sky-500 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Blue/Red Rail
            </button>
            <button
              onClick={() => setActiveLayer('water')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                activeLayer === 'water'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              LAGFERRY Water
            </button>
            <button
              onClick={() => setActiveLayer('danfo')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                activeLayer === 'danfo'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Danfo Corridors
            </button>
          </div>

          <button
            onClick={() => setHeatmapVisible(!heatmapVisible)}
            className={`p-2 rounded-xl text-xs border flex items-center gap-1.5 transition-colors ${
              heatmapVisible
                ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 font-medium'
                : 'bg-white/[0.02] text-slate-400 border-white/[0.08] hover:text-white'
            }`}
            title="Toggle congestion heatmap overlay"
          >
            <Flame className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full h-[400px] sm:h-[480px] bg-[#07090F] overflow-hidden select-none">
        <svg
          viewBox="0 0 1000 650"
          className="w-full h-full object-contain pointer-events-auto"
        >
          <defs>
            <linearGradient id="lagoonFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#082845" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0B3960" stopOpacity="0.65" />
            </linearGradient>

            <radialGradient id="heatOshodi" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.45" />
              <stop offset="80%" stopColor="#F97316" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="heatAjah" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="heatIkeja" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Land Surface */}
          <rect width="1000" height="650" fill="#080A12" />

          {/* Cartographic Coordinate Grids */}
          <g stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.04" strokeDasharray="4 6">
            <line x1="0" y1="160" x2="1000" y2="160" />
            <line x1="0" y1="320" x2="1000" y2="320" />
            <line x1="0" y1="480" x2="1000" y2="480" />
            <line x1="250" y1="0" x2="250" y2="650" />
            <line x1="500" y1="0" x2="500" y2="650" />
            <line x1="750" y1="0" x2="750" y2="650" />
          </g>

          {/* Lagos Lagoon & Coastal Water Body */}
          <path
            d="M 520,120 Q 660,70 820,95 T 960,180 L 980,360 Q 820,380 680,420 T 550,520 Q 420,530 380,450 T 520,320 Z"
            fill="url(#lagoonFill)"
            stroke="#0284C7"
            strokeWidth="1.2"
            strokeOpacity="0.3"
          />

          {/* Atlantic Ocean Coastline */}
          <path
            d="M 0,580 Q 250,560 500,570 T 1000,590 L 1000,650 L 0,650 Z"
            fill="#051829"
            stroke="#0284C7"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />

          {/* Congestion Heatmap Overlays */}
          {heatmapVisible && (
            <g className="transition-opacity duration-300 pointer-events-none">
              <circle cx="420" cy="245" r="95" fill="url(#heatOshodi)" />
              <circle cx="900" cy="552" r="85" fill="url(#heatAjah)" />
              <circle cx="280" cy="143" r="70" fill="url(#heatIkeja)" />
            </g>
          )}

          {/* Danfo / Road Arteries */}
          {(activeLayer === 'all' || activeLayer === 'danfo') && (
            <g>
              <path
                d="M 280,143 L 420,245 L 500,357 Q 560,420 620,468"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="4"
                strokeLinecap="round"
                strokeOpacity="0.85"
              />
              <path
                d="M 620,468 L 740,507 L 900,552"
                fill="none"
                stroke="#EA580C"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeOpacity="0.8"
              />
            </g>
          )}

          {/* LRMT Blue Line Rail */}
          {(activeLayer === 'all' || activeLayer === 'rail') && (
            <g>
              <path
                d="M 200,422 Q 380,410 460,440 T 620,468"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M 200,422 Q 380,410 460,440 T 620,468"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeDasharray="3 5"
              />
            </g>
          )}

          {/* LAGFERRY Waterway */}
          {(activeLayer === 'all' || activeLayer === 'water') && (
            <g>
              <path
                d="M 800,97 Q 700,280 620,468"
                fill="none"
                stroke="#06B6D4"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="5 5"
              />
            </g>
          )}

          {/* Map Stops Pins */}
          {MAP_STOPS.map((stop) => {
            const cx = (stop.x / 100) * 1000;
            const cy = (stop.y / 100) * 650;
            const isHovered = hoveredStop?.id === stop.id;

            return (
              <g
                key={stop.id}
                onClick={() => handleStopClick(stop.id)}
                onMouseEnter={() => setHoveredStop(stop)}
                onMouseLeave={() => setHoveredStop(null)}
                className="cursor-pointer group"
              >
                {/* Pulse ring on hover */}
                {isHovered && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={22}
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="1"
                    strokeOpacity="0.6"
                    className="animate-ping"
                  />
                )}

                {/* Outer badge */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 14 : 9}
                  fill="#0B0D14"
                  stroke={stop.congestion === 'gridlock' ? '#EF4444' : stop.congestion === 'moderate' ? '#F59E0B' : '#10B981'}
                  strokeWidth="2.5"
                  className="transition-all duration-200"
                />

                {/* Inner center dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 5 : 3.5}
                  fill={isHovered ? '#F59E0B' : '#FFFFFF'}
                />

                {/* Stop Typography Label */}
                <text
                  x={cx + 14}
                  y={cy + 4}
                  fill="#FFFFFF"
                  fontSize="12"
                  fontWeight="600"
                  filter="drop-shadow(0 1px 3px rgba(0,0,0,0.95))"
                  className="pointer-events-none font-sans"
                >
                  {stop.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Ambient Map Footer Callout */}
        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-xs text-slate-300 flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Compass className="w-4 h-4" />
            <span>Lagos Grid</span>
          </div>
          <span className="text-slate-600">·</span>
          <span>Click any node to view drop-off photo</span>
        </div>

      </div>
    </div>
  );
};
