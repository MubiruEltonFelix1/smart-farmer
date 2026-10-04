/* ─────────────────────────────────────────────────────────
   SmartFarmer — Shared TypeScript types
   ───────────────────────────────────────────────────────── */

/* ── Existing public-site types ── */
export interface DiagnosisResult {
  crop: string;
  disease: string;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Healthy';
  status: 'Healthy' | 'Potentially affected' | 'Affected' | 'Needs attention';
  recommendations: string[];
  imageUrl?: string;
  timestamp?: Date;
}

export interface CropCard {
  name: string;
  icon: string;
  color: string;
  diseases: string[];
  status: 'Available' | 'Coming Soon' | 'Research';
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface PartnerType {
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface TechPillar {
  title: string;
  description: string;
  icon: string;
}

export interface BenefitCard {
  title: string;
  description: string;
  icon: string;
}

export interface ImpactMetric {
  value: string;
  label: string;
  note?: string;
}

/* ── Auth & User ── */
export type Locale = 'en' | 'lg' | 'nyn';

export type SubscriptionPlan = 'free' | 'pro';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  locale: Locale;
  plan: SubscriptionPlan;
  createdAt: string; // ISO
  isDemo?: boolean;
}

export interface FarmerProfile {
  userId: string;
  farmerName: string;
  phone?: string;
  email?: string;
  preferredLocale: Locale;
  farms: Farm[];
  notificationsEnabled: boolean;
  alertsEnabled: boolean;
  dataContributionOptIn: boolean;
  consentGiven: boolean;
  consentTimestamp?: string;
}

export interface Farm {
  id: string;
  name: string;
  district: string;
  subCounty: string;
  parish: string;
  village: string;
  gpsLat?: number;
  gpsLng?: number;
  gpsConsent: boolean;
  mainCrops: string[];
  farmSizeValue: string;
  farmSizeUnit: 'acres' | 'hectares' | 'plots';
  farmingType: string;
  plantingNotes?: string;
  isDefault: boolean;
}

/* ── Usage & Quotas ── */
export interface UsageQuota {
  userId: string;
  plan: SubscriptionPlan;
  scansUsedToday: number;        // free: resets daily
  scansUsedMonth: number;        // pro: resets monthly
  scanLimitDaily: number;        // free: 3
  scanLimitMonthly: number;      // pro: 30
  chatCreditsUsedToday: number;  // free: resets daily
  chatCreditsUsedMonth: number;  // pro: resets monthly
  chatLimitDaily: number;        // free: 5
  chatLimitMonthly: number;      // pro: 50
  resetDate: string;             // ISO
}

/* ── Scan Records ── */
export type ScanSeverity = 'Healthy' | 'Low' | 'Moderate' | 'High';
export type ScanStatus = 'Healthy' | 'Potentially affected' | 'Affected' | 'Needs attention' | 'Inconclusive';

export interface ScanRecord {
  id: string;
  userId: string;
  farmId?: string;
  cropType: string;
  imageUrl: string;       // time-limited URL or data URI for demo
  imageThumb?: string;
  diagnosisResult?: DiagnosisResult;
  disease?: string;
  confidence?: number;
  severity?: ScanSeverity;
  status?: ScanStatus;
  symptomNotes?: string;
  affectedAreaPct?: number;
  location?: string;      // display label
  isInconclusive: boolean;
  savedToHistory: boolean;
  contributesToOutbreak: boolean;
  createdAt: string;      // ISO
}

/* ── Weather ── */
export interface WeatherCurrent {
  tempC: number;
  feelsLikeC: number;
  humidity: number;
  windKph: number;
  conditionText: string;
  conditionIcon: string;  // emoji or icon key
  rainMm: number;
  updatedAt: string;
}

export interface WeatherDay {
  date: string; // YYYY-MM-DD
  maxTempC: number;
  minTempC: number;
  rainProbPct: number;
  rainMm: number;
  conditionText: string;
  conditionIcon: string;
  humidity: number;
  windKph: number;
  farmAdvice?: string;
}

export interface WeatherAlert {
  id: string;
  type: 'heavy_rain' | 'drought' | 'strong_wind' | 'heat' | 'cold';
  severity: 'info' | 'watch' | 'warning';
  title: string;
  description: string;
  validFrom: string;
  validUntil: string;
}

export interface WeatherData {
  location: string;
  current: WeatherCurrent;
  forecast: WeatherDay[];
  alerts: WeatherAlert[];
  fetchedAt: string;
  isStale?: boolean;
  error?: string;
}

/* ── Disease Outbreaks ── */
export type OutbreakAlertLevel = 'info' | 'watch' | 'attention';

export interface OutbreakRecord {
  id: string;
  diseaseName: string;
  cropName: string;
  reportCount: number;    // always >= 5 before showing
  locationLabel: string;
  district: string;
  subCounty?: string;
  trendDirection: 'rising' | 'stable' | 'declining';
  alertLevel: OutbreakAlertLevel;
  windowDays: number;
  lastReportedAt: string;
  recommendedActions: string[];
  isOfficiallyConfirmed: boolean;
}

/* ── Chat / AI Assistant ── */
export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  locale: Locale;
  creditConsumed: boolean;
  timestamp: string;
  relatedScanId?: string;
  isError?: boolean;
}

export interface ChatConversation {
  id: string;
  userId: string;
  title?: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  locale: Locale;
}

/* ── Notifications ── */
export interface AppNotification {
  id: string;
  type: 'scan_result' | 'weather_alert' | 'outbreak_alert' | 'quota_warning' | 'system';
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

/* ── Plans ── */
export interface PlanConfig {
  id: SubscriptionPlan;
  name: string;
  priceUSD: number | null;
  scanLimitDaily?: number;
  scanLimitMonthly?: number;
  chatLimitDaily?: number;
  chatLimitMonthly?: number;
  historyDays: number | null;  // null = unlimited
  features: string[];
}
