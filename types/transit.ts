export type TransportMode =
  | 'danfo'
  | 'korope'
  | 'brt'
  | 'keke'
  | 'okada'
  | 'rail'
  | 'ferry'
  | 'hitch'
  | 'walk';

export type StopType =
  | 'danfo_park'
  | 'keke_junction'
  | 'brt_station'
  | 'rail_station'
  | 'ferry_jetty'
  | 'interchange';

export type WeatherCondition =
  | 'clear'
  | 'heavy_rain'
  | 'light_rain'
  | 'scarcity';

export type CongestionLevel = 'free' | 'moderate' | 'gridlock';

export type PriceConfidence = 'VERIFIED' | 'VOLATILE' | 'ESTIMATED';

export interface TransitStop {
  id: string;
  name: string;
  localName: string;
  landmarkDescription: string;
  landmarkImageUrl: string;
  visualCues: string[];
  audioCues: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  stopType: StopType;
  isVerified: boolean;
  connectedModes: TransportMode[];
  neighborhood: string;
}

export interface RouteSegment {
  id: string;
  mode: TransportMode;
  fromStop: TransitStop;
  toStop: TransitStop;
  durationMin: number;
  waitTimeMin: number;
  distanceKm: number;
  fareNgn: number;
  frequencyMin: number;
  instructions: string;
  localAdvice?: string;
  landmarks: string[];
  cowryAccepted?: boolean;
}

export interface MultimodalJourney {
  id: string;
  title: string;
  tagline: string;
  segments: RouteSegment[];
  totalDurationMin: number;
  totalWaitMin: number;
  totalFareNgn: number;
  fareRange: {
    min: number;
    max: number;
  };
  confidenceBadge: PriceConfidence;
  congestionIndex: CongestionLevel;
  carbonSavedKg: number;
  walkingDistanceKm: number;
  transfersCount: number;
  recommendedFor: 'fastest' | 'cheapest' | 'scenic_water' | 'comfort_rail';
}

export interface FareReport {
  id: string;
  routeCode: string;
  originStopId: string;
  destinationStopId: string;
  transportMode: TransportMode;
  paidFareNgn: number;
  weatherCondition: WeatherCondition;
  congestionLevel: CongestionLevel;
  timeOfDay: 'morning_rush' | 'midday' | 'evening_rush' | 'late_night';
  timestamp: number;
  contributorName: string;
  contributorTrustScore: number;
  isVerified: boolean;
  distanceDeltaMeters?: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  xpPoints: number;
  streakDays: number;
  walletBalanceNgn: number;
  trustScore: number;
  reportsCount: number;
  neighborhoodRank: string;
  badges: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    dateEarned: string;
  }>;
}

export interface B2BEnterpriseMetrics {
  activeCorridorsCount: number;
  hourlyObservationsCount: number;
  meanFareVolatilityIndex: number;
  congestionPeakRatio: number;
  topCorridors: Array<{
    corridor: string;
    dailyTrips: number;
    avgSpeedKmh: number;
    avgFareNgn: number;
    congestionRisk: 'low' | 'moderate' | 'critical';
  }>;
  originDestinationFlows: Array<{
    origin: string;
    destination: string;
    sharePercent: number;
    primaryMode: TransportMode;
    avgTransitMin: number;
  }>;
}
