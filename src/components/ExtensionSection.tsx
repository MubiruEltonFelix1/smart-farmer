import {
  IconUpload, IconScan, IconFileText, IconMap,
  IconDatabase, IconMessageCircle, IconUserCheck, IconCheck, IconBrain, IconUsers,
} from './Icons';

const EXTENSION_FEATURES = [
  { Icon: IconUpload,        title: 'Farmer submissions',   desc: 'Receive and review crop images submitted by farmers in your area.' },
  { Icon: IconScan,          title: 'AI-assisted screening', desc: 'AI pre-screens submissions so you can focus on cases that need expert attention.' },
  { Icon: IconFileText,      title: 'Case history',          desc: 'Access a full record of farmer interactions and previous diagnoses.' },
  { Icon: IconMap,           title: 'Regional monitoring',   desc: 'Identify disease patterns emerging across your area before they spread.' },
  { Icon: IconDatabase,      title: 'Farm-level records',    desc: 'Build a digital record for each farmer — crop history, observations, follow-ups.' },
  { Icon: IconMessageCircle, title: 'Broadcast advisories',  desc: 'Send targeted recommendations to affected farmers in your coverage area.' },
];

const FLOW = [
  { Icon: IconUsers,     label: 'Farmer uploads image' },
  { Icon: IconBrain,     label: 'AI provides initial assessment' },
  { Icon: IconUserCheck, label: 'Extension officer reviews flagged cases' },
  { Icon: IconCheck,     label: 'Farmer receives confirmed guidance' },
];

export default function ExtensionSection() {
  return (
    <section className="section extension-section" id="extension" aria-labelledby="extension-heading">
      <div className="container">
        <div className="section__label">FOR AGRICULTURAL PROFESSIONALS</div>
        <h2 id="extension-heading" className="section__title">Amplify agricultural expertise.</h2>
        <p className="section__subtitle">
          Smart Farmer isn't only for individual farmers. Extension officers and agricultural
          professionals can use the platform to serve more farmers, faster.
        </p>

        <div className="extension-layout">
          <div className="extension-features">
            {EXTENSION_FEATURES.map(({ Icon, title, desc }) => (
              <div key={title} className="extension-feature">
                <div className="extension-feature__icon" aria-hidden="true"><Icon size={20} /></div>
                <div>
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="extension-concept">
            <div className="extension-concept__card">
              <h3 className="extension-concept__title">AI as your assistant</h3>
              <p>
                A single extension officer can serve dozens — or hundreds — of farmers.
                AI handles the routine screening. You handle the complex cases.
              </p>
              <div className="extension-concept__flow">
                {FLOW.map(({ Icon, label }, i) => (
                  <div key={label}>
                    <div className="extension-concept__node">
                      <div className="extension-concept__node-icon" aria-hidden="true"><Icon size={16} /></div>
                      <span>{label}</span>
                    </div>
                    {i < FLOW.length - 1 && <div className="extension-concept__arrow" aria-hidden="true" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
