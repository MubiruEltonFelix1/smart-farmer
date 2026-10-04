import { useState, type FormEvent } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useRouter, Link } from '../../router';
import { t, LOCALE_LABELS, type Locale } from '../../i18n/translations';
import {
  LogoMark, IconArrowRight, IconPhone, IconMail,
  IconLock, IconUser, IconEye, IconX, IconCheck,
} from '../../components/Icons';

const LOCALES: Locale[] = ['en', 'lg', 'nyn'];

export default function SignUpPage() {
  const { signUp, locale: appLocale } = useAuth();
  const { navigate } = useRouter();

  const [name, setName]         = useState('');
  const [phone, setPhone]       = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [locale, setLocale]     = useState<Locale>(appLocale);
  const [showPw, setShowPw]     = useState(false);
  const [agreed, setAgreed]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!agreed) { setError('Please agree to the Privacy Policy to continue.'); return; }
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!phone && !email) { setError('Please enter a phone number or email address.'); return; }
    setLoading(true);
    const result = await signUp({ name: name.trim(), phone, email, password, locale });
    setLoading(false);
    if (result.success) {
      navigate('/onboarding');
    } else {
      setError(result.error ?? t(appLocale, 'error'));
    }
  }

  return (
    <div className="auth-page auth-page--signup">
      <div className="auth-card auth-card--wide">
        <Link to="/" className="auth-logo">
          <LogoMark size={40} />
          <span className="auth-logo-text">Kebeera</span>
        </Link>

        <h1 className="auth-title">{t(appLocale, 'authCreateAccount')}</h1>
        <p className="auth-subtitle">Free account · No payment required to start</p>

        {/* Language selector */}
        <div className="auth-lang-row">
          <span className="auth-lang-label">Language / Olulimi / Orurimi:</span>
          <div className="auth-lang-btns">
            {LOCALES.map(l => (
              <button
                key={l}
                type="button"
                className={`lang-btn${locale === l ? ' lang-btn--active' : ''}`}
                onClick={() => setLocale(l)}
              >
                {LOCALE_LABELS[l]}
              </button>
            ))}
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="auth-field">
            <label htmlFor="name" className="auth-label">{t(locale, 'onboardFarmerName')}</label>
            <div className="auth-input-wrap">
              <IconUser size={16} className="auth-input-icon" />
              <input
                id="name"
                type="text"
                className="auth-input auth-input--icon"
                placeholder={t(locale, 'onboardFarmerNamePlaceholder')}
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="auth-field">
            <label htmlFor="su-phone" className="auth-label">
              {t(locale, 'authPhone')} <span className="auth-optional">({t(locale, 'optional')})</span>
            </label>
            <div className="auth-input-wrap">
              <IconPhone size={16} className="auth-input-icon" />
              <input
                id="su-phone"
                type="tel"
                className="auth-input auth-input--icon"
                placeholder={t(locale, 'authPhonePlaceholder')}
                value={phone}
                onChange={e => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>
          </div>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="su-email" className="auth-label">
              {t(locale, 'authEmail')} <span className="auth-optional">({t(locale, 'optional')})</span>
            </label>
            <div className="auth-input-wrap">
              <IconMail size={16} className="auth-input-icon" />
              <input
                id="su-email"
                type="email"
                className="auth-input auth-input--icon"
                placeholder={t(locale, 'authEmailPlaceholder')}
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="su-pw" className="auth-label">{t(locale, 'authPassword')}</label>
            <div className="auth-input-wrap">
              <IconLock size={16} className="auth-input-icon" />
              <input
                id="su-pw"
                type={showPw ? 'text' : 'password'}
                className="auth-input auth-input--icon auth-input--pw"
                placeholder={t(locale, 'authPasswordPlaceholder')}
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={8}
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

          {/* Consent checkbox */}
          <label className="auth-checkbox">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="auth-checkbox-input"
            />
            <span className="auth-checkbox-box">{agreed && <IconCheck size={12} />}</span>
            <span className="auth-checkbox-label">
              {t(locale, 'authAgreeTo')}{' '}
              <span className="auth-link">{t(locale, 'authPrivacyPolicy')}</span>{' '}
              &amp;{' '}
              <span className="auth-link">{t(locale, 'authTerms')}</span>
            </span>
          </label>

          {error && (
            <div className="auth-error" role="alert">{error}</div>
          )}

          <button
            type="submit"
            className="btn btn--primary btn--large auth-submit"
            disabled={loading}
          >
            {loading ? t(locale, 'authCreating') : t(locale, 'authCreateAccount')}
            {!loading && <IconArrowRight size={16} />}
          </button>
        </form>

        <p className="auth-switch">
          {t(locale, 'authHaveAccount')}{' '}
          <Link to="/signin" className="auth-link">{t(locale, 'authSignIn')}</Link>
        </p>
      </div>
    </div>
  );
}
