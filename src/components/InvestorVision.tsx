import { IconSmartphone, IconMap, IconGlobe, IconCheck, IconArrowRight, IconChevronRight } from './Icons';

const PHASES = [
  {
    label: 'Today',
    title: 'AI-powered crop disease detection',
    Icon: IconSmartphone,
    status: 'current' as const,
    items: ['Photograph a crop leaf', 'AI analyzes the image', 'Farmer receives diagnosis + recommendations', 'Cassava detection available'],
    marker: <IconCheck size={14} />,
  },
  {
    label: 'Next',
    title: 'Personalized farm monitoring',
    Icon: IconMap,
    status: 'next' as const,
    items: ['Multi-crop disease detection', 'Farm health dashboard', 'Personalized crop recommendations', 'Extension officer platform'],
    marker: <IconArrowRight size={14} />,
  },
  {
    label: 'Future',
    title: 'Full agricultural intelligence platform',
    Icon: IconGlobe,
    status: 'future' as const,
    items: ['Connecting farmers, experts, and organisations', 'Regional disease surveillance', 'Agribusiness intelligence layer', 'Multi-country, multi-language platform'],
    marker: <IconChevronRight size={14} />,
  },
];

export default function InvestorVision() {
  return (
    <section className="section investor-section" id="vision" aria-labelledby="investor-heading">
      <div className="container">
        <div className="section__label">COMPANY VISION</div>
        <h2 id="investor-heading" className="section__title">
          Building the intelligence layer<br />for African agriculture.
        </h2>
        <p className="section__subtitle">
          We're starting with crop disease detection. We're building toward something much larger.
        </p>

        <div className="investor-phases">
          {PHASES.map(({ label, title, Icon, status, items, marker }) => (
            <div key={label} className={`investor-phase investor-phase--${status}`}>
              <div className="investor-phase__label">{label}</div>
              <div className="investor-phase__icon" aria-hidden="true"><Icon size={28} /></div>
              <h3 className="investor-phase__title">{title}</h3>
              <ul className="investor-phase__items">
                {items.map((item) => (
                  <li key={item}>
                    <span aria-hidden="true" className="investor-phase__marker">{marker}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="investor-narrative">
          <div className="investor-narrative__inner">
            <h3>The opportunity</h3>
            <p>
              Agriculture is the backbone of African economies. Smallholder farmers represent
              a large, underserved, and mobile-first population. Crop disease causes significant
              losses that better information could help mitigate.
            </p>
            <p>
              Smart Farmer sits at the intersection of AI, mobile, agriculture, and Africa —
              building a platform that can grow from individual farmer utility to an
              agricultural intelligence network.
            </p>
            <div className="investor-narrative__ctas">
              <a href="mailto:investors@smartfarmer.ai" className="btn btn--primary">Build With Us</a>
              <a href="mailto:partners@smartfarmer.ai"  className="btn btn--ghost btn--ghost-white">Partner With Us</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
