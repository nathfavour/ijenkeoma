'use client';

import React from 'react';
import { useTransitStore } from '@/lib/store';
import {
  Award,
  Sparkles,
  Zap,
  ShieldCheck,
  Trophy,
  Flame,
} from 'lucide-react';

const LEADERBOARD_COMMUTERS = [
  { rank: 1, name: 'Bolanle Ogundimu', handle: '@bolanle_transit', area: 'Oshodi-Isolo', xp: 3240, reports: 72, badge: 'Lagos Transit Elder' },
  { rank: 2, name: 'Chukwuebuka Obi', handle: '@ebuka_waterways', area: 'Ikorodu Jetty', xp: 2890, reports: 61, badge: 'Lagoon Admiral' },
  { rank: 3, name: 'Damilola Adeyemi (You)', handle: '@dami_oshodi', area: 'Oshodi / Yaba', xp: 1480, reports: 38, badge: 'Ground Truth Pioneer' },
  { rank: 4, name: 'Fatima Zubairu', handle: '@fatima_rail', area: 'Marina Waterfront', xp: 1350, reports: 29, badge: 'Blue Line Scout' },
  { rank: 5, name: 'Tunde Alabi', handle: '@tunde_ajah', area: 'Ajah Expressway', xp: 1120, reports: 24, badge: 'Surge Hunter' },
];

export const RewardsLeaderboardView: React.FC = () => {
  const {
    userProfile,
    setRewardModalOpen,
  } = useTransitStore();

  return (
    <div className="space-y-10 animate-in fade-in">
      
      {/* Title & Quick Cashout Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Trophy className="w-4 h-4" />
            <span>Commuter Economy & VTU Payout Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Rewards Wallet & Neighborhood Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl font-normal leading-relaxed">
            Convert crowdsourced fare reports into real airtime, Cowry card transit balance, and partner merchant vouchers.
          </p>
        </div>

        <button
          onClick={() => setRewardModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/10 active:scale-[0.98] transition-all min-h-[48px] shrink-0"
        >
          <Zap className="w-4 h-4" />
          <span>Redeem Earnings (₦{userProfile.walletBalanceNgn.toLocaleString()})</span>
        </button>
      </div>

      {/* User Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Wallet Balance Card */}
        <div className="rounded-2xl bg-[#0E111A] border border-white/[0.08] p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Redeemable Balance</span>
            <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-xs">
              ₦
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-400 tabular-nums">
            ₦{userProfile.walletBalanceNgn.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 font-normal">
            Direct instant top-up to MTN, Airtel, Glo, 9mobile & Cowry
          </p>
        </div>

        {/* Experience Points (XP) */}
        <div className="rounded-2xl bg-[#0E111A] border border-white/[0.08] p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Contributor Experience</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums">
            {userProfile.xpPoints.toLocaleString()} XP
          </div>
          <p className="text-[11px] text-emerald-400 font-medium">
            Next Milestone: 2,000 XP (+₦500 bonus)
          </p>
        </div>

        {/* Commuter Streak */}
        <div className="rounded-2xl bg-[#0E111A] border border-white/[0.08] p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Daily Reporting Streak</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-3xl font-extrabold text-orange-400 tabular-nums">
            {userProfile.streakDays} Days
          </div>
          <p className="text-[11px] text-slate-400 font-normal">
            1.5x active bonus applied to new fare logs
          </p>
        </div>

        {/* Trust Multiplier */}
        <div className="rounded-2xl bg-[#0E111A] border border-white/[0.08] p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Contributor Trust Score</span>
            <ShieldCheck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-sky-400 tabular-nums">
            {(userProfile.trustScore * 100).toFixed(0)}%
          </div>
          <p className="text-[11px] text-slate-400 font-normal">
            Rank: <strong className="text-white">{userProfile.neighborhoodRank}</strong>
          </p>
        </div>

      </div>

      {/* Badges Earned Section */}
      <div className="rounded-2xl bg-[#0E111A] border border-white/[0.08] p-6 sm:p-7 space-y-4">
        <h3 className="text-base font-bold text-white">Contributor Insignias</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userProfile.badges.map((b) => (
            <div
              key={b.id}
              className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 space-y-2 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">{b.title}</h4>
                  <span className="text-[10px] text-slate-500">{b.dateEarned}</span>
                </div>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed font-normal">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Neighborhood Leaderboard */}
      <div className="rounded-2xl bg-[#0E111A] border border-white/[0.08] p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white">Weekly Lagos Transit Guardian Standings</h3>
          </div>
          <span className="text-xs text-slate-400">Weekly top reporters win ₦10,000 VTU Sunday midnight</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.06] text-slate-400">
              <tr>
                <th className="pb-3 font-semibold w-12">Rank</th>
                <th className="pb-3 font-semibold">Commuter</th>
                <th className="pb-3 font-semibold">Corridor Hub</th>
                <th className="pb-3 font-semibold">Verified Submissions</th>
                <th className="pb-3 font-semibold text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-200">
              {LEADERBOARD_COMMUTERS.map((commuter) => {
                const isUser = commuter.rank === 3;
                return (
                  <tr
                    key={commuter.rank}
                    className={isUser ? 'bg-amber-400/[0.07] font-medium' : 'hover:bg-white/[0.02]'}
                  >
                    <td className="py-4 font-bold">
                      {commuter.rank === 1 && <span className="text-amber-400">#1</span>}
                      {commuter.rank === 2 && <span className="text-slate-300">#2</span>}
                      {commuter.rank === 3 && <span className="text-amber-500">#3</span>}
                      {commuter.rank > 3 && <span className="text-slate-500">#{commuter.rank}</span>}
                    </td>
                    <td className="py-4">
                      <div className="text-white font-semibold flex items-center gap-2">
                        {commuter.name}
                        {isUser && (
                          <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 text-[11px]">{commuter.badge}</span>
                    </td>
                    <td className="py-4 text-slate-300">{commuter.area}</td>
                    <td className="py-4 font-mono tabular-nums text-slate-300">
                      {commuter.reports} verified
                    </td>
                    <td className="py-4 text-right font-mono font-bold text-amber-400 tabular-nums">
                      {commuter.xp.toLocaleString()} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
