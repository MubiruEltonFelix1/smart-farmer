import { useState } from 'react';
import ProductDemo from '../components/ProductDemo';
import DiagnosisCropList from '../components/DiagnosisCropList';
import CTASection from '../components/CTASection';
import type { Locale } from '../i18n/translations';

/**
 * ProductPage — the "Try Crop Diagnosis" destination.
 *
 * Layout order (intentional):
 *   1. Upload / Take Photo box  ← first thing the user sees
 *   2. Supported crops + detectable diseases
 *   3. CTA footer
 *
 * locale is lifted here so DiagnosisCropList stays in sync with
 * whatever language the user selects in ProductDemo.
 */
export default function ProductPage() {
  const [locale, setLocale] = useState<Locale>('en');

  return (
    <>
      <ProductDemo locale={locale} onLocaleChange={setLocale} />
      <DiagnosisCropList locale={locale} />
      <CTASection />
    </>
  );
}
