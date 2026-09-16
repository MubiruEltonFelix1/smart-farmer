import { IconUser } from './Icons';

const TESTIMONIALS = [
  { quote: '[Farmer testimonial goes here — to be added once collected from real users.]',             name: '[Farmer Name]',           location: '[District, Country]',       role: 'Cassava farmer' },
  { quote: '[Agricultural extension officer testimonial — to be added after field pilot.]',           name: '[Extension Officer Name]', location: '[Region, Country]',         role: 'Agricultural extension officer' },
  { quote: '[NGO programme officer testimonial — to be added after partnership launch.]',             name: '[Programme Officer Name]', location: '[Organisation, Country]',   role: 'NGO programme partner' },
];

export default function Testimonials() {
  return (
    <section className="section testimonials-section" id="testimonials" aria-labelledby="testimonials-heading">
      <div className="container">
        <div className="section__label">TESTIMONIALS</div>
        <h2 id="testimonials-heading" className="section__title">
          Farmers, extension officers,<br />and partners.
        </h2>
        <p className="section__subtitle">
          Testimonials will be published here once collected from real users.
          All quotes shown are clearly marked as placeholders.
        </p>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-card__quote-mark" aria-hidden="true">"</div>
              <blockquote className="testimonial-card__quote">
                <p>{t.quote}</p>
                <footer className="testimonial-card__footer">
                  <div className="testimonial-card__avatar" aria-hidden="true">
                    <IconUser size={18} />
                  </div>
                  <div>
                    <cite className="testimonial-card__name">{t.name}</cite>
                    <div className="testimonial-card__location">{t.location}</div>
                    <div className="testimonial-card__role">{t.role}</div>
                  </div>
                </footer>
              </blockquote>
              <div className="testimonial-card__placeholder-note">Placeholder — real testimonial pending</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
