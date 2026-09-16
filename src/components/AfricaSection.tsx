import { IconSmartphone, IconWifi, IconGlobe, IconLeaf, IconUsers, IconBrain } from './Icons';

const LANGUAGES = ['English', 'Luganda', 'Swahili', 'French', 'Hausa', 'Amharic', 'Yoruba', 'Zulu'];

export default function AfricaSection() {
  return (
    <section className="section africa-section" id="about" aria-labelledby="africa-heading">
      <div className="container">
        <div className="section__label">AFRICAN CONTEXT</div>
        <h2 id="africa-heading" className="section__title">
          Built around the realities<br />of African farming.
        </h2>
        <p className="section__subtitle">
          Technology designed for African conditions — not adapted from solutions built elsewhere.
        </p>

        <div className="africa-grid">
          <div className="africa-card africa-card--large">
            <div className="africa-card__icon" aria-hidden="true"><IconSmartphone size={28} /></div>
            <h3>Mobile-first</h3>
            <p>
              Farmers access the product through the smartphones they already own.
              The entire experience is designed for a small screen, one-handed use,
              and variable connectivity.
            </p>
          </div>

          <div className="africa-card">
            <div className="africa-card__icon" aria-hidden="true"><IconWifi size={24} /></div>
            <h3>Low-bandwidth aware</h3>
            <p>
              The application is being designed to minimize data usage — compressed images,
              efficient requests, and cached guidance for the most common crop conditions.
            </p>
          </div>

          <div className="africa-card">
            <div className="africa-card__icon" aria-hidden="true"><IconGlobe size={24} /></div>
            <h3>Local languages</h3>
            <p>
              The platform architecture supports localization into African languages.
              We are building toward multilingual support so that language is never a barrier.
            </p>
            <div className="africa-card__langs" aria-label="Target languages">
              {LANGUAGES.map((lang) => (
                <span key={lang} className="africa-card__lang-badge">{lang}</span>
              ))}
              <span className="africa-card__lang-badge africa-card__lang-badge--more">+ more</span>
            </div>
            <p className="africa-card__note">Language support is part of our roadmap and varies by release.</p>
          </div>

          <div className="africa-card">
            <div className="africa-card__icon" aria-hidden="true"><IconLeaf size={24} /></div>
            <h3>Local crops</h3>
            <p>
              We prioritize crops that matter economically and nutritionally across African
              markets — cassava, maize, beans, banana, potato, and more.
            </p>
          </div>

          <div className="africa-card africa-card--full">
            <div className="africa-card__icon" aria-hidden="true"><IconUsers size={24} /></div>
            <h3>Human + AI</h3>
            <p>
              Smart Farmer supports farmers and agricultural professionals — it doesn't pretend
              to replace them. AI provides immediate, accessible guidance. Local expertise
              provides context, nuance, and trust.
            </p>
            <div className="africa-card__human-ai">
              <div className="africa-card__human-ai-side">
                <strong>AI provides</strong>
                <ul>
                  <li>Instant image analysis</li>
                  <li>Disease pattern recognition</li>
                  <li>24/7 availability</li>
                  <li>Consistent baseline guidance</li>
                </ul>
              </div>
              <div className="africa-card__human-ai-divider" aria-hidden="true">
                <IconBrain size={20} />
              </div>
              <div className="africa-card__human-ai-side">
                <strong>Experts provide</strong>
                <ul>
                  <li>Local context and nuance</li>
                  <li>Physical field inspection</li>
                  <li>Trusted relationships</li>
                  <li>Complex case management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
