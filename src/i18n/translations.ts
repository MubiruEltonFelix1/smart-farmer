/**
 * translations.ts — UI strings for the entire Smart Farmer site.
 *
 * Supported locales:
 *   en  — English
 *   lg  — Luganda (Central Uganda / Buganda region)
 *   nyn — Runyankole / Lunyankole (Western Uganda / Ankole region)
 *
 * Pattern: TRANSLATIONS[locale].key  or  t(locale, key)
 * Missing keys fall back to English automatically via the t() helper.
 */

export type Locale = 'en' | 'lg' | 'nyn';

/* ─── Diagnosis-page strings ─────────────────────────────── */
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
  /* Diagnosis */
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
  onboardGpsConsent: "Allow SmartFarmer to record this device's approximate location to improve weather and outbreak features",
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
  /* Diagnosis */
  languageLabel: 'Olulimi',
  heroTitle: "Okukebera Obulwadde bw'Ebirime",
  heroSubtitle: "Kwata oba teeka ekifaananyi ky'olulagala lw'ekimera. AI ejja kulaba obulwadde era n'ekugamba ky'okukola.",
  uploadTitle: "Teeka ekifaananyi ky'olulagala lw'ekimera",
  uploadSub: 'Sika osuule wano, oba kozesa amapeesa wansi',
  btnUpload: 'Teeka Ekifaananyi',
  btnTakePhoto: 'Kwata Ekifaananyi',
  btnDemoImage: "Kozesa Ekifaananyi ky'Okugezesa",
  uploadNote: 'JPEG, PNG oba WebP · Tekisukka 10 MB',
  imageReady: 'Ekifaananyi kitegekeddwa okukeberwa',
  btnAnalyze: 'Kebera Ekimera',
  btnChooseDifferent: 'Londa ekifaananyi ekirala',
  removeImage: 'Ggyawo ekifaananyi',
  uploadedLeafAlt: 'Olulagala oluteekeddwa',
  analyzingTitle: 'Tukebera ekimera…',
  analyzingSub: "AI eraba endabika y'olulagala n'obubonero bw'obulwadde",
  analysisProgress: "Enkulaakulana y'okukebera",
  confidence: 'Obukakafu',
  severity: 'Obuzito',
  recommendedActions: "Ebiragiroeby'okukola",
  disclaimer: "Kino kiva ku AI — kakasa eby'amakulu n'abakozi b'ebyobulimi mu kitundu kyo.",
  btnAnalyzeAnother: 'Kebera ekimera ekirala',
  errorTitle: 'Okukebera tekusobose',
  btnTryAgain: 'Ddamu Ogezeeko',
  errInvalidType: 'Kozesa ekifaananyi kya JPEG, PNG, oba WebP.',
  errTooLarge: 'Ekifaananyi kiteekwa okuba wansi wa 10 MB.',
  errNetwork: 'Tetusobola kutuuka ku sseeva. Kebera yintaneeti oddemu ogezeeko.',
  errServer: 'Okukebera tekunnategeka. Ddamu ogezeeko mu katono.',
  errImageTooLarge: 'Ekifaananyi kinene nnyo. Kozesa ekiri wansi wa 10 MB.',
  errAnalyzeFailed: 'Tetusobose kukebera ekifaananyi kino. Kwata olulagala olwolekera obulungi mu musana.',
  errDemoMissing: "Ekifaananyi ky'okugezesa tekiriwo. Teeka ekifaananyi kyo ky'olulagala.",
  errDemoRead: "Tetusobose kusoma ekifaananyi ky'okugezesa.",
  whatAILooksFor: 'AI enoonya ki',
  leafDiscolouration: 'Olulagala okukyusa langi',
  leafDiscolourationDesc: 'Okufuuka kyenvu, okufuuka kitaka, oba langi ezitali za bulijjo',
  lesionPatterns: 'Amabala ku lulagala',
  lesionPatternsDesc: 'Amabala, emiggo, oba ebitundu ebyokye ku lulagala',
  textureChanges: "Enkyukakyuka y'olulagala",
  textureChangesDesc: 'Endabika eya mosaic, okugobagoba, oba olulagala olutalabika bulungi',
  structuralDamage: "Okonooneka kw'olulagala",
  structuralDamageDesc: 'Okunafuwa, okukyusa, oba olulagala okufuuka obubi',
  tipsTitle: "Eby'okukola ofune ebirungi",
  tip1: 'Kozesa omusana gw\'eggulo, tokozesa flash',
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
  comingSoonNote: "Ekimera kino kikyali mu nteekateeka yaffe. Tujja kulabula abo be tukolagana nabo bwe kinaabeerawo.",

  /* Nav */
  navDashboard: 'Olupapula Olukulu',
  navScan: "Kebera Olulagala lw'Ekimera",
  navHistory: 'Ebyakeberwako',
  navWeather: 'Obudde',
  navOutbreaks: 'Obulwadde mu Kitundu',
  navProfile: "Akawunti y'Ennimiro",
  navAssistant: 'Omuyambi wa AI',
  navPlans: "Endagaano n'Amanukuvu",
  navSettings: 'Entegeka',
  navSignOut: 'Fuluma',

  /* Auth */
  authSignIn: 'Yingira',
  authSignUp: 'Kola Akawunti',
  authCreateAccount: "Kola Akawunti y'Omulimi",
  authWelcomeBack: 'Tukusanyukidde okuddayo',
  authPhone: 'Enamba ya Simu',
  authEmail: 'Aderesi ya Imeyili',
  authPassword: "Ekigambo ky'Okulinda",
  authOtp: "Koodi y'Okukakafu",
  authSendOtp: 'Tuma Koodi',
  authVerifyOtp: 'Kakasa Koodi',
  authOrEmail: 'Oba kozesa imeyili ne pasuwaadi',
  authForgotPassword: 'Owazze pasuwaadi?',
  authNoAccount: 'Tolina akawunti?',
  authHaveAccount: 'Olina akawunti?',
  authAgreeTo: "Okukolela akawunti, okiriza",
  authPrivacyPolicy: "Emitendera y'Ebyama",
  authTerms: "Amateeka g'Okukozesa",
  authSigningIn: 'Tuyingira…',
  authCreating: 'Tukola akawunti…',
  authEmailPlaceholder: 'imeyili@yo.com',
  authPhonePlaceholder: '+256 7XX XXX XXX',
  authPasswordPlaceholder: 'Obungi: ebwogero 8',

  /* Onboarding */
  onboardTitle: "Teeka akawunti y'omulimi",
  onboardSub: 'Tusobole okukuyamba obulungi. Oyinza okusalawo n\'okumaliriza ebbanga eddako.',
  onboardStep1: 'Ebyako',
  onboardStep2: "Ekifo ky'Ennimiro",
  onboardStep3: 'Ebirime Byawe',
  onboardStep4: "Amakubye n'Okukiriza",
  onboardFarmerName: 'Erinnya Lyonna',
  onboardFarmerNamePlaceholder: 'Erinnya lyawe',
  onboardFarmName: "Erinnya ry'Ennimiro",
  onboardFarmNamePlaceholder: "Ng.: Ennimiro ya Kigezi",
  onboardDistrict: 'Disitulikiti',
  onboardSubCounty: 'Sab-Kowunti',
  onboardParish: 'Pawulesi',
  onboardVillage: 'Kyalo',
  onboardGpsLabel: 'Ekifo kya GPS',
  onboardGpsConsent: "Yiga SmartFarmer okuteeka ekifo kya simu yo okusobola okukuwa obudde n'obulwadde obukyali mu kitundu kyo",
  onboardCrops: 'Ebirime Ebyalimwa',
  onboardFarmSize: "Obunene bw'Ennimiro",
  onboardFarmSizeUnit: 'Enziga',
  onboardFarmingType: "Ekika ky'Okulima (si kyetaagibwa)",
  onboardConsentTitle: 'Engeri gye tukozesa amakubye go',
  onboardConsentBody: "SmartFarmer ekozesa amafaanana g'okukebera n'ekifo kyo okwonogereza okukebera obulwadde n'okukola akabonero ka kitundu. Ebyako si biweebwa abamulimi abalala. Oyinza okuggyako okukiriza oba okuzikiriza amakubye go awa linga mu Entegeka.",
  onboardConsentCheck: 'Ntegedde era nkiriza SmartFarmer okukozesa amakubye gange nga byategekezebwa waggulu',
  onboardSkip: 'Salira wansi kati',
  onboardNext: 'Ddako',
  onboardBack: 'Emabega',
  onboardFinish: 'Genda ku Lupapula Lwange',
  onboardComplete: 'Akawunti eteekeddwa',

  /* Dashboard */
  dashGreeting: 'Wasuze otya',
  dashScansUsed: 'okukebera kwakozesebwa',
  dashScansOf: 'mu',
  dashScanToday: 'Kebera Olulagala',
  dashChatCredits: 'Amanukuvu ga chat',
  dashCreditsLeft: 'asigadde leero',
  dashRecentScans: 'Okukebera Okuggwa Ku Maaso',
  dashNoScans: "Tewali kukebera. Kwata ekifaananyi ky'olulagala lw'ekimera okutandika.",
  dashNearbyAlert: "Akabonero k'Obulwadde Okumpi",
  dashUpgrade: 'Funa ebisingawo ne Pro',
  dashUpgradeSub: "Tegeka okukebera 30 ku mwezi, ebyakeberwako byonna, n'akabonero ak'olubereberye.",
  dashUpgradeBtn: 'Laba Endagaano',
  dashWeatherLoading: "Tufuula amakubye g'obudde…",
  dashWeatherError: "Amakubye g'obudde gabeererawo",
  dashViewAll: 'Laba byonna',

  /* Scan */
  scanTitle: "Kebera Olulagala lw'Ekimera",
  scanSub: "Kwata oba teeka ekifaananyi ky'olulagala olukolimbye okukebererwa kwa AI.",
  scanSelectCrop: "Ekika ky'ekimera",
  scanSymptomNotes: "Ebiwandiiko by'obubonero (si kyetaagibwa)",
  scanSymptomPlaceholder: "Tegeeza ekyolaba, ng. amabala omulembe ku maleeba ag'awansi okuva mu wiiki eyashira",
  scanAffectedArea: "Ebitundu ebikolimbye (%)",
  scanSaveHistory: 'Tereka mu Ebyakeberwako',
  scanShareDownload: 'Pakua Lipooti',
  scanAskAssistant: 'Buuza Omuyambi',
  scanScanAnother: 'Kebera Olulagala Olulala',
  scanInconclusiveTitle: 'Tetwakubangamu ekirowoozo kyakakafu',
  scanInconclusiveBody: "Ekifaananyi oba obubonero si butuufu okufuna ekirowoozo kyakakafu. Kwata ekifaananyi n'omusana omulungi, oba yambagana n'omusuubuzi w'obulimi.",
  scanLimitReached: "Obugwanyu bw'okukebera bwakomekezebwa",
  scanLimitBody: "Okozesezza okukebera kwonna kw'olwaleero. Ggira ku Pro okufuna okukebera 30 ku mwezi.",
  scanVisibleSymptoms: 'Obubonero Obulabirika',
  scanNextSteps: "Ensonga ez'Okukola Eddako",
  scanPrevention: "Okulindirira n'Okulabirira",
  scanContactExtension: "Dda yambagana n'omulabirizi wa gavumenti",
  scanDisclaimerFull: "Kino kiri ekirowoozo kya AI, si ddagala eriweereddwako. Kakasa emiramwa emikulu n'omusuubuzi w'obulimi oba omulabirizi wa gavumenti.",
  scanSaved: 'Okukebera kwatereddwa mu ebyakeberwako',

  /* History */
  historyTitle: 'Ebyakeberwako',
  historySub: "Okukebera kwowe okutereeddwako n'ebiruwo bya AI.",
  historySearch: 'Noonya ekimera oba obulwadde…',
  historyFilterCrop: 'Ebimera Byonna',
  historyFilterDisease: 'Obulwadde Bwonna',
  historyFilterSeverity: 'Obukambwe Bwonna',
  historyFilterDate: 'Ennaku Zonna',
  historyEmpty: "Tewali kukebera kutereeddwako. Tandika kukebera amaleeba g'ebimera.",
  historyDelete: 'Sazaamu okukebera kuno',
  historyDeleteConfirm: 'Sazaamu okukebera kuno? Kino tekiyinzika kuddibwamu.',
  historyDownload: 'Pakua Lipooti',
  historyDetail: 'Laba Ebirimu',
  historyContributes: "Otereka mu makubye g'obulwadde obukyali mu kifo",
  historyOptedOut: 'Aterekedde (okusalawo)',

  /* Weather */
  weatherTitle: 'Obudde',
  weatherSub: "Obubeera bw'obudde leero n'ennaku 7 ezijja mu kitundu ky'ennimiro yo.",
  weatherCurrent: "Obubeera Bw'Obudde Leero",
  weatherForecast: "Okuteeba kw'Obudde Ennaku 7",
  weatherAlerts: "Akabonero k'Obudde",
  weatherNoAlerts: "Tewali kabonero k'obudde mu kitundu kyo.",
  weatherLoading: "Tufuula amakubye g'obudde…",
  weatherError: "Tetwakwata amakubye g'obudde. Kakasa omukutu era ogezeeko nate.",
  weatherRetry: 'Gezeeko Nate',
  weatherLastUpdated: 'Kivuunudde',
  weatherNoLocation: 'Tewali kifo kiteekeddwako',
  weatherSetLocation: "Teeka ekifo ky'ennimiro yo mu Profailo y'Ennimiro okufuna amakubye g'obudde agakuteekateekera.",
  weatherToday: 'Leero',
  weatherHumidity: 'Obusilu',
  weatherWind: 'Omuyaga',
  weatherRainChance: "Omukutu gw'enkuba",
  weatherFarmAdvice: "Obulangirizi bw'Ennimiro",
  weatherStaleWarning: "Amakubye g'obudde ganaatera okuba akulu. Nyiga 'Gezeeko Nate' okuviivuunya.",

  /* Outbreaks */
  outbreakTitle: 'Obulwadde Obukyali mu Kifo',
  outbreakSub: "Amakubye ag'ekibiina agakusanyiziddwa okuva ku nnimiro ezimpi.",
  outbreakNone: "Tewali bwambangizi bw'obulwadde obutuufu mu kitundu kyo kaakano. Ddayo oluvannyuma lw'okukusanyizibwa kw'ebiwandiiko ebisingawo.",
  outbreakReports: 'ebiwandiiko',
  outbreakTrend: 'Entimba',
  outbreakRising: 'Kweyongera',
  outbreakStable: 'Kwimirira',
  outbreakDeclining: 'Kwekkaatira',
  outbreakAlertInfo: 'Amakubye',
  outbreakAlertWatch: 'Labirira',
  outbreakAlertAttention: 'Obuzibu Obuteesa',
  outbreakConfirmed: 'Kakasibwa nga bwekiri',
  outbreakCommunityReport: "Ebiwandiiko by'ekibiina",
  outbreakPrivacyNote: "Amakubye ga busobozi, ekifo ddala ky'ennimiro, oba amafaanana si birimwamu mu byenvuuka bino.",
  outbreakThresholdNote: "Ebyenvuuka bilabirikira okuwedde ebiwandiiko ebisingawo okutuuka ku bungi bw'esinga.",
  outbreakContactExtension: "Yambagana n'Omulabirizi wa Gavumenti",
  outbreakFilterCrop: 'Ebimera Byonna',
  outbreakFilterDisease: 'Obulwadde Bwonna',
  outbreakFilterDate: 'Ebiro Byonna',
  outbreakFilterLocation: 'Ekifo Kyange',

  /* Profile */
  profileTitle: "Profailo y'Ennimiro",
  profileSub: "Labirira amakubye go g'omulimi n'ebya nnimiro yo.",
  profileFarmerInfo: "Amakubye g'Omulimi",
  profileFarmDetails: "Ebya Nnimiro",
  profileLanguage: 'Olulimi Olulondeddwa',
  profileNotifications: 'Akabonero',
  profileConsent: "Amakubye n'Okukiriza",
  profileSubscription: 'Endagaano',
  profileSave: 'Tereka Enkyukakyuka',
  profileSaving: 'Tutereka…',
  profileSaved: 'Enkyukakyuka zatereddwa',
  profileAddFarm: 'Yongera Ennimiro Endala',
  profileVerified: 'Kakasibwa',
  profileUnverified: 'Tekakasibwa',
  profileVerify: 'Kakasa',

  /* Assistant */
  assistantTitle: "Omuyambi wa AI w'Ennimiro",
  assistantSub: "Buuza ebibuuzo ku birime byawe, obulwadde, obudde, n'ebyenjigiriza z'ennimiro.",
  assistantPlaceholder: 'Buuza ekyaka ku birime byawe…',
  assistantSend: 'Tuma',
  assistantCreditsLeft: 'amanukuvu asigadde',
  assistantCreditWarning: 'Olina omanukuvu omu asigadde leero.',
  assistantOutOfCredits: "Okozesezza amanukuvu go gonna g'okwogera leero.",
  assistantGetMoreCredits: 'Funa Amanukuvu Amasingawo',
  assistantTyping: 'Omuyambi afikiira…',
  assistantError: 'Mbeera, sinasobola kukuwa ddulo kati. Gezeeko nate.',
  assistantDisclaimerTitle: 'Ku buyambi buno',
  assistantDisclaimerBody: "Omuyambi ono wa AI aawa obulangirizi bw'ennimiro bw'eby'ensatu. Si musuubuzi w'obulimi oba ssebbadde. Mu bibeera eby'obuzibu, buuza omulabirizi w'obulimi wa gavumenti.",
  assistantSuggest1: 'Nkola ki ku bulwadde buno?',
  assistantSuggest2: 'Enkuba ejja mu wiiki eno?',
  assistantSuggest3: 'Ngamba ebirime ebiri kumpi?',
  assistantSuggest4: "Kiki ekisobozesa amalalagala g'omuwogo gufuukira ga kyenvu?",
  assistantNewChat: 'Okwogera Okuggya',
  assistantLanguageSwitch: 'Kyusa olulimi',

  /* Plans */
  plansTitle: "Endagaano n'Amanukuvu",
  plansSub: "Sasula endagaano yo n'okukozesebwa kwayo.",
  planFree: 'Bwereere',
  planPro: 'Pro',
  planCurrent: 'Endagaano ya Kati',
  planUpgrade: 'Ggira ku Pro',
  planPerMonth: '/mwezi',
  planFreePrice: 'Bwereere',
  planProPrice: 'UGX 15,000',
  planBillingSetupRequired: 'Okuliipa tekiteekeddwako. Twogana natwe okutandika Pro.',
  planCreditsBalance: 'Amanukuvu Asigadde',
  planResetDate: 'Evuunuka',
  planScansRemaining: 'Okukebera okusigadde',
  planChatsRemaining: 'Amanukuvu ga kkooti asigadde',
  planCheckoutPlaceholder: 'Okuliipa kujja mangu',

  /* Settings */
  settingsTitle: 'Entegeka',
  settingsSub: "Okukima, ebyama, n'okulabirira akawunti.",
  settingsLanguage: 'Olulimi',
  settingsNotifications: "Akabonero ak'Okunyonyola",
  settingsWeatherAlerts: "Akabonero k'Obudde",
  settingsOutbreakAlerts: "Akabonero k'Obulwadde Obukyali",
  settingsDataContribution: "Tereka mu Makubye g'Obulwadde",
  settingsDataContributionBody: "Yiga ebiruwo by'okukebera ebitali na mabunga okuyingirako mu lipooti z'entimba z'obulwadde obukyali. Oyinza okusalawo n'okuggyako obutayonona ngeri zo.",
  settingsPrivacy: "Ebyama n'Amakubye",
  settingsExportData: 'Fulumya Amakubye Gange',
  settingsExportBody: "Pakua ekopi y'akawunti y'omulimi, ebyakeberwako, n'ebyokunyumba byawe.",
  settingsDeleteAccount: "Saba Okuzikiriza Akawunti",
  settingsDeleteBody: "Kino kuzaazaakiriza akawunti yo n'amakubye gonna ag'asinziira. Kino tekiyinzika kuddibwamu.",
  settingsDeleteConfirm: 'Yee, zikiriza akawunti yange',
  settingsSave: 'Tereka Entegeka',
  settingsSaved: 'Entegeka yatereddwa',

  /* General */
  loading: 'Tufuula…',
  error: 'Ekintu ekibi kiyise',
  retry: 'Gezeeko Nate',
  save: 'Tereka',
  cancel: 'Sazaamu',
  close: 'Ggalawo',
  confirm: 'Kakasa',
  delete: 'Sazaamu',
  edit: 'Kyusa',
  add: 'Yongera',
  back: 'Emabega',
  next: 'Ddako',
  done: 'Ggwerezezza',
  optional: 'si kyetaagibwa',
  required: 'kyetaagibwa',
  noData: 'Tewali kimu wano',
  upgrade: 'Ggira',
  signIn: 'Yingira',
  signOut: 'Fuluma',
  learnMore: 'Manya Ebisingawo',
  contactExtension: 'Buuza omulabirizi wa gavumenti',
  aiDisclaimer: "Ebiruwo bya AI biwa obuyambi, si buvunaanya, obulangirizi bw'obulimi obw'abaana oba abakulembeze ab'amanyi mu kitundu kyo.",
};

