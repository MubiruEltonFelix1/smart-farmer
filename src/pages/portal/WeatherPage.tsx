import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { t } from '../../i18n/translations';
import { DEMO_WEATHER } from '../../data/seedData';
import type { WeatherData } from '../../types';
import {
  IconDroplets, IconThermometer, IconActivity, IconWarning,
  IconCheck, IconRefresh, IconMapPin, IconClock, IconSun,
  IconInfo,
} from '../../components/Icons';

function alertColor(sev: string) {
  if (sev === 'warning') return { bg: 'rgba(181,69,27,0.10)', color: '#b5451b', border: '#b5451b' };
  if (sev === 'watch')   return { bg: 'rgba(200,169,78,0.12)', color: '#9a7020', border: '#c8a94e' };
  return { bg: 'rgba(14,116,144,0.10)', color: '#0e7490', border: '#0e7490' };
}

function alertIcon(type: string) {
  if (type === 'heavy_rain') return '🌧️';
  if (type === 'drought')    return '🌵';
  if (type === 'strong_wind')return '💨';
  if (type === 'heat')       return '🌡️';
  if (type === 'cold')       return '❄️';
  return '⚠️';
}

export default function WeatherPage() {
  const { locale, profile } = useAuth();
  const [data,    setData]    = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => { loadWeather(); }, []);

  function loadWeather() {
    setLoading(true);
    setError('');
    // In production: call weather API via server-side proxy
    // e.g. fetch('/api/v1/weather?lat=...&lng=...')
    setTimeout(() => {
      // Use demo data; mark as stale if farm has no location set
      const hasLocation = profile?.farms?.[0]?.gpsConsent || profile?.farms?.[0]?.district;
      setData({
        ...DEMO_WEATHER,
        location: profile?.farms?.[0]?.district
          ? `${profile.farms[0].district}, Uganda`
          : DEMO_WEATHER.location,
        isStale: !hasLocation,
      });
      setLoading(false);
    }, 900);
  }

  if (loading) return (
    <div className="portal-loading">
      <div className="portal-spinner" />
      <p>{t(locale, 'weatherLoading')}</p>
    </div>
  );

  if (error) return (
    <div className="portal-error">
      <IconWarning size={36} />
      <p>{t(locale, 'weatherError')}</p>
      <button className="btn btn--primary" onClick={loadWeather}>
        <IconRefresh size={15} /> {t(locale, 'weatherRetry')}
      </button>
    </div>
  );

  if (!data) return null;

  return (
    <div className="weather-page">
      {/* Location & refresh */}
      <div className="weather-header">
        <div className="weather-location">
          <IconMapPin size={15} />
          <span>{data.location}</span>
        </div>
        <div className="weather-header__right">
          <span className="weather-updated">
            <IconClock size={12} /> {t(locale, 'weatherLastUpdated')} {new Date(data.fetchedAt).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button className="weather-refresh-btn" onClick={loadWeather} aria-label={t(locale, 'weatherRetry')}>
            <IconRefresh size={16} />
          </button>
        </div>
      </div>

      {data.isStale && (
        <div className="weather-stale-banner">
          <IconInfo size={14} /> {t(locale, 'weatherStaleWarning')}
        </div>
      )}

      {!profile?.farms?.length && (
        <div className="weather-no-location">
          <IconMapPin size={18} />
          <p>{t(locale, 'weatherSetLocation')}</p>
        </div>
      )}

      {/* Active alerts */}
      {data.alerts.length > 0 && (
        <div className="weather-section">
          <h3 className="weather-section-title">{t(locale, 'weatherAlerts')}</h3>
          <div className="weather-alerts-list">
            {data.alerts.map(alert => {
              const style = alertColor(alert.severity);
              return (
                <div key={alert.id} className="weather-alert-card"
                  style={{ background: style.bg, borderColor: style.border }}>
                  <span className="weather-alert-card__icon">{alertIcon(alert.type)}</span>
                  <div className="weather-alert-card__body">
                    <strong style={{ color: style.color }}>{alert.title}</strong>
                    <p>{alert.description}</p>
                    <span className="weather-alert-card__period">
                      Valid: {new Date(alert.validFrom).toLocaleDateString('en', { month: 'short', day: 'numeric' })} –{' '}
                      {new Date(alert.validUntil).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Current conditions */}
      <div className="weather-section">
        <h3 className="weather-section-title">{t(locale, 'weatherCurrent')}</h3>
        <div className="weather-current-card">
          <div className="weather-current-main">
            <span className="weather-current-icon">{data.current.conditionIcon}</span>
            <div>
              <span className="weather-current-temp">{data.current.tempC}°C</span>
              <span className="weather-current-feels">Feels like {data.current.feelsLikeC}°C</span>
              <span className="weather-current-cond">{data.current.conditionText}</span>
            </div>
          </div>
          <div className="weather-current-grid">
            <div className="weather-current-stat">
              <IconDroplets size={16} />
              <span className="weather-current-stat__label">{t(locale, 'weatherHumidity')}</span>
              <span className="weather-current-stat__val">{data.current.humidity}%</span>
            </div>
            <div className="weather-current-stat">
              <IconActivity size={16} />
              <span className="weather-current-stat__label">{t(locale, 'weatherWind')}</span>
              <span className="weather-current-stat__val">{data.current.windKph} km/h</span>
            </div>
            <div className="weather-current-stat">
              <IconThermometer size={16} />
              <span className="weather-current-stat__label">Rain today</span>
              <span className="weather-current-stat__val">{data.current.rainMm} mm</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-day forecast */}
      <div className="weather-section">
        <h3 className="weather-section-title">{t(locale, 'weatherForecast')}</h3>
        <div className="weather-forecast-list">
          {data.forecast.map((day, i) => (
            <div key={day.date} className="weather-forecast-item">
              <div className="weather-forecast-item__day">
                <span className="weather-forecast-item__label">
                  {i === 0 ? t(locale, 'weatherToday') :
                    new Date(day.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <span className="weather-forecast-item__icon">{day.conditionIcon}</span>
              <div className="weather-forecast-item__temps">
                <span className="weather-forecast-item__max">{day.maxTempC}°</span>
                <span className="weather-forecast-item__min">{day.minTempC}°</span>
              </div>
              <div className="weather-forecast-item__rain">
                <IconDroplets size={12} />
                <span>{day.rainProbPct}%</span>
              </div>
              {day.farmAdvice && (
                <div className="weather-forecast-item__advice">
                  <IconSun size={12} />
                  <span>{day.farmAdvice}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {data.alerts.length === 0 && (
        <div className="weather-no-alerts">
          <IconCheck size={16} />
          <span>{t(locale, 'weatherNoAlerts')}</span>
        </div>
      )}
    </div>
  );
}
