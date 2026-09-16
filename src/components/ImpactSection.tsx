import { IMPACT_METRICS } from '../data';
import { IconTrendingUp, IconGlobe, IconAward } from './Icons';

const THEMES = [
  { Icon: IconTrendingUp, title: 'Farmer Productivity',  body: 'Better crop-health information at the point of decision — when a farmer is standing in the field with a question and no easy way to get an answer.' },
  { Icon: IconGlobe,      title: 'Food Security',         body: 'Earlier awareness of crop-health problems gives farmers more time to act before disease spreads and affects the harvest that feeds communities.' },
  { Icon: IconAward,      title: 'Economic Resilience',   body: 'Helping smallholder farmers make more informed decisions about their crops — the most important economic asset they have.' },
];

export default function ImpactSection() {
  return (
    <section className="section impact-section" id="impact" aria-labelledby="impact-heading">
      <div className="container">
        <div className="section__label">IMPACT</div>
        <h2 id="impact-heading" className="section__title">
          Technology that works<br />where it matters.
        </h2>
        <p className="section__subtitle">
          Smart Farmer is early stage. These metrics will be updated as the platform grows
          and data is verified.
        </p>

        <div className="impact-metrics" role="list">
          {IMPACT_METRICS.map((m) => (
            <div key={m.label} className="impact-metric" role="listitem">
              <div className="impact-metric__value" aria-label={`${m.value} — placeholder`}>{m.value}</div>
              <div className="impact-metric__label">{m.label}</div>
              <div className="impact-metric__note">placeholder — to be updated</div>
            </div>
          ))}
        </div>

        <div className="impact-themes">
          {THEMES.map(({ Icon, title, body }) => (
            <div key={title} className="impact-theme">
              <div className="impact-theme__icon" aria-hidden="true"><Icon size={28} /></div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
