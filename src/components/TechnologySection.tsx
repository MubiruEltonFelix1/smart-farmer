import {
  IconEye, IconBrain, IconRefresh, IconGlobe,
  IconCpu, IconDatabase, IconLeaf, IconSmartphone,
  IconThermometer, IconDroplets, IconCalendar, IconActivity,
  IconMap, IconLayers, IconSun, IconMapPin,
} from './Icons';

const TECH_CARDS = [
  { Icon: IconEye,     title: 'Computer Vision',        featured: true,  desc: 'Image-based crop analysis that examines visual patterns in leaf photographs — color, texture, shape, and lesion characteristics associated with specific diseases.' },
  { Icon: IconBrain,   title: 'Machine Learning',       featured: false, desc: 'Models trained and evaluated on crop disease imagery. Performance improves continuously as more representative, high-quality field data becomes available.' },
  { Icon: IconRefresh, title: 'Continuous Improvement', featured: false, desc: 'The system is designed to learn from new field observations, improving accuracy over time with data that reflects actual African farming conditions.' },
  { Icon: IconGlobe,   title: 'Local Context',          featured: false, desc: 'The long-term platform vision combines image intelligence with crop type, location, weather, soil, season, and farming practices for richer assessments.' },
];

const MOAT_PILLARS = [
  { Icon: IconCpu,      label: 'AI Models' },
  { Icon: IconDatabase, label: 'African Agricultural Data' },
  { Icon: IconLeaf,     label: 'Farmer Distribution' },
  { Icon: IconSmartphone,label:'Local Agricultural Knowledge' },
];

const SIGNALS = [
  { Icon: IconLeaf,        label: 'Crop type' },
  { Icon: IconMapPin,      label: 'Location' },
  { Icon: IconSun,         label: 'Weather' },
  { Icon: IconDroplets,    label: 'Soil type' },
  { Icon: IconCalendar,    label: 'Season' },
  { Icon: IconActivity,    label: 'Crop stage' },
  { Icon: IconLayers,      label: 'Practices' },
  { Icon: IconMap,         label: 'History' },
];

export default function TechnologySection() {
  return (
    <section className="section tech-section" id="technology" aria-labelledby="tech-heading">
      <div className="container">
        <div className="section__label">TECHNOLOGY</div>
        <h2 id="tech-heading" className="section__title">
          AI trained for the field,<br />not just the lab.
        </h2>
        <p className="section__subtitle">
          Building AI that works in real African farming conditions — not just benchmark datasets.
        </p>

        <div className="tech-grid">
          {TECH_CARDS.map(({ Icon, title, featured, desc }) => (
            <div key={title} className={`tech-card${featured ? ' tech-card--featured' : ''}`}>
              <div className="tech-card__icon" aria-hidden="true"><Icon size={24} /></div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>

        <div className="tech-moat">
          <h3 className="tech-moat__title">Our technology vision</h3>
          <p className="tech-moat__sub">The long-term competitive advantage is not simply the ML model. It is the combination of:</p>
          <div className="tech-moat__pillars">
            {MOAT_PILLARS.map(({ Icon, label }, i) => (
              <div key={label} className="tech-moat__group">
                <div className="tech-moat__pillar">
                  <div className="tech-moat__pillar-icon" aria-hidden="true"><Icon size={18} /></div>
                  <span>{label}</span>
                </div>
                {i < MOAT_PILLARS.length - 1 && <span className="tech-moat__plus" aria-hidden="true">+</span>}
              </div>
            ))}
          </div>
          <p className="tech-moat__note">This is Smart Farmer's technology vision — the foundation we are building toward.</p>
        </div>

        <div className="tech-signals">
          <h3 className="tech-signals__title">Signals that can enrich AI assessment</h3>
          <div className="tech-signals__grid">
            {SIGNALS.map(({ Icon, label }) => (
              <div key={label} className="tech-signals__item">
                <Icon size={20} aria-hidden={true} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
