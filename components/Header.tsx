'use client';

import React, { useState } from 'react';
import { useTransitStore } from '@/lib/store';
import { PWAInstallButton } from './PWAInstallButton';
import { CommuterWalletDrawer } from './CommuterWalletDrawer';
import { Sparkles, Menu, Navigation } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeNavTab,
    setActiveNavTab,
    userProfile,
  } = useTransitStore();

  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-white/[0.08] bg-[#090B10]/90 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-8 px-5 sm:px-8">
          
          {/* Zone 1: Brand Wordmark (Clean & dignified) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveNavTab('search')}
              className="text-left group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg py-1"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Navigation className="w-4 h-4 fill-slate-950" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap font-sans">
                  Ìjènkéọ́mā
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4 Quiet, Single-Line Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-9 text-sm font-medium text-slate-300">
            <button
              onClick={() => setActiveNavTab('search')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                activeNavTab === 'search'
                  ? 'text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <span>Multimodal Routes</span>
              {activeNavTab === 'search' && (
                <span className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-amber-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveNavTab('fare-intelligence')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                activeNavTab === 'fare-intelligence'
                  ? 'text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <span>Fare Consensus</span>
              {activeNavTab === 'fare-intelligence' && (
                <span className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-amber-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveNavTab('rewards')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                activeNavTab === 'rewards'
                  ? 'text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <span>Rewards & Leaderboard</span>
              {activeNavTab === 'rewards' && (
                <span className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-amber-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveNavTab('b2b')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                activeNavTab === 'b2b'
                  ? 'text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <span>B2B Telemetry</span>
              {activeNavTab === 'b2b' && (
                <span className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-amber-400 rounded-full" />
              )}
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action (Wallet Drawer Trigger & clean PWA install) */}
          <div className="flex items-center gap-3 shrink-0">
            <PWAInstallButton />

            {/* Commuter Wallet trigger */}
            <button
              onClick={() => setIsWalletOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 text-xs text-slate-200 transition-all active:scale-[0.98]"
              title="Open commuter profile & rewards wallet"
            >
              <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-[11px]">
                ₦
              </div>
              <span className="font-semibold tabular-nums text-white">
                ₦{userProfile.walletBalanceNgn.toLocaleString()}
              </span>
              <span className="hidden sm:inline text-slate-500 font-light">·</span>
              <span className="hidden sm:flex items-center gap-1 text-amber-400/90 font-medium tabular-nums text-[11px]">
                <Sparkles className="w-3 h-3" />
                {userProfile.xpPoints} XP
              </span>
            </button>

            {/* Mobile Navigation Drawer Trigger */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] border border-white/[0.08]"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Mobile Navigation Dropdown Menu (Clean and collapsible) */}
        {isMobileNavOpen && (
          <div className="lg:hidden px-5 py-4 border-t border-white/[0.08] bg-[#090B10] space-y-1 animate-in slide-in-from-top-2">
            {[
              { id: 'search', label: 'Multimodal Routes' },
              { id: 'fare-intelligence', label: 'Fare Consensus' },
              { id: 'rewards', label: 'Rewards & Leaderboard' },
              { id: 'b2b', label: 'B2B Telemetry' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveNavTab(tab.id as any);
                  setIsMobileNavOpen(false);
                }}
                className={`w-full text-left py-2.5 px-3 rounded-xl text-xs font-semibold transition-colors ${
                  activeNavTab === tab.id
                    ? 'bg-amber-400/15 text-amber-300'
                    : 'text-slate-300 hover:bg-white/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Slide-out Commuter Wallet Drawer */}
      <CommuterWalletDrawer
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
      />
    </>
  );
};
