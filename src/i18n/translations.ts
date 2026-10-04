/**
 * translations.ts — UI strings for the entire Smart Farmer site.
 *
 * Supported locales:
 *   en  — English
 *   lg  — Luganda (Central Uganda / Buganda region)
 *   nyn — Runyankole / Lunyankole (Western Uganda / Ankole region)
 *
 * NOTE: The original DiagnosisTranslations block is preserved unchanged.
 * SiteTranslations (added below) covers all other pages / components.
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
  removeImage: string;
  uploadedLeafAlt: string;

  // Analyzing state
  analyzingTitle: string;
  analyzingSub: string;
  analysisProgress: string;

  // Result
  confidence: string;
  severity: string;
  recommendedActions: string;
  disclaimer: string;
  btnAnalyzeAnother: string;

  // Error
  errorTitle: string;
  btnTryAgain: string;
  errInvalidType: string;
  errTooLarge: string;
  errNetwork: string;
  errServer: string;
  errImageTooLarge: string;
  errAnalyzeFailed: string;
  errDemoMissing: string;
  errDemoRead: string;

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
  supportedCropsLabel: string;
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
  removeImage: 'Remove image',
  uploadedLeafAlt: 'Uploaded crop leaf',

  analyzingTitle: 'Analyzing crop…',
  analyzingSub: 'AI is examining leaf patterns and visual symptoms',
  analysisProgress: 'Analysis progress',

  confidence: 'Confidence',
  severity: 'Severity',
  recommendedActions: 'Recommended actions',
  disclaimer: 'AI-generated assessment — verify important decisions with local agricultural expertise.',
  btnAnalyzeAnother: 'Analyze another crop',

  errorTitle: "Couldn't complete the analysis",
  btnTryAgain: 'Try Again',
  errInvalidType: 'Please use a JPEG, PNG, or WebP image.',
  errTooLarge: 'Image must be smaller than 10 MB.',
  errNetwork: 'Unable to reach the analysis server. Check your internet connection and try again.',
  errServer: 'The analysis service is not ready yet. Please try again shortly.',
  errImageTooLarge: 'Image is too large. Please use an image under 10 MB.',
  errAnalyzeFailed: "We couldn't analyze this image. Try a clearer photo of the leaf in good lighting.",
  errDemoMissing: 'The sample image is missing from this build. Please upload your own leaf photo.',
  errDemoRead: 'Could not read the sample image.',

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

  supportedCropsLabel: 'Supported crops',
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

  heroTitle: 'Okukebera Obulwadde bw\'Ebirime',
  heroSubtitle: 'Kwata oba teeka ekifaananyi ky\'olulagala lw\'ekimera. AI ejja kulaba obulwadde era n\'ekugamba ky\'okukola.',

  uploadTitle: 'Teeka ekifaananyi ky\'olulagala lw\'ekimera',
  uploadSub: 'Sika osuule wano, oba kozesa amapeesa wansi',
  btnUpload: 'Teeka Ekifaananyi',
  btnTakePhoto: 'Kwata Ekifaananyi',
  btnDemoImage: 'Kozesa Ekifaananyi Eky\'okugezesa',
  uploadNote: 'JPEG, PNG oba WebP · Tekisukka 10 MB',

  imageReady: 'Ekifaananyi kitegekeddwa okukeberwa',
  btnAnalyze: 'Kebera Ekimera',
  btnChooseDifferent: 'Londa ekifaananyi ekirala',
  removeImage: 'Ggyawo ekifaananyi',
  uploadedLeafAlt: 'Olulagala oluteekeddwa',

  analyzingTitle: 'Tukebera ekimera…',
  analyzingSub: 'AI eraba endabika y\'olulagala n\'obubonero bw\'obulwadde',
  analysisProgress: 'Enkulaakulana y\'okukebera',

  confidence: 'Obukakafu',
  severity: 'Obuzito',
  recommendedActions: 'Eby\'okukola',
  disclaimer: 'Kino kiva ku AI — kakasa eby\'amakulu n\'abakozi b\'ebyobulimi mu kitundu kyo.',
  btnAnalyzeAnother: 'Kebera ekimera ekirala',

  errorTitle: 'Okukebera tekusobose',
  btnTryAgain: 'Ddamu Ogezeeko',
  errInvalidType: 'Kozesa ekifaananyi kya JPEG, PNG, oba WebP.',
  errTooLarge: 'Ekifaananyi kiteekwa okuba wansi wa 10 MB.',
  errNetwork: 'Tetusobola kutuuka ku kompyuta. Kebera yintaneeti oddemu ogezeeko.',
  errServer: 'Okukebera tekunnategeka. Ddamu ogezeeko mu katono.',
  errImageTooLarge: 'Ekifaananyi kinene nnyo. Kozesa ekiri wansi wa 10 MB.',
  errAnalyzeFailed: 'Tetusobose kukebera ekifaananyi kino. Kwata olulagala olwolekera obulungi mu musana.',
  errDemoMissing: 'Ekifaananyi eky\'okugezesa tekiriwo. Teeka ekifaananyi kyo ky\'olulagala.',
  errDemoRead: 'Tetusobose kusoma ekifaananyi eky\'okugezesa.',

  whatAILooksFor: 'AI enoonya ki',
  leafDiscolouration: 'Olulagala okukyusa langi',
  leafDiscolourationDesc: 'Okufuuka kyenvu, okufuuka kitaka, oba langi ezitali za bulijjo',
  lesionPatterns: 'Amabala ku lulagala',
  lesionPatternsDesc: 'Amabala, emiggo, oba ebitundu ebyokye ku lulagala',
  textureChanges: 'Enkyukakyuka y\'olulagala',
  textureChangesDesc: 'Endabika eya mosaic, okugobagoba, oba olulagala olutalabika bulungi',
  structuralDamage: 'Okonooneka kw\'olulagala',
  structuralDamageDesc: 'Okunafuwa, okukyusa, oba olulagala okufuuka obubi',
  tipsTitle: 'Eby\'okukola ofune ebirungi',
  tip1: 'Kozesa omusana, tokozesa flash',
  tip2: 'Kwata olulagala olusinga okukosebwa',
  tip3: 'Jjuza ekifaananyi n\'olulagala',
  tip4: 'Weewale bifaananyi ebitasaana oba eby\'ekizikiza',

  supportedCropsLabel: 'Ebirime ebiweebwayo',
  supportedCropsTitle: 'Ebirime Ebiweebwayo',
  supportedCropsSub: 'AI esobola okukebera obulwadde ku birime bino. Nyiga ekimera olabe obulwadde obuyinza okukeberwa.',
  cropAvailable: 'Kiriwo',
  cropComingSoon: 'Kijja mangu',
  cropResearch: 'Okunoonyereza',
  detectableConditions: 'Obulwadde obuyinza okukeberwa:',
  conditionsInDev: 'Obulwadde obukyali mu nkulaakulana:',
  tryWithCrop: 'Oyagala okukebera ekimera kyo?',
  btnTryDiagnosis: 'Gezaako Okukebera',
  comingSoonNote: 'Ekimera kino kikyali mu nteekateeka yaffe. Tujja kulabula abo be tukolagana nabo bwe kinaabeerawo.',
};

const nyn: DiagnosisTranslations = {
  languageLabel: 'Orurimi',

  heroTitle: 'Okukebera Endwara y\'Ebihingwa',
  heroSubtitle: 'Kwata nari teeka ekishushani ky\'orubabi rw\'ekihingwa. AI neereeba endwara kandi neekugambira eky\'okukora.',

  uploadTitle: 'Teeka ekishushani ky\'orubabi rw\'ekihingwa',
  uploadSub: 'Sika oteeke aha, nari kozesa ebipeesa ebirikuheera ahaishi',
  btnUpload: 'Teeka Ekishushani',
  btnTakePhoto: 'Kwata Ekishushani',
  btnDemoImage: 'Kozesa Ekishushani ky\'Okugezaho',
  uploadNote: 'JPEG, PNG nari WebP · Tikahise 10 MB',

  imageReady: 'Ekishushani kitegekiire okukeberwa',
  btnAnalyze: 'Kebera Ekihingwa',
  btnChooseDifferent: 'Hitamu ekishushani ekindi',
  removeImage: 'Ihamu ekishushani',
  uploadedLeafAlt: 'Orubabi oruteekirwe',

  analyzingTitle: 'Nitukebera ekihingwa…',
  analyzingSub: 'AI neereeba orubabi n\'ebimanyiso by\'endwara',
  analysisProgress: 'Enkora y\'okukebera',

  confidence: 'Obwesigwa',
  severity: 'Obuhango',
  recommendedActions: 'Eby\'okukora',
  disclaimer: 'Eki kirikuva omu AI — kakasa eby\'omugasho n\'abakozi b\'ebyobuhingi omu kyaro kyawe.',
  btnAnalyzeAnother: 'Kebera ekihingwa ekindi',

  errorTitle: 'Okukebera tikuhikire',
  btnTryAgain: 'Garuka Ogezaho',
  errInvalidType: 'Kozesa ekishushani kya JPEG, PNG, nari WebP.',
  errTooLarge: 'Ekishushani kiteekwa kuba ahaishi ya 10 MB.',
  errNetwork: 'Titubaasa kuhika aha kompyuta. Reeba yintaneeti ogaruke ogezaho.',
  errServer: 'Okukebera tikyategeikaga. Garuka ogezaho hatari kare.',
  errImageTooLarge: 'Ekishushani kinihingi. Kozesa ekyahaishi ya 10 MB.',
  errAnalyzeFailed: 'Titubaasa kukebera ekishushani eki. Kwata orubabi orureebekaho gye omu mushana.',
  errDemoMissing: 'Ekishushani ky\'okugezaho tikiriho. Teeka ekishushani kyawe ky\'orubabi.',
  errDemoRead: 'Titubaasa kusoma ekishushani ky\'okugezaho.',

  whatAILooksFor: 'Ebi AI erireeba',
  leafDiscolouration: 'Orubabi okuhindura erangi',
  leafDiscolourationDesc: 'Okufuuka kyenvu, okufuuka kitaka, nari erangi ezitari za buriijo',
  lesionPatterns: 'Amabara aha rubabi',
  lesionPatternsDesc: 'Amabara, emigoye, nari ebitundu ebyokye aha rubabi',
  textureChanges: 'Okuhinduka kw\'orubabi',
  textureChangesDesc: 'Ebishushani nk\'eby\'akakyenkye, okugongobera, nari orubabi orutari rurungi',
  structuralDamage: 'Okuhata orubabi',
  structuralDamageDesc: 'Okunywagirira, okugotama, nari orubabi okuhinduka obubi',
  tipsTitle: 'Eby\'okukora ofune ebirungi',
  tip1: 'Kozesa omushana, otakozise flash',
  tip2: 'Kwata orubabi orurikukosebwa muno',
  tip3: 'Ijura ekishushani n\'orubabi',
  tip4: 'Irinda ebishushani ebitari byeru nari ebyomwirima',

  supportedCropsLabel: 'Ebihingwa ebiheebwa',
  supportedCropsTitle: 'Ebihingwa Ebiheebwa',
  supportedCropsSub: 'AI neebaasa okukebera endwara omu bihingwa ebi. Nyiga ekihingwa orebe endwara eziishobora okukeberwa.',
  cropAvailable: 'Kiriho',
  cropComingSoon: 'Kikwija',
  cropResearch: 'Okushwijuma',
  detectableConditions: 'Endwara eziishobora okukeberwa:',
  conditionsInDev: 'Endwara eziri omu nkora:',
  tryWithCrop: 'Noyenda okukebera ekihingwa kyawe?',
  btnTryDiagnosis: 'Gezaho Okukebera',
  comingSoonNote: 'Ekihingwa eki kikyari omu mugambi gwaitu. Nitwija kubwira abakwatanisa nari kiriho.',
};

export const TRANSLATIONS: Record<Locale, DiagnosisTranslations> = { en, lg, nyn };

export const LOCALE_LABELS: Record<Locale, string> = {
  en:  'English',
  lg:  'Luganda',
  nyn: 'Runyankole',
};

/** Display names for crops shown on the diagnosis page. */
export const CROP_NAMES: Record<Locale, Record<string, string>> = {
  en: {
    Cassava: 'Cassava',
    Maize: 'Maize',
    Tomato: 'Tomato',
    Banana: 'Banana',
    Potato: 'Potato',
    Coffee: 'Coffee',
    Rice: 'Rice',
    'Bell Pepper': 'Bell Pepper',
  },
  lg: {
    Cassava: 'Muwogo',
    Maize: 'Kasooli',
    Tomato: 'Ennyaanya',
    Banana: 'Amatooke',
    Potato: 'Poteto',
    Coffee: 'Emmwanyi',
    Rice: 'Omuceere',
    'Bell Pepper': 'Kaamulali',
  },
  nyn: {
    Cassava: 'Muhogo',
    Maize: 'Ekichooli',
    Tomato: 'Enyaanya',
    Banana: 'Ebitookye',
    Potato: 'Ebitakuri',
    Coffee: 'Emwani',
    Rice: 'Omucere',
    'Bell Pepper': 'Kaamulali',
  },
};