/* ══════════════════════════════════════════════════════════
   RUNYANKOLE (Lunyankole)
   ══════════════════════════════════════════════════════════ */
const nyn: AppTranslations = {
  /* Diagnosis */
  languageLabel: 'Orurimi',
  heroTitle: "Okukebera Endwara y'Ebihingwa",
  heroSubtitle: "Kwata nari teeka ekishushani ky'orubabi rw'ekihingwa. AI neereeba endwara kandi neekugambira eky'okukora.",
  uploadTitle: "Teeka ekishushani ky'orubabi rw'ekihingwa",
  uploadSub: 'Sika oteeke aha, nari kozesa ebipeesa ebirikuheera ahaishi',
  btnUpload: 'Teeka Ekishushani',
  btnTakePhoto: 'Kwata Ekishushani',
  btnDemoImage: "Kozesa Ekishushani ky'Okugezaho",
  uploadNote: 'JPEG, PNG nari WebP · Tikahise 10 MB',
  imageReady: 'Ekishushani kitegekiire okukeberwa',
  btnAnalyze: 'Kebera Ekihingwa',
  btnChooseDifferent: 'Hitamu ekishushani ekindi',
  removeImage: 'Ihamu ekishushani',
  uploadedLeafAlt: 'Orubabi oruteekirwe',
  analyzingTitle: 'Nitukebera ekihingwa…',
  analyzingSub: "AI neereeba orubabi n'ebimanyiso by'endwara",
  analysisProgress: "Enkora y'okukebera",
  confidence: 'Obwesigwa',
  severity: 'Obuhango',
  recommendedActions: "Ebikorwa by'okukora",
  disclaimer: "Eki kirikuva omu AI — kakasa eby'omugasho n'abakozi b'ebyobuhingi omu kyaro kyawe.",
  btnAnalyzeAnother: 'Kebera ekihingwa ekindi',
  errorTitle: 'Okukebera tikuhikire',
  btnTryAgain: 'Garuka Ogezaho',
  errInvalidType: 'Kozesa ekishushani kya JPEG, PNG, nari WebP.',
  errTooLarge: 'Ekishushani kiteekwa kuba ahaishi ya 10 MB.',
  errNetwork: 'Titubaasa kuhika aha sseeva. Reeba yintaneeti ogaruke ogezaho.',
  errServer: 'Okukebera tikyategekiira. Garuka ogezaho hatari kare.',
  errImageTooLarge: 'Ekishushani kinihingi. Kozesa ekyahaishi ya 10 MB.',
  errAnalyzeFailed: 'Titubaasa kukebera ekishushani eki. Kwata orubabi orureebekaho gye omu mushana.',
  errDemoMissing: "Ekishushani ky'okugezaho tikiriho. Teeka ekishushani kyawe ky'orubabi.",
  errDemoRead: "Titubaasa kusoma ekishushani ky'okugezaho.",
  whatAILooksFor: 'Ebi AI erireeba',
  leafDiscolouration: 'Orubabi okuhindura erangi',
  leafDiscolourationDesc: 'Okufuuka kyenvu, okufuuka kitaka, nari erangi ezitari za buriijo',
  lesionPatterns: 'Amabara aha rubabi',
  lesionPatternsDesc: 'Amabara, emigoye, nari ebitundu ebyokye aha rubabi',
  textureChanges: "Okuhinduka kw'orubabi",
  textureChangesDesc: "Ebishushani nk'eby'akakyenkye, okugongobera, nari orubabi orutari rurungi",
  structuralDamage: 'Okuhata orubabi',
  structuralDamageDesc: 'Okunywagirira, okugotama, nari orubabi okuhinduka obubi',
  tipsTitle: "Eby'okukora ofune ebirungi",
  tip1: 'Kozesa omushana gw\'enjuba, otakozise flash',
  tip2: 'Kwata orubabi orurikukosebwa muno',
  tip3: 'Ijura ekishushani n\'orubabi',
  tip4: "Irinda ebishushani ebitari byeru nari ebyomwirima",
  supportedCropsLabel: 'Ebihingwa ebiheebwa',
  supportedCropsTitle: 'Ebihingwa Ebiheebwa',
  supportedCropsSub: 'AI neebaasa okukebera endwara omu bihingwa ebi. Nyiga ekihingwa orebe endwara eziishobora okukeberwa.',
  cropAvailable: 'Kiriho',
  cropComingSoon: 'Kikwija',
  cropResearch: 'Okunoonyereza',
  detectableConditions: 'Endwara eziishobora okukeberwa:',
  conditionsInDev: 'Endwara eziri omu nkora:',
  tryWithCrop: 'Noyenda okukebera ekihingwa kyawe?',
  btnTryDiagnosis: 'Gezaho Okukebera',
  comingSoonNote: "Ekihingwa eki kikyari omu mugambi gwaitu. Nitwija kubwira abakwatanisa nari kiriho.",

  /* Nav */
  navDashboard: 'Ekitebe Ekikuru',
  navScan: "Kebera Orubabi rw'Ekihingwa",
  navHistory: 'Ebyashwerwa',
  navWeather: 'Obuheeru',
  navOutbreaks: 'Endwara mu Kyaro',
  navProfile: "Profairu y'Eirima",
  navAssistant: 'Omufura wa AI',
  navPlans: "Endagaano n'Amanukuvu",
  navSettings: 'Okuteeka',
  navSignOut: 'Sohoka',

  /* Auth */
  authSignIn: 'Ingira',
  authSignUp: 'Kola Akawunti',
  authCreateAccount: "Kola Akawunti y'Omuhingwa",
  authWelcomeBack: 'Tukusiimire ogugaruka',
  authPhone: 'Enamba ya Simu',
  authEmail: 'Aderesi ya Imeyiri',
  authPassword: "Ekigambo ky'Okulinda",
  authOtp: "Koodi y'Okukakasa",
  authSendOtp: 'Tuma Koodi',
  authVerifyOtp: 'Kakasa Koodi',
  authOrEmail: 'Nari kozesa imeyiri na pasuwaadi',
  authForgotPassword: 'Owazize pasuwaadi?',
  authNoAccount: 'Nta kawunti oyine?',
  authHaveAccount: 'Ufite akawunti?',
  authAgreeTo: "Okutera akawunti, okiriza",
  authPrivacyPolicy: "Amategeko g'Ebyama",
  authTerms: "Amategeko g'Okukozesa",
  authSigningIn: 'Tuingira…',
  authCreating: 'Tukola akawunti…',
  authEmailPlaceholder: 'imeyiri@yawe.com',
  authPhonePlaceholder: '+256 7XX XXX XXX',
  authPasswordPlaceholder: 'Nibura obwogero 8',

  /* Onboarding */
  onboardTitle: "Teeka profairu y'omuhingwa",
  onboardSub: "Tushobora okugufasha obulungi. Ushobora kusalawo n'okumaliza oluvannyuma.",
  onboardStep1: 'Ebyawe',
  onboardStep2: "Kifo ky'Eirima",
  onboardStep3: 'Ebihingwa Byawe',
  onboardStep4: "Amakuru n'Okukiriza",
  onboardFarmerName: 'Amaani Gaawe Gonna',
  onboardFarmerNamePlaceholder: 'Eizina ryawe',
  onboardFarmName: "Eizina ry'Eirima",
  onboardFarmNamePlaceholder: "Nga: Eirima rya Kigezi",
  onboardDistrict: 'Distriki',
  onboardSubCounty: 'Sab-Kaunti',
  onboardParish: 'Parishi',
  onboardVillage: 'Kyaro',
  onboardGpsLabel: 'Ekifo kya GPS',
  onboardGpsConsent: "Yiga SmartFarmer kuteeka ekifo kya simu yawe okubaasa okufuna obuheeru n'obuhangirizi bw'endwara mu kyaro kyawe",
  onboardCrops: 'Ebihingwa Ebishingaho',
  onboardFarmSize: "Obunene bw'Eirima",
  onboardFarmSizeUnit: 'Enziga',
  onboardFarmingType: "Ekika ky'Okurimira (si kyetaagibwa)",
  onboardConsentTitle: 'Engeri tukozesamu amakuru gawe',
  onboardConsentBody: "SmartFarmer ikozesa amafoto g'okukebera n'ekifo kyawe okwongera okunoonyereza kw'endwara n'okukoraho akabonero k'endwara mu kyaro. Ebyawe si biweebwa abahingwa abalala. Ushobora gufata okukiriza oba gukuraho amakuru gawe hariho mu Okuteeka.",
  onboardConsentCheck: "Ntegeire kandi nkiriza SmartFarmer gukozesa amakuru gange nk'ebitegekezibwe hariho",
  onboardSkip: 'Salawo kakaano',
  onboardNext: 'Ekirikurikiraho',
  onboardBack: 'Garuka Enyuma',
  onboardFinish: 'Genda ku Kitebe Kyange',
  onboardComplete: 'Profairu eteekwa',

  /* Dashboard */
  dashGreeting: 'Oraire ota',
  dashScansUsed: 'okukebera kwakozeswa',
  dashScansOf: 'omu',
  dashScanToday: "Kebera Orubabi rw'Ekihingwa",
  dashChatCredits: 'Amanukuvu ga Kkooti',
  dashCreditsLeft: 'asigaire erizooba',
  dashRecentScans: 'Okukebera Okuggwa ku Maaso',
  dashNoScans: "Nta kukebera. Kwata ekishushani ky'orubabi rw'ekihingwa okutandika.",
  dashNearbyAlert: "Akabonero k'Endwara Okumpi",
  dashUpgrade: 'Funa ebisingawo na Pro',
  dashUpgradeSub: "Malamusaawo okukebera 30 ku mwezi, ebyashwerwa byona, n'akabonero ak'olubereberye.",
  dashUpgradeBtn: 'Raba Endagaano',
  dashWeatherLoading: 'Tufuula obuheeru…',
  dashWeatherError: 'Obuheeru butaweebwaho',
  dashViewAll: 'Raba byona',

  /* Scan */
  scanTitle: "Kebera Orubabi rw'Ekihingwa",
  scanSub: "Kwata nari teeka ekishushani ky'orubabi orukonona okukeberwa kwa AI.",
  scanSelectCrop: "Ekika ky'ekihingwa",
  scanSymptomNotes: "Ebyandikwa by'ebimanyiso (si kyetaagibwa)",
  scanSymptomPlaceholder: "Tegeeza ekiraba, nga: amabara ga kyenvu ku mabaaho ag'ahaishi okuva owomu owashira",
  scanAffectedArea: "Ebitundu ebikonona (%)",
  scanSaveHistory: 'Tereka mu Ebyashwerwa',
  scanShareDownload: 'Pakua Lipooti',
  scanAskAssistant: 'Baza Omufura',
  scanScanAnother: 'Kebera Orubabi Orundi',
  scanInconclusiveTitle: 'Kwetuza kuteekurasigwa',
  scanInconclusiveBody: "Ekishushani nari ebimanyiso si bigyeyo okufuna ebishongore ebisingye. Kwata ekishushani mu mushana murungi, nari baza omushwezi w'ebirime.",
  scanLimitReached: "Obugwanyu bw'okukebera bwakomerezwa",
  scanLimitBody: "Okozeseza okukebera kwona kw'erizooba. Ggira Pro okufuna okukebera 30 ku mwezi.",
  scanVisibleSymptoms: 'Ebimanyiso Ebiraba',
  scanNextSteps: "Ebikorwa Ebirikirikurikiraho",
  scanPrevention: "Okulinda n'Okulabirira",
  scanContactExtension: "Edda kubaza omushwezi wa gavumenti",
  scanDisclaimerFull: "Eki niryo lipooti y'okukebera kwa AI, si ddagala eriteekebwaho obulabirizi. Kakasa emiramwa mishasha n'omushwezi w'ebirime oba omushwezi wa gavumenti.",
  scanSaved: 'Okukebera kwatereka mu ebyashwerwa',

  /* History */
  historyTitle: 'Ebyashwerwa',
  historySub: "Okukebera kwowe okwatereka n'ebiruwo bya AI.",
  historySearch: 'Noonya ekihingwa nari endwara…',
  historyFilterCrop: 'Ebihingwa Byona',
  historyFilterDisease: 'Endwara Yona',
  historyFilterSeverity: 'Obuhango Bwona',
  historyFilterDate: 'Ennaku Zona',
  historyEmpty: "Nta kukebera. Tandika kukebera amabaaho g'ebihingwa okuzimba ebyashwerwa byawe.",
  historyDelete: 'Kuraho okukebera',
  historyDeleteConfirm: 'Kuraho akawunti kano? Eki tekishobora kuddibwamu.',
  historyDownload: 'Pakua Lipooti',
  historyDetail: 'Raba Ebirimu',
  historyContributes: "Yungirako mu makuru g'endwara mu kyaro",
  historyOptedOut: 'Tagumizaho (okusalawo)',

  /* Weather */
  weatherTitle: 'Obuheeru',
  weatherSub: "Obubeera bw'obuheeru bw'erizooba n'ennaku 7 ezirikurikiraho ku eirima ryawe.",
  weatherCurrent: "Obubeera Bw'Obuheeru Bw'Erizooba",
  weatherForecast: "Ebyenfuufu by'Ennaku 7",
  weatherAlerts: "Akabonero k'Obuheeru",
  weatherNoAlerts: "Nta kabonero k'obuheeru mu kyaro kyawe.",
  weatherLoading: "Tufuula amakuru g'obuheeru…",
  weatherError: "Twebakwata amakuru g'obuheeru. Kakasa okussa kw'omukutu era ogezaho.",
  weatherRetry: 'Gezaho Nate',
  weatherLastUpdated: 'Kihindurwa',
  weatherNoLocation: 'Nta kifo kiteekwa',
  weatherSetLocation: "Teeka ekifo ky'eirima ryawe mu Profairu y'Eirima okufuna obuheeru obuteekateeka.",
  weatherToday: 'Erizooba',
  weatherHumidity: 'Obusilu',
  weatherWind: 'Omuyaga',
  weatherRainChance: "Omukutu gw'enkuba",
  weatherFarmAdvice: "Obulangirizi bw'Eirima",
  weatherStaleWarning: "Amakuru g'obuheeru gashobora kuba mahango. Nyiga gezaho okuviivuunya.",

  /* Outbreaks */
  outbreakTitle: 'Endwara mu Kyaro',
  outbreakSub: "Amakuru ag'okukunganya okuva ku mairo ampi — tarikuteekaho mazina ga bantu.",
  outbreakNone: "Nta bwambangizi bw'endwara butuufu mu kyaro kyawe kakaano. Garuka oluvannyuma lw'okukusanyizibwa kw'ebiwandiiko ebisingawo.",
  outbreakReports: 'ebiwandiiko',
  outbreakTrend: 'Entimba',
  outbreakRising: 'Kwaka',
  outbreakStable: 'Kwima',
  outbreakDeclining: 'Kwira',
  outbreakAlertInfo: 'Amakuru',
  outbreakAlertWatch: 'Labirira',
  outbreakAlertAttention: 'Obwanguka Obuniha',
  outbreakConfirmed: 'Kakasibwa mu lusegere',
  outbreakCommunityReport: "Ebiwandiiko by'ekibiina",
  outbreakPrivacyNote: "Ebyawe byona, ekifo ddala ky'eirima, nari amafoto si birimwamu mu byenfuufu bibi.",
  outbreakThresholdNote: "Ebyenfuufu biraba oluvannyuma lw'okukusanyizibwa kw'ebiwandiiko ebisingawo okutuuka ku bunene bw'okulirizibwa.",
  outbreakContactExtension: 'Baza Omushwezi wa Gavumenti',
  outbreakFilterCrop: 'Ebihingwa Byona',
  outbreakFilterDisease: 'Endwara Yona',
  outbreakFilterDate: 'Ebiro Byona',
  outbreakFilterLocation: 'Kyaro Kyange',

  /* Profile */
  profileTitle: "Profairu y'Eirima",
  profileSub: "Sasula amakuru gawe g'omuhingwa n'eby'eirima ryawe.",
  profileFarmerInfo: "Amakuru g'Omuhingwa",
  profileFarmDetails: "Eby'Eirima",
  profileLanguage: 'Orurimi Oruhingirwe',
  profileNotifications: 'Akabonero',
  profileConsent: "Amakuru n'Okukiriza",
  profileSubscription: 'Endagaano',
  profileSave: 'Tereka Ebihinduwe',
  profileSaving: 'Tutereka…',
  profileSaved: 'Ebihinduwe byatereka',
  profileAddFarm: 'Yungirako Eirima Riindi',
  profileVerified: 'Kakasibwa',
  profileUnverified: 'Tekakasibwa',
  profileVerify: 'Kakasa',

  /* Assistant */
  assistantTitle: "Omufura wa AI w'Eirima",
  assistantSub: "Baza emibuuzo ku bihingwa byawe, endwara, obuheeru, n'ebyenjigiriza z'eirima.",
  assistantPlaceholder: 'Baza ekyaka ku bihingwa byawe…',
  assistantSend: 'Tuma',
  assistantCreditsLeft: 'amanukuvu asigaire',
  assistantCreditWarning: 'Ufite omanukuvu omwe asigaire erizooba.',
  assistantOutOfCredits: "Okozeseza amanukuvu gawe gona g'okunyumba erizooba.",
  assistantGetMoreCredits: 'Funa Amanukuvu Amasingawo',
  assistantTyping: 'Omufura afikiira…',
  assistantError: 'Nshoreka, sinaakugamba kakaano. Gezaho nate.',
  assistantDisclaimerTitle: 'Ku bufura buno',
  assistantDisclaimerBody: "Omufura ono wa AI aaha obulangirizi bw'eirima bw'eby'ensatu. Si mushwezi w'ebirime nari ssebbadde. Mu bibeera eby'obuzibu, baza omushwezi w'ebirime wa gavumenti.",
  assistantSuggest1: 'Ndora ki ku ndwara ino?',
  assistantSuggest2: 'Enkuba ejja mu wiiki ino?',
  assistantSuggest3: 'Nzigama ebihingwa ebiri kumpi?',
  assistantSuggest4: "Kiki ekisobozesa amabaaho g'omuwogo gufuukira ga kyenvu?",
  assistantNewChat: 'Okunyumba Okuggya',
  assistantLanguageSwitch: 'Hindura orurimi',

  /* Plans */
  plansTitle: "Endagaano n'Amanukuvu",
  plansSub: "Sasula endagaano yawe n'okukozesebwa kwayo.",
  planFree: 'Bwereere',
  planPro: 'Pro',
  planCurrent: 'Endagaano ya Kati',
  planUpgrade: 'Ggira ku Pro',
  planPerMonth: '/omwezi',
  planFreePrice: 'Bwereere',
  planProPrice: 'UGX 15,000',
  planBillingSetupRequired: 'Okuliipa tekiteekwa. Twogana natwe okutandika Pro.',
  planCreditsBalance: 'Amanukuvu Asigaire',
  planResetDate: 'Evuunuka',
  planScansRemaining: 'Okukebera okusigaire',
  planChatsRemaining: 'Amanukuvu ga kkooti asigaire',
  planCheckoutPlaceholder: 'Okuliipa kujja mangu',

  /* Settings */
  settingsTitle: 'Okuteeka',
  settingsSub: "Okukima, ebyama, n'okulabirira akawunti.",
  settingsLanguage: 'Orurimi',
  settingsNotifications: "Akabonero ak'Okubwirwa",
  settingsWeatherAlerts: "Akabonero k'Obuheeru",
  settingsOutbreakAlerts: "Akabonero k'Endwara mu Kyaro",
  settingsDataContribution: "Yungirako mu Makuru g'Endwara",
  settingsDataContributionBody: "Yiga ebiruwo by'okukebera ebyokukunganya kuyungirako mu lipooti z'entimba z'endwara mu kyaro. Ushobora kusalawo n'ukuraho nta ngeri eshindikwa.",
  settingsPrivacy: "Ebyama n'Amakuru",
  settingsExportData: 'Fulumya Amakuru Gange',
  settingsExportBody: "Pakua eddoboozi ry'profairu y'omuhingwa, ebyashwerwa, n'ebyokunyumba byawe.",
  settingsDeleteAccount: "Saba Okukuraho Akawunti",
  settingsDeleteBody: "Eki kizaazaakiriza akawunti yawe n'amakuru gona gaagaarikiire. Eki tekishobora kuddibwamu.",
  settingsDeleteConfirm: 'Yee, kuraho akawunti yange',
  settingsSave: 'Tereka Okuteeka',
  settingsSaved: 'Okuteeka kwatereka',

  /* General */
  loading: 'Tufuula…',
  error: 'Ekintu ekibi kyahikire',
  retry: 'Gezaho Nate',
  save: 'Tereka',
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
  aiDisclaimer: "Ebiruwo bya AI biha obufura, si buvunaanya, obulangirizi bw'ebirime obutuufu nari abashwezi ba gavumenti b'omu kyaro kyawe.",
};

/* ══════════════════════════════════════════════════════════
   EXPORTS
   ══════════════════════════════════════════════════════════ */
export const TRANSLATIONS: Record<Locale, AppTranslations> = { en, lg, nyn };

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
    Maize: 'Kasooli',
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

/** t() — get a translated string with English fallback */
export function t(locale: Locale, key: keyof AppTranslations): string {
  return TRANSLATIONS[locale]?.[key] ?? TRANSLATIONS['en'][key] ?? key;
}
