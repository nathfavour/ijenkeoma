'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  FareReport,
  MultimodalJourney,
  UserProfile,
  WeatherCondition,
  TransportMode,
  CongestionLevel,
} from '@/types/transit';
import { INITIAL_FARE_REPORTS, INITIAL_JOURNEYS, INITIAL_USER_PROFILE } from './transit-data';

interface AppState {
  guestSessionId: string;
  userProfile: UserProfile;
  journeys: MultimodalJourney[];
  savedJourneys: MultimodalJourney[];
  fareReports: FareReport[];
  currentWeather: WeatherCondition;
  selectedJourneyId: string | null;
  activeNavTab: 'search' | 'fare-intelligence' | 'rewards' | 'b2b';
  isSimulatedOffline: boolean;
  visualProofingStopId: string | null;
  isFareModalOpen: boolean;
  isRewardModalOpen: boolean;
  isProofingModalOpen: boolean;

  // Actions
  setActiveNavTab: (tab: 'search' | 'fare-intelligence' | 'rewards' | 'b2b') => void;
  setSelectedJourneyId: (id: string | null) => void;
  setVisualProofingStopId: (stopId: string | null) => void;
  setCurrentWeather: (w: WeatherCondition) => void;
  setSimulatedOffline: (val: boolean) => void;
  setFareModalOpen: (open: boolean) => void;
  setRewardModalOpen: (open: boolean) => void;
  setProofingModalOpen: (open: boolean) => void;

  // Domain Actions
  toggleSaveJourney: (journey: MultimodalJourney) => void;
  addFareReport: (report: {
    originStopId: string;
    destinationStopId: string;
    transportMode: TransportMode;
    paidFareNgn: number;
    weatherCondition: WeatherCondition;
    congestionLevel: CongestionLevel;
    userLocation?: { lat: number; lng: number };
  }) => { xpAwarded: number; newBalance: number };

  redeemAirtimeReward: (provider: string, phone: string, amountNgn: number) => boolean;
  redeemCowryCardTopup: (cardId: string, amountNgn: number) => boolean;
}

const generateGuestId = () => {
  if (typeof window === 'undefined') return 'guest_init_000';
  const stored = localStorage.getItem('ijenkeoma_guest_id');
  if (stored) return stored;
  const newId = `guest_lag_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
  localStorage.setItem('ijenkeoma_guest_id', newId);
  return newId;
};

export const useTransitStore = create<AppState>()(
  persist(
    (set, get) => ({
      guestSessionId: typeof window !== 'undefined' ? generateGuestId() : 'guest_srv_001',
      userProfile: INITIAL_USER_PROFILE,
      journeys: INITIAL_JOURNEYS,
      savedJourneys: [INITIAL_JOURNEYS[0]], // One default saved for offline demo
      fareReports: INITIAL_FARE_REPORTS,
      currentWeather: 'clear',
      selectedJourneyId: INITIAL_JOURNEYS[0].id,
      activeNavTab: 'search',
      isSimulatedOffline: false,
      visualProofingStopId: 'oshodi',
      isFareModalOpen: false,
      isRewardModalOpen: false,
      isProofingModalOpen: false,

      setActiveNavTab: (tab) => set({ activeNavTab: tab }),
      setSelectedJourneyId: (id) => set({ selectedJourneyId: id }),
      setVisualProofingStopId: (stopId) => set({ visualProofingStopId: stopId }),
      setCurrentWeather: (w) => set({ currentWeather: w }),
      setSimulatedOffline: (val) => set({ isSimulatedOffline: val }),
      setFareModalOpen: (open) => set({ isFareModalOpen: open }),
      setRewardModalOpen: (open) => set({ isRewardModalOpen: open }),
      setProofingModalOpen: (open) => set({ isProofingModalOpen: open }),

      toggleSaveJourney: (journey) => {
        const { savedJourneys } = get();
        const exists = savedJourneys.some((j) => j.id === journey.id);
        if (exists) {
          set({ savedJourneys: savedJourneys.filter((j) => j.id !== journey.id) });
        } else {
          set({ savedJourneys: [...savedJourneys, journey] });
        }
      },

      addFareReport: (params) => {
        const { userProfile, fareReports } = get();
        const xpEarned = params.weatherCondition !== 'clear' ? 75 : 50; // Surge bonus XP
        const cashRewardNgn = 150; // ₦150 airtime contribution credit

        const newReport: FareReport = {
          id: `rep_${Date.now()}`,
          routeCode: `${params.originStopId.substring(0, 3).toUpperCase()}-${params.destinationStopId.substring(0, 3).toUpperCase()}`,
          originStopId: params.originStopId,
          destinationStopId: params.destinationStopId,
          transportMode: params.transportMode,
          paidFareNgn: params.paidFareNgn,
          weatherCondition: params.weatherCondition,
          congestionLevel: params.congestionLevel,
          timeOfDay: 'morning_rush',
          timestamp: Date.now(),
          contributorName: userProfile.fullName,
          contributorTrustScore: userProfile.trustScore,
          isVerified: true,
          distanceDeltaMeters: 45,
        };

        const updatedProfile: UserProfile = {
          ...userProfile,
          xpPoints: userProfile.xpPoints + xpEarned,
          walletBalanceNgn: userProfile.walletBalanceNgn + cashRewardNgn,
          reportsCount: userProfile.reportsCount + 1,
          streakDays: Math.min(30, userProfile.streakDays + 1),
          trustScore: Number(Math.min(2.5, userProfile.trustScore + 0.04).toFixed(2)),
        };

        set({
          fareReports: [newReport, ...fareReports],
          userProfile: updatedProfile,
        });

        return { xpAwarded: xpEarned, newBalance: updatedProfile.walletBalanceNgn };
      },

      redeemAirtimeReward: (provider, phone, amountNgn) => {
        const { userProfile } = get();
        if (userProfile.walletBalanceNgn < amountNgn) return false;

        set({
          userProfile: {
            ...userProfile,
            walletBalanceNgn: userProfile.walletBalanceNgn - amountNgn,
          },
        });
        return true;
      },

      redeemCowryCardTopup: (cardId, amountNgn) => {
        const { userProfile } = get();
        if (userProfile.walletBalanceNgn < amountNgn) return false;

        set({
          userProfile: {
            ...userProfile,
            walletBalanceNgn: userProfile.walletBalanceNgn - amountNgn,
          },
        });
        return true;
      },
    }),
    {
      name: 'ijenkeoma_store_v1',
      partialize: (state) => ({
        userProfile: state.userProfile,
        savedJourneys: state.savedJourneys,
        currentWeather: state.currentWeather,
        guestSessionId: state.guestSessionId,
      }),
    }
  )
);
