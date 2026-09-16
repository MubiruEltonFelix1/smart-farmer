import type {
  CropCard,
  FAQItem,
  NavLink,
  PartnerType,
  TechPillar,
  BenefitCard,
  ImpactMetric,
  DiagnosisResult,
} from '../types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Product',      href: '/product' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Technology',   href: '/technology' },
  { label: 'Solutions',    href: '/solutions' },
  { label: 'About',        href: '/about' },
];

export const CROPS: CropCard[] = [
  {
    name: 'Cassava',
    icon: 'leaf',
    color: '#2d6a4f',
    diseases: ['Cassava Mosaic Disease', 'Cassava Brown Streak', 'Bacterial Blight'],
    status: 'Available',
  },
  {
    name: 'Maize',
    icon: 'sprout',
    color: '#e07b39',
    diseases: ['Maize Lethal Necrosis', 'Gray Leaf Spot', 'Northern Blight'],
    status: 'Coming Soon',
  },
  {
    name: 'Tomato',
    icon: 'sun',
    color: '#c1440e',
    diseases: ['Early Blight', 'Late Blight', 'Leaf Curl Virus'],
    status: 'Coming Soon',
  },
  {
    name: 'Beans',
    icon: 'droplets',
    color: '#7f4f24',
    diseases: ['Angular Leaf Spot', 'Bean Mosaic', 'Anthracnose'],
    status: 'Coming Soon',
  },
  {
    name: 'Banana',
    icon: 'mountain',
    color: '#d4a017',
    diseases: ['Banana Xanthomonas Wilt', 'Fusarium Wilt', 'Black Sigatoka'],
    status: 'Research',
  },
  {
    name: 'Potato',
    icon: 'layers',
    color: '#8b7355',
    diseases: ['Late Blight', 'Early Blight', 'Bacterial Wilt'],
    status: 'Research',
  },
  {
    name: 'Coffee',
    icon: 'thermometer',
    color: '#6f4e37',
    diseases: ['Coffee Leaf Rust', 'CBD', 'Wilt Disease'],
    status: 'Research',
  },
  {
    name: 'Rice',
    icon: 'activity',
    color: '#a8b85c',
    diseases: ['Rice Blast', 'Bacterial Leaf Blight', 'Sheath Blight'],
    status: 'Research',
  },
];

export const TECH_PILLARS: TechPillar[] = [
  {
    title: 'Computer Vision',
    icon: 'eye',
    description:
      'Image-based analysis trained on crop leaf photographs to detect visual patterns associated with disease symptoms.',
  },
  {
    title: 'Machine Learning',
    icon: 'brain',
    description:
      'Models trained and evaluated on crop disease imagery, continuously improving with higher-quality, more representative field data.',
  },
  {
    title: 'Agricultural Intelligence',
    icon: 'leaf',
    description:
      'Transforms raw detection outputs into practical, contextually relevant recommendations that farmers can act on.',
  },
  {
    title: 'Farmer-Centered UX',
    icon: 'smartphone',
    description:
      'Designed to work for users across varying levels of digital literacy, with a mobile-first interface and clear language.',
  },
];

export const FARMER_BENEFITS: BenefitCard[] = [
  {
    icon: 'scan',
    title: 'Detect Earlier',
    description:
      'Identify potential disease symptoms before problems spread across the field and damage your entire crop.',
  },
  {
    icon: 'zap',
    title: 'Decide Faster',
    description:
      'Get useful information without waiting days for an extension officer or agricultural expert to be available.',
  },
  {
    icon: 'target',
    title: 'Reduce Uncertainty',
    description:
      'Turn an image of a suspicious leaf into structured, actionable information you can use right away.',
  },
  {
    icon: 'shield',
    title: 'Protect Your Yield',
    description:
      'Support better crop-management decisions designed to reduce unnecessary crop losses throughout the season.',
  },
  {
    icon: 'barChart',
    title: 'Learn Over Time',
    description:
      'Build a digital history of your farm observations across planting seasons and crop cycles.',
  },
  {
    icon: 'users',
    title: 'Stay Connected',
    description:
      'Link your diagnosis history to extension officers who can provide timely, informed follow-up support.',
  },
];

