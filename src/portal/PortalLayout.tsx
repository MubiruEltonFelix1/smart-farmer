import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useRouter, Link } from '../router';
import { t, type AppTranslations } from '../i18n/translations';
import {
  LogoMark,
  IconBarChart, IconScan, IconClock, IconDroplets,
  IconWarning, IconUser, IconMessageCircle, IconStar,
  IconShield, IconBell, IconMenu, IconX, IconArrowRight,
  IconLeaf,
} from '../components/Icons';
import type { ReactNode } from 'react';

interface NavItem {
  path: string;
  labelKey: keyof AppTranslations;
  icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/portal/dashboard',  labelKey: 'navDashboard',  icon: <IconBarChart size={18} /> },
  { path: '/portal/scan',       labelKey: 'navScan',       icon: <IconScan size={18} /> },
  { path: '/portal/history',    labelKey: 'navHistory',    icon: <IconClock size={18} /> },
  { path: '/portal/weather',    labelKey: 'navWeather',    icon: <IconDroplets size={18} /> },
  { path: '/portal/outbreaks',  labelKey: 'navOutbreaks',  icon: <IconWarning size={18} /> },
  { path: '/portal/profile',    labelKey: 'navProfile',    icon: <IconUser size={18} /> },
  { path: '/portal/assistant',  labelKey: 'navAssistant',  icon: <IconMessageCircle size={18} /> },
  { path: '/portal/plans',      labelKey: 'navPlans',      icon: <IconStar size={18} /> },
  { path: '/portal/settings',   labelKey: 'navSettings',   icon: <IconShield size={18} /> },
];

const BOTTOM_ITEMS: NavItem[] = [
  { path: '/portal/dashboard', labelKey: 'navDashboard', icon: <IconBarChart size={20} /> },
  { path: '/portal/scan',      labelKey: 'navScan',      icon: <IconScan size={20} /> },
  { path: '/portal/history',   labelKey: 'navHistory',   icon: <IconClock size={20} /> },
  { path: '/portal/weather',   labelKey: 'navWeather',   icon: <IconDroplets size={20} /> },
  { path: '/portal/assistant', labelKey: 'navAssistant', icon: <IconMessageCircle size={20} /> },
];

function PortalNav({ onClose }: { onClose?: () => void }) {
  const { locale, user, signOut } = useAuth();
  const { navigate, path } = useRouter();

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <nav className="portal-nav" aria-label="Portal navigation">
      <div className="portal-nav__logo">
        <Link to="/" className="portal-nav__logo-link" aria-label="SmartFarmer home">
          <LogoMark size={30} />
          <span className="portal-nav__logo-text">Smart<strong>Farmer</strong></span>
        </Link>
        {onClose && (
          <button className="portal-nav__close" onClick={onClose} aria-label="Close menu">
            <IconX size={20} />
          </button>
        )}
      </div>

      {user?.isDemo && (
        <div className="portal-demo-badge">
          <span>🌱 Demo Account</span>
        </div>
      )}

      <ul className="portal-nav__list" role="list">
        {NAV_ITEMS.map(item => {
          const active = path === item.path || path.startsWith(item.path + '/');
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`portal-nav__link${active ? ' portal-nav__link--active' : ''}`}
                onClick={onClose}
              >
                <span className="portal-nav__icon" aria-hidden="true">{item.icon}</span>
                <span>{t(locale, item.labelKey)}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="portal-nav__footer">
        <div className="portal-nav__user">
          <div className="portal-nav__avatar">{user?.name?.[0]?.toUpperCase() ?? 'F'}</div>
          <div className="portal-nav__user-info">
            <span className="portal-nav__user-name">{user?.name ?? 'Farmer'}</span>
            <span className="portal-nav__user-plan">{user?.plan === 'pro' ? 'Pro' : 'Free'}</span>
          </div>
        </div>
        <button className="portal-nav__signout" onClick={handleSignOut}>
          {t(locale, 'navSignOut')} <IconArrowRight size={13} />
        </button>
      </div>
    </nav>
  );
}

function PortalBottomNav() {
  const { locale } = useAuth();
  const { path } = useRouter();

  return (
    <nav className="portal-bottom-nav" aria-label="Bottom navigation">
      {BOTTOM_ITEMS.map(item => {
        const active = path === item.path || path.startsWith(item.path + '/');
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`portal-bottom-nav__item${active ? ' portal-bottom-nav__item--active' : ''}`}
          >
            {item.icon}
            <span className="portal-bottom-nav__label">
              {t(locale, item.labelKey)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

interface PortalHeaderProps {
  title: string;
  onMenuOpen: () => void;
}

function PortalHeader({ title, onMenuOpen }: PortalHeaderProps) {
  const { locale } = useAuth();
  const { navigate } = useRouter();

  return (
    <header className="portal-header">
      <button className="portal-header__menu" onClick={onMenuOpen} aria-label="Open menu">
        <IconMenu size={22} />
      </button>
      <h1 className="portal-header__title">{title}</h1>
      <div className="portal-header__actions">
        <button
          className="portal-header__action"
          aria-label="Notifications"
          onClick={() => navigate('/portal/settings')}
        >
          <IconBell size={20} />
        </button>
        <button
          className="portal-header__scan-btn btn btn--primary"
          onClick={() => navigate('/portal/scan')}
          aria-label={t(locale, 'navScan')}
        >
          <IconLeaf size={15} />
          <span className="portal-header__scan-label">{t(locale, 'navScan')}</span>
        </button>
      </div>
    </header>
  );
}

export function PortalLayout({ children, title }: { children: ReactNode; title?: string }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { path } = useRouter();

  useEffect(() => { setDrawerOpen(false); }, [path]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <div className="portal-layout">
      {/* Desktop sidebar */}
      <div className="portal-sidebar">
        <PortalNav />
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="portal-drawer-overlay"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className={`portal-drawer${drawerOpen ? ' portal-drawer--open' : ''}`}>
        <PortalNav onClose={() => setDrawerOpen(false)} />
      </div>

      {/* Main content */}
      <div className="portal-main">
        <PortalHeader
          title={title ?? 'SmartFarmer Portal'}
          onMenuOpen={() => setDrawerOpen(true)}
        />
        <main className="portal-content" id="portal-main-content">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <PortalBottomNav />
    </div>
  );
}

export default PortalLayout;

/* ─── Route guard ─────────────────────────────────────────── */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const { navigate } = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/signin');
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="portal-loading-screen">
        <LogoMark size={48} />
        <p>Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  return <>{children}</>;
}
