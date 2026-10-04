import { useState } from 'react';
import { t, type Locale } from '../../i18n/translations';
import { useAuth } from '../../auth/AuthContext';
import { DEMO_OUTBREAKS } from '../../data/seedData';
import type { OutbreakRecord } from '../../types';
import {
  IconWarning, IconTrendingUp, IconCheck, IconInfo,
  IconMapPin, IconShield, IconUsers,
} from '../../components/Icons';

function alertStyle(level: string) {
  if (level === 'attention') return { bg: 'rgba(181,69,27,0.08)', border: '#b5451b', badge: '#b5451b', badgeBg: 'rgba(181,69,27,0.12)' };
  if (level === 'watch')     return { bg: 'rgba(200,169,78,0.08)', border: '#c8a94e', badge: '#9a7020', badgeBg: 'rgba(200,169,78,0.14)' };
  return { bg: 'rgba(14,116,144,0.06)', border: '#0e7490', badge: '#0e7490', badgeBg: 'rgba(14,116,144,0.10)' };
}

function trendLabel(locale: Locale, dir: string) {
  const map: Record<string, string> = { en: dir, lg: { rising:'Yaka', stable:'Ekiri Bulungi', declining:'Yika' }[dir] ?? dir, nyn: { rising:'Kwaka', stable:'Kwima', declining:'Kwira' }[dir] ?? dir };
  return map[locale] ?? dir;
}

export default function OutbreaksPage() {
  const { locale, profile } = useAuth();
  const [cropF,     setCropF]     = useState('');
  const [locationF, setLocationF] = useState(profile?.farms?.[0]?.district ?? '');

  const crops = [...new Set(DEMO_OUTBREAKS.map(o => o.cropName))];

  const filtered = DEMO_OUTBREAKS.filter(o => {
    const matchCrop     = !cropF     || o.cropName === cropF;
    const matchLocation = !locationF || o.district === locationF;
    return matchCrop && matchLocation;
  });

  const districts = [...new Set(DEMO_OUTBREAKS.map(o => o.district))];

  return (
    <div className="outbreak-page">
      {/* Privacy note */}
      <div className="outbreak-privacy">
        <IconShield size={14} />
        <p>{t(locale, 'outbreakPrivacyNote')}</p>
      </div>

      {/* Filters */}
      <div className="outbreak-filters">
        <select className="auth-input auth-select"
          value={cropF} onChange={e => setCropF(e.target.value)}>
          <option value="">{t(locale, 'outbreakFilterCrop')}</option>
          {crops.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="auth-input auth-select"
          value={locationF} onChange={e => setLocationF(e.target.value)}>
          <option value="">{t(locale, 'outbreakFilterLocation')}</option>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <p className="outbreak-threshold-note">
        <IconInfo size={12} /> {t(locale, 'outbreakThresholdNote')}
      </p>

      {filtered.length === 0 ? (
        <div className="portal-empty">
          <IconCheck size={36} className="portal-empty__icon" style={{ color: 'var(--color-green)' }} />
          <p>{t(locale, 'outbreakNone')}</p>
        </div>
      ) : (
        <div className="outbreak-list">
          {filtered.map(ob => {
            const style = alertStyle(ob.alertLevel);
            return (
              <OutbreakCard key={ob.id} ob={ob} style={style} locale={locale} />
            );
          })}
        </div>
      )}
    </div>
  );
}

function OutbreakCard({ ob, style, locale }: {
  ob: OutbreakRecord;
  style: ReturnType<typeof alertStyle>;
  locale: Locale;
}) {
  const [expanded, setExpanded] = useState(false);

  const trendDir = ob.trendDirection;
  const trendColor = trendDir === 'rising' ? '#b5451b' : trendDir === 'declining' ? '#2d6a4f' : '#6b7280';

  return (
    <div className="outbreak-card" style={{ background: style.bg, borderColor: style.border }}>
      <div className="outbreak-card__header">
        <div className="outbreak-card__left">
          <span
            className="outbreak-card__alert-badge"
            style={{ color: style.badge, background: style.badgeBg }}
          >
            <IconWarning size={11} />
            {ob.alertLevel === 'attention' ? 'High Attention' :
             ob.alertLevel === 'watch' ? 'Watch' : 'Informational'}
          </span>
          <h3 className="outbreak-card__disease">{ob.diseaseName}</h3>
          <span className="outbreak-card__crop">{ob.cropName}</span>
        </div>
        <div className="outbreak-card__right">
          <div className="outbreak-card__trend" style={{ color: trendColor }}>
            <IconTrendingUp size={14} />
            <span>{trendLabel(locale, trendDir)}</span>
          </div>
          <span className="outbreak-card__reports">
            <IconUsers size={12} /> {ob.reportCount} {t(locale, 'outbreakReports')}
          </span>
        </div>
      </div>

      <div className="outbreak-card__location">
        <IconMapPin size={13} /> {ob.locationLabel}
        {ob.subCounty && ` · ${ob.subCounty}`}
        <span className="outbreak-card__window"> · Last {ob.windowDays} days</span>
      </div>

      <div className="outbreak-card__source">
        {ob.isOfficiallyConfirmed ? (
          <span className="outbreak-card__confirmed">
            <IconCheck size={12} /> {t(locale, 'outbreakConfirmed')}
          </span>
        ) : (
          <span className="outbreak-card__community">
            <IconInfo size={12} /> {t(locale, 'outbreakCommunityReport')}
          </span>
        )}
      </div>

      {/* Recommendations accordion */}
      <button
        className="outbreak-card__toggle"
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
      >
        {expanded ? 'Hide' : 'Show'} recommended actions
      </button>

      {expanded && (
        <div className="outbreak-card__recs">
          <ul>
            {ob.recommendedActions.map((r, i) => (
              <li key={i}><span className="outbreak-card__rec-dot" />  {r}</li>
            ))}
          </ul>
          <button className="btn btn--ghost outbreak-card__ext-btn" style={{ marginTop: 12 }}>
            {t(locale, 'outbreakContactExtension')}
          </button>
        </div>
      )}
    </div>
  );
}
