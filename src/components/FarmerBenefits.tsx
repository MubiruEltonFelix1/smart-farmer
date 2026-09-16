import { FARMER_BENEFITS } from '../data';
import {
  IconScan, IconZap, IconTarget, IconShield, IconBarChart, IconUsers,
} from './Icons';
import { useRouter } from '../router';

const ICON_MAP: Record<string, React.FC<{ size?: number }>> = {
  scan:     IconScan,
  zap:      IconZap,
  target:   IconTarget,
  shield:   IconShield,
  barChart: IconBarChart,
  users:    IconUsers,
};

export default function FarmerBenefits() {
  const { navigate } = useRouter();
  return (
    <section className="section benefits-section" id="farmers" aria-labelledby="benefits-heading">
      <div className="container">
        <div className="section__label">FOR FARMERS</div>
        <h2 id="benefits-heading" className="section__title">
          Your crops. Your decisions.<br />Better information.
        </h2>
        <p className="section__subtitle">
          Smart Farmer is designed to help farmers make better-informed decisions —
          not to replace their experience and knowledge.
        </p>

        <div className="benefits-grid">
          {FARMER_BENEFITS.map((b) => {
            const Icon = ICON_MAP[b.icon] ?? IconScan;
            return (
              <div key={b.title} className="benefit-card">
                <div className="benefit-card__icon-wrap" aria-hidden="true"><Icon size={22} /></div>
                <h3 className="benefit-card__title">{b.title}</h3>
                <p className="benefit-card__desc">{b.description}</p>
              </div>
            );
          })}
        </div>

        <div className="benefits-cta-row">
          <p className="benefits-cta-row__text">Designed to help farmers make better-informed decisions.</p>
          <button className="btn btn--primary" onClick={() => navigate('/product')}>
            Try Crop Diagnosis
          </button>
        </div>
      </div>
    </section>
  );
}
