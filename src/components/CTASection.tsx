import { IconArrowRight } from './Icons';
import { useRouter } from '../router';

export default function CTASection() {
  const { navigate } = useRouter();
  return (
    <section className="section cta-section" id="cta" aria-labelledby="cta-heading">
      <div className="container">
        <div className="cta-inner">
          <div className="section__label" style={{ color: 'rgba(255,255,255,0.6)' }}>GET STARTED</div>
          <h2 id="cta-heading" className="cta-section__title">
            Give every farmer a smarter way<br />to understand their crops.
          </h2>
          <p className="cta-section__sub">
            Start with a single leaf. Build toward a more connected, data-driven future
            for African agriculture.
          </p>
          <div className="cta-section__actions">
            <button className="btn btn--white btn--large" onClick={() => navigate('/product')}>
              Try Crop Diagnosis
              <IconArrowRight size={16} />
            </button>
            <a href="mailto:partners@smartfarmer.ai" className="btn btn--outline-white btn--large">
              Partner With Us
            </a>
          </div>
          <p className="cta-section__note">Free to try · No account required · Built for African farmers</p>
        </div>
      </div>
    </section>
  );
}
