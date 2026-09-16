import {
  IconLeaf, IconActivity, IconMapPin, IconCalendar,
  IconSprout, IconBarChart, IconCamera, IconThermometer,
  IconMap, IconBell, IconBookOpen, IconTrendingUp, IconDatabase, IconShare,
  IconLock, IconUsers, IconFileText, IconGlobe,
} from './Icons';

const SIGNALS = [
  { Icon: IconLeaf,        label: 'Crop type' },
  { Icon: IconActivity,    label: 'Disease category' },
  { Icon: IconMapPin,      label: 'Geographic area' },
  { Icon: IconCalendar,    label: 'Time of season' },
  { Icon: IconSprout,      label: 'Crop growth stage' },
  { Icon: IconBarChart,    label: 'Disease prevalence' },
  { Icon: IconCamera,      label: 'Image characteristics' },
  { Icon: IconThermometer, label: 'Environmental conditions' },
];

const DOWNSTREAM = [
  { Icon: IconMap,         text: 'Regional crop-health monitoring' },
  { Icon: IconBell,        text: 'Early disease outbreak alerts' },
  { Icon: IconBookOpen,    text: 'Agricultural research support' },
  { Icon: IconTrendingUp,  text: 'Extension planning intelligence' },
  { Icon: IconDatabase,    text: 'Agricultural risk analysis' },
  { Icon: IconShare,       text: 'Agribusiness supply-chain insights' },
];

const PRINCIPLES = [
  { Icon: IconLock,     title: 'Farmer consent first', desc: 'Data is only collected and used with explicit, informed consent from farmers.' },
  { Icon: IconUsers,    title: 'Anonymisation',         desc: 'Aggregated insights are anonymised and de-identified to protect individual farmers.' },
  { Icon: IconFileText, title: 'Never sold',            desc: 'Farmer data is never sold to third parties. Full stop.' },
  { Icon: IconGlobe,    title: 'Transparent governance',desc: 'Data policies are published, readable, and kept up to date. No hidden uses.' },
];

export default function DataSection() {
  return (
    <section className="section data-section" id="data" aria-labelledby="data-heading">
      <div className="container">
        <div className="section__label">DATA &amp; NETWORK EFFECTS</div>
        <h2 id="data-heading" className="section__title">
          Every crop image can become<br />agricultural intelligence.
        </h2>
        <p className="section__subtitle">
          Each farmer interaction has the potential to generate structured signals
          that improve the platform for everyone — with appropriate consent and governance.
        </p>

        <div className="data-layout">
          <div className="data-signals">
            <h3 className="data-signals__title">Signals from each interaction</h3>
            <div className="data-signals__grid">
              {SIGNALS.map(({ Icon, label }) => (
                <div key={label} className="data-signal">
                  <Icon size={20} aria-hidden={true} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="data-value">
            <h3 className="data-value__title">Potential downstream value</h3>
            <ul className="data-value__list">
              {DOWNSTREAM.map(({ Icon, text }) => (
                <li key={text}><Icon size={18} aria-hidden={true} /><span>{text}</span></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="data-privacy">
          <h3 className="data-privacy__title">Our data principles</h3>
          <div className="data-privacy__grid">
            {PRINCIPLES.map(({ Icon, title, desc }) => (
              <div key={title} className="data-privacy__principle">
                <div className="data-privacy__icon" aria-hidden="true"><Icon size={28} /></div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
