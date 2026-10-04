/**
 * mockAuthService.ts
 *
 * In-memory + localStorage mock of a real auth/database service.
 * All data is stored in localStorage under 'sf_*' keys.
 *
 * PRODUCTION REPLACEMENT GUIDE:
 *   1. Replace each function with the equivalent Supabase / Firebase /
 *      custom API call.
 *   2. The return shape must stay the same so AuthContext requires no changes.
 *   3. Remove DEMO_FARMER and SEED_SCANS when real data is available.
 *
 * Environment variable to enable/disable demo account:
 *   VITE_DEMO_ENABLED=true  (default true in dev)
 */

import type {
  User,
  FarmerProfile,
  Farm,
  UsageQuota,
  ScanRecord,
  ChatConversation,
  Locale,
  SubscriptionPlan,
} from '../types';
import type { SignInCredentials, SignUpData } from './AuthContext';
import { SEED_SCANS, SEED_CONVERSATIONS } from '../data/seedData';

/* ─── Helpers ─────────────────────────────────────────────── */
function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function now() {
  return new Date().toISOString();
}

function persist(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

function load<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch { return null; }
}

function makeQuota(userId: string, plan: SubscriptionPlan): UsageQuota {
  return {
    userId,
    plan,
    scansUsedToday:       0,
    scansUsedMonth:       0,
    scanLimitDaily:       plan === 'free' ? 3 : 999,
    scanLimitMonthly:     plan === 'free' ? 999 : 30,
    chatCreditsUsedToday: 0,
    chatCreditsUsedMonth: 0,
    chatLimitDaily:       plan === 'free' ? 5 : 999,
    chatLimitMonthly:     plan === 'free' ? 999 : 50,
    resetDate: new Date(Date.now() + 86_400_000).toISOString(),
  };
}

const DEFAULT_FARM: Farm = {
  id: 'farm-001',
  name: 'Demo Farm',
  district: 'Mbarara',
  subCounty: 'Kakiika',
  parish: 'Rwebikoona',
  village: 'Nyamitanga',
  gpsLat: -0.6017,
  gpsLng: 30.6545,
  gpsConsent: true,
  mainCrops: ['Cassava', 'Maize', 'Banana'],
  farmSizeValue: '2',
  farmSizeUnit: 'acres',
  farmingType: 'Mixed farming',
  isDefault: true,
};

/* ─── Demo account ────────────────────────────────────────── */
export const DEMO_USER_ID = 'demo-farmer-001';

const DEMO_USER: User = {
  id:        DEMO_USER_ID,
  email:     'demo@smartfarmer.ai',
  phone:     '+256700000001',
  name:      'Demo Farmer',
  locale:    'en',
  plan:      'free',
  createdAt: '2026-01-15T08:00:00Z',
  isDemo:    true,
};

const DEMO_PROFILE: FarmerProfile = {
  userId:              DEMO_USER_ID,
  farmerName:          'Demo Farmer',
  phone:               '+256700000001',
  email:               'demo@smartfarmer.ai',
  preferredLocale:     'en',
  farms:               [DEFAULT_FARM],
  notificationsEnabled: true,
  alertsEnabled:        true,
  dataContributionOptIn: true,
  consentGiven:         true,
  consentTimestamp:     '2026-01-15T08:01:00Z',
};

