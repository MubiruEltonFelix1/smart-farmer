import { useState, useEffect } from 'react';
import { Link, useRouter } from '../router';
import { NAV_LINKS } from '../data';
import { LogoMark, IconMenu, IconX, IconArrowRight } from './Icons';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled,  setScrolled] = useState(false);
  const { navigate } = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close drawer on route change
  useEffect(() => { setMenuOpen(false); }, []);

  return (
    <nav
      className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo" exact aria-label="SmartFarmer — home">
          <LogoMark size={32} />
          <span className="navbar__logo-text">Smart<strong>Farmer</strong></span>
        </Link>

        {/* Desktop links */}
        <ul className="navbar__links" role="list">
          {NAV_LINKS.map((link) => (
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

        {/* Desktop CTA */}
        <button
          className="btn btn--primary navbar__cta"
          onClick={() => navigate('/product')}
          aria-label="Try Crop Diagnosis"
        >
          Try Crop Diagnosis
          <IconArrowRight size={15} />
        </button>

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
          {NAV_LINKS.map((link) => (
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
        <button
          className="btn btn--primary navbar__drawer-cta"
          onClick={() => { setMenuOpen(false); navigate('/product'); }}
        >
          Try Crop Diagnosis
          <IconArrowRight size={15} />
        </button>
      </div>
    </nav>
  );
}
