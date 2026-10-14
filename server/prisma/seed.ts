import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting ScrapSetu comprehensive database seed...');

  // 1. Clean existing records in sequence
  await prisma.voiceCommandLog.deleteMany({});
  await prisma.poolActivityLog.deleteMany({});
  await prisma.poolPledge.deleteMany({});
  await prisma.scrapPool.deleteMany({});
  await prisma.scrapLotEvent.deleteMany({});
  await prisma.scrapLot.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.complaintDispute.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.ratingFeedback.deleteMany({});
  await prisma.recyclerIntake.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.actualCollectedItem.deleteMany({});
  await prisma.collectorAssignment.deleteMany({});
  await prisma.pickupStatusHistory.deleteMany({});
  await prisma.pickupItem.deleteMany({});
  await prisma.pickupRequest.deleteMany({});
  await prisma.recyclerOffer.deleteMany({});
  await prisma.materialPrice.deleteMany({});
  await prisma.materialCategory.deleteMany({});
  await prisma.verificationDocument.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.userProfile.deleteMany({});
  await prisma.user.deleteMany({});

  const demoPasswordHash = await bcrypt.hash('Demo@12345', 10);

  // 2. Material Categories
  const categoriesData = [
    {
      name: 'Paper & Cardboard',
      hindiName: 'कागज़ और गत्ता',
      slug: 'paper-cardboard',
      description: 'Newspapers, office paper, cardboard boxes, corrugated packaging, and books.',
      hindiDescription: 'समाचार पत्र, कार्यालयीन कागज़, गत्ता के डिब्बे और पुरानी किताबें।',
      icon: 'BookOpen',
      defaultUnit: 'kg',
      carbonFactorKg: 1.35,  // kg CO2e saved per kg paper
      treeFactorKg: 0.017,   // ~17 trees per 1000kg paper
      waterFactorL: 26.0,    // litres water saved per kg
      energyFactorKwh: 4.0,  // kWh energy saved per kg
    },
    {
      name: 'Rigid Plastics (PET / HDPE)',
      hindiName: 'सख्त प्लास्टिक (PET / HDPE)',
      slug: 'rigid-plastics',
      description: 'Water/soda bottles (PET), milk jugs, shampoo bottles (HDPE), and hard plastic containers.',
      hindiDescription: 'पानी/सोडा की बोतलें (PET), तेल के डिब्बे, शैम्पू की बोतलें और कठोर प्लास्टिक।',
      icon: 'Layers',
      defaultUnit: 'kg',
      carbonFactorKg: 1.80,
      treeFactorKg: 0.0,
      waterFactorL: 20.0,
      energyFactorKwh: 5.8,
    },
    {
      name: 'Ferrous Metals (Iron & Steel)',
      hindiName: 'लोहा और इस्पात',
      slug: 'ferrous-metals',
      description: 'Scrap iron, rods, steel utensils, appliance sheets, bicycle frames, and construction cuts.',
      hindiDescription: 'लोहे का कबाड़, सरिया, स्टील के बर्तन, अलमारी की चादरें और पुरानी साइकिल।',
      icon: 'Shield',
      defaultUnit: 'kg',
      carbonFactorKg: 1.50,
      treeFactorKg: 0.0,
      waterFactorL: 18.0,
      energyFactorKwh: 6.2,
    },
    {
      name: 'Non-Ferrous Metals (Aluminium, Brass, Copper)',
      hindiName: 'अल्युमिनियम, पीतल और तांबा',
      slug: 'non-ferrous-metals',
      description: 'Copper wire, brass fittings, aluminium cans, engine casings, and metal wiring.',
      hindiDescription: 'तांबे के तार, पीतल की फिटिंग, एल्युमिनियम के बर्तन और केबल्स।',
      icon: 'Sparkles',
      defaultUnit: 'kg',
      carbonFactorKg: 9.10, // Aluminium/Copper recycling saves massive CO2 compared to virgin ore
      treeFactorKg: 0.0,
      waterFactorL: 45.0,
      energyFactorKwh: 14.5,
    },
    {
      name: 'Glass Bottles & Culinary Glass',
      hindiName: 'कांच की बोतलें और जार',
      slug: 'glass',
      description: 'Intact beer/soda bottles, food jars, flat window scrap (non-tempered).',
      hindiDescription: 'कांच की बोतलें, आचार/जैम के जार और समतल खिड़की का कांच।',
      icon: 'Wine',
      defaultUnit: 'kg',
      carbonFactorKg: 0.31,
      treeFactorKg: 0.0,
      waterFactorL: 5.0,
      energyFactorKwh: 1.2,
    },
    {
      name: 'Electronic Waste (E-Waste)',
      hindiName: 'ई-कचरा (इलेक्ट्रॉनिक्स)',
      slug: 'e-waste',
      description: 'Defunct mobile phones, motherboards, chargers, computer monitors, and household appliances.',
      hindiDescription: 'खराब मोबाइल, कंप्यूटर पार्ट्स, चार्जर, मॉनिटर और घरेलू इलेक्ट्रॉनिक उपकरण।',
      icon: 'Cpu',
      defaultUnit: 'kg',
      carbonFactorKg: 3.20,
      treeFactorKg: 0.0,
      waterFactorL: 35.0,
      energyFactorKwh: 11.0,
    },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoriesData) {
    const created = await prisma.materialCategory.create({ data: cat });
    categories[cat.slug] = created;
  }
  console.log(`✅ Seeded ${categoriesData.length} material categories.`);

  // 3. Indicative Benchmark Prices
  const priceData = [
    {
      categoryId: categories['paper-cardboard'].id,
      grade: 'Newspaper (Old Raddi)',
      unit: 'kg',
      indicativePrice: 14.0,
      minPrice: 12.0,
      maxPrice: 16.0,
      region: 'North India (Jaipur / NCR)',
      source: 'Demonstration Benchmark (MRAI Delhi Index)',
    },
    {
      categoryId: categories['paper-cardboard'].id,
      grade: 'Corrugated Cardboard (Katta)',
      unit: 'kg',
      indicativePrice: 9.5,
      minPrice: 8.0,
      maxPrice: 11.0,
      region: 'North India (Jaipur / NCR)',
      source: 'Demonstration Benchmark (Local Mandi)',
    },
    {
      categoryId: categories['rigid-plastics'].id,
      grade: 'Clean PET Bottles',
      unit: 'kg',
      indicativePrice: 18.0,
      minPrice: 15.0,
      maxPrice: 22.0,
      region: 'North India (Jaipur / NCR)',
      source: 'Demonstration Benchmark (Plastics Federation)',
    },
    {
      categoryId: categories['rigid-plastics'].id,
      grade: 'HDPE / PP Mixed Hard Plastic',
      unit: 'kg',
      indicativePrice: 22.0,
      minPrice: 19.0,
      maxPrice: 25.0,
      region: 'North India (Jaipur / NCR)',
      source: 'Demonstration Benchmark (Plastics Federation)',
    },
    {
      categoryId: categories['ferrous-metals'].id,
      grade: 'Scrap Iron (Loha Heavy)',
      unit: 'kg',
      indicativePrice: 28.0,
      minPrice: 26.0,
      maxPrice: 31.0,
      region: 'North India (Jaipur / NCR)',
      source: 'Demonstration Benchmark (Mandi Steel Bulletin)',
    },
    {
      categoryId: categories['non-ferrous-metals'].id,
      grade: 'Scrap Aluminium Utensils/Cans',
      unit: 'kg',
      indicativePrice: 115.0,
      minPrice: 105.0,
      maxPrice: 130.0,
      region: 'North India (Jaipur / NCR)',
      source: 'Demonstration Benchmark (Metal Traders Portal)',
    },
    {
      categoryId: categories['non-ferrous-metals'].id,
      grade: 'Pure Copper Scrap (Tambha)',
      unit: 'kg',
      indicativePrice: 520.0,
      minPrice: 480.0,
      maxPrice: 560.0,
      region: 'North India (Jaipur / NCR)',
      source: 'Demonstration Benchmark (Metal Traders Portal)',
    },
    {
      categoryId: categories['glass'].id,
      grade: 'Whole Glass Bottles',
      unit: 'kg',
      indicativePrice: 3.5,
      minPrice: 2.5,
      maxPrice: 4.5,
      region: 'North India (Jaipur / NCR)',
      source: 'Demonstration Benchmark (Beverage Bottler Rate)',
    },
    {
      categoryId: categories['e-waste'].id,
      grade: 'Mixed Electronic Boards & Small Gadgets',
      unit: 'kg',
      indicativePrice: 45.0,
      minPrice: 35.0,
      maxPrice: 65.0,
      region: 'North India (Jaipur / NCR)',
      source: 'Demonstration Benchmark (Authorized Dismantlers)',
    },
  ];

  for (const p of priceData) {
    await prisma.materialPrice.create({ data: p });
  }
  console.log(`✅ Seeded ${priceData.length} indicative price benchmarks.`);

  // 4. Users & Profiles
  // Admin
  const adminUser = await prisma.user.create({
    data: {
      name: 'Vikramaditya Sharma',
      email: 'admin@scrapsetu.in',
      passwordHash: demoPasswordHash,
      phone: '+91 98290 11001',
      role: 'ADMIN',
      languagePref: 'en',
      isVerified: true,
      profile: {
        create: {
          businessName: 'ScrapSetu Regulatory Oversight',
          operatingHours: '24x7 Digital Operations',
          reliabilityRating: 5.0,
        },
      },
    },
  });

  // Household Users
  const household1 = await prisma.user.create({
    data: {
      name: 'Pooja Verma',
      email: 'household@scrapsetu.in',
      passwordHash: demoPasswordHash,
      phone: '+91 98290 22002',
      role: 'HOUSEHOLD',
      languagePref: 'hi',
      isVerified: true,
      addresses: {
        create: [
          {
            label: 'Home (Malviya Nagar)',
            streetAddress: 'Plot 42, Girdhar Marg, Sector 3, Malviya Nagar',
            area: 'Malviya Nagar',
            city: 'Jaipur',
            state: 'Rajasthan',
            pincode: '302017',
            lat: 26.8524,
            lng: 75.8173,
            isDefault: true,
          },
          {
            label: 'Parents House (C-Scheme)',
            streetAddress: 'B-14, Subhash Marg, C-Scheme',
            area: 'C-Scheme',
            city: 'Jaipur',
            state: 'Rajasthan',
            pincode: '302001',
            lat: 26.9112,
            lng: 75.8011,
            isDefault: false,
          },
        ],
      },
      profile: {
        create: {
          reliabilityRating: 4.9,
          totalPickupsCompleted: 4,
        },
      },
    },
    include: { addresses: true },
  });

  // Commercial / Business User
  const businessUser = await prisma.user.create({
    data: {
      name: 'Rohan Mehra (GreenLeaf Logistics & Cafe)',
      email: 'business@scrapsetu.in',
      passwordHash: demoPasswordHash,
      phone: '+91 98290 33003',
      role: 'BUSINESS',
      languagePref: 'en',
      isVerified: true,
      addresses: {
        create: [
          {
            label: 'Central Warehouse',
            streetAddress: 'Industrial Bay 7, Sitapura Industrial Area, Tonk Road',
            area: 'Sitapura',
            city: 'Jaipur',
            state: 'Rajasthan',
            pincode: '302022',
            lat: 26.7725,
            lng: 75.8521,
            isDefault: true,
          },
          {
            label: 'City Cafe & Bakery',
            streetAddress: 'GF 03, Crystal Court Mall, Malviya Nagar',
            area: 'Malviya Nagar',
            city: 'Jaipur',
            state: 'Rajasthan',
            pincode: '302017',
            lat: 26.8533,
            lng: 75.8190,
            isDefault: false,
          },
        ],
      },
      profile: {
        create: {
          businessName: 'GreenLeaf Enterprises Pvt Ltd',
          businessType: 'RESTAURANT',
          gstNumber: '08AAACG1234F1Z8',
          reliabilityRating: 5.0,
          totalPickupsCompleted: 12,
        },
      },
    },
    include: { addresses: true },
  });

  // Collectors (Kabadiwalas)
  const collector1 = await prisma.user.create({
    data: {
      name: 'Ramkishan Sahu',
      email: 'collector@scrapsetu.in',
      passwordHash: demoPasswordHash,
      phone: '+91 98290 44004',
      role: 'COLLECTOR',
      languagePref: 'hi',
      isVerified: true,
      addresses: {
        create: {
          label: 'Collection Hub',
          streetAddress: 'Near Pulia, Malviya Nagar Sector 9',
          city: 'Jaipur',
          state: 'Rajasthan',
          pincode: '302017',
          lat: 26.8501,
          lng: 75.8155,
          isDefault: true,
        },
      },
      profile: {
        create: {
          vehicleType: 'THREE_WHEELER',
          vehicleNumber: 'RJ 14 TB 4921',
          serviceAreaRadiusKm: 6.5,
          dailyCapacityKg: 250.0,
          bankUpiId: 'ramkishan.sahu@upi',
          isAvailable: true,
          reliabilityRating: 4.8,
          totalPickupsCompleted: 88,
          acceptedCategories: JSON.stringify(['paper-cardboard', 'rigid-plastics', 'ferrous-metals', 'non-ferrous-metals', 'glass']),
        },
      },
    },
    include: { addresses: true, profile: true },
  });

  const collector2 = await prisma.user.create({
    data: {
      name: 'Mohammad Farooq',
      email: 'farooq.collector@scrapsetu.in',
      passwordHash: demoPasswordHash,
      phone: '+91 98290 55005',
      role: 'COLLECTOR',
      languagePref: 'hi',
      isVerified: true,
      addresses: {
        create: {
          label: 'Collection Point',
          streetAddress: 'Shop 12, Transport Nagar Market',
          city: 'Jaipur',
          state: 'Rajasthan',
          pincode: '302003',
          lat: 26.8985,
          lng: 75.8450,
          isDefault: true,
        },
      },
      profile: {
        create: {
          vehicleType: 'MINI_TRUCK',
          vehicleNumber: 'RJ 14 GA 1182',
          serviceAreaRadiusKm: 12.0,
          dailyCapacityKg: 800.0,
          bankUpiId: 'farooq.scrap@upi',
          isAvailable: true,
          reliabilityRating: 4.9,
          totalPickupsCompleted: 142,
          acceptedCategories: JSON.stringify(['paper-cardboard', 'rigid-plastics', 'ferrous-metals', 'non-ferrous-metals', 'e-waste']),
        },
      },
    },
    include: { addresses: true, profile: true },
  });

  // Recycling Companies
  const recycler1 = await prisma.user.create({
    data: {
      name: 'Aravalli Ecocycle Mills',
      email: 'recycler@scrapsetu.in',
      passwordHash: demoPasswordHash,
      phone: '+91 98290 66006',
      role: 'RECYCLER',
      languagePref: 'en',
      isVerified: true,
      addresses: {
        create: {
          label: 'Main Processing Plant',
          streetAddress: 'Plot E-42, RIICO Industrial Area, Mansarovar',
          city: 'Jaipur',
          state: 'Rajasthan',
          pincode: '302020',
          lat: 26.8450,
          lng: 75.7600,
          isDefault: true,
        },
      },
      profile: {
        create: {
          businessName: 'Aravalli Ecocycle Mills Ltd',
          businessType: 'MANUFACTURING',
          gstNumber: '08AABCA9876C1Z4',
          dailyCapacityKg: 5000.0,
          operatingHours: '08:00 AM - 08:00 PM',
          reliabilityRating: 4.95,
          totalPickupsCompleted: 340,
        },
      },
    },
    include: { addresses: true },
  });

  const recycler2 = await prisma.user.create({
    data: {
      name: 'Jaipur GreenTech Recyclers Pvt Ltd',
      email: 'greentech@scrapsetu.in',
      passwordHash: demoPasswordHash,
      phone: '+91 98290 77007',
      role: 'RECYCLER',
      languagePref: 'en',
      isVerified: true,
      addresses: {
        create: {
          label: 'Sitapura Processing Center',
          streetAddress: 'Plot G-12, Sitapura Industrial Area Phase 2',
          city: 'Jaipur',
          state: 'Rajasthan',
          pincode: '302022',
          lat: 26.7820,
          lng: 75.8280,
          isDefault: true,
        },
      },
      profile: {
        create: {
          businessName: 'Jaipur GreenTech Recyclers Pvt Ltd',
          businessType: 'MANUFACTURING',
          gstNumber: '08BBDPA5544B1Z9',
          dailyCapacityKg: 8000.0,
          operatingHours: '09:00 AM - 07:00 PM',
          reliabilityRating: 4.88,
          totalPickupsCompleted: 215,
        },
      },
    },
    include: { addresses: true },
  });

  const recycler3 = await prisma.user.create({
    data: {
      name: 'Rajputana Smelters & Aggregators',
      email: 'rajputana.smelters@scrapsetu.in',
      passwordHash: demoPasswordHash,
      phone: '+91 98290 88008',
      role: 'RECYCLER',
      languagePref: 'hi',
      isVerified: true,
      addresses: {
        create: {
          label: 'VKIA Bulk Smelting Hub',
          streetAddress: 'Road No. 14, Vishwakarma Industrial Area (VKIA)',
          city: 'Jaipur',
          state: 'Rajasthan',
          pincode: '302013',
          lat: 26.9850,
          lng: 75.7680,
          isDefault: true,
        },
      },
      profile: {
        create: {
          businessName: 'Rajputana Smelters & Bulk Aggregators',
          businessType: 'MANUFACTURING',
          gstNumber: '08CCEPS1122C1Z1',
          dailyCapacityKg: 25000.0,
          operatingHours: '07:00 AM - 09:00 PM',
          reliabilityRating: 4.92,
          totalPickupsCompleted: 580,
        },
      },
    },
    include: { addresses: true },
  });

  console.log('✅ Seeded demo accounts across all 5 platform roles including 3 distinct recyclers.');

  // 5. Recycler Buying Offers (with diverse thresholds, distances, and capacities)
  const recyclerOffersData = [
    // Recycler 1 (Mansarovar - 4.2 km from collector hub)
    {
      recyclerId: recycler1.id,
      categoryId: categories['rigid-plastics'].id,
      facilityName: 'Aravalli Polymer Flaking Division',
      facilityAddress: 'Plot E-43, RIICO Industrial Area, Mansarovar',
      lat: 26.8452,
      lng: 75.7610,
      buyingPricePerKg: 20.5,
      minQuantityKg: 25.0,
      maxCapacityKg: 5000.0,
      currentIntakeKg: 1200.0,
      handlingFeePerKg: 0.0,
      paymentTerms: 'INSTANT_UPI_OR_NEFT',
      gradeAccepted: 'Washed bottles & caps sorted (Grade A PET)',
      notes: 'Direct weighbridge unload. Low transit loss for Mansarovar / Sanganer collectors.',
    },
    {
      recyclerId: recycler1.id,
      categoryId: categories['paper-cardboard'].id,
      facilityName: 'Aravalli Paper Pulp Plant 1',
      facilityAddress: 'Plot E-42, RIICO Industrial Area, Mansarovar',
      lat: 26.8450,
      lng: 75.7600,
      buyingPricePerKg: 11.0,
      minQuantityKg: 40.0,
      maxCapacityKg: 8000.0,
      currentIntakeKg: 3400.0,
      handlingFeePerKg: 0.0,
      paymentTerms: 'INSTANT_BANK_TRANSFER',
      gradeAccepted: 'Baled corrugated & unsoiled paper scrap',
      notes: 'Direct weighbridge unload. Free digital moisture calibration certificate.',
    },
    {
      recyclerId: recycler1.id,
      categoryId: categories['ferrous-metals'].id,
      facilityName: 'Aravalli Induction Foundry',
      facilityAddress: 'Plot F-18, RIICO Mansarovar',
      lat: 26.8460,
      lng: 75.7625,
      buyingPricePerKg: 30.0,
      minQuantityKg: 80.0,
      maxCapacityKg: 15000.0,
      currentIntakeKg: 6500.0,
      handlingFeePerKg: 0.0,
      paymentTerms: 'INSTANT_BANK_TRANSFER',
      gradeAccepted: 'Heavy structural and cast scrap',
      notes: 'Calibrated digital weighbridge certified by Weights & Measures dept.',
    },
    // Recycler 2 (Sitapura - 13.8 km away - higher gross price, but higher transport cost!)
    {
      recyclerId: recycler2.id,
      categoryId: categories['rigid-plastics'].id,
      facilityName: 'Jaipur GreenTech Polymer Center',
      facilityAddress: 'Plot G-12, Sitapura Industrial Area Phase 2',
      lat: 26.7820,
      lng: 75.8280,
      buyingPricePerKg: 22.0, // Higher advertised gross rate!
      minQuantityKg: 40.0,
      maxCapacityKg: 4000.0,
      currentIntakeKg: 950.0,
      handlingFeePerKg: 0.25,
      paymentTerms: 'SAME_DAY_NEFT',
      gradeAccepted: 'High-density bottles, drums, and sorted flakes',
      notes: 'Higher gross price; best suited for consolidated lots > 150 kg to absorb transit cost.',
    },
    {
      recyclerId: recycler2.id,
      categoryId: categories['non-ferrous-metals'].id,
      facilityName: 'GreenTech Copper & Brass Refinery',
      facilityAddress: 'Plot G-14, Sitapura Industrial Area',
      lat: 26.7825,
      lng: 75.8290,
      buyingPricePerKg: 125.0,
      minQuantityKg: 15.0,
      maxCapacityKg: 2000.0,
      currentIntakeKg: 420.0,
      handlingFeePerKg: 0.0,
      paymentTerms: 'INSTANT_BANK_TRANSFER',
      gradeAccepted: 'Stripped copper wire & cast brass fittings',
      notes: 'Optical spectrometer metal purity testing onsite.',
    },
    // Recycler 3 (VKIA - 19.5 km away - Bulk Industrial Buyer with high min requirement!)
    {
      recyclerId: recycler3.id,
      categoryId: categories['rigid-plastics'].id,
      facilityName: 'Rajputana Mega Pelletizing Plant',
      facilityAddress: 'Road No. 14, Vishwakarma Industrial Area (VKIA)',
      lat: 26.9850,
      lng: 75.7680,
      buyingPricePerKg: 25.0, // High bulk premium rate!
      minQuantityKg: 250.0, // Requires 250 kg minimum!
      maxCapacityKg: 20000.0,
      currentIntakeKg: 7800.0,
      handlingFeePerKg: 0.0,
      paymentTerms: 'DIRECT_RTGS_ON_GATEPASS',
      gradeAccepted: 'Commercial baled PET & HDPE lots',
      notes: 'Bulk aggregation buyer. Ideal for Collaborative Scrap Pools reaching >250 kg.',
    },
    {
      recyclerId: recycler3.id,
      categoryId: categories['ferrous-metals'].id,
      facilityName: 'Rajputana Electric Arc Furnace',
      facilityAddress: 'Road No. 14, VKIA Industrial Estate',
      lat: 26.9855,
      lng: 75.7690,
      buyingPricePerKg: 34.0, // Bulk steel price
      minQuantityKg: 500.0, // Requires 500 kg minimum!
      maxCapacityKg: 40000.0,
      currentIntakeKg: 16200.0,
      handlingFeePerKg: 0.0,
      paymentTerms: 'DIRECT_RTGS_ON_GATEPASS',
      gradeAccepted: 'Industrial turning scrap, iron rods, machinery bodies',
      notes: 'Highest industrial bulk rate in Rajasthan for pooled 500kg+ loads.',
    },
  ];

  const offers: Record<string, any> = {};
  for (const offer of recyclerOffersData) {
    const created = await prisma.recyclerOffer.create({ data: offer });
    offers[`${offer.facilityName}_${offer.categoryId}`] = created;
  }
  console.log(`✅ Seeded ${recyclerOffersData.length} diverse recycler buying offers.`);

  // 6. Sample Pickup Requests Across Various State Machine States
  // A. OPEN Request (Household)
  const reqOpen = await prisma.pickupRequest.create({
    data: {
      requesterId: household1.id,
      addressId: household1.addresses[0].id,
      preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      preferredTimeSlot: 'Morning (9 AM - 12 PM)',
      notes: 'Clean newspapers stacked in 2 bundles + 5kg metal pots. Please call before ringing bell.',
      status: 'OPEN',
      estimatedTotalWeightKg: 25.0,
      estimatedTotalValue: 360.0,
      items: {
        create: [
          {
            categoryId: categories['paper-cardboard'].id,
            estimatedQty: 20.0,
            unit: 'kg',
            aiPredictedCategory: 'Paper & Cardboard',
            aiConfidence: 0.94,
            userConfirmedCategory: true,
            gradeNotes: 'Old Hindi & English newspapers',
          },
          {
            categoryId: categories['ferrous-metals'].id,
            estimatedQty: 5.0,
            unit: 'kg',
            aiPredictedCategory: 'Ferrous Metals (Iron & Steel)',
            aiConfidence: 0.88,
            userConfirmedCategory: true,
            gradeNotes: 'Old utensils and iron brackets',
          },
        ],
      },
      statusHistory: {
        create: {
          fromStatus: 'INITIAL',
          toStatus: 'OPEN',
          changedById: household1.id,
          changeReason: 'Created pickup request via mobile web',
        },
      },
    },
  });

  // B. ACCEPTED Request (Assigned to collector 1)
  const reqAccepted = await prisma.pickupRequest.create({
    data: {
      requesterId: household1.id,
      addressId: household1.addresses[0].id,
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTimeSlot: 'Afternoon (12 PM - 3 PM)',
      notes: 'Heavy carton boxes from electronics unboxing.',
      status: 'ACCEPTED',
      assignedCollectorId: collector1.id,
      estimatedTotalWeightKg: 40.0,
      estimatedTotalValue: 380.0,
      items: {
        create: {
          categoryId: categories['paper-cardboard'].id,
          estimatedQty: 40.0,
          unit: 'kg',
          aiPredictedCategory: 'Paper & Cardboard',
          aiConfidence: 0.96,
          userConfirmedCategory: true,
        },
      },
      assignments: {
        create: {
          collectorId: collector1.id,
          status: 'ACCEPTED',
          distanceKm: 1.8,
          matchScore: 94.5,
          matchExplanation: 'Closest collector (1.8km) | Accepted category: Paper | Rating: 4.8★',
          acceptedAt: new Date(Date.now() - 3600000),
        },
      },
      statusHistory: {
        create: [
          {
            fromStatus: 'INITIAL',
            toStatus: 'OPEN',
            changedById: household1.id,
            changeReason: 'Created pickup request',
            timestamp: new Date(Date.now() - 7200000),
          },
          {
            fromStatus: 'OPEN',
            toStatus: 'ACCEPTED',
            changedById: collector1.id,
            changeReason: 'Accepted by Ramkishan Sahu',
            timestamp: new Date(Date.now() - 3600000),
          },
        ],
      },
    },
  });

  // C. IN_PROGRESS Request (Collector is on site / weighing)
  const reqInProgress = await prisma.pickupRequest.create({
    data: {
      requesterId: businessUser.id,
      addressId: businessUser.addresses[1].id,
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTimeSlot: 'Morning (9 AM - 12 PM)',
      notes: 'Commercial kitchen plastic containers and beverage cans.',
      status: 'IN_PROGRESS',
      assignedCollectorId: collector1.id,
      estimatedTotalWeightKg: 65.0,
      estimatedTotalValue: 1450.0,
      items: {
        create: [
          {
            categoryId: categories['rigid-plastics'].id,
            estimatedQty: 45.0,
            unit: 'kg',
            aiConfidence: 0.91,
          },
          {
            categoryId: categories['non-ferrous-metals'].id,
            estimatedQty: 20.0,
            unit: 'kg',
            aiConfidence: 0.89,
          },
        ],
      },
      assignments: {
        create: {
          collectorId: collector1.id,
          status: 'ARRIVED',
          distanceKm: 0.9,
          matchScore: 96.0,
          matchExplanation: 'Direct proximity to cafe (0.9km) | High capacity vehicle',
          acceptedAt: new Date(Date.now() - 5400000),
          arrivedAt: new Date(Date.now() - 1200000),
        },
      },
      statusHistory: {
        create: [
          {
            fromStatus: 'OPEN',
            toStatus: 'ACCEPTED',
            changedById: collector1.id,
            timestamp: new Date(Date.now() - 5400000),
          },
          {
            fromStatus: 'ACCEPTED',
            toStatus: 'IN_PROGRESS',
            changedById: collector1.id,
            changeReason: 'Collector arrived on site and started weighing',
            timestamp: new Date(Date.now() - 1200000),
          },
        ],
      },
    },
  });

  // D. COMPLETED Request with Settled Transaction & Digital Receipt
  const reqCompleted = await prisma.pickupRequest.create({
    data: {
      requesterId: businessUser.id,
      addressId: businessUser.addresses[0].id,
      preferredDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      preferredTimeSlot: 'Morning (9 AM - 12 PM)',
      notes: 'Industrial packaging paper and sorted steel scraps.',
      status: 'COMPLETED',
      assignedCollectorId: collector2.id,
      estimatedTotalWeightKg: 180.0,
      estimatedTotalValue: 3400.0,
      items: {
        create: [
          {
            categoryId: categories['paper-cardboard'].id,
            estimatedQty: 100.0,
            unit: 'kg',
          },
          {
            categoryId: categories['ferrous-metals'].id,
            estimatedQty: 80.0,
            unit: 'kg',
          },
        ],
      },
      assignments: {
        create: {
          collectorId: collector2.id,
          status: 'COMPLETED',
          distanceKm: 4.2,
          matchScore: 92.0,
          acceptedAt: new Date(Date.now() - 86400000 * 2),
          completedAt: new Date(Date.now() - 86400000 * 2 + 7200000),
        },
      },
      statusHistory: {
        create: [
          {
            fromStatus: 'OPEN',
            toStatus: 'ACCEPTED',
            changedById: collector2.id,
            timestamp: new Date(Date.now() - 86400000 * 2),
          },
          {
            fromStatus: 'ACCEPTED',
            toStatus: 'IN_PROGRESS',
            changedById: collector2.id,
            timestamp: new Date(Date.now() - 86400000 * 2 + 3600000),
          },
          {
            fromStatus: 'IN_PROGRESS',
            toStatus: 'COMPLETED',
            changedById: collector2.id,
            changeReason: 'Materials weighed, mutually verified, and payment settled',
            timestamp: new Date(Date.now() - 86400000 * 2 + 7200000),
          },
        ],
      },
      actualCollected: {
        create: [
          {
            categoryId: categories['paper-cardboard'].id,
            actualQty: 105.0,
            agreedPricePerUnit: 10.0,
            itemTotal: 1050.0,
            gradeRecorded: 'Cardboard & Paper Flute A',
          },
          {
            categoryId: categories['ferrous-metals'].id,
            actualQty: 82.5,
            agreedPricePerUnit: 29.0,
            itemTotal: 2392.5,
            gradeRecorded: 'Heavy Mild Steel',
          },
        ],
      },
    },
  });

  // Create Digital Receipt and Transaction for completed request
  const receiptNum = 'REC-2026-JP-00192';
  const rawReceiptString = `${reqCompleted.id}-${collector2.id}-${businessUser.id}-187.5-3442.50-${receiptNum}`;
  const receiptHash = crypto.createHash('sha256').update(rawReceiptString).digest('hex');

  const txn = await prisma.transaction.create({
    data: {
      pickupRequestId: reqCompleted.id,
      collectorId: collector2.id,
      requesterId: businessUser.id,
      recyclerId: recycler1.id,
      totalWeightKg: 187.5,
      totalAmount: 3442.5,
      paymentMode: 'UPI',
      paymentStatus: 'PAID',
      receiptNumber: receiptNum,
      receiptHash: receiptHash,
      notes: 'Paid via instant UPI to GreenLeaf cashier account. Verified on certified portable spring scale.',
      transactionDate: new Date(Date.now() - 86400000 * 2 + 7200000),
    },
  });

  // Link to recycler intake record
  const intakeSlipNum = 'INTAKE-ARA-00441';
  const intakeHash = crypto.createHash('sha256').update(`${txn.id}-${recycler1.id}-187.5-${intakeSlipNum}`).digest('hex');
  await prisma.recyclerIntake.create({
    data: {
      transactionId: txn.id,
      recyclerId: recycler1.id,
      supplierName: 'Mohammad Farooq (ScrapSetu Verified Collector)',
      materialGrade: 'Segregated Industrial Grade A',
      netWeightKg: 187.5,
      purchaseRatePerKg: 19.5,
      totalPurchaseAmount: 3656.25,
      intakeSlipNumber: intakeSlipNum,
      receiptHash: intakeHash,
      createdAt: new Date(Date.now() - 86400000 * 2 + 14400000),
    },
  });

  // Rating for the completed request
  await prisma.ratingFeedback.create({
    data: {
      pickupRequestId: reqCompleted.id,
      fromUserId: businessUser.id,
      toUserId: collector2.id,
      rating: 5,
      reviewText: 'Mohammad Farooq arrived right on time with calibrated digital scales. Very polite and prompt payment.',
      categoryAccuracyRating: 5,
      punctualityRating: 5,
    },
  });

  // 7. Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        userId: adminUser.id,
        action: 'VERIFY_USER',
        resource: 'User',
        resourceId: collector1.id,
        details: JSON.stringify({ verifiedRole: 'COLLECTOR', identityDoc: 'Aadhaar (Masked)' }),
      },
      {
        userId: adminUser.id,
        action: 'UPDATE_PRICE',
        resource: 'MaterialPrice',
        resourceId: categories['rigid-plastics'].id,
        details: JSON.stringify({ oldRate: 17.5, newRate: 18.0, reason: 'Monthly mandi benchmark adjustment' }),
      },
      {
        userId: collector2.id,
        action: 'COMPLETE_TRANSACTION',
        resource: 'Transaction',
        resourceId: txn.id,
        details: JSON.stringify({ receiptNumber: receiptNum, amount: 3442.5, weightKg: 187.5 }),
      },
    ],
  });

  // 9. Scrap Lots & Scrap Passports
  const lot1Hash = crypto.createHash('sha256').update('LOT-2026-X8K9M2-INIT').digest('hex');
  const lot1 = await prisma.scrapLot.create({
    data: {
      lotNumber: 'LOT-2026-X8K9M2',
      qrCodeData: '/passport/LOT-2026-X8K9M2',
      pickupRequestId: reqAccepted.id,
      collectorId: collector1.id,
      buyerId: recycler1.id,
      selectedOfferId: offers[`Aravalli Polymer Flaking Division_${categories['rigid-plastics'].id}`]?.id,
      categoryId: categories['rigid-plastics'].id,
      grade: 'Sorted Clean PET Bottles',
      declaredWeightKg: 45.0,
      collectedWeightKg: 45.0,
      status: 'BUYER_SELECTED',
      agreedRatePerKg: 20.5,
      estimatedGrossValue: 922.5,
      estimatedTransportCost: 100.0,
      estimatedNetProceeds: 822.5,
      originCity: 'Jaipur',
      originState: 'Rajasthan',
      originPincode: '302017',
      currentHashSha256: lot1Hash,
      events: {
        create: [
          {
            stage: 'GENERATED',
            actorRole: 'CITIZEN',
            actorName: 'Pooja Verma',
            evidenceType: 'SELF_REPORTED',
            location: 'Malviya Nagar, Jaipur',
            details: JSON.stringify({ message: 'Household segregation verified via ScrapVision AI.' }),
            eventHash: lot1Hash,
          },
          {
            stage: 'WEIGHED',
            actorRole: 'COLLECTOR',
            actorName: 'Ramkishan Sahu',
            evidenceType: 'INDEPENDENTLY_VERIFIED',
            location: 'Doorstep Collection, Sector 3 Malviya Nagar',
            details: JSON.stringify({ collectedWeightKg: 45.0, scaleTolerance: '±0.02 kg', scaleModel: 'TrustWeigh BT Scale' }),
            eventHash: crypto.createHash('sha256').update(lot1Hash + 'WEIGHED').digest('hex'),
          },
          {
            stage: 'BUYER_SELECTED',
            actorRole: 'COLLECTOR',
            actorName: 'Ramkishan Sahu',
            evidenceType: 'SYSTEM_RECORDED',
            location: 'Jaipur Smart Buyer Engine',
            details: JSON.stringify({
              facilityName: 'Aravalli Polymer Flaking Division',
              netProceeds: 822.5,
              distanceKm: 4.2,
              reason: 'Rank #1 highest net earnings after transit deduction',
            }),
            eventHash: crypto.createHash('sha256').update(lot1Hash + 'BUYER_SELECTED').digest('hex'),
          },
        ],
      },
    },
  });

  // Lot 2: Full Journey Complete with CPCB processing confirmation
  const lot2Hash = crypto.createHash('sha256').update('LOT-2026-PET-9042-PROCESSED').digest('hex');
  const lot2 = await prisma.scrapLot.create({
    data: {
      lotNumber: 'LOT-2026-PET-9042',
      qrCodeData: '/passport/LOT-2026-PET-9042',
      collectorId: collector2.id,
      buyerId: recycler1.id,
      selectedOfferId: offers[`Aravalli Polymer Flaking Division_${categories['rigid-plastics'].id}`]?.id,
      categoryId: categories['rigid-plastics'].id,
      grade: 'Grade A rPET Flakes Raw Input',
      declaredWeightKg: 120.0,
      collectedWeightKg: 120.0,
      receivedWeightKg: 119.2,
      weightDiscrepancyKg: -0.8,
      discrepancyPercentage: -0.7,
      hasDiscrepancy: false, // Within 1% normal moisture loss
      status: 'PROCESSING_CONFIRMED',
      agreedRatePerKg: 20.5,
      estimatedGrossValue: 2460.0,
      estimatedTransportCost: 180.0,
      estimatedNetProceeds: 2280.0,
      processingMethod: 'SHREDDED_HOT_WASHED_PELLETIZED',
      processingBatchNumber: 'BATCH-2026-ARA-0941',
      cpcbComplianceRef: 'CPCB/EPR/2026/RAJ/88219',
      processingNotes: 'Transformed into food-contact safe rPET granules for bottle-to-bottle circular manufacturing.',
      processingConfirmedAt: new Date(Date.now() - 3600000 * 4),
      originCity: 'Jaipur',
      originState: 'Rajasthan',
      originPincode: '302003',
      currentHashSha256: lot2Hash,
      events: {
        create: [
          {
            stage: 'GENERATED',
            actorRole: 'SYSTEM',
            actorName: 'ScrapSetu Digital Ledger',
            evidenceType: 'SYSTEM_RECORDED',
            location: 'Transport Nagar, Jaipur',
            details: JSON.stringify({ message: 'Commercial scrap lot registered.' }),
            eventHash: lot2Hash,
          },
          {
            stage: 'WEIGHED',
            actorRole: 'COLLECTOR',
            actorName: 'Mohammad Farooq',
            evidenceType: 'INDEPENDENTLY_VERIFIED',
            location: 'Consolidation Center, Transport Nagar',
            details: JSON.stringify({ collectedWeightKg: 120.0 }),
            eventHash: crypto.createHash('sha256').update(lot2Hash + 'WEIGHED').digest('hex'),
          },
          {
            stage: 'HANDED_OVER',
            actorRole: 'COLLECTOR',
            actorName: 'Mohammad Farooq',
            evidenceType: 'INDEPENDENTLY_VERIFIED',
            location: 'RIICO Mansarovar Industrial Area',
            details: JSON.stringify({ message: 'Loaded onto mini-truck RJ 14 GA 1182 for plant intake.' }),
            eventHash: crypto.createHash('sha256').update(lot2Hash + 'HANDED_OVER').digest('hex'),
          },
          {
            stage: 'RECEIVED',
            actorRole: 'RECYCLER',
            actorName: 'Aravalli Polymer Flaking Division',
            evidenceType: 'INDEPENDENTLY_VERIFIED',
            location: 'Weighbridge Gate 2, Plot E-43',
            details: JSON.stringify({
              receivedWeightKg: 119.2,
              slipNumber: 'WB-ARA-8812',
              discrepancyKg: -0.8,
              toleranceStatus: 'PASSED_CALIBRATION_TOLERANCE',
            }),
            eventHash: crypto.createHash('sha256').update(lot2Hash + 'RECEIVED').digest('hex'),
          },
          {
            stage: 'PROCESSING_CONFIRMED',
            actorRole: 'RECYCLER',
            actorName: 'Aravalli Polymer Flaking Division',
            evidenceType: 'INDEPENDENTLY_VERIFIED',
            location: 'Extrusion Line 3',
            details: JSON.stringify({
              processingMethod: 'SHREDDED_HOT_WASHED_PELLETIZED',
              processingBatchNumber: 'BATCH-2026-ARA-0941',
              cpcbComplianceRef: 'CPCB/EPR/2026/RAJ/88219',
              moistureDeduction: '0.67%',
            }),
            eventHash: crypto.createHash('sha256').update(lot2Hash + 'PROCESSING_CONFIRMED').digest('hex'),
          },
        ],
      },
    },
  });

  // Lot 3: Active lot for Collector 1 ready for Smart Buyer Matching
  const lot3 = await prisma.scrapLot.create({
    data: {
      lotNumber: 'LOT-2026-ALUM-7721',
      qrCodeData: '/passport/LOT-2026-ALUM-7721',
      collectorId: collector1.id,
      categoryId: categories['non-ferrous-metals'].id,
      grade: 'Aluminium Utensils & Cast Cuttings',
      declaredWeightKg: 35.0,
      collectedWeightKg: 35.0,
      status: 'WEIGHED',
      originCity: 'Jaipur',
      originState: 'Rajasthan',
      originPincode: '302017',
      currentHashSha256: crypto.createHash('sha256').update('LOT-2026-ALUM-7721-INIT').digest('hex'),
      events: {
        create: [
          {
            stage: 'GENERATED',
            actorRole: 'SYSTEM',
            actorName: 'ScrapSetu Digital Ledger',
            evidenceType: 'SYSTEM_RECORDED',
            location: 'Jaipur, Rajasthan',
            details: JSON.stringify({ message: 'Non-ferrous lot created.' }),
            eventHash: crypto.createHash('sha256').update('ALUM-GEN').digest('hex'),
          },
          {
            stage: 'WEIGHED',
            actorRole: 'COLLECTOR',
            actorName: 'Ramkishan Sahu',
            evidenceType: 'INDEPENDENTLY_VERIFIED',
            location: 'Jaipur Collection Center',
            details: JSON.stringify({ collectedWeightKg: 35.0 }),
            eventHash: crypto.createHash('sha256').update('ALUM-WEIGH').digest('hex'),
          },
        ],
      },
    },
  });

  // 10. Collaborative Scrap Pools
  const pool1 = await prisma.scrapPool.create({
    data: {
      poolCode: 'POOL-2026-PLAS-001',
      title: 'Jaipur South PET & HDPE Bulk Aggregation Drive',
      description: 'Combining clean rigid plastic lots from Mansarovar and Sanganer to satisfy 500 kg minimum bulk buyer threshold for +₹4.5/kg premium.',
      creatorId: collector1.id,
      categoryId: categories['rigid-plastics'].id,
      targetWeightKg: 500.0,
      currentPledgedKg: 380.0,
      targetPricePerKg: 25.0, // Bulk premium
      baselinePricePerKg: 20.5, // Standard single lot
      collectionDeadline: new Date(Date.now() + 86400000 * 3), // 3 days remaining
      status: 'OPEN',
      hubLocationName: 'Mansarovar Circular Recovery Hub',
      hubAddress: 'Sector 4, RIICO Industrial Area, Mansarovar, Jaipur',
      hubLat: 26.8450,
      hubLng: 75.7600,
      matchedOfferId: offers[`Rajputana Mega Pelletizing Plant_${categories['rigid-plastics'].id}`]?.id,
      matchedBuyerId: recycler3.id,
      disbursementStatus: 'PENDING_SALE',
      pledges: {
        create: [
          {
            collectorId: collector1.id,
            pledgedWeightKg: 180.0,
            status: 'PLEDGED',
            pledgedAt: new Date(Date.now() - 86400000),
          },
          {
            collectorId: collector2.id,
            pledgedWeightKg: 200.0,
            status: 'PLEDGED',
            pledgedAt: new Date(Date.now() - 3600000 * 12),
          },
        ],
      },
      activities: {
        create: [
          {
            actorId: collector1.id,
            actorName: 'Ramkishan Sahu',
            action: 'CREATED',
            details: JSON.stringify({ message: 'Pool launched targeting 500 kg PET for Rajputana Mega Plant.' }),
          },
          {
            actorId: collector1.id,
            actorName: 'Ramkishan Sahu',
            action: 'PLEDGED',
            details: JSON.stringify({ pledgedWeightKg: 180.0, poolTotal: 180.0 }),
          },
          {
            actorId: collector2.id,
            actorName: 'Mohammad Farooq',
            action: 'PLEDGED',
            details: JSON.stringify({ pledgedWeightKg: 200.0, poolTotal: 380.0 }),
          },
        ],
      },
    },
  });

  const pool2 = await prisma.scrapPool.create({
    data: {
      poolCode: 'POOL-2026-IRON-002',
      title: 'RIICO Heavy Iron & Steel Melt Lot (Target Met)',
      description: 'Consolidated commercial iron and steel turning scrap pooled for Rajputana Electric Arc Furnace.',
      creatorId: collector2.id,
      categoryId: categories['ferrous-metals'].id,
      targetWeightKg: 1000.0,
      currentPledgedKg: 1000.0,
      targetPricePerKg: 34.0,
      baselinePricePerKg: 30.0,
      collectionDeadline: new Date(Date.now() + 86400000 * 5),
      status: 'TARGET_REACHED',
      hubLocationName: 'Transport Nagar Scrap Yard Hub',
      hubAddress: 'Shop 12, Transport Nagar Market, Jaipur',
      hubLat: 26.8985,
      hubLng: 75.8450,
      matchedOfferId: offers[`Rajputana Electric Arc Furnace_${categories['ferrous-metals'].id}`]?.id,
      matchedBuyerId: recycler3.id,
      bulkNegotiatedRate: 34.0,
      totalPoolValue: 34000.0,
      disbursementStatus: 'BUYER_CONFIRMED',
      pledges: {
        create: [
          {
            collectorId: collector2.id,
            pledgedWeightKg: 650.0,
            status: 'PLEDGED',
          },
          {
            collectorId: collector1.id,
            pledgedWeightKg: 350.0,
            status: 'PLEDGED',
          },
        ],
      },
      activities: {
        create: [
          {
            actorId: collector2.id,
            actorName: 'Mohammad Farooq',
            action: 'CREATED',
            details: JSON.stringify({ targetWeightKg: 1000.0 }),
          },
          {
            actorId: 'SYSTEM',
            actorName: 'ScrapSetu Pooling Engine',
            action: 'TARGET_MET',
            details: JSON.stringify({ totalAchievedKg: 1000.0, message: '100% target reached. Matched to bulk buyer.' }),
          },
        ],
      },
    },
  });

  // 11. Voice Command Audit Logs
  await prisma.voiceCommandLog.createMany({
    data: [
      {
        userId: collector1.id,
        transcript: 'आज के पिकअप दिखाओ',
        language: 'hi',
        recognizedAction: 'NAVIGATE_TODAY_PICKUPS',
        actionPayload: JSON.stringify({ targetRoute: '/collector?tab=jobs' }),
        status: 'EXECUTED',
      },
      {
        userId: collector1.id,
        transcript: 'प्लास्टिक के बायर्स दिखाओ',
        language: 'hi',
        recognizedAction: 'OPEN_SMART_BUYER_MATCHING',
        actionPayload: JSON.stringify({ categorySlug: 'rigid-plastics' }),
        status: 'EXECUTED',
      },
      {
        userId: collector2.id,
        transcript: 'मेरी आज की कमाई कितनी है',
        language: 'hi',
        recognizedAction: 'VIEW_EARNINGS',
        actionPayload: JSON.stringify({ targetRoute: '/collector?tab=earnings' }),
        status: 'EXECUTED',
      },
    ],
  });

  console.log('✅ Seeded Scrap Lots, Traceability Passports, Scrap Pooling Groups, and Voice Command Audit records.');
  console.log('✅ Seeded pickup lifecycle states, transaction, digital receipt, rating, audit logs, and notifications.');
  console.log('🎉 Seed complete! Ready for demonstration.');
}

main()
  .catch((e) => {
    console.error('❌ Error in seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