export const SEVERITY_LABELS: Record<Locale, Record<string, string>> = {
  en:  { Healthy: 'Healthy', Low: 'Low', Moderate: 'Moderate', High: 'High' },
  lg:  { Healthy: 'Mulamu', Low: 'Katono', Moderate: 'Wakati', High: 'Nnyingi' },
  nyn: { Healthy: 'Kiramu', Low: 'Gitono', Moderate: 'Hagati', High: 'Nyingi' },
};

export const STATUS_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    Healthy: 'Healthy',
    'Potentially affected': 'Potentially affected',
    Affected: 'Affected',
    'Needs attention': 'Needs attention',
  },
  lg: {
    Healthy: 'Mulamu',
    'Potentially affected': 'Kiyinza okuba nga kirwadde',
    Affected: 'Kirwadde',
    'Needs attention': 'Kyetaaga obujjanjabi',
  },
  nyn: {
    Healthy: 'Kiramu',
    'Potentially affected': 'Kirashobora kuba kirwaire',
    Affected: 'Kirwaire',
    'Needs attention': 'Kyeetaaga obuhungiro',
  },
};

export function cropName(locale: Locale, name: string): string {
  return CROP_NAMES[locale][name] ?? name;
}

export function severityLabel(locale: Locale, value: string): string {
  return SEVERITY_LABELS[locale][value] ?? value;
}

export function statusLabel(locale: Locale, value: string): string {
  return STATUS_LABELS[locale][value] ?? value;
}