/* ─── Service ─────────────────────────────────────────────── */
export const mockAuthService = {
  /** Restore persisted session on app load */
  async restoreSession(): Promise<{ user: User; profile: FarmerProfile; quota: UsageQuota } | null> {
    const userId = load<string>('sf_session');
    if (!userId) return null;

    const user    = load<User>(`sf_user_${userId}`);
    const profile = load<FarmerProfile>(`sf_profile_${userId}`);
    const quota   = load<UsageQuota>(`sf_quota_${userId}`);

    if (!user) return null;

    // Check / reset daily quota
    const refreshed = refreshQuotaIfNeeded(quota ?? makeQuota(userId, user.plan));
    if (refreshed !== quota) persist(`sf_quota_${userId}`, refreshed);

    return { user, profile: profile ?? DEMO_PROFILE, quota: refreshed };
  },

  async signIn(creds: SignInCredentials): Promise<{
    success: boolean; error?: string;
    user?: User; profile?: FarmerProfile; quota?: UsageQuota;
  }> {
    await delay(600);

    // Demo shortcut: any password for the demo email/phone
    const isDemoEmail = creds.email?.toLowerCase() === 'demo@smartfarmer.ai';
    const isDemoPhone = creds.phone?.replace(/\s/g, '') === '+256700000001';

    if (isDemoEmail || isDemoPhone) {
      return bootSession(DEMO_USER, DEMO_PROFILE);
    }

    // Look up registered users
    const users = load<User[]>('sf_users') ?? [];
    const found = users.find(u =>
      (creds.email && u.email?.toLowerCase() === creds.email.toLowerCase()) ||
      (creds.phone && u.phone?.replace(/\s/g, '') === creds.phone?.replace(/\s/g, ''))
    );
    if (!found) return { success: false, error: 'No account found. Please sign up first.' };

    const storedPw = load<string>(`sf_pw_${found.id}`);
    if (storedPw && creds.password && storedPw !== creds.password) {
      return { success: false, error: 'Incorrect password.' };
    }

    const profile = load<FarmerProfile>(`sf_profile_${found.id}`) ?? {
      ...DEMO_PROFILE,
      userId: found.id,
      farmerName: found.name,
      email: found.email,
      phone: found.phone,
      preferredLocale: found.locale,
    };
    return bootSession(found, profile);
  },

  async signUp(data: SignUpData): Promise<{
    success: boolean; error?: string;
    user?: User; profile?: FarmerProfile; quota?: UsageQuota;
  }> {
    await delay(800);

    const users = load<User[]>('sf_users') ?? [];
    const exists = users.find(u =>
      (data.email && u.email?.toLowerCase() === data.email.toLowerCase()) ||
      (data.phone && u.phone?.replace(/\s/g, '') === data.phone?.replace(/\s/g, ''))
    );
    if (exists) return { success: false, error: 'An account with this email or phone already exists.' };

    const newUser: User = {
      id:        uid(),
      email:     data.email,
      phone:     data.phone,
      name:      data.name,
      locale:    data.locale,
      plan:      'free',
      createdAt: now(),
    };

    const newProfile: FarmerProfile = {
      userId:              newUser.id,
      farmerName:          data.name,
      email:               data.email,
      phone:               data.phone,
      preferredLocale:     data.locale,
      farms:               [],
      notificationsEnabled: true,
      alertsEnabled:        true,
      dataContributionOptIn: true,
      consentGiven:         false,
    };

    users.push(newUser);
    persist('sf_users', users);
    persist(`sf_user_${newUser.id}`,    newUser);
    persist(`sf_profile_${newUser.id}`, newProfile);
    if (data.password) persist(`sf_pw_${newUser.id}`, data.password);

    // Seed demo scans for the new user too
    seedScans(newUser.id);

    return bootSession(newUser, newProfile);
  },

  async signOut(): Promise<void> {
    localStorage.removeItem('sf_session');
  },

  async deleteAccount(userId: string): Promise<void> {
    localStorage.removeItem('sf_session');
    localStorage.removeItem(`sf_user_${userId}`);
    localStorage.removeItem(`sf_profile_${userId}`);
    localStorage.removeItem(`sf_quota_${userId}`);
    localStorage.removeItem(`sf_scans_${userId}`);
    localStorage.removeItem(`sf_chats_${userId}`);
    const users = (load<User[]>('sf_users') ?? []).filter(u => u.id !== userId);
    persist('sf_users', users);
  },

  async updateProfile(userId: string, updates: Partial<FarmerProfile>): Promise<FarmerProfile> {
    const current = load<FarmerProfile>(`sf_profile_${userId}`) ?? DEMO_PROFILE;
    const updated = { ...current, ...updates };
    persist(`sf_profile_${userId}`, updated);
    // Keep user locale in sync
    if (updates.preferredLocale) {
      const user = load<User>(`sf_user_${userId}`);
      if (user) {
        const updatedUser = { ...user, locale: updates.preferredLocale };
        persist(`sf_user_${userId}`, updatedUser);
      }
    }
    return updated;
  },

  async getQuota(userId: string): Promise<UsageQuota> {
    const user  = load<User>(`sf_user_${userId}`) ?? DEMO_USER;
    const quota = load<UsageQuota>(`sf_quota_${userId}`) ?? makeQuota(userId, user.plan);
    const refreshed = refreshQuotaIfNeeded(quota);
    if (refreshed !== quota) persist(`sf_quota_${userId}`, refreshed);
    return refreshed;
  },

  async consumeScan(userId: string): Promise<{ ok: boolean; quota: UsageQuota }> {
    const q = await this.getQuota(userId);
    const user = load<User>(`sf_user_${userId}`) ?? DEMO_USER;
    const daily   = user.plan === 'free';
    const used    = daily ? q.scansUsedToday  : q.scansUsedMonth;
    const limit   = daily ? q.scanLimitDaily  : q.scanLimitMonthly;

    if (used >= limit) return { ok: false, quota: q };

    const updated: UsageQuota = {
      ...q,
      scansUsedToday:  q.scansUsedToday + 1,
      scansUsedMonth:  q.scansUsedMonth + 1,
    };
    persist(`sf_quota_${userId}`, updated);
    return { ok: true, quota: updated };
  },

  async consumeChat(userId: string): Promise<{ ok: boolean; quota: UsageQuota }> {
    const q = await this.getQuota(userId);
    const user = load<User>(`sf_user_${userId}`) ?? DEMO_USER;
    const daily = user.plan === 'free';
    const used  = daily ? q.chatCreditsUsedToday  : q.chatCreditsUsedMonth;
    const limit = daily ? q.chatLimitDaily         : q.chatLimitMonthly;

    if (used >= limit) return { ok: false, quota: q };

    const updated: UsageQuota = {
      ...q,
      chatCreditsUsedToday:  q.chatCreditsUsedToday + 1,
      chatCreditsUsedMonth:  q.chatCreditsUsedMonth + 1,
    };
    persist(`sf_quota_${userId}`, updated);
    return { ok: true, quota: updated };
  },

  async updateLocale(userId: string, locale: Locale): Promise<void> {
    const user = load<User>(`sf_user_${userId}`);
    if (user) persist(`sf_user_${userId}`, { ...user, locale });
  },

  /* ── Scans ── */
  async getScans(userId: string): Promise<ScanRecord[]> {
    return load<ScanRecord[]>(`sf_scans_${userId}`) ?? [];
  },

  async addScan(userId: string, scan: ScanRecord): Promise<void> {
    const scans = load<ScanRecord[]>(`sf_scans_${userId}`) ?? [];
    scans.unshift(scan);
    persist(`sf_scans_${userId}`, scans);
  },

  async deleteScan(userId: string, scanId: string): Promise<void> {
    const scans = (load<ScanRecord[]>(`sf_scans_${userId}`) ?? []).filter(s => s.id !== scanId);
    persist(`sf_scans_${userId}`, scans);
  },

  /* ── Chat ── */
  async getConversations(userId: string): Promise<ChatConversation[]> {
    return load<ChatConversation[]>(`sf_chats_${userId}`) ?? [];
  },

  async saveConversation(userId: string, convo: ChatConversation): Promise<void> {
    const convos = load<ChatConversation[]>(`sf_chats_${userId}`) ?? [];
    const idx = convos.findIndex(c => c.id === convo.id);
    if (idx >= 0) convos[idx] = convo;
    else convos.unshift(convo);
    persist(`sf_chats_${userId}`, convos);
  },
};

