/**
 * translations.ts — Full UI string catalogue.
 *
 * Supported locales:
 *   en  — English
 *   lg  — Luganda   (Central Uganda / Buganda region)
 *   nyn — Runyankole (Western Uganda / Ankole region)
 *
 * Pattern: TRANSLATIONS[locale].key
 * Missing keys fall back to English automatically via the t() helper below.
 */

export type Locale = 'en' | 'lg' | 'nyn';

/* ─── Diagnosis-page strings (existing) ─────────────────── */
export interface DiagnosisTranslations {
  languageLabel: string;
  heroTitle: string;
  heroSubtitle: string;
  uploadTitle: string;
  uploadSub: string;
  btnUpload: string;
  btnTakePhoto: string;
  btnDemoImage: string;
  uploadNote: string;
  imageReady: string;
  btnAnalyze: string;
  btnChooseDifferent: string;
  analyzingTitle: string;
  analyzingSub: string;
  confidence: string;
  severity: string;
  recommendedActions: string;
  disclaimer: string;
  btnAnalyzeAnother: string;
  errorTitle: string;
  btnTryAgain: string;
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

/* ─── Portal-wide strings ───────────────────────────────── */
export interface PortalTranslations {
  /* Nav */
  navDashboard: string;
  navScan: string;
  navHistory: string;
  navWeather: string;
  navOutbreaks: string;
  navProfile: string;
  navAssistant: string;
  navPlans: string;
  navSettings: string;
  navSignOut: string;

  /* Auth */
  authSignIn: string;
  authSignUp: string;
  authCreateAccount: string;
  authWelcomeBack: string;
  authPhone: string;
  authEmail: string;
  authPassword: string;
  authOtp: string;
  authSendOtp: string;
  authVerifyOtp: string;
  authOrEmail: string;
  authForgotPassword: string;
  authNoAccount: string;
  authHaveAccount: string;
  authAgreeTo: string;
  authPrivacyPolicy: string;
  authTerms: string;
  authSigningIn: string;
  authCreating: string;
  authEmailPlaceholder: string;
  authPhonePlaceholder: string;
  authPasswordPlaceholder: string;

  /* Onboarding */
  onboardTitle: string;
  onboardSub: string;
  onboardStep1: string;
  onboardStep2: string;
  onboardStep3: string;
  onboardStep4: string;
  onboardFarmerName: string;
  onboardFarmerNamePlaceholder: string;
  onboardFarmName: string;
  onboardFarmNamePlaceholder: string;
  onboardDistrict: string;
  onboardSubCounty: string;
  onboardParish: string;
  onboardVillage: string;
  onboardGpsLabel: string;
  onboardGpsConsent: string;
  onboardCrops: string;
  onboardFarmSize: string;
  onboardFarmSizeUnit: string;
  onboardFarmingType: string;
  onboardConsentTitle: string;
  onboardConsentBody: string;
  onboardConsentCheck: string;
  onboardSkip: string;
  onboardNext: string;
  onboardBack: string;
  onboardFinish: string;
  onboardComplete: string;

  /* Dashboard */
  dashGreeting: string;
  dashScansUsed: string;
  dashScansOf: string;
  dashScanToday: string;
  dashChatCredits: string;
  dashCreditsLeft: string;
  dashRecentScans: string;
  dashNoScans: string;
  dashNearbyAlert: string;
  dashUpgrade: string;
  dashUpgradeSub: string;
  dashUpgradeBtn: string;
  dashWeatherLoading: string;
  dashWeatherError: string;
  dashViewAll: string;

  /* Scan */
  scanTitle: string;
  scanSub: string;
  scanSelectCrop: string;
  scanSymptomNotes: string;
  scanSymptomPlaceholder: string;
  scanAffectedArea: string;
  scanSaveHistory: string;
  scanShareDownload: string;
  scanAskAssistant: string;
  scanScanAnother: string;
  scanInconclusiveTitle: string;
  scanInconclusiveBody: string;
  scanLimitReached: string;
  scanLimitBody: string;
  scanVisibleSymptoms: string;
  scanNextSteps: string;
  scanPrevention: string;
  scanContactExtension: string;
  scanDisclaimerFull: string;
  scanSaved: string;

  /* History */
  historyTitle: string;
  historySub: string;
  historySearch: string;
  historyFilterCrop: string;
  historyFilterDisease: string;
  historyFilterSeverity: string;
  historyFilterDate: string;
  historyEmpty: string;
  historyDelete: string;
  historyDeleteConfirm: string;
  historyDownload: string;
  historyDetail: string;
  historyContributes: string;
  historyOptedOut: string;

  /* Weather */
  weatherTitle: string;
  weatherSub: string;
  weatherCurrent: string;
  weatherForecast: string;
  weatherAlerts: string;
  weatherNoAlerts: string;
  weatherLoading: string;
  weatherError: string;
  weatherRetry: string;
  weatherLastUpdated: string;
  weatherNoLocation: string;
  weatherSetLocation: string;
  weatherToday: string;
  weatherHumidity: string;
  weatherWind: string;
  weatherRainChance: string;
  weatherFarmAdvice: string;
  weatherStaleWarning: string;

  /* Outbreaks */
  outbreakTitle: string;
  outbreakSub: string;
  outbreakNone: string;
  outbreakReports: string;
  outbreakTrend: string;
  outbreakRising: string;
  outbreakStable: string;
  outbreakDeclining: string;
  outbreakAlertInfo: string;
  outbreakAlertWatch: string;
  outbreakAlertAttention: string;
  outbreakConfirmed: string;
  outbreakCommunityReport: string;
  outbreakPrivacyNote: string;
  outbreakThresholdNote: string;
  outbreakContactExtension: string;
  outbreakFilterCrop: string;
  outbreakFilterDisease: string;
  outbreakFilterDate: string;
  outbreakFilterLocation: string;

  /* Profile */
  profileTitle: string;
  profileSub: string;
  profileFarmerInfo: string;
  profileFarmDetails: string;
  profileLanguage: string;
  profileNotifications: string;
  profileConsent: string;
  profileSubscription: string;
  profileSave: string;
  profileSaving: string;
  profileSaved: string;
  profileAddFarm: string;
  profileVerified: string;
  profileUnverified: string;
  profileVerify: string;

  /* Assistant */
  assistantTitle: string;
  assistantSub: string;
  assistantPlaceholder: string;
  assistantSend: string;
  assistantCreditsLeft: string;
  assistantCreditWarning: string;
  assistantOutOfCredits: string;
  assistantGetMoreCredits: string;
  assistantTyping: string;
  assistantError: string;
  assistantDisclaimerTitle: string;
  assistantDisclaimerBody: string;
  assistantSuggest1: string;
  assistantSuggest2: string;
  assistantSuggest3: string;
  assistantSuggest4: string;
  assistantNewChat: string;
  assistantLanguageSwitch: string;

  /* Plans */
  plansTitle: string;
  plansSub: string;
  planFree: string;
  planPro: string;
  planCurrent: string;
  planUpgrade: string;
  planPerMonth: string;
  planFreePrice: string;
  planProPrice: string;
  planBillingSetupRequired: string;
  planCreditsBalance: string;
  planResetDate: string;
  planScansRemaining: string;
  planChatsRemaining: string;
  planCheckoutPlaceholder: string;

