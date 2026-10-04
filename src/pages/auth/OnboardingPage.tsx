import { useState, type CSSProperties } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useRouter } from '../../router';
import { t, LOCALE_LABELS, type Locale } from '../../i18n/translations';
import { CROPS } from '../../data';
import {
  LogoMark, IconCheck, IconArrowRight, IconMapPin,
  IconLeaf, IconShield, IconUser,
} from '../../components/Icons';
import type { Farm } from '../../types';

type Step = 1 | 2 | 3 | 4;

const FARM_SIZE_UNITS = ['acres', 'hectares', 'plots'] as const;
const FARMING_TYPES   = ['Subsistence farming', 'Mixed farming', 'Commercial farming', 'Organic farming', 'Irrigation farming'];
const DISTRICTS       = ['Mbarara', 'Kampala', 'Gulu', 'Jinja', 'Mbale', 'Masaka', 'Arua', 'Lira', 'Bushenyi', 'Kiruhura', 'Other'];

export default function OnboardingPage() {
  const { profile, updateProfile, locale: authLocale } = useAuth();
  const { navigate } = useRouter();

  const [step, setStep]       = useState<Step>(1);
  const [saving, setSaving]   = useState(false);
  const [locale]              = useState<Locale>(authLocale);

  // Step 1 — Farmer details
  const [farmerName, setFarmerName] = useState(profile?.farmerName ?? '');

  // Step 2 — Farm location
  const [farmName,   setFarmName]   = useState('');
  const [district,   setDistrict]   = useState('');
  const [subCounty,  setSubCounty]  = useState('');
  const [parish,     setParish]     = useState('');
  const [village,    setVillage]    = useState('');
  const [gpsConsent, setGpsConsent] = useState(false);

  // Step 3 — Crops
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [farmSize,  setFarmSize]  = useState('');
  const [sizeUnit,  setSizeUnit]  = useState<'acres' | 'hectares' | 'plots'>('acres');
  const [farmType,  setFarmType]  = useState('');

  // Step 4 — Consent
  const [consentGiven, setConsentGiven] = useState(false);
  const [optIn,        setOptIn]        = useState(true);

  const totalSteps = 4;

  function toggleCrop(name: string) {
    setSelectedCrops(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  }

  async function finish() {
    setSaving(true);
    const farm: Farm = {
      id:            'farm-' + Date.now(),
      name:          farmName || `${farmerName}'s Farm`,
      district,
      subCounty,
      parish,
      village,
      gpsConsent,
      mainCrops:     selectedCrops,
      farmSizeValue: farmSize,
      farmSizeUnit:  sizeUnit,
      farmingType:   farmType,
      isDefault:     true,
    };

    await updateProfile({
      farmerName,
      farms:               farm.district ? [farm] : [],
      dataContributionOptIn: optIn,
      consentGiven,
      consentTimestamp:    new Date().toISOString(),
    });
    setSaving(false);
    navigate('/portal/dashboard');
  }

  const STEP_ICONS = [IconUser, IconMapPin, IconLeaf, IconShield];
  const STEP_LABELS = [
    t(locale, 'onboardStep1'),
    t(locale, 'onboardStep2'),
    t(locale, 'onboardStep3'),
    t(locale, 'onboardStep4'),
  ];

  return (
    <div className="onboard-page">
      {/* Header */}
      <div className="onboard-header">
        <LogoMark size={36} />
        <h1 className="onboard-title">{t(locale, 'onboardTitle')}</h1>
        <p className="onboard-sub">{t(locale, 'onboardSub')}</p>
      </div>

      {/* Stepper */}
      <div className="onboard-stepper" role="list">
        {([1,2,3,4] as Step[]).map((s) => {
          const Icon = STEP_ICONS[s - 1];
          const done = step > s;
          const active = step === s;
          return (
            <div
              key={s}
              className={`onboard-step${active ? ' onboard-step--active' : ''}${done ? ' onboard-step--done' : ''}`}
              role="listitem"
              aria-current={active ? 'step' : undefined}
            >
              <div className="onboard-step-circle">
                {done ? <IconCheck size={14} /> : <Icon size={14} />}
              </div>
              <span className="onboard-step-label">{STEP_LABELS[s - 1]}</span>
            </div>
          );
        })}
      </div>

      {/* Card */}
      <div className="onboard-card">
        {/* Progress */}
        <div className="onboard-progress">
          <div
            className="onboard-progress-fill"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* ── Step 1: Farmer Details ── */}
        {step === 1 && (
          <div className="onboard-body">
            <h2 className="onboard-step-title">{t(locale, 'onboardStep1')}</h2>
            <div className="auth-field">
              <label className="auth-label">{t(locale, 'onboardFarmerName')}</label>
              <input
                type="text"
                className="auth-input"
                placeholder={t(locale, 'onboardFarmerNamePlaceholder')}
                value={farmerName}
                onChange={e => setFarmerName(e.target.value)}
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">
                Preferred Language / Olulimi / Orurimi
              </label>
              <div className="lang-switcher" style={{ marginBottom: 0 }}>
                {(['en','lg','nyn'] as Locale[]).map(l => (
                  <button key={l} type="button"
                    className={`lang-btn${locale === l ? ' lang-btn--active' : ''}`}
                    onClick={() => {}}
                    disabled
                  >
                    {LOCALE_LABELS[l]}
                  </button>
                ))}
              </div>
              <p className="auth-field-hint">Selected during sign-up. Change in Settings.</p>
            </div>
          </div>
        )}

        {/* ── Step 2: Farm Location ── */}
        {step === 2 && (
          <div className="onboard-body">
            <h2 className="onboard-step-title">{t(locale, 'onboardStep2')}</h2>
            <div className="onboard-grid-2">
              <div className="auth-field">
                <label className="auth-label">{t(locale, 'onboardFarmName')}</label>
                <input type="text" className="auth-input"
                  placeholder={t(locale, 'onboardFarmNamePlaceholder')}
                  value={farmName} onChange={e => setFarmName(e.target.value)} />
              </div>
              <div className="auth-field">
                <label className="auth-label">{t(locale, 'onboardDistrict')}</label>
                <select className="auth-input auth-select"
                  value={district} onChange={e => setDistrict(e.target.value)}>
                  <option value="">Select district…</option>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="auth-field">
                <label className="auth-label">{t(locale, 'onboardSubCounty')}</label>
                <input type="text" className="auth-input"
                  placeholder="e.g. Kakiika"
                  value={subCounty} onChange={e => setSubCounty(e.target.value)} />
              </div>
              <div className="auth-field">
                <label className="auth-label">{t(locale, 'onboardParish')}</label>
                <input type="text" className="auth-input"
                  placeholder="e.g. Rwebikoona"
                  value={parish} onChange={e => setParish(e.target.value)} />
              </div>
              <div className="auth-field">
                <label className="auth-label">{t(locale, 'onboardVillage')}</label>
                <input type="text" className="auth-input"
                  placeholder="e.g. Nyamitanga"
                  value={village} onChange={e => setVillage(e.target.value)} />
              </div>
            </div>
            <label className="auth-checkbox" style={{ marginTop: 8 }}>
              <input type="checkbox" className="auth-checkbox-input"
                checked={gpsConsent} onChange={e => setGpsConsent(e.target.checked)} />
              <span className="auth-checkbox-box">{gpsConsent && <IconCheck size={12} />}</span>
              <span className="auth-checkbox-label">{t(locale, 'onboardGpsConsent')}</span>
            </label>
          </div>
        )}

        {/* ── Step 3: Crops ── */}
        {step === 3 && (
          <div className="onboard-body">
            <h2 className="onboard-step-title">{t(locale, 'onboardStep3')}</h2>
            <p className="onboard-step-sub">{t(locale, 'onboardCrops')}</p>
            <div className="onboard-crop-grid">
              {CROPS.map(crop => {
                const active = selectedCrops.includes(crop.name);
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
            <div className="onboard-grid-3" style={{ marginTop: 20 }}>
              <div className="auth-field">
                <label className="auth-label">{t(locale, 'onboardFarmSize')} <span className="auth-optional">({t(locale, 'optional')})</span></label>
                <input type="number" min="0" className="auth-input"
                  placeholder="e.g. 2"
                  value={farmSize} onChange={e => setFarmSize(e.target.value)} />
              </div>
              <div className="auth-field">
                <label className="auth-label">{t(locale, 'onboardFarmSizeUnit')}</label>
                <select className="auth-input auth-select"
                  value={sizeUnit}
                  onChange={e => setSizeUnit(e.target.value as typeof sizeUnit)}>
                  {FARM_SIZE_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div className="auth-field" style={{ gridColumn: '1 / -1' }}>
                <label className="auth-label">{t(locale, 'onboardFarmingType')}</label>
                <select className="auth-input auth-select"
                  value={farmType} onChange={e => setFarmType(e.target.value)}>
                  <option value="">Select type…</option>
                  {FARMING_TYPES.map(ft => <option key={ft} value={ft}>{ft}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Consent ── */}
        {step === 4 && (
          <div className="onboard-body">
            <h2 className="onboard-step-title">{t(locale, 'onboardStep4')}</h2>
            <div className="onboard-consent-box">
              <div className="onboard-consent-icon"><IconShield size={28} /></div>
              <h3>{t(locale, 'onboardConsentTitle')}</h3>
              <p>{t(locale, 'onboardConsentBody')}</p>
            </div>
            <label className="auth-checkbox" style={{ marginTop: 20 }}>
              <input type="checkbox" className="auth-checkbox-input"
                checked={consentGiven} onChange={e => setConsentGiven(e.target.checked)} />
              <span className="auth-checkbox-box">{consentGiven && <IconCheck size={12} />}</span>
              <span className="auth-checkbox-label">{t(locale, 'onboardConsentCheck')}</span>
            </label>
            <label className="auth-checkbox" style={{ marginTop: 12 }}>
              <input type="checkbox" className="auth-checkbox-input"
                checked={optIn} onChange={e => setOptIn(e.target.checked)} />
              <span className="auth-checkbox-box">{optIn && <IconCheck size={12} />}</span>
              <span className="auth-checkbox-label">
                {t(locale, 'settingsDataContribution')} — {t(locale, 'settingsDataContributionBody')}
              </span>
            </label>
          </div>
        )}

        {/* Footer actions */}
        <div className="onboard-footer">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => step > 1 ? setStep((step - 1) as Step) : navigate('/portal/dashboard')}
          >
            {step > 1 ? t(locale, 'onboardBack') : t(locale, 'onboardSkip')}
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            {step < totalSteps && (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => navigate('/portal/dashboard')}
              >
                {t(locale, 'onboardSkip')}
              </button>
            )}
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => step < totalSteps ? setStep((step + 1) as Step) : finish()}
              disabled={saving}
            >
              {step < totalSteps
                ? <>{t(locale, 'onboardNext')} <IconArrowRight size={15} /></>
                : saving ? 'Saving…' : <>{t(locale, 'onboardFinish')} <IconArrowRight size={15} /></>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
