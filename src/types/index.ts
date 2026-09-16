export interface DiagnosisResult {
  crop: string;
  disease: string;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Healthy';
  status: 'Healthy' | 'Potentially affected' | 'Affected' | 'Needs attention';
  recommendations: string[];
  imageUrl?: string;
  timestamp?: Date;
}

export interface CropCard {
  name: string;
  icon: string;
  color: string;
  diseases: string[];
  status: 'Available' | 'Coming Soon' | 'Research';
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface PartnerType {
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface TechPillar {
  title: string;
  description: string;
  icon: string;
}

export interface BenefitCard {
  title: string;
  description: string;
  icon: string;
}

export interface ImpactMetric {
  value: string;
  label: string;
  note?: string;
}
