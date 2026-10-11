export type Language = 'en' | 'hi';

export const translations = {
  en: {
    // Navigation & Common
    brandName: 'ScrapSetu',
    brandTagline: 'A Digital Bridge to Sustainable Recycling',
    home: 'Home',
    howItWorks: 'How It Works',
    scrapRates: 'Scrap Rates',
    impact: 'Eco Impact',
    dashboard: 'Dashboard',
    login: 'Login',
    register: 'Sign Up',
    logout: 'Logout',
    demoMode: 'College Demo Switcher',
    switchRole: 'Switch Role',
    quickDemoHelp: 'Click any role badge to test immediate access:',
    language: 'Language',
    hindi: 'हिंदी',
    english: 'English',

    // Roles
    roleHousehold: 'Household',
    roleBusiness: 'Business',
    roleCollector: 'Kabadiwala (Collector)',
    roleRecycler: 'Recycling Facility',
    roleAdmin: 'Administrator',

    // Hero & Landing
    heroTitle: 'Turn Scrap Into Value. Empower Informal Collectors.',
    heroSubtitle:
      'India’s first inclusive digital bridge connecting waste generators, doorstep kabadiwalas, and certified recycling mills with fair prices and verified ecological accountability.',
    bookPickupBtn: 'Schedule Scrap Pickup',
    viewMandiRatesBtn: 'Explore Today’s Rates',
    joinAsCollectorBtn: 'Kabadiwala Partner Onboarding',
    
    // Impact highlights
    totalRecycled: 'Kg Recycled',
    co2Averted: 'Kg CO₂ Averted',
    fairPayouts: '₹ Paid Directly',
    activeKabadiwalas: 'Verified Collectors',

    // Workflow Steps
    step1Title: '1. Request in 30 Seconds',
    step1Desc: 'Select paper, plastics, or metals. Snap a photo for AI category assistance and instant rate preview.',
    step2Title: '2. Smart Local Matching',
    step2Desc: 'Assigned to trusted, verified neighbourhood kabadiwalas based on distance and vehicle capacity.',
    step3Title: '3. Digital Scale & Fair Weighing',
    step3Desc: 'Collector weighs on calibrated scales. Mutually agreed rates recorded in real-time.',
    step4Title: '4. Instant Digital Receipt',
    step4Desc: 'Receive a tamper-evident receipt via UPI or Cash. Direct lineage traced to certified recycling plants.',

    // Pickup Creation
    createPickupTitle: 'Schedule a Scrap Pickup',
    createPickupSubtitle: 'Get door-step service with certified digital scales and fair rates.',
    pickupAddress: 'Pickup Address',
    addNewAddress: '+ Add New Address',
    preferredDate: 'Preferred Pickup Date',
    preferredTimeSlot: 'Preferred Time Window',
    materialsList: 'Materials to Recycle',
    addMaterial: '+ Add Another Category',
    selectCategory: 'Select Scrap Category',
    estimatedQuantity: 'Estimated Quantity (kg)',
    aiVisionHelper: 'AI Material Vision Classifier',
    aiVisionHelperSubtitle: 'Upload a picture of your waste to detect its category and estimated value.',
    rateDisclaimer:
      'Rates shown are indicative demonstration benchmarks. Final payment is calculated after on-site physical weighing.',
    submitPickupBtn: 'Confirm Pickup Booking',
    calculating: 'Calculating fair valuation...',

    // Collector Dashboard
    collectorBoardTitle: 'कबाड़ीवाला जॉब बोर्ड (Job Terminal)',
    nearbyJobs: 'Nearby Open Pickups',
    myActiveJobs: 'My Active Pickups',
    todayEarnings: 'Today’s Earnings',
    weeklyEarnings: 'Weekly Earnings',
    acceptJobBtn: 'पिकअप स्वीकार करें (Accept Pickup)',
    arrivedBtn: 'पहुंच गए (Mark Arrived / In Progress)',
    enterWeighingBtn: 'वजन दर्ज करें (Enter Final Weight & Pay)',
    routeOptimizerBtn: 'स्मार्ट रूट प्लानर (Optimized Route)',

    // Recycler Dashboard
    recyclerPortalTitle: 'Recycling Plant Management Portal',
    buyingRateSheet: 'Active Buying Offers',
    postNewOffer: '+ Post Buying Rate',
    recordIntakeSlip: 'Record Inbound Weight Slip',
    monthlyThroughput: 'Total Material Processed',

    // Admin Dashboard
    adminConsoleTitle: 'Regulatory & Governance Console',
    verificationQueue: 'Verification & KYC Queue',
    priceManagement: 'Benchmark Mandi Rate Sheet',
    disputeCenter: 'Disputes & Grievance Moderation',
    auditLedger: 'Cryptographic Audit Trail',

    // Statuses
    statusOpen: 'Looking for Collector',
    statusAccepted: 'Collector Assigned',
    statusInProgress: 'Weighing on Site',
    statusCompleted: 'Settled & Completed',
    statusCancelled: 'Cancelled',
    statusDisputed: 'Dispute Under Review',
  },

  hi: {
    // Navigation & Common
    brandName: 'स्क्रैपसेतु',
    brandTagline: 'टिकाऊ पुनर्चक्रण का डिजिटल सेतु',
    home: 'होम',
    howItWorks: 'यह कैसे काम करता है',
    scrapRates: 'कबाड़ मंडी भाव',
    impact: 'पर्यावरण प्रभाव',
    dashboard: 'डैशबोर्ड',
    login: 'लॉग इन',
    register: 'साइन अप',
    logout: 'लॉग आउट',
    demoMode: 'डेमो रोल स्विचर',
    switchRole: 'भूमिका बदलें',
    quickDemoHelp: 'डेमो के लिए किसी भी भूमिका पर तुरंत क्लिक करें:',
    language: 'भाषा',
    hindi: 'हिंदी',
    english: 'English',

    // Roles
    roleHousehold: 'घरेलू उपभोक्ता',
    roleBusiness: 'व्यावसायिक / दुकान',
    roleCollector: 'कबाड़ीवाला (कलेक्टर)',
    roleRecycler: 'रीसाइक्लिंग फैक्ट्री',
    roleAdmin: 'प्रशासक (Admin)',

    // Hero & Landing
    heroTitle: 'कबाड़ का सही दाम। कबाड़ीवालों का डिजिटल सम्मान।',
    heroSubtitle:
      'घरों, दुकानों, स्थानीय कबाड़ीवालों और प्रमाणित रीसाइक्लिंग मिलों को निष्पक्ष दरों और डिजिटल रसीदों से जोड़ने वाला भारत का पहला डिजिटल सेतु।',
    bookPickupBtn: 'कबाड़ पिकअप बुक करें',
    viewMandiRatesBtn: 'आज के मंडी भाव देखें',
    joinAsCollectorBtn: 'कबाड़ीवाला साथी बनें',

    // Impact highlights
    totalRecycled: 'किग्रा रिसाइकल हुआ',
    co2Averted: 'किग्रा कार्बन बचत',
    fairPayouts: '₹ प्रत्यक्ष भुगतान',
    activeKabadiwalas: 'सत्यापित कबाड़ीवाले',

    // Workflow Steps
    step1Title: '१. ३० सेकंड में अनुरोध',
    step1Desc: 'कागज़, प्लास्टिक या लोहा चुनें। फोटो अपलोड करके AI से श्रेणी पहचानें और भाव देखें।',
    step2Title: '२. नजदीकी कबाड़ीवाला मैच',
    step2Desc: 'दूरी और वाहन क्षमता के आधार पर आपके इलाके के विश्वसनीय कबाड़ीवाले को आबंटित।',
    step3Title: '३. डिजिटल कांटे पर सही तौल',
    step3Desc: 'कबाड़ीवाला प्रमाणित कांटे से तौलेगा। दोनों पक्षों की सहमति से दर तय।',
    step4Title: '४. तुरंत पक्की डिजिटल रसीद',
    step4Desc: 'कैश या UPI से तुरंत भुगतान। प्रमाणित रीसाइक्लिंग मिलों तक पूर्ण पारदर्शिता।',

    // Pickup Creation
    createPickupTitle: 'कबाड़ पिकअप शेड्यूल करें',
    createPickupSubtitle: 'घर बैठे सही वजन और उचित मंडी भाव पर सेवा पाएं।',
    pickupAddress: 'पिकअप का पता',
    addNewAddress: '+ नया पता जोड़ें',
    preferredDate: 'पसंदीदा तारीख',
    preferredTimeSlot: 'पसंदीदा समय',
    materialsList: 'कबाड़ की किस्में',
    addMaterial: '+ अन्य सामग्री जोड़ें',
    selectCategory: 'कबाड़ की श्रेणी चुनें',
    estimatedQuantity: 'अनुमानित वजन (किग्रा)',
    aiVisionHelper: 'AI कबाड़ पहचान सहायक',
    aiVisionHelperSubtitle: 'कबाड़ की फोटो अपलोड करें और उसकी श्रेणी और अनुमानित भाव जानें।',
    rateDisclaimer:
      'दिखाए गए भाव सांकेतिक हैं। अंतिम भुगतान घर पर डिजिटल कांटे से तौलने के बाद तय होगा।',
    submitPickupBtn: 'पिकअप बुक करें',
    calculating: 'उचित भाव गणना हो रही है...',

    // Collector Dashboard
    collectorBoardTitle: 'कबाड़ीवाला जॉब टर्मिनल',
    nearbyJobs: 'नजदीकी उपलब्ध पिकअप',
    myActiveJobs: 'मेरे चालू पिकअप',
    todayEarnings: 'आज की कुल कमाई',
    weeklyEarnings: 'इस सप्ताह की कमाई',
    acceptJobBtn: 'पिकअप स्वीकार करें',
    arrivedBtn: 'पते पर पहुंच गए',
    enterWeighingBtn: 'तौल दर्ज करें और भुगतान करें',
    routeOptimizerBtn: 'सुगम मार्ग प्लानर (रूट)',

    // Recycler Dashboard
    recyclerPortalTitle: 'रीसाइक्लिंग प्लांट पोर्टल',
    buyingRateSheet: 'कच्चे माल की खरीद दरें',
    postNewOffer: '+ नई खरीद दर जारी करें',
    recordIntakeSlip: 'इनबाउंड वजन पर्ची बनाएं',
    monthlyThroughput: 'मासिक रीसाइक्लिंग मात्रा',

    // Admin Dashboard
    adminConsoleTitle: 'नियामक एवं नियंत्रण कक्ष',
    verificationQueue: 'दस्तावेज़ सत्यापन कतार',
    priceManagement: 'मंडी सांकेतिक दर प्रबंधन',
    disputeCenter: 'विवाद समाधान केंद्र',
    auditLedger: 'सुरक्षित ऑडिट लॉग',

    // Statuses
    statusOpen: 'कबाड़ीवाले की प्रतीक्षा',
    statusAccepted: 'कबाड़ीवाला तय हुआ',
    statusInProgress: 'तौल जारी है',
    statusCompleted: 'सफलतापूर्वक पूरा हुआ',
    statusCancelled: 'रद्द किया गया',
    statusDisputed: 'विवाद की समीक्षा में',
  },
};
