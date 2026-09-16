import { IconInfo } from './Icons';

const FEATURES = [
  { label: 'Image capture in the field',    status: 'Available', desc: 'Take photos with your phone camera at any time, with or without connectivity.' },
  { label: 'Cached crop guidance',          status: 'Roadmap',   desc: 'Key disease information and recommendations stored locally for offline access.' },
  { label: 'Offline image queue',           status: 'Roadmap',   desc: 'Capture images offline and have them analyzed automatically when connectivity returns.' },
  { label: 'Intelligent image compression', status: 'Roadmap',   desc: 'Automatically compress images to minimize data usage on 2G/3G connections.' },
  { label: 'Background sync',               status: 'Roadmap',   desc: 'Synchronize diagnoses, farm records, and alerts when connectivity becomes available.' },
  { label: 'On-device AI inference',        status: 'Research',  desc: 'Run the ML model directly on the device without any internet connection required.' },
];

export default function OfflineSection() {
  return (
    <section className="section offline-section" id="offline" aria-labelledby="offline-heading">
      <div className="container">
        <div className="section__label">CONNECTIVITY</div>
        <h2 id="offline-heading" className="section__title">Designed for the field.</h2>
        <p className="section__subtitle">
          African farming happens in places where connectivity is limited, intermittent, or expensive.
          We're building Smart Farmer to work within those realities.
        </p>

        <div className="offline-grid">
          {FEATURES.map((f) => (
            <div key={f.label} className="offline-card">
              <div className="offline-card__top">
                <span className="offline-card__label">{f.label}</span>
                <span className={`offline-card__badge offline-card__badge--${f.status.toLowerCase().replace(' ', '-')}`}>
                  {f.status}
                </span>
              </div>
              <p className="offline-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="offline-disclaimer">
          <IconInfo size={16} />
          Features marked <strong>Roadmap</strong> are planned but not yet available.
          Features marked <strong>Research</strong> are in early exploration.
          Only <strong>Available</strong> features are currently in the product.
        </div>
      </div>
    </section>
  );
}
