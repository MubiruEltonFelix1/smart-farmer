import {
  IconSmartphone, IconBrain, IconUsers, IconLeaf, IconGlobe, IconLock,
} from './Icons';

const TRUST_ITEMS = [
  { Icon: IconSmartphone, label: 'Mobile-first' },
  { Icon: IconBrain,      label: 'AI-powered' },
  { Icon: IconUsers,      label: 'Smallholder farmer designed' },
  { Icon: IconLeaf,       label: 'Built for African crops' },
  { Icon: IconGlobe,      label: 'Multilingual-ready' },
  { Icon: IconLock,       label: 'Farmer data privacy' },
];

export default function TrustBar() {
  return (
    <section className="trust-bar" aria-label="Platform features">
      <div className="container">
        <p className="trust-bar__heading">Built for the realities of African agriculture</p>
        <ul className="trust-bar__items" role="list">
          {TRUST_ITEMS.map((item) => (
            <li key={item.label} className="trust-bar__item">
              <item.Icon size={16} aria-hidden={true} />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
