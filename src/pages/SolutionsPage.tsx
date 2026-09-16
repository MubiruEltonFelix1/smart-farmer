import PageHeader from '../components/PageHeader';
import PartnerSection from '../components/PartnerSection';
import ExtensionSection from '../components/ExtensionSection';
import ImpactSection from '../components/ImpactSection';
import Testimonials from '../components/Testimonials';
import CTASection from '../components/CTASection';

export default function SolutionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="SOLUTIONS"
        title="From individual farms to agricultural ecosystems."
        subtitle="Smart Farmer is being built as a platform — not just an app. We work with cooperatives, NGOs, governments, and agribusinesses that serve African farmers at scale."
      />
      <PartnerSection />
      <ExtensionSection />
      <ImpactSection />
      <Testimonials />
      <CTASection />
    </>
  );
}
