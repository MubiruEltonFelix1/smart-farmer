import { useEffect, type ComponentType } from 'react';
import { RouterProvider, Routes, useRouter } from './router';
import { AuthProvider } from './auth/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PortalLayout, { ProtectedRoute } from './portal/PortalLayout';

/* Public pages */
import HomePage       from './pages/HomePage';
import ProductPage    from './pages/ProductPage';
import HowItWorksPage from './pages/HowItWorksPage';
import TechnologyPage from './pages/TechnologyPage';
import SolutionsPage  from './pages/SolutionsPage';
import AboutPage      from './pages/AboutPage';
import PricingPage    from './pages/PricingPage';

/* Auth pages */
import SignInPage     from './pages/auth/SignInPage';
import SignUpPage     from './pages/auth/SignUpPage';
import OnboardingPage from './pages/auth/OnboardingPage';

/* Portal pages */
import DashboardPage  from './pages/portal/DashboardPage';
import PortalScanPage from './pages/portal/PortalScanPage';
import HistoryPage    from './pages/portal/HistoryPage';
import WeatherPage    from './pages/portal/WeatherPage';
import OutbreaksPage  from './pages/portal/OutbreaksPage';
import ProfilePage    from './pages/portal/ProfilePage';
import AssistantPage  from './pages/portal/AssistantPage';
import PlansPage      from './pages/portal/PlansPage';
import SettingsPage   from './pages/portal/SettingsPage';

import './index.css';

/* ── Portal route wrapper helpers ──────────────────────── */
function withPortal(Page: ComponentType, title: string) {
  return (
    <ProtectedRoute>
      <PortalLayout title={title}>
        <Page />
      </PortalLayout>
    </ProtectedRoute>
  );
}

/* ── Routes ─────────────────────────────────────────────── */
const ROUTES = [
  /* Public */
  { path: '/',             element: <HomePage />,        exact: true  },
  { path: '/product',      element: <ProductPage />,     exact: false },
  { path: '/how-it-works', element: <HowItWorksPage />,  exact: false },
  { path: '/technology',   element: <TechnologyPage />,  exact: false },
  { path: '/solutions',    element: <SolutionsPage />,   exact: false },
  { path: '/about',        element: <AboutPage />,       exact: false },
  { path: '/pricing',      element: <PricingPage />,     exact: false },

  /* Auth */
  { path: '/signin',       element: <SignInPage />,      exact: false },
  { path: '/signup',       element: <SignUpPage />,      exact: false },
  { path: '/onboarding',   element: <OnboardingPage />,  exact: false },

  /* Portal */
  { path: '/portal/dashboard', element: withPortal(DashboardPage,  'Dashboard'),         exact: false },
  { path: '/portal/scan',      element: withPortal(PortalScanPage, 'Scan Crop Leaf'),    exact: false },
  { path: '/portal/history',   element: withPortal(HistoryPage,    'Scan History'),      exact: false },
  { path: '/portal/weather',   element: withPortal(WeatherPage,    'Weather'),           exact: false },
  { path: '/portal/outbreaks', element: withPortal(OutbreaksPage,  'Disease Outbreaks'), exact: false },
  { path: '/portal/profile',   element: withPortal(ProfilePage,    'Farm Profile'),      exact: false },
  { path: '/portal/assistant', element: withPortal(AssistantPage,  'AI Farm Assistant'), exact: false },
  { path: '/portal/plans',     element: withPortal(PlansPage,      'Plans & Credits'),   exact: false },
  { path: '/portal/settings',  element: withPortal(SettingsPage,   'Settings'),          exact: false },
];

/* ── AppShell — public layout (Navbar + Footer) ─────────── */
function AppShell() {
  const { path } = useRouter();
  const isPortal = path.startsWith('/portal');
  const isAuth   = path === '/signin' || path === '/signup' || path === '/onboarding';

  // Scroll reveal for public pages
  useEffect(() => {
    if (isPortal || isAuth) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    const els = document.querySelectorAll('.reveal');
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });

  return (
    <>
      {!isPortal && <Navbar />}
      <main
        id="main-content"
        className={isPortal ? '' : 'page-main'}
      >
        <Routes routes={ROUTES} />
      </main>
      {!isPortal && !isAuth && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </RouterProvider>
  );
}
