import {
  IconUserCheck, IconClock, IconLeaf, IconWifi, IconMapPin,
  IconCloud, IconBookOpen, IconZap,
} from './Icons';

const PROBLEMS = [
  { Icon: IconUserCheck, text: 'Limited access to agricultural experts' },
  { Icon: IconClock,     text: 'Delayed disease identification' },
  { Icon: IconLeaf,      text: 'Preventable crop losses every season' },
  { Icon: IconWifi,      text: 'Unreliable or inaccessible agricultural information' },
  { Icon: IconMapPin,    text: 'Few extension officers for thousands of farmers' },
  { Icon: IconCloud,     text: 'Weather and climate uncertainty' },
  { Icon: IconBookOpen,  text: 'Language and literacy barriers' },
  { Icon: IconZap,       text: 'Limited access to timely farm intelligence' },
];

export default function ProblemSection() {
  return (
    <section className="section problem-section" id="problem" aria-labelledby="problem-heading">
      <div className="container">
        <div className="section__label">THE PROBLEM</div>
        <h2 id="problem-heading" className="section__title">
          A crop disease can start<br />with a single leaf.
        </h2>
        <p className="section__subtitle">
          African smallholder farmers grow food for hundreds of millions of people.
          Yet when a crop shows signs of disease, getting reliable guidance is rarely simple.
        </p>

        <ul className="problem-grid" role="list">
          {PROBLEMS.map((p) => (
            <li key={p.text} className="problem-card">
              <p.Icon size={18} aria-hidden={true} className="problem-card__icon" />
              <span>{p.text}</span>
            </li>
          ))}
        </ul>

        {/* Visual story */}
        <div className="problem-story" aria-label="The journey from unknown symptom to lost income">
          <div className="problem-story__path problem-story__path--bad">
            {[
              { label: 'Unknown symptom' },
              { label: 'Delayed diagnosis' },
              { label: 'Crop damage' },
              { label: 'Lost income' },
            ].map((s, i, arr) => (
              <div key={s.label} className="problem-story__group">
                <div className="problem-story__step problem-story__step--bad">
                  <span className="problem-story__label">{s.label}</span>
                </div>
                {i < arr.length - 1 && <div className="problem-story__arrow" aria-hidden="true">→</div>}
              </div>
            ))}
          </div>

          <div className="problem-story__divider" aria-label="versus">
            <span className="problem-story__vs">VS</span>
          </div>

          <div className="problem-story__path problem-story__path--good">
            {[
              { label: 'Take a photo' },
              { label: 'AI analysis' },
              { label: 'Clear guidance' },
              { label: 'Better decision' },
            ].map((s, i, arr) => (
              <div key={s.label} className="problem-story__group">
                <div className="problem-story__step problem-story__step--good">
                  <span className="problem-story__label">{s.label}</span>
                </div>
                {i < arr.length - 1 && <div className="problem-story__arrow" aria-hidden="true">→</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
