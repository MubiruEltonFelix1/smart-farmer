import { TECH_PILLARS } from '../data';
import { IconEye, IconBrain, IconLeaf, IconSmartphone, IconArrowRight } from './Icons';

const ICON_MAP: Record<string, React.FC<{ size?: number; className?: string }>> = {
  eye:        IconEye,
  brain:      IconBrain,
  leaf:       IconLeaf,
  smartphone: IconSmartphone,
};

export default function SolutionSection() {
  return (
    <section className="section solution-section" id="solution" aria-labelledby="solution-heading">
      <div className="container">
        <div className="section__label">THE SOLUTION</div>
        <h2 id="solution-heading" className="section__title">
          Agricultural expertise,<br />in your pocket.
        </h2>
        <p className="section__subtitle">
          Smart Farmer is a digital farming assistant that combines computer vision, machine
          learning, and agricultural knowledge to help farmers understand what's happening to
          their crops — and what to do about it.
        </p>

        <div className="solution-grid">
          {TECH_PILLARS.map((pillar) => {
            const Icon = ICON_MAP[pillar.icon] ?? IconEye;
            return (
              <div key={pillar.title} className="solution-card">
                <div className="solution-card__icon-wrap" aria-hidden="true">
                  <Icon size={22} />
                </div>
                <h3 className="solution-card__title">{pillar.title}</h3>
                <p className="solution-card__desc">{pillar.description}</p>
              </div>
            );
          })}
        </div>

        {/* Concept flow */}
        <div className="solution-concept">
          <div className="solution-concept__inner">
            {[
              { Icon: IconSmartphone, label: 'Crop photo' },
              { Icon: IconBrain,      label: 'AI analysis' },
              { Icon: IconLeaf,       label: 'Clear guidance' },
              { Icon: IconArrowRight, label: 'Better decision' },
            ].map((step, i, arr) => (
              <div key={step.label} className="solution-concept__group">
                <div className="solution-concept__step">
                  <div className="solution-concept__icon">
                    <step.Icon size={22} />
                  </div>
                  <span>{step.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="solution-concept__connector" aria-hidden="true">
                    <IconArrowRight size={18} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
