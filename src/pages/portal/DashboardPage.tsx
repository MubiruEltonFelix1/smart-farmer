import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useRouter } from '../../router';
import { t } from '../../i18n/translations';
import { mockAuthService } from '../../auth/mockAuthService';
import { DEMO_WEATHER, DEMO_OUTBREAKS } from '../../data/seedData';
import type { ScanRecord } from '../../types';
import {
  IconScan, IconLeaf, IconArrowRight, IconWarning,
  IconDroplets, IconCheck, IconClock,
  IconStar,
} from '../../components/Icons';

function severityColor(sev?: string) {
  if (sev === 'High')     return '#b5451b';
  if (sev === 'Moderate') return '#c8a94e';
  if (sev === 'Low')      return '#0e7490';
  return '#2d6a4f';
}

function severityBg(sev?: string) {
  if (sev === 'High')     return 'rgba(181,69,27,0.10)';
  if (sev === 'Moderate') return 'rgba(200,169,78,0.12)';
  if (sev === 'Low')      return 'rgba(14,116,144,0.10)';
  return 'rgba(45,106,79,0.10)';
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getGreeting(locale: string, name: string): string {
  const hr = new Date().getHours();
  const part = hr < 12 ? 'morning' : hr < 17 ? 'afternoon' : 'evening';
  if (locale === 'lg') return `Wasuze otya, ${name}`;
  if (locale === 'nyn') return `Oraire ota, ${name}`;
  return `Good ${part}, ${name}`;
}

export default function DashboardPage() {
  const { user, quota, locale } = useAuth();
  const { navigate } = useRouter();
  const [scans, setScans] = useState<ScanRecord[]>([]);

  useEffect(() => {
    if (user?.id) {
      mockAuthService.getScans(user.id).then(s => setScans(s.slice(0, 4)));
    }
  }, [user?.id]);

  const weather = DEMO_WEATHER;
  const topAlert = DEMO_OUTBREAKS.find(o => o.alertLevel !== 'info');
  const scanUsed  = quota?.scansUsedToday ?? 0;
  const scanLimit = quota?.scanLimitDaily ?? 3;
  const chatLeft  = (quota?.chatLimitDaily ?? 5) - (quota?.chatCreditsUsedToday ?? 0);

  return (
    <div className="dash-page">
      {/* Greeting */}
      <div className="dash-greeting">
        <h2 className="dash-greeting__text">
          {getGreeting(locale, user?.name?.split(' ')[0] ?? 'Farmer')} 👋
        </h2>
        <p className="dash-greeting__sub">
          {new Date().toLocaleDateString('en-UG', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Demo banner */}
      {user?.isDemo && (
        <div className="dash-demo-notice">
          🌱 You are signed in to the <strong>demo account</strong>. Data shown is for testing purposes only.
          <button className="dash-demo-notice__btn" onClick={() => navigate('/signup')}>
            Create real account
          </button>
        </div>
      )}

      {/* Quick stats row */}
      <div className="dash-stats">
        {/* Scan usage */}
        <div className="dash-stat-card">
          <div className="dash-stat-card__header">
            <IconScan size={18} className="dash-stat-card__icon" />
            <span className="dash-stat-card__label">{t(locale, 'dashScansUsed')}</span>
          </div>
          <div className="dash-stat-card__value">
            <strong>{scanUsed}</strong> / {scanLimit}
          </div>
          <div className="dash-stat-bar">
            <div
              className="dash-stat-bar__fill"
              style={{ width: `${Math.min((scanUsed / scanLimit) * 100, 100)}%`,
                background: scanUsed >= scanLimit ? '#b5451b' : undefined }}
            />
          </div>
          {scanUsed >= scanLimit ? (
            <span className="dash-stat-card__warn">Limit reached · Resets tomorrow</span>
          ) : (
            <span className="dash-stat-card__note">{scanLimit - scanUsed} remaining today</span>
          )}
        </div>

        {/* Chat credits */}
        <div className="dash-stat-card">
          <div className="dash-stat-card__header">
            <IconStar size={18} className="dash-stat-card__icon" />
            <span className="dash-stat-card__label">{t(locale, 'dashChatCredits')}</span>
          </div>
          <div className="dash-stat-card__value">
            <strong>{Math.max(0, chatLeft)}</strong>
          </div>
          <span className="dash-stat-card__note">{t(locale, 'dashCreditsLeft')}</span>
        </div>

        {/* Weather mini */}
        <div className="dash-stat-card dash-stat-card--weather" onClick={() => navigate('/portal/weather')}>
          <div className="dash-stat-card__header">
            <IconDroplets size={18} className="dash-stat-card__icon" />
            <span className="dash-stat-card__label">{weather.location}</span>
          </div>
          <div className="dash-weather-mini">
            <span className="dash-weather-mini__icon">{weather.current.conditionIcon}</span>
            <span className="dash-weather-mini__temp">{weather.current.tempC}°C</span>
          </div>
          <span className="dash-stat-card__note">{weather.current.conditionText} · {weather.current.humidity}% humidity</span>
        </div>
      </div>

      {/* Primary CTA */}
      <button
        className="dash-scan-cta"
        onClick={() => navigate('/portal/scan')}
      >
        <div className="dash-scan-cta__icon"><IconLeaf size={28} /></div>
        <div className="dash-scan-cta__text">
          <strong>{t(locale, 'dashScanToday')}</strong>
          <span>Take or upload a photo of a crop leaf</span>
        </div>
        <IconArrowRight size={20} className="dash-scan-cta__arrow" />
      </button>

      {/* Nearby outbreak alert */}
      {topAlert && (
        <div
          className={`dash-alert dash-alert--${topAlert.alertLevel}`}
          onClick={() => navigate('/portal/outbreaks')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && navigate('/portal/outbreaks')}
        >
          <IconWarning size={18} className="dash-alert__icon" />
          <div className="dash-alert__body">
            <span className="dash-alert__title">{t(locale, 'dashNearbyAlert')}</span>
            <span className="dash-alert__desc">
              {topAlert.diseaseName} · {topAlert.locationLabel} · {topAlert.reportCount} reports
            </span>
          </div>
          <IconArrowRight size={15} />
        </div>
      )}

      {/* Recent scans */}
      <div className="dash-section">
        <div className="dash-section__header">
          <h3 className="dash-section__title">{t(locale, 'dashRecentScans')}</h3>
          <button className="dash-section__link" onClick={() => navigate('/portal/history')}>
            {t(locale, 'dashViewAll')} <IconArrowRight size={13} />
          </button>
        </div>

        {scans.length === 0 ? (
          <div className="dash-empty">
            <IconLeaf size={36} className="dash-empty__icon" />
            <p>{t(locale, 'dashNoScans')}</p>
          </div>
        ) : (
          <div className="dash-scan-list">
            {scans.map(scan => (
              <div
                key={scan.id}
                className="dash-scan-item"
                onClick={() => navigate('/portal/history')}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate('/portal/history')}
              >
                <div
                  className="dash-scan-item__thumb"
                  style={{ background: severityBg(scan.severity) }}
                >
                  <IconLeaf size={20} style={{ color: severityColor(scan.severity) }} />
                </div>
                <div className="dash-scan-item__info">
                  <span className="dash-scan-item__crop">{scan.cropType}</span>
                  <span className="dash-scan-item__disease">{scan.disease}</span>
                </div>
                <div className="dash-scan-item__meta">
                  {scan.severity && (
                    <span
                      className="dash-scan-item__badge"
                      style={{ color: severityColor(scan.severity), background: severityBg(scan.severity) }}
                    >
                      {scan.severity}
                    </span>
                  )}
                  <span className="dash-scan-item__time">
                    <IconClock size={11} /> {timeAgo(scan.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upgrade card (Free users) */}
      {user?.plan === 'free' && (
        <div className="dash-upgrade-card">
          <div className="dash-upgrade-card__body">
            <IconStar size={22} className="dash-upgrade-card__icon" />
            <div>
              <strong>{t(locale, 'dashUpgrade')}</strong>
              <p>{t(locale, 'dashUpgradeSub')}</p>
            </div>
          </div>
          <button
            className="btn btn--primary"
            onClick={() => navigate('/portal/plans')}
          >
            {t(locale, 'dashUpgradeBtn')} <IconArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Weather forecast strip */}
      <div className="dash-section">
        <div className="dash-section__header">
          <h3 className="dash-section__title">7-Day Forecast</h3>
          <button className="dash-section__link" onClick={() => navigate('/portal/weather')}>
            {t(locale, 'dashViewAll')} <IconArrowRight size={13} />
          </button>
        </div>
        <div className="dash-forecast-strip">
          {weather.forecast.slice(0, 5).map((day, i) => (
            <div key={day.date} className="dash-forecast-day">
              <span className="dash-forecast-day__label">
                {i === 0 ? t(locale, 'weatherToday') : new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
              </span>
              <span className="dash-forecast-day__icon">{day.conditionIcon}</span>
              <span className="dash-forecast-day__temp">{day.maxTempC}°</span>
              <span className="dash-forecast-day__rain">{day.rainProbPct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI disclaimer */}
      <p className="dash-disclaimer">
        <IconCheck size={13} /> {t(locale, 'aiDisclaimer')}
      </p>
    </div>
  );
}