  /* Settings */
  settingsTitle: string;
  settingsSub: string;
  settingsLanguage: string;
  settingsNotifications: string;
  settingsWeatherAlerts: string;
  settingsOutbreakAlerts: string;
  settingsDataContribution: string;
  settingsDataContributionBody: string;
  settingsPrivacy: string;
  settingsExportData: string;
  settingsExportBody: string;
  settingsDeleteAccount: string;
  settingsDeleteBody: string;
  settingsDeleteConfirm: string;
  settingsSave: string;
  settingsSaved: string;

  /* General */
  loading: string;
  error: string;
  retry: string;
  save: string;
  cancel: string;
  close: string;
  confirm: string;
  delete: string;
  edit: string;
  add: string;
  back: string;
  next: string;
  done: string;
  optional: string;
  required: string;
  noData: string;
  upgrade: string;
  signIn: string;
  signOut: string;
  learnMore: string;
  contactExtension: string;
  aiDisclaimer: string;
}

export type AppTranslations = DiagnosisTranslations & PortalTranslations;

/* ══════════════════════════════════════════════════════════
   ENGLISH
   ══════════════════════════════════════════════════════════ */
const en: AppTranslations = {
  /* Diagnosis (existing) */
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
  comingSoonNote: "This crop is on our development roadmap. We'll notify partners when it's available.",

  /* Nav */
  navDashboard: 'Dashboard',
  navScan: 'Scan Crop Leaf',
  navHistory: 'Scan History',
  navWeather: 'Weather',
  navOutbreaks: 'Disease Outbreaks',
  navProfile: 'Farm Profile',
  navAssistant: 'AI Farm Assistant',
  navPlans: 'Plans & Credits',
  navSettings: 'Settings',
  navSignOut: 'Sign Out',

  /* Auth */
  authSignIn: 'Sign In',
  authSignUp: 'Create Account',
  authCreateAccount: 'Create Farmer Account',
  authWelcomeBack: 'Welcome back',
  authPhone: 'Phone Number',
  authEmail: 'Email Address',
  authPassword: 'Password',
  authOtp: 'Verification Code',
  authSendOtp: 'Send Code',
  authVerifyOtp: 'Verify Code',
  authOrEmail: 'Or use email and password',
  authForgotPassword: 'Forgot password?',
  authNoAccount: "Don't have an account?",
  authHaveAccount: 'Already have an account?',
  authAgreeTo: 'By signing up you agree to our',
  authPrivacyPolicy: 'Privacy Policy',
  authTerms: 'Terms of Use',
  authSigningIn: 'Signing in…',
  authCreating: 'Creating account…',
  authEmailPlaceholder: 'you@example.com',
  authPhonePlaceholder: '+256 7XX XXX XXX',
  authPasswordPlaceholder: 'At least 8 characters',

  /* Onboarding */
  onboardTitle: 'Set up your farmer profile',
  onboardSub: 'Help us personalise your experience. You can skip and complete this later.',
  onboardStep1: 'Your Details',
  onboardStep2: 'Farm Location',
  onboardStep3: 'Your Crops',
  onboardStep4: 'Data & Consent',
  onboardFarmerName: 'Full Name',
  onboardFarmerNamePlaceholder: 'Your name',
  onboardFarmName: 'Farm Name',
  onboardFarmNamePlaceholder: 'e.g. Kigezi Family Farm',
  onboardDistrict: 'District',
  onboardSubCounty: 'Sub-County',
  onboardParish: 'Parish',
  onboardVillage: 'Village',
  onboardGpsLabel: 'GPS Location',
  onboardGpsConsent: 'Allow SmartFarmer to record this device\'s approximate location to improve weather and outbreak features',
  onboardCrops: 'Main Crops Grown',
  onboardFarmSize: 'Farm Size',
  onboardFarmSizeUnit: 'Unit',
  onboardFarmingType: 'Farming Type (optional)',
  onboardConsentTitle: 'How we use your data',
  onboardConsentBody: 'SmartFarmer uses your scan images and approximate location to improve disease detection and generate anonymised local outbreak trends. Your personal details are never shared with other farmers. You can withdraw consent or delete your data at any time in Settings.',
  onboardConsentCheck: 'I understand and consent to SmartFarmer using my data as described above',
  onboardSkip: 'Skip for now',
  onboardNext: 'Next',
  onboardBack: 'Back',
  onboardFinish: 'Go to My Dashboard',
  onboardComplete: 'Profile set up',

  /* Dashboard */
  dashGreeting: 'Good morning',
  dashScansUsed: 'scans used',
  dashScansOf: 'of',
  dashScanToday: 'Scan a Crop Leaf',
  dashChatCredits: 'Chat credits',
  dashCreditsLeft: 'remaining today',
  dashRecentScans: 'Recent Scans',
  dashNoScans: 'No scans yet. Take a photo of a crop leaf to get started.',
  dashNearbyAlert: 'Nearby Disease Alert',
  dashUpgrade: 'Get more with Pro',
  dashUpgradeSub: 'Unlock 30 scans/month, full history, and priority alerts.',
  dashUpgradeBtn: 'View Plans',
  dashWeatherLoading: 'Loading weather…',
  dashWeatherError: 'Weather unavailable',
  dashViewAll: 'View all',

  /* Scan */
  scanTitle: 'Scan Crop Leaf',
  scanSub: 'Take or upload a photo of the affected leaf for AI analysis.',
  scanSelectCrop: 'Crop type',
  scanSymptomNotes: 'Symptom notes (optional)',
  scanSymptomPlaceholder: 'Describe what you see, e.g. yellow spots on lower leaves since last week',
  scanAffectedArea: 'Estimated affected area (%)',
  scanSaveHistory: 'Save to History',
  scanShareDownload: 'Download Report',
  scanAskAssistant: 'Ask the Assistant',
  scanScanAnother: 'Scan Another Leaf',
  scanInconclusiveTitle: 'Unable to determine reliably',
  scanInconclusiveBody: 'The image quality or symptoms are not clear enough for a confident result. Please take a clearer photo in good light, or consult a local extension officer.',
  scanLimitReached: 'Daily scan limit reached',
  scanLimitBody: 'You have used all your free scans for today. Upgrade to Pro for 30 scans per month.',
  scanVisibleSymptoms: 'Visible Symptoms Detected',
  scanNextSteps: 'Next Steps',
  scanPrevention: 'Prevention & Monitoring',
  scanContactExtension: 'When to contact an extension officer',
  scanDisclaimerFull: 'This is an AI screening assessment, not a definitive laboratory diagnosis. Always confirm important decisions with a qualified agronomist or local extension officer.',
  scanSaved: 'Scan saved to history',

  /* History */
  historyTitle: 'Scan History',
  historySub: 'Your saved crop scans and AI results.',
  historySearch: 'Search by crop or disease…',
  historyFilterCrop: 'All Crops',
  historyFilterDisease: 'All Diseases',
  historyFilterSeverity: 'All Severities',
  historyFilterDate: 'All Dates',
  historyEmpty: 'No scans found. Start scanning crop leaves to build your history.',
  historyDelete: 'Delete scan',
  historyDeleteConfirm: 'Delete this scan record? This cannot be undone.',
  historyDownload: 'Download Report',
  historyDetail: 'View Details',
  historyContributes: 'Contributing to local outbreak data',
  historyOptedOut: 'Not contributing (opted out)',

  /* Weather */
  weatherTitle: 'Weather',
  weatherSub: 'Current conditions and 7-day forecast for your farm area.',
  weatherCurrent: 'Current Conditions',
  weatherForecast: '7-Day Forecast',
  weatherAlerts: 'Weather Alerts',
  weatherNoAlerts: 'No active weather alerts for your area.',
  weatherLoading: 'Loading weather data…',
  weatherError: 'Unable to load weather. Check your connection and try again.',
  weatherRetry: 'Retry',
  weatherLastUpdated: 'Updated',
  weatherNoLocation: 'No location set',
  weatherSetLocation: 'Set your farm location in Farm Profile to get personalised weather.',
  weatherToday: 'Today',
  weatherHumidity: 'Humidity',
  weatherWind: 'Wind',
  weatherRainChance: 'Rain chance',
  weatherFarmAdvice: 'Farming Advice',
  weatherStaleWarning: 'Weather data may be outdated. Tap retry to refresh.',

  /* Outbreaks */
  outbreakTitle: 'Disease Outbreaks',
  outbreakSub: 'Anonymised, aggregated reports from nearby farms.',
  outbreakNone: 'No confirmed local disease trends yet for your area. Check back after more reports are collected.',
  outbreakReports: 'reports',
  outbreakTrend: 'Trend',
  outbreakRising: 'Rising',
  outbreakStable: 'Stable',
  outbreakDeclining: 'Declining',
  outbreakAlertInfo: 'Informational',
  outbreakAlertWatch: 'Watch',
  outbreakAlertAttention: 'High Attention',
  outbreakConfirmed: 'Officially confirmed',
  outbreakCommunityReport: 'Community reports',
  outbreakPrivacyNote: 'No personal details, exact farm locations, or photos are included in these trends.',
  outbreakThresholdNote: 'Trends are only shown after a minimum number of reports are received from an area.',
  outbreakContactExtension: 'Contact Extension Officer',
  outbreakFilterCrop: 'All Crops',
  outbreakFilterDisease: 'All Diseases',
  outbreakFilterDate: 'All Time',
  outbreakFilterLocation: 'My Area',

  /* Profile */
  profileTitle: 'Farm Profile',
  profileSub: 'Manage your farmer details and farm information.',
  profileFarmerInfo: 'Farmer Information',
  profileFarmDetails: 'Farm Details',
  profileLanguage: 'Preferred Language',
  profileNotifications: 'Notifications',
  profileConsent: 'Data & Consent',
  profileSubscription: 'Subscription',
  profileSave: 'Save Changes',
  profileSaving: 'Saving…',
  profileSaved: 'Changes saved',
  profileAddFarm: 'Add Another Farm',
  profileVerified: 'Verified',
  profileUnverified: 'Not verified',
  profileVerify: 'Verify',

  /* Assistant */
  assistantTitle: 'AI Farm Assistant',
  assistantSub: 'Ask questions about your crops, diseases, weather, and farm care.',
  assistantPlaceholder: 'Ask anything about your crops…',
  assistantSend: 'Send',
  assistantCreditsLeft: 'credits left',
  assistantCreditWarning: 'You have 1 credit remaining today.',
  assistantOutOfCredits: 'You have used all your chat credits for today.',
  assistantGetMoreCredits: 'Get More Credits',
  assistantTyping: 'Assistant is thinking…',
  assistantError: 'Sorry, I could not respond right now. Please try again.',
  assistantDisclaimerTitle: 'About this assistant',
  assistantDisclaimerBody: 'This AI assistant provides general farming guidance. It is not a human agronomist or emergency service. For high-risk situations, always contact your local extension officer.',
  assistantSuggest1: 'What should I do about this disease?',
  assistantSuggest2: 'Is rain expected this week?',
  assistantSuggest3: 'How can I protect nearby plants?',
  assistantSuggest4: 'What causes yellow leaves on cassava?',
  assistantNewChat: 'New Chat',
  assistantLanguageSwitch: 'Switch language',

  /* Plans */
  plansTitle: 'Plans & Credits',
  plansSub: 'Manage your subscription and usage.',
  planFree: 'Free',
  planPro: 'Pro',
  planCurrent: 'Current Plan',
  planUpgrade: 'Upgrade to Pro',
  planPerMonth: '/month',
  planFreePrice: 'Free',
  planProPrice: 'UGX 15,000',
  planBillingSetupRequired: 'Payment processing is not yet configured. Contact us to activate Pro.',
  planCreditsBalance: 'Credits Balance',
  planResetDate: 'Resets',
  planScansRemaining: 'Scans remaining',
  planChatsRemaining: 'Chat credits remaining',
  planCheckoutPlaceholder: 'Checkout coming soon',

  /* Settings */
  settingsTitle: 'Settings',
  settingsSub: 'Preferences, privacy, and account management.',
  settingsLanguage: 'Language',
  settingsNotifications: 'Push Notifications',
  settingsWeatherAlerts: 'Weather Alerts',
  settingsOutbreakAlerts: 'Disease Outbreak Alerts',
  settingsDataContribution: 'Contribute to Outbreak Data',
  settingsDataContributionBody: 'Allow anonymised scan results to be included in local disease trend reports. You can opt out at any time without losing any features.',
  settingsPrivacy: 'Privacy & Data',
  settingsExportData: 'Export My Data',
  settingsExportBody: 'Download a copy of your farmer profile, scan history, and chat history.',
  settingsDeleteAccount: 'Request Account Deletion',
  settingsDeleteBody: 'This will permanently delete your account and all associated data. This cannot be undone.',
  settingsDeleteConfirm: 'Yes, delete my account',
  settingsSave: 'Save Settings',
  settingsSaved: 'Settings saved',

  /* General */
  loading: 'Loading…',
  error: 'Something went wrong',
  retry: 'Try again',
  save: 'Save',
  cancel: 'Cancel',
  close: 'Close',
  confirm: 'Confirm',
  delete: 'Delete',
  edit: 'Edit',
  add: 'Add',
  back: 'Back',
  next: 'Next',
  done: 'Done',
  optional: 'optional',
  required: 'required',
  noData: 'Nothing here yet',
  upgrade: 'Upgrade',
  signIn: 'Sign In',
  signOut: 'Sign Out',
  learnMore: 'Learn more',
  contactExtension: 'Contact extension officer',
  aiDisclaimer: 'AI assessments support, but do not replace, qualified agricultural advice or local extension officers.',
};

/* ══════════════════════════════════════════════════════════
   LUGANDA
   ══════════════════════════════════════════════════════════ */
const lg: AppTranslations = {
  /* Diagnosis (existing) */
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

  /* Nav */
  navDashboard: 'Olupapula Olukulu',
  navScan: 'Keba Ekileeba',
  navHistory: 'Ebyakeberwako',
  navWeather: 'Obudde',
  navOutbreaks: 'Obulwadde mu Kifo',
  navProfile: 'Akawunti y\'Ennimiro',
  navAssistant: 'Omuyambi wa AI',
  navPlans: 'Byokufuna n\'Amanukuvu',
  navSettings: 'Entegeka',
  navSignOut: 'Fuluma',

  /* Auth */
  authSignIn: 'Yingira',
  authSignUp: 'Kola Akawunti',
  authCreateAccount: 'Kola Akawunti y\'Omulimi',
  authWelcomeBack: 'Tukusanyukidde okuddayo',
  authPhone: 'Enamba ya Simu',
  authEmail: 'Aderesi ya Email',
  authPassword: 'Ekigambo ky\'Okulinda',
  authOtp: 'Koodi y\'Okukoleza',
  authSendOtp: 'Tuma Koodi',
  authVerifyOtp: 'Kakasa Koodi',
  authOrEmail: 'Oba kozesa email ne password',
  authForgotPassword: 'Owazze password?',
  authNoAccount: 'Tolina akawunti?',
  authHaveAccount: 'Olina akawunti?',
  authAgreeTo: 'Okukolela akawunti okiriza',
  authPrivacyPolicy: 'Emitendera y\'Ebyama',
  authTerms: 'Amateeka y\'Okukozesa',
  authSigningIn: 'Yingira…',
  authCreating: 'Tukola akawunti…',
  authEmailPlaceholder: 'email@yo.com',
  authPhonePlaceholder: '+256 7XX XXX XXX',
  authPasswordPlaceholder: 'Buli buzibu 8 obwogero',

  /* Onboarding */
  onboardTitle: 'Teeka akawunti y\'omulimi',
  onboardSub: 'Tusobole okukuyamba obulungi. Oyinza okusalawo n\'okumaliriza ebbanga eddako.',
  onboardStep1: 'Ebikuteekako',
  onboardStep2: 'Kifo ky\'Ennimiro',
  onboardStep3: 'Ebimera Byawe',
  onboardStep4: 'Amakubye n\'Okukiriza',
  onboardFarmerName: 'Erinnya Lyonso',
  onboardFarmerNamePlaceholder: 'Erinnya lyawe',
  onboardFarmName: 'Erinnya ry\'Ennimiro',
  onboardFarmNamePlaceholder: 'Nga. Ennimiro ya Kigezi',
  onboardDistrict: 'Disitulikiti',
  onboardSubCounty: 'Sab-Kowunti',
  onboardParish: 'Pawulesi',
  onboardVillage: 'Kyalo',
  onboardGpsLabel: 'Ekifo kya GPS',
  onboardGpsConsent: 'Yiga SmartFarmer okuteeka ekifo kya simu yo okusobola okukuwa obudde n\'obulwadde obukyali mu kifo kyo',
  onboardCrops: 'Ebimera Ebyayungibwa',
  onboardFarmSize: 'Obunene bw\'Ennimiro',
  onboardFarmSizeUnit: 'Enziga',
  onboardFarmingType: 'Ekika ky\'Okulima (si kyetaagibwa)',
  onboardConsentTitle: 'Engeri gye tukozesa amakubye go',
  onboardConsentBody: 'SmartFarmer ekozesa amafaanana g\'okukebera n\'ekifo kyo okwonogereza okukebera obulwadde n\'okukola akabonero ka kifo. Ebyo byawe si biweebwa abamulimi abalala. Oyinza okuggyako okukiriza oba okuzikiriza amakubye go awa linga mu Entegeka.',
  onboardConsentCheck: 'Ntegedde era nkiriza SmartFarmer okukozesa amakubye gange nga byategekezebwa waggulu',
  onboardSkip: 'Salira wansi kaakano',
  onboardNext: 'Ddayo Eddako',
  onboardBack: 'Ddayo Emabega',
  onboardFinish: 'Genda ku Lupapula Lwange',
  onboardComplete: 'Akawunti eteekeddwa',

  /* Dashboard */
  dashGreeting: 'Wasuze otya',
  dashScansUsed: 'okukeberera kwakozesebwa',
  dashScansOf: 'mu',
  dashScanToday: 'Keba Ekileeba',
  dashChatCredits: 'Amanukuvu ga chat',
  dashCreditsLeft: 'abasigadde leero',
  dashRecentScans: 'Okukeberera Okuggwa Ku Maaso',
  dashNoScans: 'Tewali kukeberera. Fotografa ekileeba ky\'ekimera okutandika.',
  dashNearbyAlert: 'Akabonero k\'Obulwadde Okumpi',
  dashUpgrade: 'Funa ebisingawo ne Pro',
  dashUpgradeSub: 'Malamusaawo okukeberera 30 ku mwezi, ebyakeberwako byonna, n\'akabonero ak\'olubereberye.',
  dashUpgradeBtn: 'Laba Endagaano',
  dashWeatherLoading: 'Tufuula obudde…',
  dashWeatherError: 'Obudde buteekuweebwa',
  dashViewAll: 'Laba byonna',

  /* Scan */
  scanTitle: 'Keba Ekileeba ky\'Ekimera',
  scanSub: 'Fotografa oba yongereza ifaanana y\'ekileeba ekyolimba okukebererwa kwa AI.',
  scanSelectCrop: 'Ekika ky\'ekimera',
  scanSymptomNotes: 'Ebiwandiiko by\'obubonero (si kyetaagibwa)',
  scanSymptomPlaceholder: 'Tegeeza ekyolaba, nga. amabala omulembe ku maleeba ag\'awansi okuva ow\'olweyamba oluggwadde',
  scanAffectedArea: 'Ebitendera by\'ebitundu ebikolimbye (%)',
  scanSaveHistory: 'Zachula mu Byakeberwako',
  scanShareDownload: 'Pakua Lipooti',
  scanAskAssistant: 'Buuza Omuyambi',
  scanScanAnother: 'Keba Ekileeba Ekiddako',
  scanInconclusiveTitle: 'Teyinzika kutegeezebwa bulungi',
  scanInconclusiveBody: 'Ifaanana oba obubonero si butuufu okufuna ekirowoozo ekijja ddala. Fotografa n\'omusana omulungi oba bujja omulabirizi w\'obulimi.',
  scanLimitReached: 'Obugwanyu bw\'okukeberera bwakomekezebwa',
  scanLimitBody: 'Okozesezza okukeberera kwonna kw\'olwaleero. Ggira Pro okufuna okukeberera 30 ku mwezi.',
  scanVisibleSymptoms: 'Obubonero Obulabirika',
  scanNextSteps: 'Ensonga Eddako',
  scanPrevention: 'Okulindirira n\'Okulabirira',
  scanContactExtension: 'Edda okubuuza omulabirizi wa gavumenti',
  scanDisclaimerFull: 'Kino kiri ekirowoozo kya AI, si ddagala eriweereddwako obulabirizi. Kakasa emiramwa emikulembeze n\'omusuubuzi w\'obulimi oba omulabirizi wa gavumenti.',
  scanSaved: 'Okukeberera kwazachulwa mu byakeberwako',

  /* History */
  historyTitle: 'Ebyakeberwako',
  historySub: 'Okukeberera kwowe okuzachulwa n\'ebiruwo bya AI.',
  historySearch: 'Noonya ekimera oba obulwadde…',
  historyFilterCrop: 'Ebimera Byonna',
  historyFilterDisease: 'Obulwadde Bwonna',
  historyFilterSeverity: 'Buli Bukosedde',
  historyFilterDate: 'Ennaku Zonna',
  historyEmpty: 'Tewali kukeberera kukuwangaalirwe. Tandika kukeba amaleeba g\'ebimera.',
  historyDelete: 'Sazaamu okukeberera',
  historyDeleteConfirm: 'Sazaamu akawunti kano k\'okukeberera? Kino tekiyinzika kuddibwamu.',
  historyDownload: 'Pakua Lipooti',
  historyDetail: 'Laba Ebirimu',
  historyContributes: 'Otereka mu makubye g\'obulwadde obukyali',
  historyOptedOut: 'Oterekera bulungi (okusalawo)',

  /* Weather */
  weatherTitle: 'Obudde',
  weatherSub: 'Obubeera bw\'obudde leero n\'ennaku 7 ezijja okuwandiika ennimiro yo.',
  weatherCurrent: 'Obubeera Bw\'Obudde Leero',
  weatherForecast: 'Ebyenfuufu by\'Ennaku 7',
  weatherAlerts: 'Akabonero k\'Obudde',
  weatherNoAlerts: 'Tewali kabonero k\'obudde mu kifo kyo.',
  weatherLoading: 'Tufuula amakubye g\'obudde…',
  weatherError: 'Tetwakwata amakubye g\'obudde. Kakasa okussa kw\'omukutu era ogezeeko nate.',
  weatherRetry: 'Gezeeko Nate',
  weatherLastUpdated: 'Kivuunudde',
  weatherNoLocation: 'Tewali kifo kiteekeddwako',
  weatherSetLocation: 'Teeka ekifo ky\'ennimiro yo mu Akawunti y\'Ennimiro okufuna obudde obuteekateeka.',
  weatherToday: 'Leero',
  weatherHumidity: 'Obusilu',
  weatherWind: 'Omuyaga',
  weatherRainChance: 'Omukutu gw\'enkuba',
  weatherFarmAdvice: 'Obulangirizi bw\'Ennimiro',
  weatherStaleWarning: 'Amakubye g\'obudde ganaatera okuba akulu. Nyiga gezeeko okuviivuunya.',

  /* Outbreaks */
  outbreakTitle: 'Obulwadde obukyali mu Kifo',
  outbreakSub: 'Amakubye ag\'anonymized, agakusanyiziddwa okuva ku nnimiro ezimpi.',
  outbreakNone: 'Tewali bwambangizi bw\'obulwadde obutuufu mu kifo kyo kaakano. Ddayo oluvannyuma lw\'okukusanyizibwa kw\'ebiwandiiko ebisingawo.',
  outbreakReports: 'ebiwandiiko',
  outbreakTrend: 'Entimba',
  outbreakRising: 'Yaka',
  outbreakStable: 'Ekiri Bulungi',
  outbreakDeclining: 'Yika',
  outbreakAlertInfo: 'Amakubye',
  outbreakAlertWatch: 'Labirira',
  outbreakAlertAttention: 'Kitegeeza Ennyo',
  outbreakConfirmed: 'Kakasibwa mu lusegere',
  outbreakCommunityReport: 'Ebiwandiiko by\'ekibiina',
  outbreakPrivacyNote: 'Ebya busobozi bulimu, ekifo ddala ky\'ennimiro, oba amafaanana si birimwamu mu byenvuuka bino.',
  outbreakThresholdNote: 'Byenvuuka bilabirikira okuwedde ebiwandiiko ebisingawo okutuuka ku obungi bw\'esinga.',
  outbreakContactExtension: 'Buuza Omulabirizi wa Gavumenti',
  outbreakFilterCrop: 'Ebimera Byonna',
  outbreakFilterDisease: 'Obulwadde Bwonna',
  outbreakFilterDate: 'Ebiro Byonna',
  outbreakFilterLocation: 'Ekifo Kyange',

  /* Profile */
  profileTitle: 'Akawunti y\'Ennimiro',
  profileSub: 'Sasula amakubye go g\'omulimi n\'ebya nnimiro yo.',
  profileFarmerInfo: 'Amakubye g\'Omulimi',
  profileFarmDetails: 'Ebya Nnimiro',
  profileLanguage: 'Olulimi Olulondeddwa',
  profileNotifications: 'Akabonero',
  profileConsent: 'Amakubye n\'Okukiriza',
  profileSubscription: 'Endagaano',
  profileSave: 'Zachula Enkyukakyuka',
  profileSaving: 'Tuzachula…',
  profileSaved: 'Enkyukakyuka zazachulwa',
  profileAddFarm: 'Yongera Ennimiro Endala',
  profileVerified: 'Kakasibwa',
  profileUnverified: 'Tekakasibwa',
  profileVerify: 'Kakasa',

  /* Assistant */
  assistantTitle: 'Omuyambi wa AI w\'Ennimiro',
  assistantSub: 'Buuza ebibuuzo ku byimera byawe, obulwadde, obudde, n\'ebyenjigiriza z\'ennimiro.',
  assistantPlaceholder: 'Buuza ekyaka ku byimera byawe…',
  assistantSend: 'Tuma',
  assistantCreditsLeft: 'amanukuvu asigadde',
  assistantCreditWarning: 'Olina omanukuvu amulimu gumu abasigadde leero.',
  assistantOutOfCredits: 'Okozesezza amanukuvu go gonna g\'okunyumba leero.',
  assistantGetMoreCredits: 'Funa Amanukuvu Amasingawo',
  assistantTyping: 'Omuyambi afikiira…',
  assistantError: 'Mbeera, si nakuyamba kaakano. Gezaako nate.',
  assistantDisclaimerTitle: 'Ku buyambi buno',
  assistantDisclaimerBody: 'Omuyambi ono wa AI aawa obulangirizi bw\'ennimiro bw\'eby\'ensatu. Si musuubuzi w\'obulimi oba sebaddukulu. Mu bibeera eby\'obuzibu, buuza omulabirizi w\'obulimi wa gavumenti.',
  assistantSuggest1: 'Nkola ki ku bulwadde buno?',
  assistantSuggest2: 'Enkuba ejja mu wiiki eno?',
  assistantSuggest3: 'Ngamba ngamba ebimera ebiri kumpi?',
  assistantSuggest4: 'Kiki ekisobozesa amaleeba g\'omuwogo gufuukira omulembe?',
  assistantNewChat: 'Enyumba Mpya',
  assistantLanguageSwitch: 'Kyusa olulimi',

  /* Plans */
  plansTitle: 'Endagaano n\'Amanukuvu',
  plansSub: 'Sasula endagaano yo n\'okukozesebwa kwayo.',
  planFree: 'Bwereere',
  planPro: 'Pro',
  planCurrent: 'Endagaano y\'Enkola',
  planUpgrade: 'Ggira ku Pro',
  planPerMonth: '/mwezi',
  planFreePrice: 'Bwereere',
  planProPrice: 'UGX 15,000',
  planBillingSetupRequired: 'Okuteesa okuliipa tekiteekeddwako. Twogana natwe okutandika Pro.',
  planCreditsBalance: 'Amanukuvu ag\'Asigadde',
  planResetDate: 'Evuunuka',
  planScansRemaining: 'Okukeberera okusigadde',
  planChatsRemaining: 'Amanukuvu ga chat asigadde',
  planCheckoutPlaceholder: 'Okuliipa kujja mangu',

  /* Settings */
  settingsTitle: 'Entegeka',
  settingsSub: 'Okukima, ebyama, n\'okulabirira akawunti.',
  settingsLanguage: 'Olulimi',
  settingsNotifications: 'Akabonero ak\'Okunyonyola',
  settingsWeatherAlerts: 'Akabonero k\'Obudde',
  settingsOutbreakAlerts: 'Akabonero k\'Obulwadde obukyali',
  settingsDataContribution: 'Tereka mu Makubye g\'Obulwadde',
  settingsDataContributionBody: 'Yiga ebiruwo by\'okukebera anonymized okuyingirako mu lipooti z\'entimba z\'obulwadde obukyali. Oyinza okusalawo n\'okuggyako n\'obutayokuwa ngeri zo.',
  settingsPrivacy: 'Ebyama n\'Amakubye',
  settingsExportData: 'Fulumya Amakubye Gange',
  settingsExportBody: 'Pakua eddoboozi ly\'akawunti y\'omulimi, ebyakeberwako, n\'ebyokunyumba byawe.',
  settingsDeleteAccount: 'Saba Okkomerezebwa kw\'Akawunti',
  settingsDeleteBody: 'Kino kuzaazaakiriza akawunti yo n\'amakubye gonna aganaasikirira. Kino tekiyinzika kuddibwamu.',
  settingsDeleteConfirm: 'Yee, zikiriza akawunti yange',
  settingsSave: 'Zachula Entegeka',
  settingsSaved: 'Entegeka yazachulwa',

  /* General */
  loading: 'Tufuula…',
  error: 'Ekintu ekibi kiyise',
  retry: 'Gezeeko Nate',
  save: 'Zachula',
  cancel: 'Sazaamu',
  close: 'Ggalawo',
  confirm: 'Kakasa',
  delete: 'Sazaamu',
  edit: 'Kyusa',
  add: 'Yongera',
  back: 'Ddayo Emabega',
  next: 'Ddayo Eddako',
  done: 'Ggwerezezza',
  optional: 'si kyetaagibwa',
  required: 'kyetaagibwa',
  noData: 'Tewali kimu omu wano kaakano',
  upgrade: 'Ggira',
  signIn: 'Yingira',
  signOut: 'Fuluma',
  learnMore: 'Manya Ebisingawo',
  contactExtension: 'Buuza omulabirizi wa gavumenti',
  aiDisclaimer: 'Ebiruwo bya AI biwa obuyambi, si buvunaanya, obulangirizi bw\'obulimi obw\'abaana oba abakulembeze ab\'amanyi mu kifo kyo.',
};

/* ══════════════════════════════════════════════════════════
   RUNYANKOLE
   ══════════════════════════════════════════════════════════ */
const nyn: AppTranslations = {
  /* Diagnosis (existing) */
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

  /* Nav */
  navDashboard: 'Ekitebe Ekikuru',
  navScan: 'Shwera Orubaaho',
  navHistory: 'Ebyashwerwa',
  navWeather: 'Obuheeru',
  navOutbreaks: 'Endwara mu Kifo',
  navProfile: 'Profairu y\'Eirima',
  navAssistant: 'Omufura wa AI',
  navPlans: 'Endagaano n\'Amanukuvu',
  navSettings: 'Okuteeka',
  navSignOut: 'Sohoka',

  /* Auth */
  authSignIn: 'Ingira',
  authSignUp: 'Kola Akawunti',
  authCreateAccount: 'Kola Akawunti y\'Omuhingwa',
  authWelcomeBack: 'Tukusiimire gusubira',
  authPhone: 'Enamba ya Simu',
  authEmail: 'Aderesi ya Email',
  authPassword: 'Ekigambo ky\'Okulinda',
  authOtp: 'Koodi y\'Okukoleza',
  authSendOtp: 'Tuma Koodi',
  authVerifyOtp: 'Kakasa Koodi',
  authOrEmail: 'Oba kozesa email na password',
  authForgotPassword: 'Owazize password?',
  authNoAccount: 'Nta kawunti ufite?',
  authHaveAccount: 'Ufite akawunti?',
  authAgreeTo: 'Okutera akawunti okiriza',
  authPrivacyPolicy: 'Amategeko y\'Ebyama',
  authTerms: 'Amategeko y\'Okukozesa',
  authSigningIn: 'Ingira…',
  authCreating: 'Twakola akawunti…',
  authEmailPlaceholder: 'email@yawe.com',
  authPhonePlaceholder: '+256 7XX XXX XXX',
  authPasswordPlaceholder: 'Nibura obwogero 8',

  /* Onboarding */
  onboardTitle: 'Teeka profairu y\'omuhingwa',
  onboardSub: 'Turashobora okugufasha obulungi. Ushobora kusalawo n\'kumaliza oluvannyuma.',
  onboardStep1: 'Ebikuteekaho',
  onboardStep2: 'Kifo ky\'Eirima',
  onboardStep3: 'Ebihingwa Byawe',
  onboardStep4: 'Amakuru n\'Okukiriza',
  onboardFarmerName: 'Amaani Yoona',
  onboardFarmerNamePlaceholder: 'Eizina ryawe',
  onboardFarmName: 'Eizina ry\'Eirima',
  onboardFarmNamePlaceholder: 'Nga. Eirima rya Kigezi',
  onboardDistrict: 'Distriki',
  onboardSubCounty: 'Sab-Kaunti',
  onboardParish: 'Parishi',
  onboardVillage: 'Kyaro',
  onboardGpsLabel: 'Ekifo kya GPS',
  onboardGpsConsent: 'Yiga SmartFarmer kuteeka ekifo kya simu yawe okureka obuheeru n\'obushwezi bw\'endwara kubasha',
  onboardCrops: 'Ebihingwa Ebisinga',
  onboardFarmSize: 'Obunene bw\'Eirima',
  onboardFarmSizeUnit: 'Enziga',
  onboardFarmingType: 'Ekika ky\'Okurimira (si kyetaagibwa)',
  onboardConsentTitle: 'Engeri tukozesamu amakuru gawe',
  onboardConsentBody: 'SmartFarmer ikozesa amafoto g\'okushwera n\'ekifo kyawe okwongera okunoonyereza kw\'endwara n\'okukoraho akabonero k\'endwara mu kifo. Ebyo byawe si biweebwa abahingwa abalala. Ushobora gufata okukiriza oba gukuraho amakuru gawe hariho mu Okuteeka.',
  onboardConsentCheck: 'Ntegeire kandi nkiriza SmartFarmer gukozesa amakuru gange nk\'ebitegekezibwe hariho',
  onboardSkip: 'Salawo kakaano',
  onboardNext: 'Ekirikurikiraho',
  onboardBack: 'Garuka Enyuma',
  onboardFinish: 'Genda ku Kitebe Kyange',
  onboardComplete: 'Profairu eteekwa',

  /* Dashboard */
  dashGreeting: 'Oraire ota',
  dashScansUsed: 'okushwera kwakozeswa',
  dashScansOf: 'mu',
  dashScanToday: 'Shwera Orubaaho',
  dashChatCredits: 'Amanukuvu ga chat',
  dashCreditsLeft: 'asigaire erizooba',
  dashRecentScans: 'Okushwera Okuggwa ku Maaso',
  dashNoScans: 'Nta kushwera. Fota orubaaho rw\'ekihingwa okutandika.',
  dashNearbyAlert: 'Akabonero k\'Endwara Okumpi',
  dashUpgrade: 'Funa ebisingawo na Pro',
  dashUpgradeSub: 'Malamusaawo okushwera 30 ku mwezi, ebyashwerwa byona, n\'akabonero ak\'olubereberye.',
  dashUpgradeBtn: 'Raba Endagaano',
  dashWeatherLoading: 'Tufuula obuheeru…',
  dashWeatherError: 'Obuheeru butaweebwaho',
  dashViewAll: 'Raba byona',

  /* Scan */
  scanTitle: 'Shwera Orubaaho rw\'Ekihingwa',
  scanSub: 'Fota oba yunjura ifoto y\'orubaaho orukonona okushwerwa kwa AI.',
  scanSelectCrop: 'Ekika ky\'ekihingwa',
  scanSymptomNotes: 'Ebyandikwa by\'ebimanyisyo (si kyetaagibwa)',
  scanSymptomPlaceholder: 'Tegeeza ekiraba, nga. amabara omulembe ku mabaaho ag\'ahansi okuva owomu owashira',
  scanAffectedArea: 'Ebitundu ebikonona (%)',
  scanSaveHistory: 'Zachula mu Ebyashwerwa',
  scanShareDownload: 'Pakua Lipooti',
  scanAskAssistant: 'Baza Omufura',
  scanScanAnother: 'Shwera Orubaaho Orundi',
  scanInconclusiveTitle: 'Kwetuza kuteekurasigwa',
  scanInconclusiveBody: 'Ifoto oba ebimanyisyo si bigyeyo okufuna ebishongore ebisingye. Fota n\'oruhanga rurungi, oba baza omushwezi w\'ebirime.',
  scanLimitReached: 'Obugwanyu bw\'okushwera bwakomerezwa',
  scanLimitBody: 'Okozeseza okushwera kwona kw\'erizooba. Ggira Pro okufuna okushwera 30 ku mwezi.',
  scanVisibleSymptoms: 'Ebimanyisyo Ebiraba',
  scanNextSteps: 'Eby\'okukora Ebirikirikurikiraho',
  scanPrevention: 'Okulinda n\'Okulabirira',
  scanContactExtension: 'Edda kubaza omushwezi wa gavumenti',
  scanDisclaimerFull: 'Eki niryo lipooti y\'okushwera kwa AI, si ddagala eriteekebwaho obulabirizi. Kakasa emiramwa mishasha n\'omushwezi w\'ebirime oba omushwezi wa gavumenti.',
  scanSaved: 'Okushwera kwazachulwa mu ebyashwerwa',

  /* History */
  historyTitle: 'Ebyashwerwa',
  historySub: 'Okushwera kwowe okuzachulwa n\'ebiruwo bya AI.',
  historySearch: 'Noonya ekihingwa oba endwara…',
  historyFilterCrop: 'Ebihingwa Byona',
  historyFilterDisease: 'Endwara Yona',
  historyFilterSeverity: 'Obukome Bwona',
  historyFilterDate: 'Ennaku Zona',
  historyEmpty: 'Nta kushwera kukuzachulwa. Tandika kushwera amabaaho g\'ebihingwa.',
  historyDelete: 'Kuraho okushwera',
  historyDeleteConfirm: 'Kuraho akawunti kano k\'okushwera? Eki tekishobora kuddibwamu.',
  historyDownload: 'Pakua Lipooti',
  historyDetail: 'Raba Ebirimu',
  historyContributes: 'Yungirako mu makuru g\'endwara mu kifo',
  historyOptedOut: 'Takoraho (okusalawo)',

  /* Weather */
  weatherTitle: 'Obuheeru',
  weatherSub: 'Obubeera bw\'obuheeru bw\'erizooba n\'ennaku 7 ezirikurikiraho okuwandiika eirima ryawe.',
  weatherCurrent: 'Obubeera Bw\'Obuheeru Bw\'Erizooba',
  weatherForecast: 'Ebyenfuufu by\'Ennaku 7',
  weatherAlerts: 'Akabonero k\'Obuheeru',
  weatherNoAlerts: 'Nta kabonero k\'obuheeru mu kifo kyawe.',
  weatherLoading: 'Tufuula amakuru g\'obuheeru…',
  weatherError: 'Tewakwata amakuru g\'obuheeru. Kakasa okussa kw\'omukutu era ogezeeko nate.',
  weatherRetry: 'Gezeeko Nate',
  weatherLastUpdated: 'Kihindurwa',
  weatherNoLocation: 'Nta kifo kiteekwa',
  weatherSetLocation: 'Teeka ekifo ky\'eirima ryawe mu Profairu y\'Eirima okufuna obuheeru obuteekateeka.',
  weatherToday: 'Erizooba',
  weatherHumidity: 'Obusilu',
  weatherWind: 'Omuyaga',
  weatherRainChance: 'Omukutu gw\'enkuba',
  weatherFarmAdvice: 'Obulangirizi bw\'Eirima',
  weatherStaleWarning: 'Amakuru g\'obuheeru gashobora kuba mahango. Nyiga gezeeko okuviivuunya.',

  /* Outbreaks */
  outbreakTitle: 'Endwara mu Kifo',
  outbreakSub: 'Amakuru ag\'anonymized, agakusanyiziddwa okuva ku mairo ampi.',
  outbreakNone: 'Nta bwambangizi bw\'endwara butuufu mu kifo kyawe kakaano. Garuka oluvannyuma lw\'okukusanyizibwa kw\'ebiwandiiko ebisingawo.',
  outbreakReports: 'ebiwandiiko',
  outbreakTrend: 'Entimba',
  outbreakRising: 'Kwaka',
  outbreakStable: 'Kwima',
  outbreakDeclining: 'Kwira',
  outbreakAlertInfo: 'Amakuru',
  outbreakAlertWatch: 'Labirira',
  outbreakAlertAttention: 'Bitariho Ennyo',
  outbreakConfirmed: 'Kakasibwa mu lusegere',
  outbreakCommunityReport: 'Ebiwandiiko by\'ekibiina',
  outbreakPrivacyNote: 'Ebyawe byona, ekifo ddala ky\'eirima, oba amafoto si birimwamu mu byenfuufu bibi.',
  outbreakThresholdNote: 'Ebyenfuufu biraba okuwedde ebiwandiiko ebisingawo okutuuka ku bunene bw\'esinga.',
  outbreakContactExtension: 'Baza Omushwezi wa Gavumenti',
  outbreakFilterCrop: 'Ebihingwa Byona',
  outbreakFilterDisease: 'Endwara Yona',
  outbreakFilterDate: 'Ebiro Byona',
  outbreakFilterLocation: 'Kifo Kyange',

  /* Profile */
  profileTitle: 'Profairu y\'Eirima',
  profileSub: 'Sasula amakuru gawe g\'omuhingwa n\'eby\'eirima ryawe.',
  profileFarmerInfo: 'Amakuru g\'Omuhingwa',
  profileFarmDetails: 'Eby\'Eirima',
  profileLanguage: 'Orurimi Oruhingirwe',
  profileNotifications: 'Akabonero',
  profileConsent: 'Amakuru n\'Okukiriza',
  profileSubscription: 'Endagaano',
  profileSave: 'Zachula Ebihinduwe',
  profileSaving: 'Tuzachula…',
  profileSaved: 'Ebihinduwe bizachulwa',
  profileAddFarm: 'Yungirako Eirima Riindi',
  profileVerified: 'Kakasibwa',
  profileUnverified: 'Tekakasibwa',
  profileVerify: 'Kakasa',

  /* Assistant */
  assistantTitle: 'Omufura wa AI w\'Eirima',
  assistantSub: 'Baza emibuuzo ku bihingwa byawe, endwara, obuheeru, n\'ebyenjigiriza z\'eirima.',
  assistantPlaceholder: 'Baza ekyaka ku bihingwa byawe…',
  assistantSend: 'Tuma',
  assistantCreditsLeft: 'amanukuvu asigaire',
  assistantCreditWarning: 'Ufite omanukuvu omwe asigaire erizooba.',
  assistantOutOfCredits: 'Okozeseza amanukuvu gawe gona g\'okunyumba erizooba.',
  assistantGetMoreCredits: 'Funa Amanukuvu Amasingawo',
  assistantTyping: 'Omufura afikiira…',
  assistantError: 'Mbeera, nkagufasha kakaano. Gezeeko nate.',
  assistantDisclaimerTitle: 'Ku bufura buno',
  assistantDisclaimerBody: 'Omufura ono wa AI aha obulangirizi bw\'eirima bw\'eby\'ensatu. Si mushwezi w\'ebirime oba sebaddukulu. Mu bibeera eby\'obuzibu, baza omushwezi w\'ebirime wa gavumenti.',
  assistantSuggest1: 'Ndora ki ku ndwara ino?',
  assistantSuggest2: 'Enkuba ejja mu wiiki ino?',
  assistantSuggest3: 'Nzigama ebihingwa ebiri kumpi?',
  assistantSuggest4: 'Kiki ekisobozesa amabaaho g\'omuwogo gufuukira omulembe?',
  assistantNewChat: 'Enyumba Mpya',
  assistantLanguageSwitch: 'Hindura orurimi',

  /* Plans */
  plansTitle: 'Endagaano n\'Amanukuvu',
  plansSub: 'Sasula endagaano yawe n\'okukozesebwa kwayo.',
  planFree: 'Bwereere',
  planPro: 'Pro',
  planCurrent: 'Endagaano y\'Erizooba',
  planUpgrade: 'Ggira ku Pro',
  planPerMonth: '/omwezi',
  planFreePrice: 'Bwereere',
  planProPrice: 'UGX 15,000',
  planBillingSetupRequired: 'Okuliipa tekiteekwa. Twogana natwe okutandika Pro.',
  planCreditsBalance: 'Amanukuvu Asigaire',
  planResetDate: 'Evuunuka',
  planScansRemaining: 'Okushwera okusigaire',
  planChatsRemaining: 'Amanukuvu ga chat asigaire',
  planCheckoutPlaceholder: 'Okuliipa kujja mangu',

  /* Settings */
  settingsTitle: 'Okuteeka',
  settingsSub: 'Okukima, ebyama, n\'okulabirira akawunti.',
  settingsLanguage: 'Orurimi',
  settingsNotifications: 'Akabonero ak\'Okunyonyola',
  settingsWeatherAlerts: 'Akabonero k\'Obuheeru',
  settingsOutbreakAlerts: 'Akabonero k\'Endwara mu Kifo',
  settingsDataContribution: 'Yungirako mu Makuru g\'Endwara',
  settingsDataContributionBody: 'Yiga ebiruwo by\'okushwera anonymized kuyungirako mu lipooti z\'entimba z\'endwara mu kifo. Ushobora kusalawo n\'ukuraho nta ngeri eshindikwa.',
  settingsPrivacy: 'Ebyama n\'Amakuru',
  settingsExportData: 'Fulumya Amakuru Gange',
  settingsExportBody: 'Pakua eddoboozi ry\'profairu y\'omuhingwa, ebyashwerwa, n\'ebyokunyumba byawe.',
  settingsDeleteAccount: 'Saba Okukuraho Akawunti',
  settingsDeleteBody: 'Eki kizaazaakiriza akawunti yawe n\'amakuru gona gaagaarikiire. Eki tekishobora kuddibwamu.',
  settingsDeleteConfirm: 'Yee, kuraho akawunti yange',
  settingsSave: 'Zachula Okuteeka',
  settingsSaved: 'Okuteeka kwazachulwa',

  /* General */
  loading: 'Tufuula…',
  error: 'Ekintu ekibi kyahikire',
  retry: 'Gezeeko Nate',
  save: 'Zachula',
  cancel: 'Salawo',
  close: 'Galawo',
  confirm: 'Kakasa',
  delete: 'Kuraho',
  edit: 'Hindura',
  add: 'Yungirako',
  back: 'Garuka Enyuma',
  next: 'Ekirikurikiraho',
  done: 'Ggwerezezza',
  optional: 'si kyetaagibwa',
  required: 'kyetaagibwa',
  noData: 'Nta kintu hano kakaano',
  upgrade: 'Ggira',
  signIn: 'Ingira',
  signOut: 'Sohoka',
  learnMore: 'Manya Ebisingawo',
  contactExtension: 'Baza omushwezi wa gavumenti',
  aiDisclaimer: 'Ebiruwo bya AI biha obufura, si buvunaanya, obulangirizi bw\'ebirime obutuufu oba abashwezi ba gavumenti b\'omu kifo kyawe.',
};

export const TRANSLATIONS: Record<Locale, AppTranslations> = { en, lg, nyn };

export const LOCALE_LABELS: Record<Locale, string> = {
  en:  'English',
  lg:  'Luganda',
  nyn: 'Runyankole',
};

/** t() — get a translated string with English fallback */
export function t(locale: Locale, key: keyof AppTranslations): string {
  return TRANSLATIONS[locale]?.[key] ?? TRANSLATIONS['en'][key] ?? key;
}
