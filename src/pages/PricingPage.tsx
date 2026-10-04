import { useRouter } from '../router';
import PageHeader from '../components/PageHeader';
import CTASection from '../components/CTASection';
import {
  IconCheck, IconX, IconStar, IconArrowRight,
  IconShield, IconInfo,
} from '../components/Icons';

const FREE_FEATURES = [
  { text: '3 crop scans per day', included: true },
  { text: '5 AI assistant credits per day', included: true },
  { text: 'Scan history: last 30 days', included: true },
  { text: 'Basic 7-day weather forecast', included: true },
  { text: 'Nearby outbreak summary', included: true },
  { text: 'English, Luganda & Runyankole', included: true },
  { text: 'No payment required', included: true },
  { text: 'Full lifetime scan history', included: false },
  { text: 'Downloadable scan reports', included: false },
  { text: 'Proactive weather alerts', included: false },
  { text: 'Priority extension escalation', included: false },
];

const PRO_FEATURES = [
  { text: '30 crop scans per month', included: true },
  { text: '50 AI assistant credits per month', included: true },
  { text: 'Full scan history — lifetime', included: true },
  { text: 'Extended forecast + proactive alerts', included: true },
  { text: 'Faster & richer outbreak alerts', included: true },
  { text: 'Downloadable scan reports', included: true },
  { text: 'Priority extension officer escalation', included: true },
  { text: 'No ads or promotional interruptions', included: true },
  { text: 'Configurable quotas (admin)', included: true },
];

export default function PricingPage() {
  const { navigate } = useRouter();

  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Simple, honest pricing"
        subtitle="Start free. Upgrade when you need more scans, deeper insights, and priority features. No hidden fees."
      />

      <section className="section pricing-section">
        <div className="container">
          <div className="pricing-grid">
            {/* Free */}
            <div className="pricing-card">
              <div className="pricing-card__header">
                <h3 className="pricing-card__name">Free</h3>
                <div className="pricing-card__price">
                  <span className="pricing-card__amount">Free</span>
                  <span className="pricing-card__period">forever</span>
                </div>
                <p className="pricing-card__desc">
                  For farmers who want to start using AI crop diagnosis with no commitment.
                </p>
              </div>
              <ul className="pricing-feature-list">
                {FREE_FEATURES.map(f => (
                  <li key={f.text} className={`pricing-feature${!f.included ? ' pricing-feature--no' : ''}`}>
                    {f.included
                      ? <IconCheck size={14} className="pricing-feature__icon pricing-feature__icon--ok" />
                      : <IconX size={14} className="pricing-feature__icon pricing-feature__icon--no" />
                    }
                    {f.text}
                  </li>
                ))}
              </ul>
              <button
                className="btn btn--ghost pricing-card__cta"
                onClick={() => navigate('/signup')}
              >
                Create Free Account <IconArrowRight size={14} />
              </button>
            </div>

            {/* Pro */}
            <div className="pricing-card pricing-card--pro">
              <div className="pricing-card__badge">
                <IconStar size={12} /> Most popular
              </div>
              <div className="pricing-card__header">
                <h3 className="pricing-card__name">Pro</h3>
                <div className="pricing-card__price">
                  <span className="pricing-card__amount">UGX 15,000</span>
                  <span className="pricing-card__period">/month</span>
                </div>
                <p className="pricing-card__desc">
                  For serious smallholder farmers and cooperative members who rely on SmartFarmer regularly.
                </p>
              </div>
              <ul className="pricing-feature-list">
                {PRO_FEATURES.map(f => (
                  <li key={f.text} className="pricing-feature">
                    <IconCheck size={14} className="pricing-feature__icon pricing-feature__icon--ok" />
                    {f.text}
                  </li>
                ))}
              </ul>
              <button
                className="btn btn--primary pricing-card__cta"
                onClick={() => navigate('/signup')}
              >
                Get Started — Free Trial <IconArrowRight size={14} />
              </button>
              <div className="pricing-billing-note">
                <IconInfo size={12} />
                Payment processing setup required. Contact us at{' '}
                <a href="mailto:billing@smartfarmer.ai">billing@smartfarmer.ai</a>
              </div>
            </div>
          </div>

          {/* Enterprise */}
          <div className="pricing-enterprise">
            <div className="pricing-enterprise__icon"><IconShield size={28} /></div>
            <div>
              <h3>Cooperatives, NGOs &amp; Government</h3>
              <p>
                Custom pricing for organisations needing multi-farm dashboards, bulk onboarding,
                API access, and aggregated reporting. Limits are configurable per deployment.
              </p>
            </div>
            <a href="mailto:partners@smartfarmer.ai" className="btn btn--ghost">
              Contact Us <IconArrowRight size={14} />
            </a>
          </div>

          {/* FAQ strip */}
          <div className="pricing-faq">
            <h3 className="pricing-faq__title">Common questions</h3>
            <div className="pricing-faq__grid">
              {[
                {
                  q: 'Do I need to pay to start?',
                  a: 'No. The Free plan is available immediately with no payment required. Create an account and start scanning.',
                },
                {
                  q: 'What counts as a scan?',
                  a: 'A scan is counted only when an image is successfully submitted for analysis. Failed uploads, network errors, and retries are not charged.',
                },
                {
                  q: 'Can I cancel Pro anytime?',
                  a: 'Yes. Cancel at any time from your account settings. Your data remains accessible for 30 days after cancellation.',
                },
                {
                  q: 'Is the AI diagnosis accurate?',
                  a: 'AI results are a screening assessment, not a laboratory diagnosis. Accuracy varies by image quality and disease stage. Always confirm with your extension officer for important decisions.',
                },
              ].map(item => (
                <div key={item.q} className="pricing-faq__item">
                  <strong>{item.q}</strong>
                  <p>{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI disclaimer */}
          <div className="pricing-disclaimer">
            <IconShield size={14} />
            <p>
              AI assessments support, but do not replace, qualified agricultural advice or local extension officers.
              SmartFarmer is a decision-support tool — always consult a professional for high-risk or unclear situations.
            </p>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
