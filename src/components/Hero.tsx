import { useRouter } from '../router';
import { IconArrowRight, IconShield, IconScan } from './Icons';

export default function Hero() {
  const { navigate } = useRouter();

  return (
    <section className="hero" id="product" aria-labelledby="hero-heading">
      <div className="hero__inner">
        {/* Text column */}
        <div className="hero__text">
          <span className="hero__eyebrow">AI FOR AFRICAN FARMERS</span>
          <h1 id="hero-heading" className="hero__headline">
            Turn a photo of your crop into actionable farming intelligence.
          </h1>
          <p className="hero__sub">
            Our AI-powered farming assistant helps farmers identify crop diseases from leaf images
            and provides practical recommendations to protect their crops, improve productivity,
            and make better farming decisions.
          </p>
          <div className="hero__ctas">
            <button
              className="btn btn--primary btn--large"
              onClick={() => navigate('/product')}
            >
              Diagnose a Crop
              <IconArrowRight size={16} />
            </button>
            <button
              className="btn btn--ghost btn--large"
              onClick={() => navigate('/how-it-works')}
            >
              See How It Works
            </button>
          </div>
          <p className="hero__note">
            <IconShield size={14} />
            Free to use · No account required to try
          </p>
        </div>

        {/* Phone mockup */}
        <div className="hero__visual" aria-label="Product preview: crop diagnosis on a smartphone">
          <div className="phone">
            <div className="phone__frame">
              <div className="phone__notch" aria-hidden="true" />
              <div className="phone__screen">
                {/* App header */}
                <div className="phone__app-header">
                  <span className="phone__app-logo">SmartFarmer</span>
                  <span className="phone__app-badge">AI</span>
                </div>

                {/* Leaf + scan */}
                <div className="phone__scan-area" aria-label="Cassava leaf being analyzed">
                  <div className="phone__leaf-bg">
                    <div className="phone__leaf-illustration" aria-hidden="true">
                      <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="leaf-svg">
                        <path d="M60 10 C20 30 10 70 30 110 C40 130 80 135 90 110 C110 70 100 30 60 10Z" fill="#2d6a4f" opacity="0.9"/>
                        <path d="M60 10 L60 130" stroke="#1a4731" strokeWidth="2"/>
                        <path d="M60 40 C45 45 38 55 40 65" stroke="#1a4731" strokeWidth="1.5" opacity="0.7"/>
                        <path d="M60 40 C75 45 82 55 80 65" stroke="#1a4731" strokeWidth="1.5" opacity="0.7"/>
                        <path d="M60 65 C42 72 35 82 38 92" stroke="#1a4731" strokeWidth="1.5" opacity="0.7"/>
                        <path d="M60 65 C78 72 85 82 82 92" stroke="#1a4731" strokeWidth="1.5" opacity="0.7"/>
                        <circle cx="45" cy="52" r="5" fill="#d4a017" opacity="0.85"/>
                        <circle cx="72" cy="48" r="4" fill="#d4a017" opacity="0.85"/>
                        <circle cx="50" cy="75" r="3.5" fill="#c1440e" opacity="0.75"/>
                        <circle cx="68" cy="80" r="4.5" fill="#d4a017" opacity="0.8"/>
                        <circle cx="40" cy="90" r="3" fill="#c1440e" opacity="0.7"/>
                      </svg>
                    </div>
                    <div className="phone__scan-line" aria-hidden="true" />
                    <div className="phone__scan-corner phone__scan-corner--tl" aria-hidden="true" />
                    <div className="phone__scan-corner phone__scan-corner--tr" aria-hidden="true" />
                    <div className="phone__scan-corner phone__scan-corner--bl" aria-hidden="true" />
                    <div className="phone__scan-corner phone__scan-corner--br" aria-hidden="true" />
                  </div>
                  <p className="phone__analyzing-text">
                    <span className="phone__dot-pulse" aria-hidden="true" />
                    Analyzing crop…
                  </p>
                </div>

                {/* Result card */}
                <div className="phone__result">
                  <div className="phone__result-header">
                    <div>
                      <div className="phone__result-crop">Cassava</div>
                      <div className="phone__result-disease">Cassava Mosaic Disease</div>
                    </div>
                    <div className="phone__confidence">
                      <span className="phone__confidence-num">94%</span>
                      <span className="phone__confidence-label">confidence</span>
                    </div>
                  </div>
                  <div className="phone__result-status phone__result-status--warn">
                    Potentially affected · Moderate severity
                  </div>
                  <div className="phone__result-actions">
                    <p className="phone__result-actions-title">Recommended next steps</p>
                    <ul>
                      <li>Remove severely affected leaves</li>
                      <li>Monitor surrounding plants</li>
                      <li>Contact extension officer</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="phone__badge phone__badge--top" aria-hidden="true">
              <IconScan size={14} />
              AI Analysis
            </div>
            <div className="phone__badge phone__badge--bottom" aria-hidden="true">
              <span className="badge-dot badge-dot--green" />
              94% Confidence
            </div>
          </div>
        </div>
      </div>

      <div className="hero__bg-circle hero__bg-circle--1" aria-hidden="true" />
      <div className="hero__bg-circle hero__bg-circle--2" aria-hidden="true" />
    </section>
  );
}
