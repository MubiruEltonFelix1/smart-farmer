import PageHeader from '../components/PageHeader';
import TechnologySection from '../components/TechnologySection';
import DataSection from '../components/DataSection';
import InvestorVision from '../components/InvestorVision';
import CTASection from '../components/CTASection';

export default function TechnologyPage() {
  return (
    <>
      <PageHeader
        eyebrow="TECHNOLOGY"
        title="AI trained for the field, not just the lab."
        subtitle="Building machine learning that works in real African farming conditions — with the data quality, local context, and responsible governance to match."
      />
      <TechnologySection />
      <DataSection />
      <InvestorVision />
      <CTASection />
    </>
  );
}
