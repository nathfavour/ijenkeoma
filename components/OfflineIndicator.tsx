'use client';

import React, { useEffect, useState } from 'react';
import { useTransitStore } from '@/lib/store';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [browserOnline, setBrowserOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const { isSimulatedOffline, setSimulatedOffline } = useTransitStore();

  useEffect(() => {
    const onOnline = () => setBrowserOnline(true);
    const onOffline = () => setBrowserOnline(false);

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const isActuallyOffline = !browserOnline || isSimulatedOffline;

  if (!isActuallyOffline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2.5 rounded-lg bg-amber-500/95 text-slate-950 px-3.5 py-2 text-xs font-semibold shadow-xl border border-amber-400 backdrop-blur-md animate-in slide-in-from-bottom-2">
      <WifiOff className="w-4 h-4 shrink-0 text-slate-950" />
      <span>
        {isSimulatedOffline ? 'Simulated 2G/Offline Corridor' : 'Offline Mode — Local Cache Active'}
      </span>
      <button
        onClick={() => setSimulatedOffline(false)}
        className="ml-2 text-[10px] uppercase font-bold tracking-wider bg-slate-950 text-amber-300 px-2 py-0.5 rounded hover:bg-slate-900 transition-colors"
      >
        Restore
      </button>
    </div>
  );
};
