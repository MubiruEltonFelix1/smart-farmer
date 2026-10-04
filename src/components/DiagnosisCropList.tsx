import { useState } from 'react';
import { CROPS } from '../data';
import {
  IconLeaf, IconSprout, IconSun, IconDroplets, IconMountain,
  IconLayers, IconThermometer, IconActivity, IconCheck,
} from './Icons';
import { TRANSLATIONS, cropName, type Locale } from '../i18n/translations';

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

interface Props {
  locale?: Locale;
}

export default function DiagnosisCropList({ locale = 'en' }: Props) {
  const [active, setActive] = useState<string>(CROPS[0].name);
  const t = TRANSLATIONS[locale];
  const selectedCrop = CROPS.find((c) => c.name === active) ?? CROPS[0];
  const CropIcon = ICON_MAP[selectedCrop.icon] ?? IconLeaf;

  return (
    <section className="section diag-crops-section" id="supported-crops" aria-labelledby="diag-crops-heading">
      <div className="container">
        <div className="section__label">{t.supportedCropsLabel}</div>
        <h2 id="diag-crops-heading" className="section__title">{t.supportedCropsTitle}</h2>
        <p className="section__subtitle">{t.supportedCropsSub}</p>

        <div className="diag-crops-layout">
          {/* Crop pill grid */}
          <div className="diag-crops-grid" role="list">
            {CROPS.map((crop) => {
              const Icon = ICON_MAP[crop.icon] ?? IconLeaf;
              return (
                <button
                  key={crop.name}
                  role="listitem"
                  className={`diag-crop-pill${active === crop.name ? ' diag-crop-pill--active' : ''}`}
                  style={{ '--crop-color': crop.color } as React.CSSProperties}
                  onClick={() => setActive(crop.name)}
                  aria-pressed={active === crop.name}
                  aria-label={cropName(locale, crop.name)}
                >
                  <span className="diag-crop-pill__icon" aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  <span className="diag-crop-pill__name">{cropName(locale, crop.name)}</span>
                  <span className="diag-crop-pill__dot" aria-hidden="true" />
                </button>
              );
            })}
          </div>

          {/* Detail card */}
          <div className="diag-crop-detail" aria-live="polite" aria-atomic="true">
            <div className="diag-crop-detail__header">
              <div
                className="diag-crop-detail__icon-wrap"
                style={{ background: `${selectedCrop.color}18`, color: selectedCrop.color }}
                aria-hidden="true"
              >
                <CropIcon size={32} />
              </div>
              <div>
                <h3 className="diag-crop-detail__name">{cropName(locale, selectedCrop.name)}</h3>
                <span className="diag-crop-detail__badge diag-crop-detail__badge--available">
                  {t.cropAvailable}
                </span>
              </div>
            </div>

            <div className="diag-crop-detail__diseases">
              <p className="diag-crop-detail__diseases-title">{t.detectableConditions}</p>
              <ul className="diag-crop-detail__diseases-list">
                {selectedCrop.diseases.map((d) => (
                  <li key={d}>
                    <IconCheck size={14} />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
