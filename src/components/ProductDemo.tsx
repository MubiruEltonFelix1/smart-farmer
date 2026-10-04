import { useState, useRef } from 'react';
import { analyzeCropImage, validateImage } from '../services/diagnosisService';
import type { DiagnosisResult } from '../types';
import {
  IconUpload, IconSearch, IconClose, IconInfo,
  IconBrain, IconCheck, IconWarning,
} from './Icons';
import {
  TRANSLATIONS, LOCALE_LABELS, cropName, severityLabel, statusLabel, type Locale,
} from '../i18n/translations';

type DemoState = 'idle' | 'preview' | 'analyzing' | 'result' | 'error';

const DEMO_IMAGE_PATH = '/demo-leaf.jpg';

// Camera icon (inline — avoids adding another Icons export for one symbol)
function IconCamera({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

interface Props {
  locale?: Locale;
  onLocaleChange?: (l: Locale) => void;
}

export default function ProductDemo({ locale: localeProp, onLocaleChange }: Props) {
  const [state,    setState]    = useState<DemoState>('idle');
  const [preview,  setPreview]  = useState<string | null>(null);
  const [result,   setResult]   = useState<DiagnosisResult | null>(null);
  const [error,    setError]    = useState<string>('');
  const [progress, setProgress] = useState(0);
  // If locale is controlled externally (ProductPage), use that. Otherwise manage locally.
  const [internalLocale, setInternalLocale] = useState<Locale>('en');
  const locale = localeProp ?? internalLocale;
  const handleLocaleChange = (l: Locale) => {
    setInternalLocale(l);
    onLocaleChange?.(l);
  };

  const fileInputRef   = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const t = TRANSLATIONS[locale];

  // ── file handling ─────────────────────────────────────────────────────────
  const handleFile = (file: File) => {
    const v = validateImage(file);
    if (!v.valid) { setError(t[v.errorKey]); setState('error'); return; }
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setState('preview');
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setState('analyzing'); setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => { if (p >= 90) { clearInterval(interval); return 90; } return p + Math.random() * 18; });
    }, 280);
    try {
      const res = await analyzeCropImage({ image: preview });
      clearInterval(interval); setProgress(100);
      setTimeout(() => { setResult(res); setState('result'); }, 400);
    } catch (err: unknown) {
      clearInterval(interval);
      const code = err instanceof Error && 'code' in err
        ? (err as Error & { code: string }).code
        : 'UNKNOWN';
      const byCode: Record<string, string> = {
        NETWORK: t.errNetwork,
        SERVER: t.errServer,
        IMAGE_QUALITY: t.errImageTooLarge,
      };
      setError(byCode[code] ?? t.errAnalyzeFailed);
      setState('error');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setState('idle'); setPreview(null); setResult(null); setError(''); setProgress(0);
    if (fileInputRef.current)   fileInputRef.current.value   = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const loadDemoImage = async () => {
    try {
      const res = await fetch(DEMO_IMAGE_PATH);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onload  = (e) => { setPreview(e.target?.result as string); setState('preview'); };
      reader.onerror = () => { setError(t.errDemoRead); setState('error'); };
      reader.readAsDataURL(blob);
    } catch {
      setError(t.errDemoMissing);
      setState('error');
    }
  };

  const severityColor = (s: string) => {
    if (s === 'Healthy')  return 'var(--color-green)';
    if (s === 'Low')      return '#84cc16';
    if (s === 'Moderate') return 'var(--color-gold)';
    return 'var(--color-rust)';
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <section className="section diag-section" id="demo" aria-labelledby="diag-heading">
      <div className="container">

        {/* ── Language switcher ── */}
        <div className="lang-switcher" role="group" aria-label={t.languageLabel}>
          <span className="lang-switcher__label">{t.languageLabel}:</span>
          {(Object.keys(LOCALE_LABELS) as Locale[]).map((loc) => (
            <button
              key={loc}
              className={`lang-btn${locale === loc ? ' lang-btn--active' : ''}`}
              onClick={() => handleLocaleChange(loc)}
              aria-pressed={locale === loc}
            >
              {LOCALE_LABELS[loc]}
            </button>
          ))}
        </div>

        {/* ── Page hero ── */}
        <div className="diag-hero">
          <h1 id="diag-heading" className="diag-hero__title">{t.heroTitle}</h1>
          <p className="diag-hero__sub">{t.heroSubtitle}</p>
        </div>

        {/* ── Main card ── */}
        <div className="diag-wrapper">

          {/* Left: upload / states */}
          <div className="diag-panel">

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              aria-label="Choose crop image file"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            {/* capture="environment" opens the rear camera on mobile */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              className="sr-only"
              aria-label="Take a photo"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {/* IDLE — upload box */}
            {state === 'idle' && (
              <div
                className="diag-dropzone"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                role="button"
                tabIndex={0}
                aria-label={t.uploadTitle}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="diag-dropzone__icon" aria-hidden="true">
                  <IconUpload size={48} />
                </div>
                <p className="diag-dropzone__title">{t.uploadTitle}</p>
                <p className="diag-dropzone__sub">{t.uploadSub}</p>

                <div className="diag-dropzone__btns">
                  <button
                    className="btn btn--primary diag-btn-upload"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  >
                    <IconUpload size={16} />
                    {t.btnUpload}
                  </button>
                  <button
                    className="btn btn--secondary diag-btn-camera"
                    onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
                  >
                    <IconCamera size={16} />
                    {t.btnTakePhoto}
                  </button>
                  <button
                    className="btn btn--ghost"
                    onClick={(e) => { e.stopPropagation(); loadDemoImage(); }}
                  >
                    {t.btnDemoImage}
                  </button>
                </div>

                <p className="diag-dropzone__note">{t.uploadNote}</p>
              </div>
            )}

            {/* PREVIEW */}
            {state === 'preview' && preview && (
              <div className="diag-preview">
                <div className="diag-preview__img-wrap">
                  <img src={preview} alt={t.uploadedLeafAlt} className="diag-preview__img" />
                  <button className="diag-preview__remove" onClick={reset} aria-label={t.removeImage}>
                    <IconClose size={16} />
                  </button>
                </div>
                <div className="diag-preview__actions">
                  <p className="diag-preview__ready">{t.imageReady}</p>
                  <button className="btn btn--primary btn--large" onClick={handleAnalyze}>
                    <IconSearch size={16} />
                    {t.btnAnalyze}
                  </button>
                  <button className="btn btn--ghost" onClick={reset}>
                    {t.btnChooseDifferent}
                  </button>
                </div>
              </div>
            )}

            {/* ANALYZING */}
            {state === 'analyzing' && (
              <div className="diag-analyzing">
                <div className="diag-analyzing__animation" aria-hidden="true">
                  <div className="scan-rings">
                    <div className="scan-ring scan-ring--1" />
                    <div className="scan-ring scan-ring--2" />
                    <div className="scan-ring scan-ring--3" />
                    <span className="scan-rings__center"><IconBrain size={24} /></span>
                  </div>
                </div>
                <p className="diag-analyzing__title">{t.analyzingTitle}</p>
                <p className="diag-analyzing__sub">{t.analyzingSub}</p>
                <div
                  className="diag-progress"
                  role="progressbar"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={t.analysisProgress}
                >
                  <div className="diag-progress__fill" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
                <p className="diag-analyzing__pct">{Math.round(Math.min(progress, 100))}%</p>
              </div>
            )}

            {/* RESULT */}
            {state === 'result' && result && (
              <div className="diag-result">
                <div className="diag-result__header">
                  <div className="diag-result__crop-badge"><span>{cropName(locale, result.crop)}</span></div>
                  <div className="diag-result__status"
                    style={{ color: result.severity === 'Healthy' ? 'var(--color-green)' : 'var(--color-gold)' }}>
                    {statusLabel(locale, result.status)}
                  </div>
                </div>
                <h3 className="diag-result__condition">{result.disease}</h3>
                <div className="diag-result__metrics">
                  <div className="diag-result__metric">
                    <span className="diag-result__metric-val">{result.confidence}%</span>
                    <span className="diag-result__metric-label">{t.confidence}</span>
                  </div>
                  <div className="diag-result__metric">
                    <span className="diag-result__metric-val" style={{ color: severityColor(result.severity) }}>
                      {severityLabel(locale, result.severity)}
                    </span>
                    <span className="diag-result__metric-label">{t.severity}</span>
                  </div>
                </div>
                <div className="diag-result__confidence-bar">
                  <div className="diag-result__confidence-fill" style={{ width: `${result.confidence}%` }} />
                </div>
                <div className="diag-result__recs">
                  <p className="diag-result__recs-title">{t.recommendedActions}</p>
                  <ol className="diag-result__recs-list">
                    {result.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                  </ol>
                </div>
                <p className="diag-result__disclaimer">
                  <IconInfo size={13} />
                  {t.disclaimer}
                </p>
                <button className="btn btn--ghost diag-result__reset" onClick={reset}>
                  {t.btnAnalyzeAnother}
                </button>
              </div>
            )}

            {/* ERROR */}
            {state === 'error' && (
              <div className="diag-error">
                <div className="diag-error__icon" aria-hidden="true"><IconWarning size={40} /></div>
                <p className="diag-error__title">{t.errorTitle}</p>
                <p className="diag-error__msg">{error}</p>
                <button className="btn btn--primary" onClick={reset}>{t.btnTryAgain}</button>
              </div>
            )}
          </div>

          {/* Right: tips panel */}
          <div className="diag-info">
            <h3 className="diag-info__title">{t.whatAILooksFor}</h3>
            <ul className="diag-info__list">
              {[
                { color: '#c1440e', title: t.leafDiscolouration,  desc: t.leafDiscolourationDesc },
                { color: '#d4a017', title: t.lesionPatterns,      desc: t.lesionPatternsDesc },
                { color: '#2d6a4f', title: t.textureChanges,      desc: t.textureChangesDesc },
                { color: '#7f4f24', title: t.structuralDamage,    desc: t.structuralDamageDesc },
              ].map((item) => (
                <li key={item.title}>
                  <span className="diag-info__dot" style={{ background: item.color }} aria-hidden="true" />
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="diag-info__tip">
              <strong>{t.tipsTitle}</strong>
              <ul>
                {[t.tip1, t.tip2, t.tip3, t.tip4].map((tip) => (
                  <li key={tip}><IconCheck size={12} className="diag-info__check" />{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
