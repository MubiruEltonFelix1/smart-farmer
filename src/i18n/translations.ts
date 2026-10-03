/**
 * translations.ts — UI strings for the crop diagnosis page.
 *
 * Supported locales:
 *   en  — English
 *   lg  — Luganda (Central Uganda / Buganda region)
 *   nyn — Runyankole (Western Uganda / Ankole region)
 */

export type Locale = 'en' | 'lg' | 'nyn';

export interface DiagnosisTranslations {
  // Language selector
  languageLabel: string;

  // Page hero
  heroTitle: string;
  heroSubtitle: string;

  // Upload box
  uploadTitle: string;
  uploadSub: string;
  btnUpload: string;
  btnTakePhoto: string;
  btnDemoImage: string;
  uploadNote: string;

  // Preview state
  imageReady: string;
  btnAnalyze: string;
  btnChooseDifferent: string;

  // Analyzing state
  analyzingTitle: string;
  analyzingSub: string;

  // Result
  confidence: string;
  severity: string;
  recommendedActions: string;
  disclaimer: string;
  btnAnalyzeAnother: string;

  // Error
  errorTitle: string;
  btnTryAgain: string;

  // Side panel
  whatAILooksFor: string;
  leafDiscolouration: string;
  leafDiscolourationDesc: string;
  lesionPatterns: string;
  lesionPatternsDesc: string;
  textureChanges: string;
  textureChangesDesc: string;
  structuralDamage: string;
  structuralDamageDesc: string;
  tipsTitle: string;
  tip1: string;
  tip2: string;
  tip3: string;
  tip4: string;

  // Supported crops section
  supportedCropsTitle: string;
  supportedCropsSub: string;
  cropAvailable: string;
  cropComingSoon: string;
  cropResearch: string;
  detectableConditions: string;
  conditionsInDev: string;
  tryWithCrop: string;
  btnTryDiagnosis: string;
  comingSoonNote: string;
}

const en: DiagnosisTranslations = {
  languageLabel: 'Language',

  heroTitle: 'Crop Disease Diagnosis',
  heroSubtitle: 'Take or upload a photo of a crop leaf. The AI will identify the disease and tell you what to do.',

  uploadTitle: 'Upload a crop leaf photo',
  uploadSub: 'Drag and drop, or use the buttons below',
  btnUpload: 'Upload Image',
  btnTakePhoto: 'Take Photo',
  btnDemoImage: 'Use Demo Image',
  uploadNote: 'JPEG, PNG or WebP · Max 10 MB',

  imageReady: 'Image ready for analysis',
  btnAnalyze: 'Analyze Crop',
  btnChooseDifferent: 'Choose a different image',

  analyzingTitle: 'Analyzing crop…',
  analyzingSub: 'AI is examining leaf patterns and visual symptoms',

  confidence: 'Confidence',
  severity: 'Severity',
  recommendedActions: 'Recommended actions',
  disclaimer: 'AI-generated assessment — verify important decisions with local agricultural expertise.',
  btnAnalyzeAnother: 'Analyze another crop',

  errorTitle: "Couldn't complete the analysis",
  btnTryAgain: 'Try Again',

  whatAILooksFor: 'What the AI looks for',
  leafDiscolouration: 'Leaf discolouration',
  leafDiscolourationDesc: 'Yellowing, browning, or unusual colour patterns',
  lesionPatterns: 'Lesion patterns',
  lesionPatternsDesc: 'Spots, streaks, or necrotic areas on the leaf surface',
  textureChanges: 'Texture changes',
  textureChangesDesc: 'Mosaic patterns, distortion, or unusual surface texture',
  structuralDamage: 'Structural damage',
  structuralDamageDesc: 'Wilting, curling, or deformation of leaf structure',
  tipsTitle: 'Tips for better results',
  tip1: 'Use natural daylight, not flash',
  tip2: 'Focus on the most affected leaf',
  tip3: 'Fill the frame with the leaf',
  tip4: 'Avoid blurry or dark images',

  supportedCropsTitle: 'Supported Crops',
  supportedCropsSub: 'The AI can diagnose diseases across these crops. Tap any crop to see the detectable conditions.',
  cropAvailable: 'Available',
  cropComingSoon: 'Coming Soon',
  cropResearch: 'Research',
  detectableConditions: 'Detectable conditions:',
  conditionsInDev: 'Conditions under development:',
  tryWithCrop: 'Ready to diagnose your crop?',
  btnTryDiagnosis: 'Try Crop Diagnosis',
  comingSoonNote: 'This crop is on our development roadmap. We\'ll notify partners when it\'s available.',
};