export const PARTNER_TYPES: PartnerType[] = [
  {
    title: 'Cooperatives',
    icon: 'users',
    description: 'Monitor crop health across all member farms from a single unified dashboard.',
    features: [
      'Member farm dashboards',
      'Aggregate disease alerts',
      'Bulk advisory distribution',
      'Crop health reports',
    ],
  },
  {
    title: 'NGOs',
    icon: 'globe',
    description: 'Deploy digital agricultural services at scale across your programme beneficiaries.',
    features: [
      'Programme monitoring',
      'Farmer onboarding tools',
      'Impact data collection',
      'Multi-region coverage',
    ],
  },
  {
    title: 'Governments',
    icon: 'building',
    description: 'Support national agricultural extension programmes and crop-disease surveillance.',
    features: [
      'Regional disease mapping',
      'Extension officer tools',
      'Early warning systems',
      'Policy-relevant insights',
    ],
  },
  {
    title: 'Agribusinesses',
    icon: 'package',
    description: 'Build farmer engagement and advisory services that strengthen your value chain.',
    features: [
      'Farmer advisory platform',
      'Input recommendation engine',
      'Supply chain intelligence',
      'Branded farmer tools',
    ],
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How does crop disease detection work?',
    answer:
      'The application uses computer vision and machine learning to analyze photographs of crop leaves. When you upload or capture an image, the AI model examines visual patterns in the leaf — such as discoloration, lesions, and texture changes — and compares them against patterns learned from crop disease imagery to produce an assessment.',
  },
  {
    question: 'What crops can the app analyze?',
    answer:
      'Cassava is the initial supported crop, with detection models actively developed and validated. Additional crops including maize, tomato, beans, banana, potato, coffee, and rice are on the roadmap as research and model development progresses.',
  },
  {
    question: 'Does the app replace agricultural experts?',
    answer:
      'No. Smart Farmer is designed to support farmers and agricultural professionals, not replace them. The AI provides an initial assessment and practical guidance. For important decisions, we always recommend consulting a qualified local agricultural extension officer or specialist.',
  },
  {
    question: 'How accurate is the AI?',
    answer:
      'Accuracy depends on several factors: image quality and lighting, crop variety, disease stage, and the representativeness of training data. We do not publish a single accuracy figure, as performance varies across conditions. We are committed to ongoing model evaluation and improvement using real field data.',
  },
  {
    question: 'Can I use it without internet?',
    answer:
      'Full offline AI inference is currently a roadmap feature. The current application requires internet connectivity to run crop analysis. We are actively designing for low-bandwidth environments and plan to support offline image capture with queued analysis in a future version.',
  },
  {
    question: 'Is my farm data private?',
    answer:
      'Yes. We are committed to farmer data privacy. Any data collected is handled with explicit consent, used only for the purposes stated, and never sold to third parties. Our full data policy and responsible AI principles are published on this site.',
  },
  {
    question: 'Which countries are supported?',
    answer:
      'Smart Farmer is being developed with an initial focus on Sub-Saharan African markets. Specific country availability will be published as the product launches. If you are interested in a specific country or region, contact us directly.',
  },
  {
    question: 'Can organisations integrate the technology?',
    answer:
      "Yes. We are building an API and platform offering for cooperatives, NGOs, governments, and agribusinesses. Integrations are currently available on a partnership basis. Reach out through our Partner With Us form to discuss your organisation's needs.",
  },
];

export const IMPACT_METRICS: ImpactMetric[] = [
  { value: '[X]', label: 'Farmers Reached',  note: 'placeholder' },
  { value: '[X]', label: 'Diagnoses Run',    note: 'placeholder' },
  { value: '[X]', label: 'Crop Types',       note: 'placeholder' },
  { value: '[X]', label: 'Regions',          note: 'placeholder' },
];

export const MOCK_DIAGNOSIS: DiagnosisResult = {
  crop: 'Cassava',
  disease: 'Cassava Mosaic Disease',
  confidence: 94,
  severity: 'Moderate',
  status: 'Potentially affected',
  recommendations: [
    'Inspect nearby plants for similar symptoms within the next 24–48 hours.',
    'Remove severely affected leaves where appropriate to reduce spread.',
    'Avoid moving plant material from affected areas to healthy parts of the farm.',
    'Monitor the field over the coming days and document any progression.',
    'Contact your local agricultural extension officer if symptoms persist or worsen.',
  ],
};

export const RECENT_DIAGNOSES = [
  { crop: 'Cassava', result: 'Mosaic Disease',  status: 'At Risk',        time: '2 hours ago' },
  { crop: 'Maize',   result: 'Healthy',         status: 'Healthy',        time: '1 day ago' },
  { crop: 'Tomato',  result: 'Early Blight',    status: 'Needs Attention',time: '3 days ago' },
  { crop: 'Cassava', result: 'Healthy',         status: 'Healthy',        time: '1 week ago' },
];
