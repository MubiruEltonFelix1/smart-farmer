import { useState } from 'react';
import { FAQ_ITEMS } from '../data';
import { IconChevronDown } from './Icons';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="section faq-section" id="faq" aria-labelledby="faq-heading">
      <div className="container">
        <div className="section__label">FAQ</div>
        <h2 id="faq-heading" className="section__title">Common questions.</h2>
        <p className="section__subtitle">
          Answers to what farmers, partners, and investors most commonly ask.
        </p>

        <div className="faq-list" role="list">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className={`faq-item${isOpen ? ' faq-item--open' : ''}`} role="listitem">
                <button
                  className="faq-item__question"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-q-${i}`}
                >
                  <span>{item.question}</span>
                  <span className="faq-item__chevron" aria-hidden="true">
                    <IconChevronDown size={18} className={isOpen ? 'faq-chevron--open' : ''} />
                  </span>
                </button>
                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className="faq-item__answer"
                  style={{ maxHeight: isOpen ? '400px' : '0', opacity: isOpen ? 1 : 0 }}
                >
                  <div className="faq-item__answer-inner">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
