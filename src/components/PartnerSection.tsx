import { PARTNER_TYPES } from '../data';
import {
  IconUsers, IconGlobe, IconBuilding, IconPackage, IconCheck,
} from './Icons';

const ICON_MAP: Record<string, React.FC<{ size?: number }>> = {
  users:    IconUsers,
  globe:    IconGlobe,
  building: IconBuilding,
  package:  IconPackage,
};

export default function PartnerSection() {
  return (
    <section className="section partner-section" id="solutions" aria-labelledby="partner-heading">
      <div className="container">
        <div className="section__label">SOLUTIONS</div>
        <h2 id="partner-heading" className="section__title">
          From individual farms<br />to agricultural ecosystems.
        </h2>
        <p className="section__subtitle">
          Smart Farmer is being built as a platform — not just an app.
          We partner with organisations that serve African farmers at scale.
        </p>

        <div className="partner-grid">
          {PARTNER_TYPES.map((p) => {
            const Icon = ICON_MAP[p.icon] ?? IconUsers;
            return (
              <div key={p.title} className="partner-card">
                <div className="partner-card__icon-wrap" aria-hidden="true"><Icon size={24} /></div>
                <h3 className="partner-card__title">{p.title}</h3>
                <p className="partner-card__desc">{p.description}</p>
                <ul className="partner-card__features">
                  {p.features.map((f) => (
                    <li key={f}><IconCheck size={13} />{f}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="partner-cta">
          <div className="partner-cta__inner">
            <h3>Ready to explore a partnership?</h3>
            <p>
              Whether you're an NGO, cooperative, government ministry, or agribusiness —
              we'd like to understand your needs and explore how Smart Farmer can support your work.
            </p>
            <a href="mailto:partners@smartfarmer.ai" className="btn btn--primary btn--large">
              Partner With Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
