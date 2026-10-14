import prisma from '../utils/prisma.js';

export interface VoiceActionResult {
  intent: string;
  commandText: string;
  confidence: number;
  recognizedAction: string;
  targetRoute?: string;
  modalTarget?: string;
  parameters?: Record<string, any>;
  requiresConfirmation: boolean;
  hindiTitle: string;
  englishTitle: string;
  hindiConfirmationMessage: string;
  englishConfirmationMessage: string;
  suggestedQuickActions: { labelHi: string; labelEn: string; command: string }[];
}

export class VoiceCommandService {
  /**
   * Parse Hindi / Hinglish / English spoken input into structured circular actions
   */
  static parseCommand(transcript: string): VoiceActionResult {
    const raw = transcript.toLowerCase().trim();

    // 1. Today's Pickups ("Aaj ke pickup dikhao", "aaj ka kaam", "today pickup")
    if (
      raw.includes('aaj ke pickup') ||
      raw.includes('aaj ka pickup') ||
      raw.includes('today pickup') ||
      raw.includes('आज के पिकअप') ||
      raw.includes('आज का काम') ||
      raw.includes('pickups dikhao')
    ) {
      return {
        intent: 'NAVIGATE_TODAY_PICKUPS',
        commandText: transcript,
        confidence: 0.95,
        recognizedAction: 'VIEW_TODAY_PICKUPS',
        targetRoute: '/collector?tab=jobs',
        requiresConfirmation: false,
        hindiTitle: 'आज के पिकअप शेड्यूल',
        englishTitle: "Today's Assigned Pickups",
        hindiConfirmationMessage: 'आज के सभी निर्धारित पिकअप दिखाए जा रहे हैं।',
        englishConfirmationMessage: "Navigating to today's scheduled pickups.",
        suggestedQuickActions: [
          { labelHi: 'रास्ता ऑप्टिमाइज़ करें', labelEn: 'Optimize Route', command: 'EcoRoute chalao' },
          { labelHi: 'नया जॉब स्वीकारें', labelEn: 'Accept Nearby Job', command: 'Paas ke jobs dikhao' },
        ],
      };
    }

    // 2. Nearby Scrap Jobs ("Paas ke scrap jobs dikhao", "nearby jobs", "nayi pickup dhundo")
    if (
      raw.includes('paas ke') ||
      raw.includes('nearby') ||
      raw.includes('paas ka') ||
      raw.includes('पास के') ||
      raw.includes('scrap jobs') ||
      raw.includes('नया कबाड़') ||
      raw.includes('naye jobs')
    ) {
      return {
        intent: 'NAVIGATE_NEARBY_JOBS',
        commandText: transcript,
        confidence: 0.93,
        recognizedAction: 'VIEW_NEARBY_JOBS',
        targetRoute: '/collector?tab=nearby',
        requiresConfirmation: false,
        hindiTitle: 'आस-पास के उपलब्ध कबाड़ जॉब्स',
        englishTitle: 'Nearby Available Scrap Requests',
        hindiConfirmationMessage: 'आपके 5 किमी के दायरे में उपलब्ध नए पिकअप लोड हो रहे हैं।',
        englishConfirmationMessage: 'Fetching available pickup jobs within your 5 km service area.',
        suggestedQuickActions: [
          { labelHi: 'रास्ता मैप पर देखें', labelEn: 'View On Map', command: 'Map dikhao' },
          { labelHi: 'रेट चेक करें', labelEn: 'Check Scrap Rates', command: 'Mandi ke rate batao' },
        ],
      };
    }

    // 3. Earnings ("Meri aaj ki kamai dikhao", "kitna paisa bana", "my earnings")
    if (
      raw.includes('kamai') ||
      raw.includes('kamayi') ||
      raw.includes('earnings') ||
      raw.includes('कमाई') ||
      raw.includes('कितना पैसा') ||
      raw.includes('hisaab') ||
      raw.includes('wallet')
    ) {
      return {
        intent: 'NAVIGATE_EARNINGS',
        commandText: transcript,
        confidence: 0.96,
        recognizedAction: 'VIEW_EARNINGS',
        targetRoute: '/collector?tab=earnings',
        requiresConfirmation: false,
        hindiTitle: 'दैनिक कमाई और UPI खाता',
        englishTitle: 'Daily Earnings & Wallet Ledger',
        hindiConfirmationMessage: 'आपकी आज की कुल कमाई और डिजिटल रसीदें खोली जा रही हैं।',
        englishConfirmationMessage: 'Opening your total earnings ledger and completed digital receipts.',
        suggestedQuickActions: [
          { labelHi: 'UPI खाता चेक करें', labelEn: 'Check UPI', command: 'UPI ledger dikhao' },
          { labelHi: 'आज का काम पूरा करें', labelEn: 'Finish Day', command: 'Pickup complete karna hai' },
        ],
      };
    }

    // 4. Buyer Matching ("Plastic ke buyers dikhao", "Loha bechna hai", "recycler dhundo")
    if (
      raw.includes('buyer') ||
      raw.includes('recycler') ||
      raw.includes('बायर्स') ||
      raw.includes('खरीदार') ||
      raw.includes('bechna hai') ||
      raw.includes('बेचना है')
    ) {
      let categorySlug = 'rigid-plastics';
      let materialNameHi = 'प्लास्टिक';
      let materialNameEn = 'Plastics';

      if (raw.includes('loha') || raw.includes('iron') || raw.includes('लोहा')) {
        categorySlug = 'ferrous-metals';
        materialNameHi = 'लोहा और इस्पात';
        materialNameEn = 'Ferrous Metals';
      } else if (raw.includes('paper') || raw.includes('raddi') || raw.includes('कागज़') || raw.includes('गत्ता')) {
        categorySlug = 'paper-cardboard';
        materialNameHi = 'कागज़ और गत्ता';
        materialNameEn = 'Paper & Cardboard';
      } else if (raw.includes('tamba') || raw.includes('aluminium') || raw.includes('तांबा')) {
        categorySlug = 'non-ferrous-metals';
        materialNameHi = 'अल्युमिनियम व तांबा';
        materialNameEn = 'Non-Ferrous Metals';
      }

      return {
        intent: 'NAVIGATE_BUYER_MATCHING',
        commandText: transcript,
        confidence: 0.92,
        recognizedAction: 'OPEN_SMART_BUYER_MATCHING',
        targetRoute: `/collector?tab=buyers&category=${categorySlug}`,
        parameters: { categorySlug },
        requiresConfirmation: false,
        hindiTitle: `${materialNameHi} के सबसे मुनाफे वाले बायर्स`,
        englishTitle: `Best Net Payout Buyers for ${materialNameEn}`,
        hindiConfirmationMessage: `${materialNameHi} के लिए सबसे ज्यादा नेट रिटर्न देने वाले रिसाइक्लर्स की तुलना दिखाई जा रही है।`,
        englishConfirmationMessage: `Comparing best net proceeds recycler offers for ${materialNameEn}.`,
        suggestedQuickActions: [
          { labelHi: 'पूलिंग ग्रुप देखें', labelEn: 'Check Scrap Pool', command: 'Scrap pool dikhao' },
          { labelHi: 'रेट चेक करें', labelEn: 'View Rates', command: 'Rates batao' },
        ],
      };
    }

    // 5. Complete Pickup / Digital Scale ("Pickup complete karna hai", "wazan karo", "scale")
    if (
      raw.includes('complete karna hai') ||
      raw.includes('pickup complete') ||
      raw.includes('कम्प्लीट') ||
      raw.includes('पूरा करना') ||
      raw.includes('wajan') ||
      raw.includes('wazan') ||
      raw.includes('तोलना') ||
      raw.includes('weigh')
    ) {
      return {
        intent: 'COMPLETE_PICKUP_WORKFLOW',
        commandText: transcript,
        confidence: 0.94,
        recognizedAction: 'OPEN_TRUSTWEIGH_MODAL',
        modalTarget: 'TRUSTWEIGH_SCALE_MODAL',
        requiresConfirmation: true, // Consequential transaction!
        hindiTitle: 'डिजिटल वजन और रसीद बनाएं (TrustWeigh)',
        englishTitle: 'Digital Weighing & Receipt Issuance',
        hindiConfirmationMessage: 'क्या आप डिजिटल वजन पैमाना चालू करके पिकअप पूरा करना चाहते हैं?',
        englishConfirmationMessage: 'Do you want to launch the digital scale and generate tamper-proof receipt?',
        suggestedQuickActions: [
          { labelHi: 'हाँ, वजन शुरू करें', labelEn: 'Yes, Start Weighing', command: 'Start weigh' },
          { labelHi: 'रद्द करें', labelEn: 'Cancel', command: 'Radd karo' },
        ],
      };
    }

    // 6. Collaborative Scrap Pooling ("Scrap pool dikhao", "group sale", "bulk pool")
    if (
      raw.includes('pool') ||
      raw.includes('pooling') ||
      raw.includes('पूलिंग') ||
      raw.includes('ग्रुप') ||
      raw.includes('इकट्ठा बेचना') ||
      raw.includes('bulk')
    ) {
      return {
        intent: 'NAVIGATE_POOLING',
        commandText: transcript,
        confidence: 0.93,
        recognizedAction: 'VIEW_SCRAP_POOLS',
        targetRoute: '/collector?tab=pooling',
        requiresConfirmation: false,
        hindiTitle: 'सहकारी स्क्रैप पूलिंग (Collaborative Pooling)',
        englishTitle: 'Collaborative Scrap Pooling Groups',
        hindiConfirmationMessage: 'साथी कबाड़ियों के साथ मिलकर थोक में ज्यादा दाम पाने वाले पूल्स खुल रहे हैं।',
        englishConfirmationMessage: 'Opening collaborative pooling groups for higher bulk sales value.',
        suggestedQuickActions: [
          { labelHi: 'नया पूल बनाएं', labelEn: 'Create New Pool', command: 'Naya pool banao' },
          { labelHi: 'बायर्स देखें', labelEn: 'Find Buyers', command: 'Plastic ke buyers dikhao' },
        ],
      };
    }

    // 7. Rates & Mandi Benchmark ("Loha ke rate kya hai", "aaj ka rate", "mandi rate")
    if (
      raw.includes('rate') ||
      raw.includes('bhav') ||
      raw.includes('रेट') ||
      raw.includes('भाव') ||
      raw.includes('mandi')
    ) {
      return {
        intent: 'SHOW_RATES',
        commandText: transcript,
        confidence: 0.91,
        recognizedAction: 'NAVIGATE_MANDI_RATES',
        targetRoute: '/rates',
        requiresConfirmation: false,
        hindiTitle: 'आज के मंडी स्क्रैप रेट्स',
        englishTitle: 'Daily Mandi Scrap Benchmarks',
        hindiConfirmationMessage: 'आज के आधिकारिक मंडी रेट्स और कमोडिटी इंडेक्स खुल रहे हैं।',
        englishConfirmationMessage: 'Opening live Mandi benchmark rates index.',
        suggestedQuickActions: [
          { labelHi: 'बायर्स की तुलना करें', labelEn: 'Compare Buyers', command: 'Plastic ke buyers dikhao' },
          { labelHi: 'पूलिंग चेक करें', labelEn: 'Check Pools', command: 'Scrap pool dikhao' },
        ],
      };
    }

    // Default Fallback
    return {
      intent: 'GENERAL_SEARCH',
      commandText: transcript,
      confidence: 0.75,
      recognizedAction: 'NAVIGATE_COLLECTOR_HOME',
      targetRoute: '/collector',
      requiresConfirmation: false,
      hindiTitle: `कमांड: "${transcript}"`,
      englishTitle: `Command: "${transcript}"`,
      hindiConfirmationMessage: 'कमांड पहचानी गई। आप नीचे दिए गए बटनों से त्वरित विकल्प चुन सकते हैं।',
      englishConfirmationMessage: 'Command parsed. Select from the quick options below.',
      suggestedQuickActions: [
        { labelHi: 'आज के पिकअप दिखाओ', labelEn: 'Today Pickups', command: 'Aaj ke pickup dikhao' },
        { labelHi: 'पास के कबाड़ जॉब्स', labelEn: 'Nearby Jobs', command: 'Paas ke scrap jobs dikhao' },
        { labelHi: 'मेरी आज की कमाई', labelEn: 'My Earnings', command: 'Meri aaj ki kamai dikhao' },
        { labelHi: 'प्लास्टिक के बायर्स', labelEn: 'Plastic Buyers', command: 'Plastic ke buyers dikhao' },
      ],
    };
  }

  /**
   * Record voice audit command
   */
  static async recordVoiceAudit(data: {
    userId: string;
    transcript: string;
    language?: string;
    recognizedAction: string;
    actionPayload?: any;
    status?: string;
    networkOnline?: boolean;
  }) {
    return prisma.voiceCommandLog.create({
      data: {
        userId: data.userId,
        transcript: data.transcript,
        language: data.language || 'hi',
        recognizedAction: data.recognizedAction,
        actionPayload: data.actionPayload ? JSON.stringify(data.actionPayload) : null,
        status: data.status || 'RECOGNIZED',
        networkOnline: data.networkOnline ?? true,
      },
    });
  }
}
