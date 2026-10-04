/**
 * PortalScanPage — Authenticated scan experience.
 * Wraps the existing ProductDemo flow with portal-specific features:
 * quota enforcement, crop selector, notes, save to history.
 */
import { useState, useRef, type DragEvent } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useRouter } from '../../router';
import { t } from '../../i18n/translations';
import { mockAuthService } from '../../auth/mockAuthService';
import { analyzeCropImage } from '../../services/diagnosisService';
import { CROPS } from '../../data';
import type { ScanRecord, DiagnosisResult } from '../../types';
import {
  IconUpload, IconCamera, IconScan, IconCheck, IconWarning,
  IconArrowRight, IconX, IconLeaf, IconInfo, IconRefresh,
  IconMessageCircle, IconClock,
} from '../../components/Icons';

type ScanState = 'idle' | 'preview' | 'analyzing' | 'result' | 'error' | 'inconclusive' | 'limit';

function severityColor(sev?: string) {
  if (sev === 'High')     return '#b5451b';
  if (sev === 'Moderate') return '#c8a94e';
  if (sev === 'Low')      return '#0e7490';
  return '#2d6a4f';
}

export default function PortalScanPage() {
  const { user, quota, locale, consumeScan } = useAuth();
  const { navigate } = useRouter();

  const [state,    setState]    = useState<ScanState>('idle');
  const [preview,  setPreview]  = useState<string | null>(null);
  const [file,     setFile]     = useState<File | null>(null);
  const [result,   setResult]   = useState<DiagnosisResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [error,    setError]    = useState('');
  const [saved,    setSaved]    = useState(false);
  const [cropType, setCropType] = useState('');
  const [notes,    setNotes]    = useState('');
  const [affectedPct, setAffectedPct] = useState('');

  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const scanUsed  = quota?.scansUsedToday ?? 0;
  const scanLimit = quota?.scanLimitDaily ?? 3;
  const atLimit   = user?.plan === 'free' && scanUsed >= scanLimit;

  function handleFile(f: File) {
    if (f.size > 10 * 1024 * 1024) { setError('Image must be under 10 MB.'); setState('error'); return; }
    const url = URL.createObjectURL(f);
    setFile(f);
    setPreview(url);
    setState('preview');
    setError('');
    setSaved(false);
    setResult(null);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  async function analyze() {
    if (!file) return;
    if (atLimit) { setState('limit'); return; }

    // Reserve a credit before calling the API to prevent double-charging
    const ok = await consumeScan();
    if (!ok) { setState('limit'); return; }

    setState('analyzing');
    setProgress(10);

    try {
      const tick = setInterval(() => setProgress(p => Math.min(p + 8, 88)), 300);
      const res = await analyzeCropImage({ image: file, cropHint: cropType || undefined });
      clearInterval(tick);
      setProgress(100);

      if (res.confidence && res.confidence < 50) {
        setResult(res);
        setState('inconclusive');
      } else {
        setResult(res);
        setState('result');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t(locale, 'error'));
      setState('error');
    }
  }

  async function saveToHistory() {
    if (!result || !user) return;
    const scan: ScanRecord = {
      id:                   'scan-' + Date.now(),
      userId:               user.id,
      farmId:               'farm-001',
      cropType:             cropType || result.crop,
      imageUrl:             preview ?? '/demo-leaf.jpg',
      imageThumb:           preview ?? '/demo-leaf.jpg',
      disease:              result.disease,
      confidence:           result.confidence,
      severity:             result.severity as ScanRecord['severity'],
      status:               result.status as ScanRecord['status'],
      diagnosisResult:      result,
      symptomNotes:         notes,
      affectedAreaPct:      affectedPct ? parseInt(affectedPct) : undefined,
      location:             'Mbarara, Kakiika',
      isInconclusive:       state === 'inconclusive',
      savedToHistory:       true,
      contributesToOutbreak: true,
      createdAt:            new Date().toISOString(),
    };
    await mockAuthService.addScan(user.id, scan);
    setSaved(true);
  }

  function reset() {
    setState('idle');
    setPreview(null);
    setFile(null);
    setResult(null);
    setProgress(0);
    setError('');
    setSaved(false);
    setCropType('');
    setNotes('');
    setAffectedPct('');
  }

  return (
    <div className="scan-page">
      {/* Quota bar */}
      {user?.plan === 'free' && (
        <div className="scan-quota-bar">
          <span className="scan-quota-bar__text">
            {scanUsed} / {scanLimit} {t(locale, 'dashScansUsed')} today
          </span>
          <div className="scan-quota-bar__track">
            <div
              className="scan-quota-bar__fill"
              style={{
                width: `${Math.min((scanUsed / scanLimit) * 100, 100)}%`,
                background: scanUsed >= scanLimit ? '#b5451b' : undefined,
              }}
            />
          </div>
        </div>
      )}

      <div className="scan-layout">
        {/* Left: main upload/result panel */}
        <div className="scan-main-panel">

          {/* IDLE — upload / camera */}
          {state === 'idle' && (
            <div
              className="diag-dropzone"
              onDrop={onDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload crop leaf image"
              onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
            >
              <IconUpload size={48} className="diag-dropzone__icon" />
              <p className="diag-dropzone__title">{t(locale, 'uploadTitle')}</p>
              <p className="diag-dropzone__sub">{t(locale, 'uploadSub')}</p>
              <div className="diag-dropzone__btns" onClick={e => e.stopPropagation()}>
                <button className="btn btn--primary diag-btn-upload" onClick={() => fileRef.current?.click()}>
                  <IconUpload size={15} /> {t(locale, 'btnUpload')}
                </button>
                <button className="btn btn--secondary diag-btn-camera" onClick={() => cameraRef.current?.click()}>
                  <IconCamera size={15} /> {t(locale, 'btnTakePhoto')}
                </button>
              </div>
              <p className="diag-dropzone__note">{t(locale, 'uploadNote')}</p>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
          )}

          {/* LIMIT REACHED */}
          {state === 'limit' && (
            <div className="scan-limit-state">
              <IconWarning size={40} className="scan-limit-state__icon" />
              <h3>{t(locale, 'scanLimitReached')}</h3>
              <p>{t(locale, 'scanLimitBody')}</p>
              <div className="scan-limit-state__actions">
                <button className="btn btn--primary" onClick={() => navigate('/portal/plans')}>
                  {t(locale, 'upgrade')} <IconArrowRight size={14} />
                </button>
                <button className="btn btn--ghost" onClick={reset}>
                  {t(locale, 'back')}
                </button>
              </div>
            </div>
          )}

          {/* PREVIEW */}
          {state === 'preview' && preview && (
            <div className="diag-preview">
              <div className="diag-preview__img-wrap">
                <img src={preview} alt="Crop leaf to analyze" className="diag-preview__img" />
                <button className="diag-preview__remove" onClick={reset} aria-label="Remove image">
                  <IconX size={16} />
                </button>
              </div>
              {/* Crop selector */}
              <div className="scan-meta-row">
                <div className="auth-field" style={{ flex: 1 }}>
                  <label className="auth-label">{t(locale, 'scanSelectCrop')}</label>
                  <select className="auth-input auth-select"
                    value={cropType} onChange={e => setCropType(e.target.value)}>
                    <option value="">Auto-detect…</option>
                    {CROPS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="auth-field" style={{ flex: 1 }}>
                  <label className="auth-label">{t(locale, 'scanAffectedArea')}</label>
                  <input type="number" min="0" max="100" className="auth-input"
                    placeholder="e.g. 25"
                    value={affectedPct} onChange={e => setAffectedPct(e.target.value)} />
                </div>
              </div>
              <div className="auth-field">
                <label className="auth-label">{t(locale, 'scanSymptomNotes')}</label>
                <textarea className="auth-input auth-textarea"
                  rows={2}
                  placeholder={t(locale, 'scanSymptomPlaceholder')}
                  value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
              <div className="diag-preview__actions">
                <button className="btn btn--primary btn--large" onClick={analyze} disabled={atLimit}>
                  <IconScan size={16} /> {t(locale, 'btnAnalyze')}
                </button>
                <button className="btn btn--ghost" onClick={reset}>
                  {t(locale, 'btnChooseDifferent')}
                </button>
              </div>
            </div>
          )}

          {/* ANALYZING */}
          {state === 'analyzing' && (
            <div className="diag-analyzing">
              <div className="diag-analyzing__animation">
                <div className="scan-rings">
                  <div className="scan-ring scan-ring--1" />
                  <div className="scan-ring scan-ring--2" />
                  <div className="scan-ring scan-ring--3" />
                  <span className="scan-rings__center"><IconLeaf size={20} /></span>
                </div>
              </div>
              <p className="diag-analyzing__title">{t(locale, 'analyzingTitle')}</p>
              <p className="diag-analyzing__sub">{t(locale, 'analyzingSub')}</p>
              <div className="diag-progress">
                <div className="diag-progress__fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="diag-analyzing__pct">{progress}%</span>
            </div>
          )}

          {/* INCONCLUSIVE */}
          {state === 'inconclusive' && (
            <div className="scan-inconclusive">
              <IconInfo size={36} className="scan-inconclusive__icon" />
              <h3>{t(locale, 'scanInconclusiveTitle')}</h3>
              <p>{t(locale, 'scanInconclusiveBody')}</p>
              {result && (
                <p className="scan-inconclusive__conf">
                  Confidence: <strong>{result.confidence}%</strong>
                </p>
              )}
              <div className="scan-inconclusive__actions">
                <button className="btn btn--primary" onClick={reset}>
                  <IconRefresh size={15} /> {t(locale, 'btnTryAgain')}
                </button>
                <button className="btn btn--ghost" onClick={() => navigate('/portal/assistant')}>
                  <IconMessageCircle size={15} /> {t(locale, 'scanAskAssistant')}
                </button>
              </div>
            </div>
          )}

          {/* ERROR */}
          {state === 'error' && (
            <div className="diag-error">
              <IconWarning size={40} className="diag-error__icon" />
              <h3 className="diag-error__title">{t(locale, 'errorTitle')}</h3>
              <p className="diag-error__msg">{error}</p>
              <button className="btn btn--primary" onClick={reset}>
                <IconRefresh size={15} /> {t(locale, 'btnTryAgain')}
              </button>
            </div>
          )}

          {/* RESULT */}
          {state === 'result' && result && (
            <div className="diag-result scan-result">
              {/* Header */}
              <div className="diag-result__header">
                <span className="diag-result__crop-badge">
                  <IconLeaf size={13} /> {result.crop}
                </span>
                <span
                  className="diag-result__status"
                  style={{ color: severityColor(result.severity) }}
                >
                  {result.status}
                </span>
              </div>

              <h2 className="diag-result__condition">{result.disease}</h2>

              {/* Metrics */}
              <div className="diag-result__metrics">
                <div className="diag-result__metric">
                  <span className="diag-result__metric-val">{result.confidence}%</span>
                  <span className="diag-result__metric-label">{t(locale, 'confidence')}</span>
                </div>
                <div className="diag-result__metric">
                  <span
                    className="diag-result__metric-val"
                    style={{ color: severityColor(result.severity) }}
                  >
                    {result.severity}
                  </span>
                  <span className="diag-result__metric-label">{t(locale, 'severity')}</span>
                </div>
              </div>
              <div className="diag-result__confidence-bar">
                <div
                  className="diag-result__confidence-fill"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>

              {/* Recommendations */}
              <div className="diag-result__recs">
                <p className="diag-result__recs-title">{t(locale, 'scanNextSteps')}</p>
                <ol className="diag-result__recs-list">
                  {result.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                </ol>
              </div>

              {/* Disclaimer */}
              <div className="diag-result__disclaimer">
                <IconInfo size={13} />
                <p>{t(locale, 'scanDisclaimerFull')}</p>
              </div>

              {/* Actions */}
              <div className="scan-result__actions">
                {!saved ? (
                  <button className="btn btn--primary" onClick={saveToHistory}>
                    <IconCheck size={15} /> {t(locale, 'scanSaveHistory')}
                  </button>
                ) : (
                  <span className="scan-result__saved">
                    <IconCheck size={14} /> {t(locale, 'scanSaved')}
                  </span>
                )}
                <button className="btn btn--ghost" onClick={() => navigate('/portal/assistant')}>
                  <IconMessageCircle size={15} /> {t(locale, 'scanAskAssistant')}
                </button>
                <button className="btn btn--ghost" onClick={reset}>
                  <IconScan size={15} /> {t(locale, 'scanScanAnother')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: info panel */}
        <div className="diag-info scan-info-panel">
          <p className="diag-info__title">{t(locale, 'whatAILooksFor')}</p>
          <ul className="diag-info__list">
            {[
              { color: '#c8a94e', label: t(locale, 'leafDiscolouration'), desc: t(locale, 'leafDiscolourationDesc') },
              { color: '#b5451b', label: t(locale, 'lesionPatterns'),     desc: t(locale, 'lesionPatternsDesc') },
              { color: '#2d6a4f', label: t(locale, 'textureChanges'),     desc: t(locale, 'textureChangesDesc') },
              { color: '#0e7490', label: t(locale, 'structuralDamage'),   desc: t(locale, 'structuralDamageDesc') },
            ].map(item => (
              <li key={item.label}>
                <div className="diag-info__dot" style={{ background: item.color }} />
                <div><strong>{item.label}</strong><p>{item.desc}</p></div>
              </li>
            ))}
          </ul>
          <div className="diag-info__tip">
            <strong>{t(locale, 'tipsTitle')}</strong>
            <ul>
              {[t(locale,'tip1'), t(locale,'tip2'), t(locale,'tip3'), t(locale,'tip4')].map((tip,i) => (
                <li key={i}><IconCheck size={13} className="diag-info__check" />{tip}</li>
              ))}
            </ul>
          </div>

          {/* Quota summary */}
          <div className="scan-quota-summary">
            <IconClock size={14} />
            <span>
              {scanUsed}/{scanLimit} scans used today
              {user?.plan === 'free' && ' · Free plan'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
