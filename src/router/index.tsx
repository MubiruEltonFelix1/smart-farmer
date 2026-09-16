import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type MouseEvent,
} from 'react';

/* ─── Types ─────────────────────────────────────────────── */
interface RouterContextValue {
  path: string;
  navigate: (to: string) => void;
}

/* ─── Context ────────────────────────────────────────────── */
const RouterContext = createContext<RouterContextValue>({
  path: '/',
  navigate: () => {},
});

/* ─── Provider ───────────────────────────────────────────── */
export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    window.history.pushState(null, '', to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

/* ─── Hook ───────────────────────────────────────────────── */
export function useRouter() {
  return useContext(RouterContext);
}

/* ─── Link ───────────────────────────────────────────────── */
interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
}

export function Link({
  to,
  children,
  className = '',
  activeClassName = '',
  exact = false,
  onClick,
  'aria-label': ariaLabel,
}: LinkProps) {
  const { path, navigate } = useRouter();
  const isActive = exact ? path === to : path === to || path.startsWith(to + '/');
  const classes = [className, isActive && activeClassName].filter(Boolean).join(' ');

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick?.();
    navigate(to);
  };

  return (
    <a
      href={to}
      className={classes || undefined}
      onClick={handleClick}
      aria-current={isActive ? 'page' : undefined}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}

/* ─── Route ──────────────────────────────────────────────── */
interface RouteProps {
  path: string;
  element: ReactNode;
  exact?: boolean;
}

/* ─── Routes (renders first match) ──────────────────────── */
interface RoutesProps {
  routes: RouteProps[];
}

export function Routes({ routes }: RoutesProps) {
  const { path } = useRouter();

  for (const route of routes) {
    const match = route.exact ? path === route.path : path === route.path || path.startsWith(route.path + '/');
    if (match) return <>{route.element}</>;
  }

  // 404 fallback – redirect home
  const { navigate } = useRouter();
  useEffect(() => { navigate('/'); }, []);
  return null;
}
