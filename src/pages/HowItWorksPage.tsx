import PageHeader from '../components/PageHeader';
import HowItWorks from '../components/HowItWorks';
import ProductDemo from '../components/ProductDemo';
import FarmerBenefits from '../components/FarmerBenefits';
import OfflineSection from '../components/OfflineSection';
import CTASection from '../components/CTASection';

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="HOW IT WORKS"
        title="From leaf photo to farming decision."
        subtitle="Four simple steps. No agricultural training required. Smart Farmer puts AI-powered crop guidance in the hands of every farmer."
      />
      <HowItWorks />
      <ProductDemo />
      <FarmerBenefits />
      <OfflineSection />
      <CTASection />
    </>
  );
}
