import { useState } from 'react';
import { CROPS } from '../data';
import type { CropCard } from '../types';
import {
  IconLeaf, IconSprout, IconSun, IconDroplets, IconMountain,
  IconLayers, IconThermometer, IconActivity, IconCheck, IconClock, IconArrowRight,
} from './Icons';
import { useRouter } from '../router';

const ICON_MAP: Record<string, React.FC<{ size?: number }>> = {
  leaf:        IconLeaf,
  sprout:      IconSprout,
  sun:         IconSun,
  droplets:    IconDroplets,
  mountain:    IconMountain,
  layers:      IconLayers,
  thermometer: IconThermometer,
  activity:    IconActivity,
};

const STATUS_COLOR: Record<CropCard['status'], string> = {
  'Available':   'var(--color-green)',
  'Coming Soon': 'var(--color-gold)',
  'Research':    'var(--color-sand)',
};
const STATUS_BG: Record<CropCard['status'], string> = {
  'Available':   'rgba(45,106,79,0.1)',
  'Coming Soon': 'rgba(212,160,23,0.12)',
  'Research':    'rgba(139,115,85,0.1)',
};

export default function CropCoverage() {
  const [active, setActive] = useState<string>('Cassava');
  const { navigate } = useRouter();
  const selectedCrop = CROPS.find((c) => c.name === active) ?? CROPS[0];
  const CropIcon = ICON_MAP[selectedCrop.icon] ?? IconLeaf;

  return (
    <section className="section crops-section" id="crops" aria-labelledby="crops-heading">
      <div className="container">
        <div className="section__label">CROP COVERAGE</div>
        <h2 id="crops-heading" className="section__title">
          Starting with cassava.<br />Built for Africa's crops.
        </h2>
        <p className="section__subtitle">
          Our platform is designed to support the crops that matter most to African smallholder
          farmers. Cassava detection is available now; additional crops are in active development.
        </p>

        <div className="crops-layout">
          <div className="crops-grid" role="list">
            {CROPS.map((crop) => {
              const Icon = ICON_MAP[crop.icon] ?? IconLeaf;
              return (
                <button
                  key={crop.name}
                  role="listitem"
                  className={`crop-card${active === crop.name ? ' crop-card--active' : ''}`}
                  onClick={() => setActive(crop.name)}
                  aria-pressed={active === crop.name}
                  aria-label={`${crop.name} — ${crop.status}`}
                >
                  <span className="crop-card__icon-wrap" aria-hidden="true">
                    <Icon size={22} />
                  </span>
                  <span className="crop-card__name">{crop.name}</span>
                  <span className="crop-card__badge" style={{ color: STATUS_COLOR[crop.status], background: STATUS_BG[crop.status] }}>
                    {crop.status}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="crops-detail" aria-live="polite" aria-atomic="true">
            <div className="crops-detail__header">
              <div className="crops-detail__icon-wrap" aria-hidden="true"><CropIcon size={32} /></div>
              <div>
                <h3 className="crops-detail__name">{selectedCrop.name}</h3>
                <span className="crops-detail__status" style={{ color: STATUS_COLOR[selectedCrop.status], background: STATUS_BG[selectedCrop.status] }}>
                  {selectedCrop.status}
                </span>
              </div>
            </div>
            <div className="crops-detail__diseases">
              <p className="crops-detail__diseases-title">
                {selectedCrop.status === 'Available' ? 'Detectable conditions include:' : 'Conditions under research/development:'}
              </p>
              <ul>
                {selectedCrop.diseases.map((d) => (
                  <li key={d}><IconCheck size={14} />{d}</li>
                ))}
              </ul>
            </div>
            {selectedCrop.name === 'Cassava' && (
              <div className="crops-detail__cta">
                <p>Ready to try with your cassava crop?</p>
                <button className="btn btn--primary" onClick={() => navigate('/product')}>
                  Try Crop Diagnosis<IconArrowRight size={14} />
                </button>
              </div>
            )}
            {selectedCrop.status !== 'Available' && (
              <div className="crops-detail__coming">
                <IconClock size={15} />
                This crop is on our development roadmap. We'll notify partners when it's available.
              </div>
            )}
          </div>
        </div>

        <div className="crops-legend" aria-label="Status legend">
          {(['Available', 'Coming Soon', 'Research'] as CropCard['status'][]).map((s) => (
            <div key={s} className="crops-legend__item">
              <span className="crops-legend__dot" style={{ background: STATUS_COLOR[s] }} aria-hidden="true" />
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
