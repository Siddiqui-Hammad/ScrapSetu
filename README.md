# ScrapSetu (स्क्रैपसेतु): AI-Powered Circular Economy Platform
**Smart India Hackathon Edition | Circular Intelligence & Climate-Tech Infrastructure**

[![Next.js](https://img.shields.io/badge/Next.js-14.2_App_Router-black.svg?logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v24.20_LTS-green.svg?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-darkblue.svg?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4_Luxury_Dark-10b981.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-28/28_Passed_(100%25)-brightgreen.svg?logo=vitest)](https://vitest.dev/)

---

## 🌍 Overview

**ScrapSetu (स्क्रैपसेतु)** is an advanced, AI-assisted Indian circular-economy platform connecting households, commercial waste generators, informal waste collectors (*kabadiwalas*), recycling mills, and government environmental authorities (CPCB/MoEFCC).

It replaces fragmented, cash-only informal scrap collection with:
1. **Intelligent Material Identification & Volumetric Weight Estimation** (ScrapVision AI).
2. **Transparent Fair Mandi Pricing** with instant UPI bank settlements (TrustWeigh).
3. **Biometric Face-Matching KYC** (Aadhaar & Driving Licence vs Live Camera Selfie).
4. **Collector Visual Inspection Workflow** (customer scrap photos visible before job acceptance).
5. **Bilingual Hover Translation Tooltips** (instant English ↔ Hindi context across all touchpoints).
6. **Luxury Dark Climate-Tech Aesthetics** (Obsidian Forest `#070D0A` with emerald/teal ambient lighting).
7. **End-to-End Waste Traceability** with tamper-evident digital QR Waste Passports.

---

## 🌟 ScrapSetu Major Innovations

### 1. 🌌 Luxury Dark Theme (`#070D0A`)
* **Design System**: Deep obsidian forest canvas (`#070D0A`) paired with elevated obsidian surfaces (`#0B1510`, `#0E1D16`) and subtle glowing emerald borders (`rgba(16, 185, 129, 0.2)`).
* **High Contrast Typography**: Brilliant light text (`#F4FDF8`) and muted sage labels (`#A3B8AD`) designed for maximum legibility and premium startup presentation.

### 2. 🌐 Bilingual Hover Translation Tooltips (`<BilingualText>`)
* Active language toggle (`EN` or `हिंदी`) prominently displayed in the header with glowing status.
* Moving your cursor over navigation links, role cards, action buttons, and headings triggers a floating translation tooltip revealing what the item means in the opposite language (English ↔ Hindi).

### 3. 🔍 ScrapVision AI: Visual Description & Volumetric Weight Estimation
* **Natural Language Observation**: Generates human-like scene observations (*"I can see 14 clean PET beverage bottles, uncompressed transparent polymer. Grade A sorting."*).
* **Volumetric Weight Readout**: Computes volumetric mass in kg (`5.2 kg ± 0.4 kg`) from item density and unit count with interactive fine-tuning slider and instant payout valuation.
* **Dual Capture**: Supports live webcam snapshot (`getUserMedia`) and high-resolution photo file uploads.
* **Cart Synchronization**: 1-click confirmation adds the verified weight and category directly into the pickup booking cart.

### 4. 🛺 Collector Portal: Customer Scrap Photo Inspection Lightbox
* Nearby jobs in the Collector Portal display customer-uploaded scrap photo thumbnails and AI weight badges (`AI Weight: ~15.0 kg`).
* **Interactive Lightbox Modal**: Collectors can inspect the full-resolution photo, read the AI's composition analysis, verify the address and payout, and accept the job with complete certainty before traveling.

### 5. 🛡️ AI Biometric KYC Photo Matching (Aadhaar / DL vs Live Selfie)
* Verifies collectors and recyclers by matching ID card photos against live camera selfies.
* Features anti-spoofing detection, 68 facial coordinate landmark checks, inter-pupillary distance alignment, and instant OCR data extraction.

### 6. 🤝 Smart Buyer Matching & Collaborative Pooling
* Matches collectors with optimal bulk recyclers based on net proceeds (price minus transport cost).
* Enables micro-collectors to pool scrap lots together to reach high-value bulk factory minimum order quantities (MOQs).

---

## ⚡ 1-Click Role Switcher Demo Accounts

| Role | Demo Credentials | Key Workflows & Features |
|---|---|---|
| 🏠 **Household** | `household@scrapsetu.in` / `Demo@12345` | ScrapVision AI Scanner, calibrated doorstep booking, GreenKarma citizen rewards. |
| 🛺 **Collector** | `collector@scrapsetu.in` / `Demo@12345` | Scrap Photo Inspection Lightbox, EcoRoute TSP navigation, Voice Kabadiwala mode. |
| 🏢 **Business** | `business@scrapsetu.in` / `Demo@12345` | Bulk commercial scrap scheduling, ESG/BRSR compliance reports, GST tax receipts. |
| 🏭 **Recycler** | `recycler@scrapsetu.in` / `Demo@12345` | Live mandi intake rate board, weighbridge intake slips, CPCB EPR credit certificates. |
| 🛡️ **Admin** | `admin@scrapsetu.in` / `Demo@12345` | AI Biometric Face-Matching KYC queue, circular flow telemetry, dispute resolution. |

---

## 🚀 Quick Start Guide

### 1. Start Backend API
```bash
cd server
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm test        # Runs 28/28 automated unit tests
npm run dev     # Starts server on http://localhost:5000
```

### 2. Start Next.js Frontend
```bash
cd frontend
npm install
npm run build   # Verifies static compilation of all 14 routes
npm run dev     # Starts app on http://localhost:3000
```

---

## 🧪 Automated Testing Status

* **Backend Unit & Integration Tests**: 28 passed (100%) via Vitest.
  * `kycPhotoMatching.test.ts` (6 tests)
  * `server.test.ts` (5 tests)
  * `advancedFeatures.test.ts` (17 tests)
* **Frontend Production Build**: 14/14 static pages compiled with zero TypeScript or webpack errors.

---

## 📜 Repository Structure

```
├── frontend/                     # Next.js 14 App Router (Tailwind + Radix UI + Motion)
│   ├── src/app/                  # Portal routes (household, collector, business, recycler, admin)
│   ├── src/components/common/    # Navbar, Footer, BilingualText tooltips
│   ├── src/components/workflows/ # ScrapVision, PhotoMatching KYC, TrustWeigh, BuyerMatching, Pooling
│   └── src/store/                # Zustand stores (Auth, Language, Cart)
├── server/                       # Node.js + Express + TypeScript + Prisma ORM
│   ├── src/controllers/          # Portal APIs, Auth, KYC, Pooling, Buyer Matching
│   ├── src/services/             # AI Service (ScrapVision & Face Matching), EcoRoute TSP
│   └── tests/                    # Vitest test suite
├── docs/                         # Architecture diagrams, ER specifications, SIH package
└── streamlit_app.py              # Streamlit demo edition
```

---

© 2026 **ScrapSetu Platform**. Built for Smart India Hackathon & Sustainable Circular Economy.
