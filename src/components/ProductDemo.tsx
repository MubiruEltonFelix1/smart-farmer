import { useState, useRef } from 'react';
import { analyzeCropImage, validateImage } from '../services/diagnosisService';
import type { DiagnosisResult } from '../types';
import { IconUpload, IconSearch, IconClose, IconInfo, IconBrain, IconCheck, IconWarning } from './Icons';

type DemoState = 'idle' | 'preview' | 'analyzing' | 'result' | 'error';

export default function ProductDemo() {
  const [state,   setState]   = useState<DemoState>('idle');
  const [preview, setPreview] = useState<string | null>(null);
  const [result,  setResult]  = useState<DiagnosisResult | null>(null);
  const [error,   setError]   = useState<string>('');
  const [progress,setProgress]= useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const v = validateImage(file);
    if (!v.valid) { setError(v.error ?? 'Invalid image.'); setState('error'); return; }
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
    } catch {
      clearInterval(interval);
      setError("We couldn't analyze this image. Try taking a clearer photo of the leaf in good lighting.");
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const useDemoImage = () => { setPreview('/cassava-demo.jpg'); setState('preview'); };

  const severityColor = (s: string) => {
    if (s === 'Healthy')  return 'var(--color-green)';
    if (s === 'Low')      return '#84cc16';
    if (s === 'Moderate') return 'var(--color-gold)';
    return 'var(--color-rust)';
  };

  return (
    <section className="section demo-section" id="demo" aria-labelledby="demo-heading">
      <div className="container">
        <div className="section__label">PRODUCT DEMO</div>
        <h2 id="demo-heading" className="section__title">From leaf photo to farming decision.</h2>
        <p className="section__subtitle">
          Try the AI diagnosis experience. Upload a crop leaf photo to see how Smart Farmer analyzes it.
        </p>

        <div className="demo-wrapper">
          <div className="demo-panel">

            {/* IDLE */}
            {state === 'idle' && (
              <div
                className="demo-dropzone"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                role="button" tabIndex={0}
                aria-label="Upload crop image"
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef} type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only" aria-label="Choose crop image file"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <div className="demo-dropzone__icon" aria-hidden="true"><IconUpload size={48} /></div>
                <p className="demo-dropzone__title">Upload a crop leaf photo</p>
                <p className="demo-dropzone__sub">Drag and drop, or click to choose</p>
                <div className="demo-dropzone__btns">
                  <button className="btn btn--primary" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                    Upload Image
                  </button>
                  <button className="btn btn--ghost" onClick={(e) => { e.stopPropagation(); useDemoImage(); }}>
                    Use Demo Image
                  </button>
                </div>
                <p className="demo-dropzone__note">JPEG, PNG or WebP · Max 10 MB</p>
              </div>
            )}

            {/* PREVIEW */}
            {state === 'preview' && preview && (
              <div className="demo-preview">
                <div className="demo-preview__img-wrap">
                  <img src={preview} alt="Uploaded crop leaf" className="demo-preview__img" />
                  <button className="demo-preview__remove" onClick={reset} aria-label="Remove image">
                    <IconClose size={16} />
                  </button>
                </div>
                <div className="demo-preview__actions">
                  <p className="demo-preview__ready">Image ready for analysis</p>
                  <button className="btn btn--primary btn--large" onClick={handleAnalyze}>
                    <IconSearch size={16} />
                    Analyze Crop
                  </button>
                  <button className="btn btn--ghost" onClick={reset}>Choose different image</button>
                </div>
              </div>
            )}

            {/* ANALYZING */}
            {state === 'analyzing' && (
              <div className="demo-analyzing">
                <div className="demo-analyzing__animation" aria-hidden="true">
                  <div className="scan-rings">
                    <div className="scan-ring scan-ring--1" /><div className="scan-ring scan-ring--2" /><div className="scan-ring scan-ring--3" />
                    <span className="scan-rings__center"><IconBrain size={24} /></span>
                  </div>
                </div>
                <p className="demo-analyzing__title">Analyzing crop…</p>
                <p className="demo-analyzing__sub">AI is examining leaf patterns and visual symptoms</p>
                <div className="demo-progress" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Analysis progress">
                  <div className="demo-progress__fill" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
                <p className="demo-analyzing__pct">{Math.round(Math.min(progress, 100))}%</p>
              </div>
            )}

            {/* RESULT */}
            {state === 'result' && result && (
              <div className="demo-result">
                <div className="demo-result__header">
                  <div className="demo-result__crop-badge"><span>{result.crop}</span></div>
                  <div className="demo-result__status" style={{ color: result.severity === 'Healthy' ? 'var(--color-green)' : 'var(--color-gold)' }}>
                    {result.status}
                  </div>
                </div>
                <h3 className="demo-result__condition">{result.disease}</h3>
                <div className="demo-result__metrics">
                  <div className="demo-result__metric">
                    <span className="demo-result__metric-val">{result.confidence}%</span>
                    <span className="demo-result__metric-label">Confidence</span>
                  </div>
                  <div className="demo-result__metric">
                    <span className="demo-result__metric-val" style={{ color: severityColor(result.severity) }}>{result.severity}</span>
                    <span className="demo-result__metric-label">Severity</span>
                  </div>
                </div>
                <div className="demo-result__confidence-bar">
                  <div className="demo-result__confidence-fill" style={{ width: `${result.confidence}%` }} />
                </div>
                <div className="demo-result__recs">
                  <p className="demo-result__recs-title">Recommended actions</p>
                  <ol className="demo-result__recs-list">
                    {result.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                  </ol>
                </div>
                <p className="demo-result__disclaimer">
                  <IconInfo size={13} />
                  AI-generated assessment — verify important decisions with local agricultural expertise.
                </p>
                <button className="btn btn--ghost demo-result__reset" onClick={reset}>Analyze another crop</button>
              </div>
            )}

            {/* ERROR */}
            {state === 'error' && (
              <div className="demo-error">
                <div className="demo-error__icon" aria-hidden="true"><IconWarning size={40} /></div>
                <p className="demo-error__title">Couldn't complete the analysis</p>
                <p className="demo-error__msg">{error}</p>
                <button className="btn btn--primary" onClick={reset}>Try Again</button>
              </div>
            )}
          </div>

          {/* Side info */}
          <div className="demo-info">
            <h3 className="demo-info__title">What the AI looks for</h3>
            <ul className="demo-info__list">
              {[
                { color: '#c1440e', title: 'Leaf discoloration',  desc: 'Yellowing, browning, or unusual color patterns' },
                { color: '#d4a017', title: 'Lesion patterns',     desc: 'Spots, streaks, or necrotic areas on the leaf surface' },
                { color: '#2d6a4f', title: 'Texture changes',     desc: 'Mosaic patterns, distortion, or unusual surface texture' },
                { color: '#7f4f24', title: 'Structural damage',   desc: 'Wilting, curling, or deformation of leaf structure' },
              ].map((item) => (
                <li key={item.title}>
                  <span className="demo-info__dot" style={{ background: item.color }} aria-hidden="true" />
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="demo-info__tip">
              <strong>Tips for better results</strong>
              <ul>
                {['Use natural daylight, not flash', 'Focus on the most affected leaf', 'Fill the frame with the leaf', 'Avoid blurry or dark images'].map((t) => (
                  <li key={t}><IconCheck size={12} className="demo-info__check" />{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
