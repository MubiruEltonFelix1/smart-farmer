import { useState, type FormEvent } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useRouter, Link } from '../../router';
import { t } from '../../i18n/translations';
import {
  LogoMark, IconArrowRight, IconPhone, IconMail, IconLock, IconEye, IconX, IconLeaf,
} from '../../components/Icons';

type Mode = 'phone' | 'email';

export default function SignInPage() {
  const { signIn, locale } = useAuth();
  const { navigate } = useRouter();
  const [mode, setMode]       = useState<Mode>('phone');
  const [phone, setPhone]     = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn(
      mode === 'phone'
        ? { phone, password }
        : { email, password }
    );
    setLoading(false);
    if (result.success) {
      navigate('/portal/dashboard');
    } else {
      setError(result.error ?? t(locale, 'error'));
    }
  }

  function demoSignIn() {
    setMode('email');
    setEmail('demo@smartfarmer.ai');
    setPassword('demo1234');
  }

  return (
    <div className="auth-page auth-page--signin">
      <div className="auth-card">
        {/* Logo */}
        <Link to="/" className="auth-logo">
          <LogoMark size={40} />
          <span className="auth-logo-text">Kebeera</span>
        </Link>

        <h1 className="auth-title">{t(locale, 'authWelcomeBack')}</h1>
        <p className="auth-subtitle">Sign in to your farmer account</p>

        {/* Demo banner */}
        <div className="auth-demo-banner">
          <span className="auth-demo-label"><IconLeaf size={15} /> Demo account available</span>
          <button className="auth-demo-btn" type="button" onClick={demoSignIn}>
            Fill demo credentials
          </button>
        </div>

        {/* Mode toggle */}
        <div className="auth-mode-toggle">
          <button
            type="button"
            className={`auth-mode-btn${mode === 'phone' ? ' auth-mode-btn--active' : ''}`}
            onClick={() => setMode('phone')}
          >
            <IconPhone size={15} /> Phone OTP
          </button>
          <button
            type="button"
            className={`auth-mode-btn${mode === 'email' ? ' auth-mode-btn--active' : ''}`}
            onClick={() => setMode('email')}
          >
            <IconMail size={15} /> Email
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {mode === 'phone' ? (
            <div className="auth-field">
              <label htmlFor="phone" className="auth-label">{t(locale, 'authPhone')}</label>
              <div className="auth-input-wrap">
                <IconPhone size={16} className="auth-input-icon" />
                <input
                  id="phone"
                  type="tel"
                  className="auth-input auth-input--icon"
                  placeholder={t(locale, 'authPhonePlaceholder')}
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  autoComplete="tel"
                  required
                />
              </div>
              <p className="auth-field-hint">We'll send a verification code via SMS</p>
            </div>
          ) : (
            <div className="auth-field">
              <label htmlFor="email" className="auth-label">{t(locale, 'authEmail')}</label>
              <div className="auth-input-wrap">
                <IconMail size={16} className="auth-input-icon" />
                <input
                  id="email"
                  type="email"
                  className="auth-input auth-input--icon"
                  placeholder={t(locale, 'authEmailPlaceholder')}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-field">
            <div className="auth-label-row">
              <label htmlFor="password" className="auth-label">{t(locale, 'authPassword')}</label>
              <button type="button" className="auth-forgot">{t(locale, 'authForgotPassword')}</button>
            </div>
            <div className="auth-input-wrap">
              <IconLock size={16} className="auth-input-icon" />
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                className="auth-input auth-input--icon auth-input--pw"
                placeholder={t(locale, 'authPasswordPlaceholder')}
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="auth-pw-toggle"
                onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <IconX size={15} /> : <IconEye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn--primary btn--large auth-submit"
            disabled={loading}
          >
            {loading ? t(locale, 'authSigningIn') : t(locale, 'authSignIn')}
            {!loading && <IconArrowRight size={16} />}
          </button>
        </form>

        <p className="auth-switch">
          {t(locale, 'authNoAccount')}{' '}
          <Link to="/signup" className="auth-link">{t(locale, 'authSignUp')}</Link>
        </p>
      </div>
    </div>
  );
}
