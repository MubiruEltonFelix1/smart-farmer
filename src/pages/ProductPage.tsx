import PageHeader from '../components/PageHeader';
import SolutionSection from '../components/SolutionSection';
import ProductDemo from '../components/ProductDemo';
import CropCoverage from '../components/CropCoverage';
import DashboardPreview from '../components/DashboardPreview';
import CTASection from '../components/CTASection';

export default function ProductPage() {
  return (
    <>
      <PageHeader
        eyebrow="PRODUCT"
        title="Agricultural expertise, in your pocket."
        subtitle="Smart Farmer turns a crop leaf photograph into an actionable diagnosis. Take a photo, understand the problem, know what to do next."
      />
      <SolutionSection />
      <ProductDemo />
      <CropCoverage />
      <DashboardPreview />
      <CTASection />
    </>
  );
}
