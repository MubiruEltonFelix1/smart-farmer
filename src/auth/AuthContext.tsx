/**
 * AuthContext — Global authentication state for SmartFarmer.
 *
 * Uses localStorage for demo/mock persistence. In production,
 * replace mockAuthService calls with real Supabase / Firebase / custom
 * API calls. The interface stays identical.
 */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, FarmerProfile, UsageQuota, Locale } from '../types';
import { mockAuthService } from './mockAuthService';

/* ─── Context shape ──────────────────────────────────────── */
interface AuthContextValue {
  user: User | null;
  profile: FarmerProfile | null;
  quota: UsageQuota | null;
  loading: boolean;
  isAuthenticated: boolean;

  /* Auth actions */
  signIn:        (credentials: SignInCredentials) => Promise<AuthResult>;
  signUp:        (data: SignUpData)               => Promise<AuthResult>;
  signOut:       ()                               => Promise<void>;
  deleteAccount: ()                               => Promise<void>;

  /* Profile actions */
  updateProfile: (updates: Partial<FarmerProfile>) => Promise<void>;
  refreshQuota:  ()                                => Promise<void>;
  resetDemoChatCredits: ()                         => Promise<void>;
  consumeScan:   ()                                => Promise<boolean>; // false = limit hit
  consumeChat:   ()                                => Promise<boolean>;

  /* Locale */
  locale: Locale;
  setLocale: (l: Locale) => void;
}

export interface SignInCredentials {
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
}

export interface SignUpData {
  email?: string;
  phone?: string;
  password?: string;
  name: string;
  locale: Locale;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  requiresOtp?: boolean;
}

/* ─── Context ────────────────────────────────────────────── */
const AuthContext = createContext<AuthContextValue>({
  user: null, profile: null, quota: null, loading: true, isAuthenticated: false,
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signOut: async () => {},
  deleteAccount: async () => {},
  updateProfile: async () => {},
  refreshQuota: async () => {},
  resetDemoChatCredits: async () => {},
  consumeScan: async () => false,
  consumeChat: async () => false,
  locale: 'en',
  setLocale: () => {},
});

/* ─── Provider ───────────────────────────────────────────── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [quota,   setQuota]   = useState<UsageQuota | null>(null);
  const [loading, setLoading] = useState(true);
  const [locale,  setLocaleState] = useState<Locale>('en');

  /* Boot: restore session */
  useEffect(() => {
    (async () => {
      try {
        const session = await mockAuthService.restoreSession();
        if (session) {
          setUser(session.user);
          setProfile(session.profile);
          setQuota(session.quota);
          setLocaleState(session.user.locale);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = useCallback(async (creds: SignInCredentials): Promise<AuthResult> => {
    const result = await mockAuthService.signIn(creds);
    if (result.success && result.user) {
      setUser(result.user);
      setProfile(result.profile ?? null);
      setQuota(result.quota ?? null);
      setLocaleState(result.user.locale);
    }
    return { success: result.success, error: result.error };
  }, []);

  const signUp = useCallback(async (data: SignUpData): Promise<AuthResult> => {
    const result = await mockAuthService.signUp(data);
    if (result.success && result.user) {
      setUser(result.user);
      setProfile(result.profile ?? null);
      setQuota(result.quota ?? null);
      setLocaleState(result.user.locale);
    }
    return { success: result.success, error: result.error };
  }, []);

  const signOut = useCallback(async () => {
    await mockAuthService.signOut();
    setUser(null);
    setProfile(null);
    setQuota(null);
    setLocaleState('en');
  }, []);

  const deleteAccount = useCallback(async () => {
    if (user) {
      await mockAuthService.deleteAccount(user.id);
      setUser(null);
      setProfile(null);
      setQuota(null);
    }
  }, [user]);

  const updateProfile = useCallback(async (updates: Partial<FarmerProfile>) => {
    if (!user) return;
    const updated = await mockAuthService.updateProfile(user.id, updates);
    setProfile(updated);
  }, [user]);

  const refreshQuota = useCallback(async () => {
    if (!user) return;
    const q = await mockAuthService.getQuota(user.id);
    setQuota(q);
  }, [user]);

  const resetDemoChatCredits = useCallback(async () => {
    if (!user?.isDemo) return;
    const q = await mockAuthService.resetDemoChatCredits(user.id);
    setQuota(q);
  }, [user]);

  const consumeScan = useCallback(async (): Promise<boolean> => {
    if (!user || !quota) return false;
    const result = await mockAuthService.consumeScan(user.id);
    if (result.ok) setQuota(result.quota);
    return result.ok;
  }, [user, quota]);

  const consumeChat = useCallback(async (): Promise<boolean> => {
    if (!user || !quota) return false;
    const result = await mockAuthService.consumeChat(user.id);
    if (result.ok) setQuota(result.quota);
    return result.ok;
  }, [user, quota]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (user) {
      mockAuthService.updateLocale(user.id, l);
      setUser(prev => prev ? { ...prev, locale: l } : prev);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user, profile, quota, loading,
      isAuthenticated: !!user,
      signIn, signUp, signOut, deleteAccount,
      updateProfile, refreshQuota, resetDemoChatCredits, consumeScan, consumeChat,
      locale, setLocale,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
