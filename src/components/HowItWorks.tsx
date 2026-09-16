import { IconCamera, IconBrain, IconBarChart, IconCheck, IconInfo } from './Icons';

const STEPS = [
  {
    number: '01',
    title: 'Take a photo',
    description: 'Point your phone at the affected crop leaf and take a clear, well-lit picture. The closer and sharper, the better the analysis.',
    Icon: IconCamera,
    visual: (
      <div className="step-visual step-visual--camera" aria-label="Camera interface">
        <div className="camera-ui">
          <div className="camera-ui__viewfinder">
            <div className="camera-ui__corner camera-ui__corner--tl" />
            <div className="camera-ui__corner camera-ui__corner--tr" />
            <div className="camera-ui__corner camera-ui__corner--bl" />
            <div className="camera-ui__corner camera-ui__corner--br" />
            <div className="camera-ui__center-dot" />
          </div>
          <div className="camera-ui__controls">
            <div className="camera-ui__btn" aria-hidden="true" />
          </div>
        </div>
      </div>
    ),
  },
  {
    number: '02',
    title: 'AI analyzes the crop',
    description: 'Our machine-learning system processes the image, examining leaf color, texture, and patterns associated with crop disease symptoms.',
    Icon: IconBrain,
    visual: (
      <div className="step-visual step-visual--scan" aria-label="AI scanning animation">
        <div className="scan-ui">
          <div className="scan-ui__rings">
            <div className="scan-ui__ring scan-ui__ring--1" />
            <div className="scan-ui__ring scan-ui__ring--2" />
            <div className="scan-ui__ring scan-ui__ring--3" />
          </div>
          <div className="scan-ui__center"><IconBrain size={22} /></div>
          <div className="scan-ui__bars">
            <div className="scan-ui__bar" style={{ width: '80%' }} />
            <div className="scan-ui__bar" style={{ width: '60%' }} />
            <div className="scan-ui__bar" style={{ width: '90%' }} />
          </div>
        </div>
      </div>
    ),
  },
  {
    number: '03',
    title: 'Understand the result',
    description: 'Receive a clear AI assessment with a confidence level, severity indicator, and condition name presented in plain language.',
    Icon: IconBarChart,
    visual: (
      <div className="step-visual step-visual--result" aria-label="Diagnosis result card">
        <div className="result-mini">
          <div className="result-mini__header">
            <span className="result-mini__crop">Cassava</span>
            <span className="result-mini__conf">94%</span>
          </div>
          <div className="result-mini__condition">Cassava Mosaic Disease</div>
          <div className="result-mini__severity result-mini__severity--moderate">Moderate · Potentially affected</div>
          <div className="result-mini__bar">
            <div className="result-mini__bar-fill" style={{ width: '94%' }} />
          </div>
        </div>
      </div>
    ),
  },
  {
    number: '04',
    title: 'Take action',
    description: 'Follow practical, step-by-step recommendations. Know what to inspect, what to remove, and when to seek expert advice.',
    Icon: IconCheck,
    visual: (
      <div className="step-visual step-visual--actions" aria-label="Recommended actions list">
        <div className="actions-mini">
          <p className="actions-mini__title">What you can do</p>
          <ul>
            {['Inspect nearby plants', 'Remove affected leaves', 'Monitor the field', 'Contact extension officer'].map(a => (
              <li key={a}><IconCheck size={12} className="actions-mini__check" />{a}</li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="section how-section" id="how-it-works" aria-labelledby="how-heading">
      <div className="container">
        <div className="section__label">HOW IT WORKS</div>
        <h2 id="how-heading" className="section__title">
          From leaf photo to farming decision.
        </h2>
        <p className="section__subtitle">Four simple steps. No agricultural training required.</p>

        <div className="how-steps">
          {STEPS.map((step) => (
            <div key={step.number} className="how-step">
              <div className="how-step__number" aria-hidden="true">{step.number}</div>
              <div className="how-step__visual">{step.visual}</div>
              <div className="how-step__content">
                <div className="how-step__icon-wrap" aria-hidden="true"><step.Icon size={20} /></div>
                <h3 className="how-step__title">{step.title}</h3>
                <p className="how-step__desc">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="how-section__disclaimer">
          <IconInfo size={14} />
          AI results are intended to support farmers' decisions and should be combined with local agricultural expertise where appropriate.
        </p>
      </div>
    </section>
  );
}
