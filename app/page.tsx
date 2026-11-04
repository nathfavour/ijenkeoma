'use client';

import React from 'react';
import { useTransitStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { MultimodalSearchView } from '@/components/MultimodalSearchView';
import { FareIntelligenceView } from '@/components/FareIntelligenceView';
import { RewardsLeaderboardView } from '@/components/RewardsLeaderboardView';
import { B2BAnalyticsView } from '@/components/B2BAnalyticsView';
import { VisualProofingDrawer } from '@/components/VisualProofingDrawer';
import { FareReportDrawer } from '@/components/FareReportDrawer';
import { RewardClaimDrawer } from '@/components/RewardClaimDrawer';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { Navigation } from 'lucide-react';

export default function HomePage() {
  const { activeNavTab, setActiveNavTab } = useTransitStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-slate-100 selection:bg-amber-400/30 selection:text-amber-200">
      
      {/* 3-Zone De-cluttered Top Navigation Bar */}
      <Header />

      {/* Main Content Viewport with Generous Breathing Room */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
        {activeNavTab === 'search' && <MultimodalSearchView />}
        {activeNavTab === 'fare-intelligence' && <FareIntelligenceView />}
        {activeNavTab === 'rewards' && <RewardsLeaderboardView />}
        {activeNavTab === 'b2b' && <B2BAnalyticsView />}
      </main>

      {/* Responsive Slide-out Drawers (Mobile Bottom Sheet / Desktop Right Sidebar) */}
      <VisualProofingDrawer />
      <FareReportDrawer />
      <RewardClaimDrawer />

      {/* Ambient Offline Detection Pill */}
      <OfflineIndicator />

      {/* Clean, Elegant Footer */}
      <footer className="mt-20 border-t border-white/[0.08] bg-[#05060A] py-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-md">
            <div className="flex items-center gap-2.5 text-white font-bold text-base">
              <div className="w-6 h-6 rounded-md bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                <Navigation className="w-3.5 h-3.5 fill-slate-950" />
              </div>
              <span className="tracking-tight">Ìjènkéọ́mā</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-normal">
              Africa’s real-time multimodal navigation and ground-truth transit/price intelligence engine. Safe journeys across Lagos & beyond.
            </p>
            <div className="text-[11px] text-slate-500 font-light pt-1">
              Compliant with Nigerian Data Protection Regulation (NDPR) · Spatial Anonymization Active
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-8 text-xs text-slate-300 font-medium">
            <button
              onClick={() => setActiveNavTab('search')}
              className="hover:text-amber-400 transition-colors"
            >
              Multimodal Routes
            </button>
            <button
              onClick={() => setActiveNavTab('fare-intelligence')}
              className="hover:text-amber-400 transition-colors"
            >
              Consensus Fares
            </button>
            <button
              onClick={() => setActiveNavTab('rewards')}
              className="hover:text-amber-400 transition-colors"
            >
              Rewards & Leaderboard
            </button>
            <button
              onClick={() => setActiveNavTab('b2b')}
              className="hover:text-amber-400 transition-colors"
            >
              B2B Telemetry
            </button>
          </div>

          <div className="text-right text-[11px] text-slate-500">
            <span>© {new Date().getFullYear()} Ìjènkéọ́mā Inc. Built for everyday African commuters.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
