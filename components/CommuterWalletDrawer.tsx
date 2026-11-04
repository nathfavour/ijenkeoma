'use client';

import React from 'react';
import { useTransitStore } from '@/lib/store';
import { Drawer } from './Drawer';
import {
  Award,
  Sparkles,
  Flame,
  ShieldCheck,
  Zap,
  Wifi,
  WifiOff,
  User,
  ArrowRight,
} from 'lucide-react';

interface CommuterWalletDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommuterWalletDrawer: React.FC<CommuterWalletDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    userProfile,
    guestSessionId,
    isSimulatedOffline,
    setSimulatedOffline,
    setRewardModalOpen,
    setActiveNavTab,
  } = useTransitStore();

  const handleOpenPayout = () => {
    onClose();
    setRewardModalOpen(true);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Commuter Profile & Wallet"
      subtitle={`Lagos Transit Contributor · ${userProfile.neighborhoodRank}`}
      widthClass="max-w-md"
    >
      <div className="space-y-6">
        
        {/* Wallet Balance Hero Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-400/15 via-amber-500/5 to-transparent border border-amber-400/25 space-y-3">
          <div className="flex items-center justify-between text-xs text-amber-200/80">
            <span>Airtime & Fare Credit</span>
            <span className="font-mono text-[11px] text-amber-400/90 font-bold uppercase">Active Balance</span>
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums tracking-tight">
            ₦{userProfile.walletBalanceNgn.toLocaleString()}
          </div>
          <button
            onClick={handleOpenPayout}
            className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Zap className="w-4 h-4" />
            <span>Redeem Airtime or Cowry Credits</span>
          </button>
        </div>

        {/* 3-stat micro grid */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Contributor XP</span>
            <div className="text-base font-bold text-amber-400 mt-1 tabular-nums flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {userProfile.xpPoints}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Streak</span>
            <div className="text-base font-bold text-orange-400 mt-1 tabular-nums flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              {userProfile.streakDays}d
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Trust Score</span>
            <div className="text-base font-bold text-sky-400 mt-1 tabular-nums flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {(userProfile.trustScore * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-3 text-xs">
          <h4 className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
            Account Verification
          </h4>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Commuter Name</span>
              <span className="font-semibold text-white">{userProfile.fullName}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Verified Phone</span>
              <span className="font-mono text-white">{userProfile.phone}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Submissions Logged</span>
              <span className="font-mono text-white tabular-nums">{userProfile.reportsCount}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px] pt-1 border-t border-white/[0.06]">
              <span>Ephemeral Guest ID</span>
              <span className="font-mono text-slate-500">{guestSessionId.substring(0, 16)}...</span>
            </div>
          </div>
        </div>

        {/* Offline Simulation Control */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <span className="font-semibold text-white block">Offline 2G Corridor Mode</span>
            <p className="text-[11px] text-slate-400 font-normal">
              {isSimulatedOffline ? 'Testing cache in cellular blind spot' : 'Live network connection'}
            </p>
          </div>
          <button
            onClick={() => setSimulatedOffline(!isSimulatedOffline)}
            className={`p-2 rounded-xl text-xs font-semibold border transition-colors ${
              isSimulatedOffline
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
            }`}
          >
            {isSimulatedOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Nav to full Rewards page */}
        <button
          onClick={() => {
            onClose();
            setActiveNavTab('rewards');
          }}
          className="w-full py-3 rounded-xl border border-white/10 hover:border-white/20 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
        >
          <span>View Neighborhood Leaderboards</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

      </div>
    </Drawer>
  );
};