const lg: DiagnosisTranslations = {
  languageLabel: 'Olulimi',

  heroTitle: 'Okukebera Obulwadde bw\'Ebimera',
  heroSubtitle: 'Fotografa oba yongereza ifaanana y\'ekileeba ky\'ekimera. AI ekiraba obulwadde era ekugamba eky\'okukola.',

  uploadTitle: 'Yongereza ifaanana y\'ekileeba ky\'ekimera',
  uploadSub: 'Siga wansi, oba kozesa batabani eri wansi',
  btnUpload: 'Yongereza Ifaanana',
  btnTakePhoto: 'Fotografa',
  btnDemoImage: 'Kozesa Ifaanana y\'Okugerageza',
  uploadNote: 'JPEG, PNG oba WebP · Nkomerero 10 MB',

  imageReady: 'Ifaanana etegekeddwa okukebererwa',
  btnAnalyze: 'Kebera Ekimera',
  btnChooseDifferent: 'Londa ifaanana endala',

  analyzingTitle: 'Ekimera kikebererwa…',
  analyzingSub: 'AI ekebera endabika z\'ekileeba n\'obubonero bw\'obulwadde',

  confidence: 'Ekirowoozo',
  severity: 'Obukosedde',
  recommendedActions: 'Ebiragiro ebirungi',
  disclaimer: 'Ekirowoozo kya AI — kakasa emiramwa emikulembeze n\'abantu ab\'obusuubuzi bw\'olukumi.',
  btnAnalyzeAnother: 'Kebera ekimera ekiddako',

  errorTitle: 'Okukebera tekuggwerera',
  btnTryAgain: 'Gezaako Nate',

  whatAILooksFor: 'Eky\'AI kyenoonya',
  leafDiscolouration: 'Enkyukakyuka y\'omulala',
  leafDiscolourationDesc: 'Okufuuka omulembe, obutaka, oba endabika endala',
  lesionPatterns: 'Endabika z\'ebisago',
  lesionPatternsDesc: 'Amabala, emigga, oba ebitundu ebikomye ku luleeba',
  textureChanges: 'Enkyukakyuka y\'okwakira',
  textureChangesDesc: 'Endabika ya mosaic, okugobagoba, oba okwakira okwewuunya',
  structuralDamage: 'Okonooneka kw\'endabika',
  structuralDamageDesc: 'Okunyamira, okukyungubala, oba okonooneka kw\'ekileeba',
  tipsTitle: 'Ebiragiro by\'okufuna ebirungi',
  tip1: 'Kozesa omusana gw\'eggulo, si flash',
  tip2: 'Kendeeza ku kileeba ekisinga okonooneka',
  tip3: 'Jjuza ekifaananyi n\'ekileeba',
  tip4: 'Weewale amafaanani amatali mazima oba amafubyi',

  supportedCropsTitle: 'Ebimera Ebiweebwayo',
  supportedCropsSub: 'AI eyinza okukebera obulwadde mu bimera bino. Nyiga ekimera okirabe ebulwadde ebyeyinza okukeberebwa.',
  cropAvailable: 'Kiriwo',
  cropComingSoon: 'Kijja Mangu',
  cropResearch: 'Okukola Okutegeereza',
  detectableConditions: 'Ebulwadde ebyeyinza okukeberebwa:',
  conditionsInDev: 'Ebulwadde mu nkulaakulana:',
  tryWithCrop: 'Oyagala okukebera ekimera kyawe?',
  btnTryDiagnosis: 'Gezaako Okukebera',
  comingSoonNote: 'Ekimera kino kiri mu ggendererwa lwaffe. Tubalangirira ab\'omukwaano bwe kikiriwo.',
};

