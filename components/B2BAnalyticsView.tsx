'use client';

import React, { useState } from 'react';
import { ENTERPRISE_B2B_METRICS } from '@/lib/transit-data';
import {
  Key,
  Copy,
  Check,
  Code2,
  Shield,
  Terminal,
  Zap,
} from 'lucide-react';

export const B2BAnalyticsView: React.FC = () => {
  const [apiKeyType, setApiKeyType] = useState<'live' | 'test'>('live');
  const [apiKey, setApiKey] = useState('live_ijenkeoma_4f89ac87019b882e9124');
  const [copiedKey, setCopiedKey] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<'od-matrix' | 'consensus-pricing' | 'corridor-telemetry'>('od-matrix');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isExecutingApi, setIsExecutingApi] = useState(false);

  const handleGenerateKey = () => {
    const prefix = apiKeyType === 'live' ? 'live_' : 'test_';
    const rand = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 10);
    setApiKey(`${prefix}ijenkeoma_${rand}`);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRunEndpointTest = () => {
    setIsExecutingApi(true);
    setTimeout(() => {
      setIsExecutingApi(false);
      if (selectedEndpoint === 'od-matrix') {
        setApiResponse(
          JSON.stringify(
            {
              status: 'success',
              timestamp: new Date().toISOString(),
              corridor_count: ENTERPRISE_B2B_METRICS.originDestinationFlows.length,
              flows: ENTERPRISE_B2B_METRICS.originDestinationFlows,
              rate_limit: { limit: 100000, remaining: 98420, reset_epoch: 1730678400 },
            },
            null,
            2
          )
        );
      } else if (selectedEndpoint === 'consensus-pricing') {
        setApiResponse(
          JSON.stringify(
            {
              status: 'success',
              corridor: 'OSHODI_CMS_MARINA',
              algorithm: 'EWMA_HALF_LIFE_45M',
              consensus_fare_ngn: 520,
              confidence_level: 'VERIFIED',
              volatility_score: 14.2,
              sample_size_recent: 84,
              surge_factors: { rain_markup: 0, fuel_factor: 1.0, rush_hour: true },
            },
            null,
            2
          )
        );
      } else {
        setApiResponse(
          JSON.stringify(
            {
              status: 'success',
              active_hubs: 148,
              peak_bottlenecks: ENTERPRISE_B2B_METRICS.topCorridors,
              telemetry_source: 'Lagos Commuter GPS Mesh',
            },
            null,
            2
          )
        );
      }
    }, 350);
  };

  return (
    <div className="space-y-10 animate-in fade-in">
      
      {/* Enterprise Title & Headline */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/[0.08] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Shield className="w-4 h-4" />
            <span>LAMATA Regulators, 3PLs & Mobility Fintechs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Enterprise Telemetry & Mobility Data Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-normal leading-relaxed">
            Programmatic access to real-time Lagos Origin-Destination flows, multimodal choke points, and dynamic corridor pricing vectors.
          </p>
        </div>

        {/* Enterprise Tier Badge */}
        <div className="flex items-center gap-4 bg-[#0E111A] border border-white/[0.08] rounded-2xl p-4 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Active Contract</span>
            <span className="text-sm font-bold text-white">Tier 2 Enterprise API</span>
            <span className="text-[11px] text-emerald-400 block font-medium">₦1,500,000 / mo · 500k req/mo</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="rounded-2xl bg-[#0E111A] border border-white/[0.08] p-5 space-y-1">
          <span className="text-[11px] font-medium text-slate-400 block">Monitored Corridors</span>
          <div className="text-3xl font-extrabold text-white tabular-nums">
            {ENTERPRISE_B2B_METRICS.activeCorridorsCount}
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">Danfo, Rail, Ferry, BRT</span>
        </div>

        <div className="rounded-2xl bg-[#0E111A] border border-white/[0.08] p-5 space-y-1">
          <span className="text-[11px] font-medium text-slate-400 block">Hourly GPS Points</span>
          <div className="text-3xl font-extrabold text-white tabular-nums">
            {ENTERPRISE_B2B_METRICS.hourlyObservationsCount.toLocaleString()}
          </div>
          <span className="text-[11px] text-amber-400 font-medium">Real-time commuter crowd</span>
        </div>

        <div className="rounded-2xl bg-[#0E111A] border border-white/[0.08] p-5 space-y-1">
          <span className="text-[11px] font-medium text-slate-400 block">Mean Volatility</span>
          <div className="text-3xl font-extrabold text-white tabular-nums">
            {ENTERPRISE_B2B_METRICS.meanFareVolatilityIndex}%
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Daily dynamic range</span>
        </div>

        <div className="rounded-2xl bg-[#0E111A] border border-white/[0.08] p-5 space-y-1">
          <span className="text-[11px] font-medium text-slate-400 block">Peak Congestion Ratio</span>
          <div className="text-3xl font-extrabold text-white tabular-nums">
            {ENTERPRISE_B2B_METRICS.congestionPeakRatio}x
          </div>
          <span className="text-[11px] text-rose-400 font-medium">3rd Mainland surge</span>
        </div>
      </div>

      {/* Origin-Destination (O-D) Matrix Table */}
      <div className="rounded-2xl bg-[#0E111A] border border-white/[0.08] p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Origin-Destination (O-D) Commute Flow Matrix</h3>
            <p className="text-xs text-slate-400">Continuous commuter origin-to-destination vector distribution</p>
          </div>
          <span className="text-xs font-mono text-slate-400 tabular-nums">Live Telemetry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.06] text-slate-400">
              <tr>
                <th className="pb-3 font-semibold">Origin Hub</th>
                <th className="pb-3 font-semibold">Destination Axis</th>
                <th className="pb-3 font-semibold">Corridor Volume Share</th>
                <th className="pb-3 font-semibold">Dominant Mode</th>
                <th className="pb-3 font-semibold text-right">Avg Transit Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-200">
              {ENTERPRISE_B2B_METRICS.originDestinationFlows.map((flow, i) => (
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="py-4 font-semibold text-white">{flow.origin}</td>
                  <td className="py-4 text-slate-300">{flow.destination}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${flow.sharePercent}%` }}
                        />
                      </div>
                      <span className="font-mono tabular-nums text-slate-200">{flow.sharePercent}%</span>
                    </div>
                  </td>
                  <td className="py-4 uppercase text-[11px] font-semibold text-slate-400">
                    {flow.primaryMode}
                  </td>
                  <td className="py-4 text-right font-mono font-medium text-amber-400 tabular-nums">
                    {flow.avgTransitMin} mins
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Developer API Management & Interactive Console */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* API Credentials Card */}
        <div className="rounded-2xl bg-[#0E111A] border border-white/[0.08] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white">API Credentials & Rate Limits</h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-normal">
            Authenticate Edge requests with bearer token authorization header.
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setApiKeyType('live')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  apiKeyType === 'live'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-white/[0.02] text-slate-400 border border-white/[0.06]'
                }`}
              >
                Production (live_)
              </button>
              <button
                onClick={() => setApiKeyType('test')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  apiKeyType === 'test'
                    ? 'bg-sky-400 text-slate-950'
                    : 'bg-white/[0.02] text-slate-400 border border-white/[0.06]'
                }`}
              >
                Sandbox (test_)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={apiKey}
                className="w-full bg-[#080910] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-amber-300"
              />
              <button
                onClick={handleCopyKey}
                className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 transition-colors shrink-0"
                title="Copy API Key"
              >
                {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={handleGenerateKey}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium underline"
            >
              Rotate Secret Key
            </button>
          </div>

          <div className="pt-4 border-t border-white/[0.06] space-y-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Monthly Metered Quota</span>
              <span className="font-mono text-white tabular-nums">1,580 / 500,000 reqs</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: '3.2%' }} />
            </div>
          </div>
        </div>

        {/* Live OpenAPI Runner */}
        <div className="rounded-2xl bg-[#0E111A] border border-white/[0.08] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-white">Live OpenAPI Runner</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">OpenAPI 3.1</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setSelectedEndpoint('od-matrix')}
              className={`px-3 py-1.5 rounded-xl font-mono transition-colors ${
                selectedEndpoint === 'od-matrix'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-white/[0.02] text-slate-400 border border-white/[0.06]'
              }`}
            >
              /flows/od-matrix
            </button>
            <button
              onClick={() => setSelectedEndpoint('consensus-pricing')}
              className={`px-3 py-1.5 rounded-xl font-mono transition-colors ${
                selectedEndpoint === 'consensus-pricing'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-white/[0.02] text-slate-400 border border-white/[0.06]'
              }`}
            >
              /pricing/consensus
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080910] border border-white/10 font-mono text-[11px] text-slate-300 overflow-x-auto">
            <div className="text-slate-500 mb-1"># Shell Command</div>
            <code>
              {`curl -X GET "https://ijenkeoma.com/api/v1/${selectedEndpoint}" \\`}
              <br />
              {`  -H "Authorization: Bearer ${apiKey.substring(0, 16)}..."`}
            </code>
          </div>

          <button
            onClick={handleRunEndpointTest}
            disabled={isExecutingApi}
            className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors min-h-[44px]"
          >
            <Code2 className="w-4 h-4" />
            <span>{isExecutingApi ? 'Running API query...' : 'Execute Live API Request'}</span>
          </button>

          {apiResponse && (
            <div className="p-3.5 rounded-xl bg-[#080910] border border-white/10 font-mono text-[10px] text-emerald-400 max-h-44 overflow-y-auto">
              <pre>{apiResponse}</pre>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
