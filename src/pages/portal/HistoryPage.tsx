import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { t } from '../../i18n/translations';
import { mockAuthService } from '../../auth/mockAuthService';
import type { ScanRecord } from '../../types';
import {
  IconSearch, IconLeaf, IconClock, IconCheck, IconWarning,
  IconX, IconFileText, IconMapPin, IconInfo,
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

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function HistoryPage() {
  const { user, locale } = useAuth();
  const [scans,    setScans]    = useState<ScanRecord[]>([]);
  const [search,   setSearch]   = useState('');
  const [cropF,    setCropF]    = useState('');
  const [sevF,     setSevF]     = useState('');
  const [selected, setSelected] = useState<ScanRecord | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) mockAuthService.getScans(user.id).then(setScans);
  }, [user?.id]);

  const crops    = [...new Set(scans.map(s => s.cropType))];
  const severities = ['Healthy', 'Low', 'Moderate', 'High'];

  const filtered = scans.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.cropType.toLowerCase().includes(q) || (s.disease?.toLowerCase().includes(q) ?? false);
    const matchCrop   = !cropF || s.cropType === cropF;
    const matchSev    = !sevF  || s.severity === sevF;
    return matchSearch && matchCrop && matchSev;
  });

  async function handleDelete(id: string) {
    if (!user) return;
    setDeleting(id);
    await mockAuthService.deleteScan(user.id, id);
    setScans(prev => prev.filter(s => s.id !== id));
    if (selected?.id === id) setSelected(null);
    setDeleting(null);
  }

  return (
    <div className="history-page">
      {/* Filters */}
      <div className="history-filters">
        <div className="history-search-wrap">
          <IconSearch size={15} className="history-search-icon" />
          <input
            type="search"
            className="history-search"
            placeholder={t(locale, 'historySearch')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label={t(locale, 'historySearch')}
          />
        </div>
        <select className="auth-input auth-select history-filter"
          value={cropF} onChange={e => setCropF(e.target.value)}>
          <option value="">{t(locale, 'historyFilterCrop')}</option>
          {crops.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="auth-input auth-select history-filter"
          value={sevF} onChange={e => setSevF(e.target.value)}>
          <option value="">{t(locale, 'historyFilterSeverity')}</option>
          {severities.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <p className="history-count">{filtered.length} scan{filtered.length !== 1 ? 's' : ''}</p>

      {filtered.length === 0 ? (
        <div className="portal-empty">
          <IconLeaf size={40} className="portal-empty__icon" />
          <p>{t(locale, 'historyEmpty')}</p>
        </div>
      ) : (
        <div className="history-layout">
          {/* List */}
          <div className="history-list">
            {filtered.map(scan => (
              <div
                key={scan.id}
                className={`history-item${selected?.id === scan.id ? ' history-item--selected' : ''}`}
                onClick={() => setSelected(scan)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelected(scan)}
              >
                <div
                  className="history-item__thumb"
                  style={{ background: severityBg(scan.severity) }}
                >
                  <IconLeaf size={22} style={{ color: severityColor(scan.severity) }} />
                </div>
                <div className="history-item__info">
                  <span className="history-item__crop">{scan.cropType}</span>
                  <span className="history-item__disease">{scan.disease}</span>
                  <span className="history-item__time">
                    <IconClock size={11} /> {fmt(scan.createdAt)}
                  </span>
                </div>
                <div className="history-item__right">
                  {scan.severity && (
                    <span
                      className="history-item__badge"
                      style={{ color: severityColor(scan.severity), background: severityBg(scan.severity) }}
                    >
                      {scan.severity}
                    </span>
                  )}
                  {scan.confidence && (
                    <span className="history-item__conf">{scan.confidence}%</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Detail */}
          {selected ? (
            <div className="history-detail">
              <div className="history-detail__header">
                <h3 className="history-detail__title">{selected.disease}</h3>
                <button
                  className="history-detail__close"
                  onClick={() => setSelected(null)}
                  aria-label="Close detail"
                >
                  <IconX size={18} />
                </button>
              </div>

              <div className="history-detail__meta">
                <span className="history-detail__crop">
                  <IconLeaf size={13} /> {selected.cropType}
                </span>
                <span
                  style={{ color: severityColor(selected.severity), fontWeight: 600 }}
                >
                  {selected.severity}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-light)' }}>
                  {selected.confidence}% confidence
                </span>
              </div>

              {selected.location && (
                <p className="history-detail__location">
                  <IconMapPin size={13} /> {selected.location}
                </p>
              )}

              <p className="history-detail__date">
                <IconClock size={13} /> {fmt(selected.createdAt)}
              </p>

              {selected.symptomNotes && (
                <div className="history-detail__notes">
                  <strong>Symptom notes:</strong>
                  <p>{selected.symptomNotes}</p>
                </div>
              )}

              {selected.diagnosisResult?.recommendations && (
                <div className="diag-result__recs" style={{ marginTop: 12 }}>
                  <p className="diag-result__recs-title">{t(locale, 'recommendedActions')}</p>
                  <ol className="diag-result__recs-list">
                    {selected.diagnosisResult.recommendations.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="history-detail__outbreak">
                {selected.contributesToOutbreak ? (
                  <span className="history-detail__contrib">
                    <IconCheck size={13} /> {t(locale, 'historyContributes')}
                  </span>
                ) : (
                  <span className="history-detail__no-contrib">
                    <IconInfo size={13} /> {t(locale, 'historyOptedOut')}
                  </span>
                )}
              </div>

              <div className="history-detail__disclaimer">
                <IconInfo size={12} />
                <p>{t(locale, 'scanDisclaimerFull')}</p>
              </div>

              <div className="history-detail__actions">
                <button className="btn btn--ghost" style={{ fontSize: '0.85rem', padding: '8px 14px' }}>
                  <IconFileText size={14} /> {t(locale, 'historyDownload')}
                </button>
                <button
                  className="btn btn--ghost"
                  style={{ fontSize: '0.85rem', padding: '8px 14px', color: '#b5451b', borderColor: '#b5451b' }}
                  onClick={() => handleDelete(selected.id)}
                  disabled={deleting === selected.id}
                >
                  <IconX size={14} /> {deleting === selected.id ? 'Deleting…' : t(locale, 'historyDelete')}
                </button>
              </div>
            </div>
          ) : (
            <div className="history-detail history-detail--empty">
              <IconWarning size={32} className="portal-empty__icon" />
              <p>Select a scan to view details</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
