import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useRouter } from '../../router';
import { t, LOCALE_LABELS, type Locale } from '../../i18n/translations';
import {
  IconShield, IconBell, IconUser, IconCheck,
  IconWarning, IconFileText, IconX, IconArrowRight,
} from '../../components/Icons';

export default function SettingsPage() {
  const { user, profile, locale, setLocale, updateProfile, signOut, deleteAccount } = useAuth();
  const { navigate } = useRouter();

  const [notif,   setNotif]   = useState(profile?.notificationsEnabled ?? true);
  const [weather, setWeather] = useState(profile?.alertsEnabled ?? true);
  const [outbr,   setOutbr]   = useState(profile?.alertsEnabled ?? true);
  const [optIn,   setOptIn]   = useState(profile?.dataContributionOptIn ?? true);
  const [saved,   setSaved]   = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [delConf, setDelConf] = useState('');
  const [deleting,setDeleting]= useState(false);

  async function save() {
    await updateProfile({
      notificationsEnabled: notif,
      alertsEnabled: weather && outbr,
      dataContributionOptIn: optIn,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleDeleteAccount() {
    if (delConf.toLowerCase() !== 'delete') return;
    setDeleting(true);
    await deleteAccount();
    navigate('/');
  }

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  function exportData() {
    const data = {
      exportedAt: new Date().toISOString(),
      user: { name: user?.name, email: user?.email, phone: user?.phone, plan: user?.plan },
      profile: profile,
      note: 'To export scan history and chat history, use the History and Assistant pages.',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = 'smartfarmer-data-export.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="settings-page">
      {/* Language */}
      <section className="settings-section">
        <div className="settings-section-header">
          <IconUser size={18} />
          <h3>{t(locale, 'settingsLanguage')}</h3>
        </div>
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
                {l === 'en' ? 'English' : l === 'lg' ? 'Luganda' : 'Runyankole'}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="settings-section">
        <div className="settings-section-header">
          <IconBell size={18} />
          <h3>{t(locale, 'settingsNotifications')}</h3>
        </div>
        <div className="settings-toggles">
          <SettingsToggle
            label={t(locale, 'settingsNotifications')}
            checked={notif}
            onChange={setNotif}
          />
          <SettingsToggle
            label={t(locale, 'settingsWeatherAlerts')}
            checked={weather}
            onChange={setWeather}
          />
          <SettingsToggle
            label={t(locale, 'settingsOutbreakAlerts')}
            checked={outbr}
            onChange={setOutbr}
          />
        </div>
      </section>

      {/* Privacy & Data */}
      <section className="settings-section">
        <div className="settings-section-header">
          <IconShield size={18} />
          <h3>{t(locale, 'settingsPrivacy')}</h3>
        </div>
        <SettingsToggle
          label={t(locale, 'settingsDataContribution')}
          subLabel={t(locale, 'settingsDataContributionBody')}
          checked={optIn}
          onChange={setOptIn}
        />
        <div className="settings-data-actions">
          <button className="btn btn--ghost settings-data-btn" onClick={exportData}>
            <IconFileText size={15} /> {t(locale, 'settingsExportData')}
          </button>
          <p className="settings-data-note">{t(locale, 'settingsExportBody')}</p>
        </div>
      </section>

      {/* Save */}
      <div className="settings-save-row">
        <button className="btn btn--primary" onClick={save}>
          {saved
            ? <><IconCheck size={15} /> {t(locale, 'settingsSaved')}</>
            : t(locale, 'settingsSave')
          }
        </button>
      </div>

      {/* Account actions */}
      <section className="settings-section settings-section--danger">
        <div className="settings-section-header">
          <IconWarning size={18} />
          <h3>Account</h3>
        </div>
        <div className="settings-account-actions">
          <button className="btn btn--ghost settings-signout-btn" onClick={handleSignOut}>
            {t(locale, 'navSignOut')} <IconArrowRight size={14} />
          </button>
          <button
            className="settings-delete-link"
            onClick={() => setShowDel(true)}
          >
            {t(locale, 'settingsDeleteAccount')}
          </button>
        </div>
      </section>

      {/* Delete confirmation modal */}
      {showDel && (
        <div className="settings-modal-overlay" role="dialog" aria-modal="true">
          <div className="settings-modal">
            <div className="settings-modal__header">
              <h3><IconWarning size={18} /> {t(locale, 'settingsDeleteAccount')}</h3>
              <button onClick={() => setShowDel(false)} aria-label="Close">
                <IconX size={18} />
              </button>
            </div>
            <p>{t(locale, 'settingsDeleteBody')}</p>
            <p style={{ marginTop: 12, fontSize: '0.9rem' }}>
              Type <strong>delete</strong> to confirm:
            </p>
            <input
              type="text"
              className="auth-input"
              placeholder="delete"
              value={delConf}
              onChange={e => setDelConf(e.target.value)}
              style={{ marginTop: 8 }}
            />
            <div className="settings-modal__actions">
              <button className="btn btn--ghost" onClick={() => setShowDel(false)}>
                {t(locale, 'cancel')}
              </button>
              <button
                className="btn settings-delete-confirm-btn"
                onClick={handleDeleteAccount}
                disabled={delConf.toLowerCase() !== 'delete' || deleting}
              >
                {deleting ? 'Deleting…' : t(locale, 'settingsDeleteConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsToggle({ label, subLabel, checked, onChange }: {
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
