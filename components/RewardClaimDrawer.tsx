'use client';

import React, { useState } from 'react';
import { useTransitStore } from '@/lib/store';
import { Drawer } from './Drawer';
import {
  Smartphone,
  CreditCard,
  Tag,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const RewardClaimDrawer: React.FC = () => {
  const {
    isRewardModalOpen,
    setRewardModalOpen,
    userProfile,
    redeemAirtimeReward,
    redeemCowryCardTopup,
  } = useTransitStore();

  const [rewardType, setRewardType] = useState<'airtime' | 'cowry' | 'voucher'>('airtime');
  const [phone, setPhone] = useState(userProfile.phone || '08034928812');
  const [provider, setProvider] = useState('MTN');
  const [airtimeAmount, setAirtimeAmount] = useState('1000');
  const [cowryCardId, setCowryCardId] = useState('0492-8812-7491-0012');
  const [cowryAmount, setCowryAmount] = useState('2000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      if (rewardType === 'airtime') {
        const amt = parseInt(airtimeAmount, 10);
        if (amt > userProfile.walletBalanceNgn) {
          setErrorMessage('Insufficient wallet balance for this amount.');
          return;
        }
        const ok = redeemAirtimeReward(provider, phone, amt);
        if (ok) {
          setSuccessReceipt(`₦${amt.toLocaleString()} ${provider} Airtime sent to ${phone}`);
        }
      } else if (rewardType === 'cowry') {
        const amt = parseInt(cowryAmount, 10);
        if (amt > userProfile.walletBalanceNgn) {
          setErrorMessage('Insufficient wallet balance for Cowry card top-up.');
          return;
        }
        const ok = redeemCowryCardTopup(cowryCardId, amt);
        if (ok) {
          setSuccessReceipt(`₦${amt.toLocaleString()} loaded to Cowry Card (${cowryCardId})`);
        }
      } else {
        if (userProfile.walletBalanceNgn < 1500) {
          setErrorMessage('₦1,500 required for partner merchant voucher.');
          return;
        }
        redeemAirtimeReward('VOUCHER', phone, 1500);
        setSuccessReceipt('₦1,500 Chowdeck / Shoprite discount code dispatched via SMS!');
      }
    }, 1000);
  };

  return (
    <Drawer
      isOpen={isRewardModalOpen}
      onClose={() => {
        setRewardModalOpen(false);
        setSuccessReceipt(null);
        setErrorMessage(null);
      }}
      title="Commuter Payout & Wallet"
      subtitle="Instant automated VTU dispatch to Nigerian telcos & Cowry transit cards"
      widthClass="max-w-lg"
    >
      {successReceipt ? (
        <div className="py-12 text-center space-y-4 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">VTU Payout Dispatched</h3>
          <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
            {successReceipt}
          </p>
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] inline-block text-xs text-slate-300">
            Remaining Balance:{' '}
            <strong className="text-amber-400 font-bold tabular-nums">
              ₦{userProfile.walletBalanceNgn.toLocaleString()}
            </strong>
          </div>
          <button
            onClick={() => {
              setSuccessReceipt(null);
              setRewardModalOpen(false);
            }}
            className="mt-4 block mx-auto px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleRedeem} className="space-y-5">
          
          {/* Balance overview */}
          <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-between text-xs">
            <span className="text-amber-200/90 font-medium">Available Payout Balance</span>
            <span className="text-lg font-bold text-amber-400 tabular-nums">
              ₦{userProfile.walletBalanceNgn.toLocaleString()}
            </span>
          </div>

          {/* Reward Type Tabs */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setRewardType('airtime')}
              className={`p-3 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                rewardType === 'airtime'
                  ? 'bg-amber-400 text-slate-950 border-amber-400'
                  : 'bg-white/[0.02] text-slate-300 border-white/[0.08]'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Airtime</span>
            </button>
            <button
              type="button"
              onClick={() => setRewardType('cowry')}
              className={`p-3 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                rewardType === 'cowry'
                  ? 'bg-sky-400 text-slate-950 border-sky-400'
                  : 'bg-white/[0.02] text-slate-300 border-white/[0.08]'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Cowry Card</span>
            </button>
            <button
              type="button"
              onClick={() => setRewardType('voucher')}
              className={`p-3 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                rewardType === 'voucher'
                  ? 'bg-rose-400 text-slate-950 border-rose-400'
                  : 'bg-white/[0.02] text-slate-300 border-white/[0.08]'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Voucher</span>
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Airtime Fields */}
          {rewardType === 'airtime' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Telco Provider
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['MTN', 'Airtel', 'Glo', '9mobile'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setProvider(p)}
                      className={`py-2.5 text-xs font-bold rounded-xl border transition-colors ${
                        provider === p
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400'
                          : 'bg-white/[0.02] text-slate-400 border-white/[0.08]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Recipient Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  placeholder="0803 492 8812"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Airtime Denomination
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['500', '1000', '2000'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAirtimeAmount(amt)}
                      className={`py-2.5 rounded-xl border text-xs font-semibold tabular-nums transition-colors ${
                        airtimeAmount === amt
                          ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                          : 'bg-white/[0.02] text-slate-300 border-white/[0.08]'
                      }`}
                    >
                      ₦{parseInt(amt, 10).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Cowry Transit Card Fields */}
          {rewardType === 'cowry' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Cowry Card 16-Digit UID
                </label>
                <input
                  type="text"
                  value={cowryCardId}
                  onChange={(e) => setCowryCardId(e.target.value)}
                  required
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
                  placeholder="0492-8812-7491-0012"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Accepted across BRT, Blue Line Rail, and LAGFERRY terminals.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Top-up Amount
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['1000', '2000'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCowryAmount(amt)}
                      className={`py-2.5 rounded-xl border text-xs font-semibold tabular-nums transition-colors ${
                        cowryAmount === amt
                          ? 'bg-sky-400 text-slate-950 border-sky-400 font-bold'
                          : 'bg-white/[0.02] text-slate-300 border-white/[0.08]'
                      }`}
                    >
                      ₦{parseInt(amt, 10).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Voucher */}
          {rewardType === 'voucher' && (
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2 text-xs text-slate-300">
              <span className="text-amber-400 font-bold block">
                Chowdeck & Shoprite Lagos Voucher (₦1,500)
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                Dispatched immediately via SMS with an instant QR discount code valid at all Lagos retail food and grocery partner stores.
              </p>
            </div>
          )}

          {/* Action */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            {isProcessing ? (
              <span>Connecting to VTU Gateway...</span>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Execute Instant Dispatch</span>
              </>
            )}
          </button>
        </form>
      )}
    </Drawer>
  );
};
