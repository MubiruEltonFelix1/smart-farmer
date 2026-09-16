import PageHeader from '../components/PageHeader';
import AfricaSection from '../components/AfricaSection';
import FAQ from '../components/FAQ';
import CTASection from '../components/CTASection';

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="ABOUT"
        title="Built around the realities of African farming."
        subtitle="We are building world-class AI technology for African conditions — mobile-first, low-bandwidth aware, multilingual, and farmer-centered from the ground up."
      />
      <AfricaSection />
      <FAQ />
      <CTASection />
    </>
  );
}