/* ─── Internal helpers ────────────────────────────────────── */
function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

function bootSession(user: User, profile: FarmerProfile) {
  const quota = load<UsageQuota>(`sf_quota_${user.id}`) ?? makeQuota(user.id, user.plan);
  const refreshed = refreshQuotaIfNeeded(quota);
  persist(`sf_session`,             user.id);
  persist(`sf_user_${user.id}`,    user);
  persist(`sf_profile_${user.id}`, profile);
  persist(`sf_quota_${user.id}`,   refreshed);

  // Seed scans if none exist yet
  if (!localStorage.getItem(`sf_scans_${user.id}`)) {
    seedScans(user.id);
  }
  if (!localStorage.getItem(`sf_chats_${user.id}`)) {
    seedChats(user.id);
  }

  return { success: true, user, profile, quota: refreshed };
}

function refreshQuotaIfNeeded(q: UsageQuota): UsageQuota {
  const now = new Date();
  const reset = new Date(q.resetDate);
  if (now >= reset) {
    return {
      ...q,
      scansUsedToday:       0,
      chatCreditsUsedToday: 0,
      resetDate: new Date(now.getTime() + 86_400_000).toISOString(),
    };
  }
  return q;
}

function seedScans(userId: string) {
  const scans = SEED_SCANS.map(s => ({ ...s, userId }));
  persist(`sf_scans_${userId}`, scans);
}

function seedChats(userId: string) {
  const chats = SEED_CONVERSATIONS.map(c => ({ ...c, userId }));
  persist(`sf_chats_${userId}`, chats);
}