const nyn: DiagnosisTranslations = {
  languageLabel: 'Orurimi',

  heroTitle: 'Okushwera Endwara y\'Ebihingwa',
  heroSubtitle: 'Fota oba yunjura ifoto y\'orubaaho rw\'ekihingwa. AI eishwera endwara era ekubwira ekikukora.',

  uploadTitle: 'Yunjura ifoto y\'orubaaho rw\'ekihingwa',
  uploadSub: 'Teeka wansi, oba kozesa ebuto eiri wansi',
  btnUpload: 'Yunjura Ifoto',
  btnTakePhoto: 'Fota',
  btnDemoImage: 'Kozesa Ifoto y\'Omugerageza',
  uploadNote: 'JPEG, PNG oba WebP · Nkozeso 10 MB',

  imageReady: 'Ifoto etegekeirwe okushwerwa',
  btnAnalyze: 'Shwera Ekihingwa',
  btnChooseDifferent: 'Hanga ifoto ndiijo',

  analyzingTitle: 'Ekihingwa kishwerwa…',
  analyzingSub: 'AI eshwera ebishusho by\'orubaaho n\'ebimanyisyo by\'endwara',

  confidence: 'Obusingye',
  severity: 'Obukome',
  recommendedActions: 'Ebikorwa ebiragirwa',
  disclaimer: 'Eshongore ya AI — kakasa emiramwa mishasha n\'abashwezi b\'ebirime.',
  btnAnalyzeAnother: 'Shwera ekihingwa ekindi',

  errorTitle: 'Okushwera tekwahikire',
  btnTryAgain: 'Gezaho Nongera',

  whatAILooksFor: 'Eky\'AI ekishaka',
  leafDiscolouration: 'Okuhinduka kw\'orubaaho',
  leafDiscolourationDesc: 'Okufuuka omulembe, obutaka, oba ebishusho ebisingaho',
  lesionPatterns: 'Ebishusho by\'ebisago',
  lesionPatternsDesc: 'Amabara, emigga, oba ebitundu ebipfire ku rubaaho',
  textureChanges: 'Okuhinduka kw\'okwakira',
  textureChangesDesc: 'Ebishusho bya mosaic, okunabuka, oba okwakira okwetaagaho',
  structuralDamage: 'Okonona kw\'ebishusho',
  structuralDamageDesc: 'Okwebumba, okugotama, oba okonona kw\'orubaaho',
  tipsTitle: 'Amahugurizo g\'okufuna ebirungi',
  tip1: 'Kozesa oruhanga rw\'enjuba, si flash',
  tip2: 'Kendeera ku rubaaho rwerukire okonona',
  tip3: 'Jura ifoto n\'orubaaho',
  tip4: 'Irinda amafoto atagaragara neza oba amafubyi',

  supportedCropsTitle: 'Ebihingwa Ebiweebwaho',
  supportedCropsSub: 'AI irashobora okushwera endwara muri ebihingwa bibi. Nyiga ekihingwa uribone endwara ezirashobora okushwerwa.',
  cropAvailable: 'Kiriho',
  cropComingSoon: 'Kijja Mangu',
  cropResearch: 'Okunoonyereza',
  detectableConditions: 'Endwara ezirashobora okushwerwa:',
  conditionsInDev: 'Endwara mu nkulaakulana:',
  tryWithCrop: 'Oyagana okushwera ekihingwa kyawe?',
  btnTryDiagnosis: 'Gezaho Okushwera',
  comingSoonNote: 'Ekihingwa kino kiri mu mugambi gwaitu. Turabwira abavugizi nibikiriho.',
};

export const TRANSLATIONS: Record<Locale, DiagnosisTranslations> = { en, lg, nyn };

export const LOCALE_LABELS: Record<Locale, string> = {
  en:  'English',
  lg:  'Luganda',
  nyn: 'Runyankole',
};
