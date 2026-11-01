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
  IconStar, IconInfo, IconMapPin, IconActivity,
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

/** Compute a simple farm health score from recent scans */
function computeFarmHealth(scans: ScanRecord[]): number {
  if (scans.length === 0) return 100;
  const weights: Record<string, number> = { Healthy: 100, Low: 75, Moderate: 45, High: 15 };
  const total = scans.reduce((sum, s) => sum + (weights[s.severity ?? 'Healthy'] ?? 80), 0);
  return Math.round(total / scans.length);
}

function HealthScoreRing({ score }: { score: number }) {
  const color = score >= 75 ? '#52b788' : score >= 50 ? '#c8a94e' : '#b5451b';
  const label = score >= 75 ? 'Good' : score >= 50 ? 'Fair' : 'Needs Attention';
  const r = 34;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: 84, height: 84 }}>
        <svg width="84" height="84" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="42" cy="42" r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="7" />
          <circle
            cx="42" cy="42" r={r}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-dark)', lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>/100</span>
        </div>
      </div>
      <span style={{ fontSize: '0.72rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { user, quota, locale, profile } = useAuth();
  const { navigate } = useRouter();
  const [scans, setScans] = useState<ScanRecord[]>([]);

  useEffect(() => {
    if (user?.id) {
      mockAuthService.getScans(user.id).then(s => setScans(s.slice(0, 5)));
    }
  }, [user?.id]);

  const weather  = DEMO_WEATHER;
  const topAlert = DEMO_OUTBREAKS.find(o => o.alertLevel !== 'info');
  const scanUsed  = quota?.scansUsedToday ?? 0;
  const scanLimit = quota?.scanLimitDaily ?? 3;
  const chatLeft  = (quota?.chatLimitDaily ?? 5) - (quota?.chatCreditsUsedToday ?? 0);
  const farmHealth = computeFarmHealth(scans);
  const farmName  = profile?.farms?.[0]?.name ?? 'My Farm';
  const district  = profile?.farms?.[0]?.district ?? 'Mbarara';
  const totalScans = scans.length;

  return (
    <div className="dash-page">

      {/* ── Greeting header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 className="dash-greeting__text">
            {getGreeting(locale, user?.name?.split(' ')[0] ?? 'Farmer')} 👋
          </h2>
          <p className="dash-greeting__sub" style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
            <IconMapPin size={12} />
            {farmName} · {district}, Uganda &nbsp;·&nbsp;
            {new Date().toLocaleDateString('en-UG', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {/* Farm health ring */}
        <HealthScoreRing score={farmHealth} />
      </div>

      {/* Demo banner */}
      {user?.isDemo && (
        <div className="dash-demo-notice">
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconInfo size={15} />
            You are signed in to the <strong>demo account</strong> — data shown is for illustration purposes.
          </span>
          <button className="dash-demo-notice__btn" onClick={() => navigate('/signup')}>
            Create real account →
          </button>
        </div>
      )}

      {/* ── KPI Stats row ── */}
      <div className="dash-stats">
        {/* Scans today */}
        <div className="dash-stat-card">
          <div className="dash-stat-card__header">
            <IconScan size={16} className="dash-stat-card__icon" />
            <span className="dash-stat-card__label">{t(locale, 'dashScansUsed')}</span>
          </div>
          <div className="dash-stat-card__value">
            <strong>{scanUsed}</strong>
            <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-light)' }}> / {scanLimit}</span>
          </div>
          <div className="dash-stat-bar">
            <div
              className="dash-stat-bar__fill"
              style={{
                width: `${Math.min((scanUsed / scanLimit) * 100, 100)}%`,
                background: scanUsed >= scanLimit ? '#b5451b' : undefined,
              }}
            />
          </div>
          {scanUsed >= scanLimit ? (
            <span className="dash-stat-card__warn">Limit reached · Resets tomorrow</span>
          ) : (
            <span className="dash-stat-card__note">{scanLimit - scanUsed} remaining today</span>
          )}
        </div>

        {/* Total diagnoses */}
        <div className="dash-stat-card">
          <div className="dash-stat-card__header">
            <IconActivity size={16} className="dash-stat-card__icon" />
            <span className="dash-stat-card__label">Total Diagnoses</span>
          </div>
          <div className="dash-stat-card__value">
            <strong>{totalScans}</strong>
          </div>
          <span className="dash-stat-card__note">Across all crops this season</span>
        </div>

        {/* Weather mini — clickable */}
        <div className="dash-stat-card dash-stat-card--weather" onClick={() => navigate('/portal/weather')}>
          <div className="dash-stat-card__header">
            <IconDroplets size={16} className="dash-stat-card__icon" />
            <span className="dash-stat-card__label">{weather.location}</span>
          </div>
          <div className="dash-weather-mini">
            <span className="dash-weather-mini__icon">{weather.current.conditionIcon}</span>
            <span className="dash-weather-mini__temp">{weather.current.tempC}°C</span>
          </div>
          <span className="dash-stat-card__note">
            {weather.current.conditionText} · {weather.current.humidity}% humidity
          </span>
        </div>
      </div>

      {/* ── Primary CTA ── */}
      <button
        className="dash-scan-cta"
        onClick={() => navigate('/portal/scan')}
      >
        <div className="dash-scan-cta__icon"><IconLeaf size={28} /></div>
        <div className="dash-scan-cta__text">
          <strong>{t(locale, 'dashScanToday')}</strong>
          <span>Take or upload a photo of any crop leaf for instant AI diagnosis</span>
        </div>
        <IconArrowRight size={20} className="dash-scan-cta__arrow" />
      </button>

      {/* ── Active disease alert ── */}
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
              {topAlert.diseaseName} · {topAlert.locationLabel} · {topAlert.reportCount} reported cases
            </span>
          </div>
          <IconArrowRight size={15} />
        </div>
      )}

      {/* ── Recent scans ── */}
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
            <p style={{ fontWeight: 600 }}>{t(locale, 'dashNoScans')}</p>
            <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
              Use the Scan button above to diagnose your first crop
            </p>
          </div>
        ) : (
          <div className="dash-scan-list">
            {scans.slice(0, 4).map(scan => (
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
                  {scan.location && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-light)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <IconMapPin size={10} /> {scan.location}
                    </span>
                  )}
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

      {/* ── Upgrade card (Free users) ── */}
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

      {/* ── 7-day weather forecast ── */}
      <div className="dash-section">
        <div className="dash-section__header">
          <h3 className="dash-section__title">7-Day Forecast · Mbarara</h3>
          <button className="dash-section__link" onClick={() => navigate('/portal/weather')}>
            {t(locale, 'dashViewAll')} <IconArrowRight size={13} />
          </button>
        </div>
        <div className="dash-forecast-strip">
          {weather.forecast.slice(0, 7).map((day, i) => (
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

      {/* ── AI disclaimer ── */}
      <p className="dash-disclaimer">
        <IconCheck size={13} /> {t(locale, 'aiDisclaimer')}
      </p>
    </div>
  );
}
