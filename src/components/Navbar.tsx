import { useState, useEffect } from 'react';
import { Link, useRouter } from '../router';
import { useAuth } from '../auth/AuthContext';
import { NAV_LINKS } from '../data';
import { LogoMark, IconMenu, IconX, IconArrowRight, IconUser } from './Icons';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { navigate, path } = useRouter();
  const { isAuthenticated, user } = useAuth();

  const isPortal = path.startsWith('/portal');

  useEffect(() => {
    if (isPortal) return;
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isPortal]);

  useEffect(() => { setMenuOpen(false); }, [path]);

  if (isPortal) return null;

  const allNavLinks = [
    ...NAV_LINKS,
    { label: 'Pricing', href: '/pricing' },
  ];

  return (
    <nav
      className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo" exact aria-label="Kebeera — home">
          <LogoMark size={32} />
          <span className="navbar__logo-text">Kebeera</span>
        </Link>

        {/* Desktop links */}
        <ul className="navbar__links" role="list">
          {allNavLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className="navbar__link"
                activeClassName="navbar__link--active"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop auth CTAs */}
        <div className="navbar__auth-actions">
          {isAuthenticated ? (
            <button
              className="btn btn--primary navbar__cta"
              onClick={() => navigate('/portal/dashboard')}
              aria-label="Go to Farmer Portal"
            >
              <IconUser size={15} />
              {user?.name?.split(' ')[0] ?? 'Portal'}
            </button>
          ) : (
            <>
              <button
                className="btn btn--ghost navbar__signin-btn"
                onClick={() => navigate('/signin')}
              >
                Farmer Sign In
              </button>
              <button
                className="btn btn--primary navbar__cta"
                onClick={() => navigate('/product')}
                aria-label="Try Crop Diagnosis"
              >
                Try Crop Diagnosis
                <IconArrowRight size={15} />
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <IconX size={22} /> : <IconMenu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`navbar__drawer${menuOpen ? ' navbar__drawer--open' : ''}`}
        aria-hidden={!menuOpen}
        id="mobile-menu"
      >
        <ul role="list">
          {allNavLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className="navbar__drawer-link"
                activeClassName="navbar__drawer-link--active"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar__drawer-auth">
          {isAuthenticated ? (
            <button
              className="btn btn--primary navbar__drawer-cta"
              onClick={() => { setMenuOpen(false); navigate('/portal/dashboard'); }}
            >
              <IconUser size={15} /> Go to Portal
            </button>
          ) : (
            <>
              <button
                className="btn btn--ghost navbar__drawer-cta"
                style={{ marginBottom: 8 }}
                onClick={() => { setMenuOpen(false); navigate('/signin'); }}
              >
                Farmer Sign In
              </button>
              <button
                className="btn btn--primary navbar__drawer-cta"
                onClick={() => { setMenuOpen(false); navigate('/signup'); }}
              >
                Create Account <IconArrowRight size={15} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
