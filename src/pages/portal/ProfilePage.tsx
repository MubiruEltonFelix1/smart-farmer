import { useState, useEffect, type CSSProperties } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { t, LOCALE_LABELS, type Locale } from '../../i18n/translations';
import { CROPS } from '../../data';
import type { Farm } from '../../types';
import {
  IconCheck, IconUser, IconMapPin, IconLeaf,
  IconShield, IconStar,
} from '../../components/Icons';

const DISTRICTS   = ['Mbarara', 'Kampala', 'Gulu', 'Jinja', 'Mbale', 'Masaka', 'Arua', 'Lira', 'Bushenyi', 'Kiruhura', 'Other'];
const SIZE_UNITS  = ['acres', 'hectares', 'plots'] as const;
const FARM_TYPES  = ['Subsistence farming', 'Mixed farming', 'Commercial farming', 'Organic farming', 'Irrigation farming'];

export default function ProfilePage() {
  const { user, profile, updateProfile, locale, setLocale, refreshQuota, quota } = useAuth();
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [tab,     setTab]     = useState<'farmer'|'farm'|'language'|'consent'|'subscription'>('farmer');

  // Farmer fields
  const [name,    setName]    = useState(profile?.farmerName ?? '');
  const [phone,   setPhone]   = useState(profile?.phone ?? '');
  const [email,   setEmail]   = useState(profile?.email ?? '');

  // Farm fields (first farm for simplicity)
  const [farm,    setFarm]    = useState<Farm>(
    profile?.farms?.[0] ?? {
      id: 'farm-new', name: '', district: '', subCounty: '', parish: '',
      village: '', gpsConsent: false, mainCrops: [], farmSizeValue: '',
      farmSizeUnit: 'acres', farmingType: '', isDefault: true,
    }
  );

  // Notifications
  const [notif,   setNotif]   = useState(profile?.notificationsEnabled ?? true);
  const [alerts,  setAlerts]  = useState(profile?.alertsEnabled ?? true);
  const [optIn,   setOptIn]   = useState(profile?.dataContributionOptIn ?? true);

  useEffect(() => { refreshQuota(); }, [refreshQuota]);

  function updateFarm(patch: Partial<Farm>) {
    setFarm(prev => ({ ...prev, ...patch }));
  }

  function toggleCrop(name: string) {
    setFarm(prev => ({
      ...prev,
      mainCrops: prev.mainCrops.includes(name)
        ? prev.mainCrops.filter(c => c !== name)
        : [...prev.mainCrops, name],
    }));
  }

  async function save() {
    setSaving(true);
    await updateProfile({
      farmerName: name,
      phone,
      email,
      farms: [farm],
      notificationsEnabled: notif,
      alertsEnabled: alerts,
      dataContributionOptIn: optIn,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const TABS = [
    { id: 'farmer',       label: t(locale, 'profileFarmerInfo'),  icon: <IconUser size={15} /> },
    { id: 'farm',         label: t(locale, 'profileFarmDetails'), icon: <IconMapPin size={15} /> },
    { id: 'language',     label: t(locale, 'profileLanguage'),    icon: <IconLeaf size={15} /> },
    { id: 'consent',      label: t(locale, 'profileConsent'),     icon: <IconShield size={15} /> },
    { id: 'subscription', label: t(locale, 'profileSubscription'),icon: <IconStar size={15} /> },
  ] as const;

  return (
    <div className="profile-page">
      {/* Tab nav */}
      <div className="profile-tabs" role="tablist">
        {TABS.map(tb => (
          <button
            key={tb.id}
            role="tab"
            aria-selected={tab === tb.id}
            className={`profile-tab${tab === tb.id ? ' profile-tab--active' : ''}`}
            onClick={() => setTab(tb.id as typeof tab)}
          >
            {tb.icon} <span>{tb.label}</span>
          </button>
        ))}
      </div>

      <div className="profile-body">

        {/* ── Farmer Info ── */}
        {tab === 'farmer' && (
          <div className="profile-section">
            <div className="profile-avatar-row">
              <div className="profile-avatar">{user?.name?.[0]?.toUpperCase() ?? 'F'}</div>
              <div>
                <span className="profile-avatar-name">{user?.name}</span>
                <span className="profile-avatar-plan">{user?.plan === 'pro' ? '⭐ Pro' : 'Free'}</span>
              </div>
            </div>
            <div className="onboard-grid-2">
              <div className="auth-field">
                <label className="auth-label">{t(locale, 'onboardFarmerName')}</label>
                <input className="auth-input" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="auth-field">
                <label className="auth-label">{t(locale, 'authPhone')}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input className="auth-input" value={phone} onChange={e => setPhone(e.target.value)} />
                  <span className="profile-verified profile-verified--ok"><IconCheck size={12} /> {t(locale, 'profileVerified')}</span>
                </div>
              </div>
              <div className="auth-field" style={{ gridColumn: '1 / -1' }}>
                <label className="auth-label">{t(locale, 'authEmail')}</label>
                <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="profile-notif-group">
              <ProfileToggle
                label={t(locale, 'settingsNotifications')}
                checked={notif}
                onChange={setNotif}
              />
              <ProfileToggle
                label={t(locale, 'settingsWeatherAlerts')}
                checked={alerts}
                onChange={setAlerts}
              />
            </div>
          </div>
        )}

        {/* ── Farm Details ── */}
        {tab === 'farm' && (
          <div className="profile-section">
            <div className="onboard-grid-2">
              <div className="auth-field">
                <label className="auth-label">{t(locale, 'onboardFarmName')}</label>
                <input className="auth-input" value={farm.name}
                  onChange={e => updateFarm({ name: e.target.value })} />
              </div>
              <div className="auth-field">
                <label className="auth-label">{t(locale, 'onboardDistrict')}</label>
                <select className="auth-input auth-select" value={farm.district}
                  onChange={e => updateFarm({ district: e.target.value })}>
                  <option value="">Select district…</option>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="auth-field">
                <label className="auth-label">{t(locale, 'onboardSubCounty')}</label>
                <input className="auth-input" value={farm.subCounty}
                  onChange={e => updateFarm({ subCounty: e.target.value })} />
              </div>
              <div className="auth-field">
                <label className="auth-label">{t(locale, 'onboardParish')}</label>
                <input className="auth-input" value={farm.parish}
                  onChange={e => updateFarm({ parish: e.target.value })} />
              </div>
              <div className="auth-field">
                <label className="auth-label">{t(locale, 'onboardVillage')}</label>
                <input className="auth-input" value={farm.village}
                  onChange={e => updateFarm({ village: e.target.value })} />
              </div>
              <div className="auth-field">
                <label className="auth-label">{t(locale, 'onboardFarmSize')}</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="auth-input" type="number" min="0" value={farm.farmSizeValue}
                    onChange={e => updateFarm({ farmSizeValue: e.target.value })}
                    style={{ flex: 1 }} />
                  <select className="auth-input auth-select" style={{ flex: 1 }}
                    value={farm.farmSizeUnit}
                    onChange={e => updateFarm({ farmSizeUnit: e.target.value as typeof farm.farmSizeUnit })}>
                    {SIZE_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="auth-field" style={{ gridColumn: '1 / -1' }}>
                <label className="auth-label">{t(locale, 'onboardFarmingType')}</label>
                <select className="auth-input auth-select" value={farm.farmingType}
                  onChange={e => updateFarm({ farmingType: e.target.value })}>
                  <option value="">Select type…</option>
                  {FARM_TYPES.map(ft => <option key={ft} value={ft}>{ft}</option>)}
                </select>
              </div>
            </div>
            <div className="auth-field" style={{ marginTop: 8 }}>
              <label className="auth-label">{t(locale, 'onboardCrops')}</label>
              <div className="onboard-crop-grid">
                {CROPS.map(crop => {
                  const active = farm.mainCrops.includes(crop.name);
                  return (
                    <button
                      key={crop.name}
                      type="button"
                      className={`onboard-crop-btn${active ? ' onboard-crop-btn--active' : ''}`}
                      style={{ '--crop-color': crop.color } as CSSProperties}
                      onClick={() => toggleCrop(crop.name)}
                    >
                      {active && <span className="onboard-crop-check"><IconCheck size={11} /></span>}
                      {crop.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Language ── */}
        {tab === 'language' && (
          <div className="profile-section">
            <p className="profile-section-desc">
              Choose the language used throughout the app, scan results, and AI assistant.
            </p>
            <div className="profile-lang-grid">
              {(['en', 'lg', 'nyn'] as Locale[]).map(l => (
                <button
                  key={l}
                  type="button"
                  className={`profile-lang-option${locale === l ? ' profile-lang-option--active' : ''}`}
                  onClick={() => setLocale(l)}
                >
                  {locale === l && <IconCheck size={14} className="profile-lang-option__check" />}
                  <span className="profile-lang-option__name">{LOCALE_LABELS[l]}</span>
                  <span className="profile-lang-option__native">
                    {l === 'en' ? 'English' : l === 'lg' ? 'Luganda (Central Uganda)' : 'Runyankole (Western Uganda)'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Consent ── */}
        {tab === 'consent' && (
          <div className="profile-section">
            <div className="onboard-consent-box">
              <div className="onboard-consent-icon"><IconShield size={28} /></div>
              <h3>{t(locale, 'onboardConsentTitle')}</h3>
              <p>{t(locale, 'onboardConsentBody')}</p>
            </div>
            <ProfileToggle
              label={t(locale, 'settingsDataContribution')}
              subLabel={t(locale, 'settingsDataContributionBody')}
              checked={optIn}
              onChange={setOptIn}
            />
          </div>
        )}

        {/* ── Subscription ── */}
        {tab === 'subscription' && (
          <div className="profile-section">
            <div className="profile-sub-card">
              <div className="profile-sub-card__header">
                <IconStar size={20} />
                <span>{user?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}</span>
                <span className="profile-sub-card__badge">{t(locale, 'planCurrent')}</span>
              </div>
              {quota && (
                <div className="profile-sub-card__stats">
                  <div className="profile-sub-card__stat">
                    <span className="profile-sub-card__stat-label">{t(locale, 'planScansRemaining')}</span>
                    <span className="profile-sub-card__stat-val">
                      {(quota.scanLimitDaily - quota.scansUsedToday)} / {quota.scanLimitDaily}
                    </span>
                  </div>
                  <div className="profile-sub-card__stat">
                    <span className="profile-sub-card__stat-label">{t(locale, 'planChatsRemaining')}</span>
                    <span className="profile-sub-card__stat-val">
                      {(quota.chatLimitDaily - quota.chatCreditsUsedToday)} / {quota.chatLimitDaily}
                    </span>
                  </div>
                  <div className="profile-sub-card__stat">
                    <span className="profile-sub-card__stat-label">{t(locale, 'planResetDate')}</span>
                    <span className="profile-sub-card__stat-val">
                      {new Date(quota.resetDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Save button (not on subscription tab) */}
        {tab !== 'subscription' && tab !== 'language' && (
          <div className="profile-save-row">
            <button
              className="btn btn--primary"
              onClick={save}
              disabled={saving}
            >
              {saving ? t(locale, 'profileSaving') : saved ? <><IconCheck size={15} /> {t(locale, 'profileSaved')}</> : t(locale, 'profileSave')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileToggle({ label, subLabel, checked, onChange }: {
  label: string;
  subLabel?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="profile-toggle-row">
      <div className="profile-toggle-label">
        <span>{label}</span>
        {subLabel && <p className="profile-toggle-sub">{subLabel}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`profile-toggle${checked ? ' profile-toggle--on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="profile-toggle__thumb" />
      </button>
    </div>
  );
}
