# ScrapSetu: A Digital Bridge to Sustainable Recycling
**Smart India Hackathon Presentation Edition**

[![Node.js](https://img.shields.io/badge/Node.js-v24.20_LTS-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-darkblue.svg)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-teal.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Passed_100%25-brightgreen.svg)](https://vitest.dev/)

---

## 🌍 Overview

**ScrapSetu** is an inclusive, end-to-end digital recycling ecosystem that connects households, commercial waste generators, informal waste collectors (*kabadiwalas*), recycling businesses, and authorized waste management organizations across India.

It transforms India's informal recycling sector by eliminating unfair scrap pricing, unreliable doorstep collection, poor segregation, and lack of digital records.

---

## ⚡ 1-Click College Demo Accounts

For immediate demonstration and evaluation, a **Quick Role Switcher** is pinned to the top of every screen. Alternatively, you can log in with development credentials:

| Role | Demo Email | Password | Persona & Functionality |
|---|---|---|---|
| 🏠 **Household** | `household@scrapsetu.in` | `Demo@12345` | Pooja Verma (Malviya Nagar, Jaipur) — Doorstep booking, AI vision classifier, live tracking, eco footprint. |
| 🏢 **Business** | `business@scrapsetu.in` | `Demo@12345` | Rohan Mehra (GreenLeaf Logistics) — Bulk recurring collections, multi-warehouse dispatch, GST receipts. |
| 🛺 **Kabadiwala** | `collector@scrapsetu.in` | `Demo@12345` | Ramkishan Sahu — Mobile-first Hindi/English terminal, 1-tap accept, digital scale weighing entry, TSP route optimizer. |
| 🏭 **Recycler** | `recycler@scrapsetu.in` | `Demo@12345` | Aravalli Ecocycle Mills — Published buying rates, weighbridge intake slips, bulk recycling throughput. |
| 🛡️ **Administrator** | `admin@scrapsetu.in` | `Demo@12345` | Vikramaditya Sharma — KYC document approvals, mandi benchmark rates, dispute center, immutable audit logs. |

---

## 🚀 Quick Start Guide

### 1. Start Backend API
```bash
cd server
npm install
npx prisma db push
npx tsx prisma/seed.ts
npx tsx watch src/server.ts
```
Backend runs at `http://localhost:5000` with health check at `http://localhost:5000/api/health`.

### 2. Start Frontend Web Client
```bash
cd client
npm install
npx vite
```
Frontend runs at `http://localhost:5173`.

---

## 🧪 Automated Testing

Both backend and frontend logic have comprehensive automated Vitest test suites:

```bash
# Run backend tests (Pricing, Matching, Geolocation, SHA-256 Receipt verification, TSP Route optimizer)
cd server && npx vitest run

# Run frontend tests (Translations, Demo role schemas, Formula verification)
cd client && npx vitest run
```

---

## 📐 Documentation Index

- [Architecture & State Machine](file:///C:/Users/Asus/.gemini/antigravity/scratch/scrapsetu/docs/ARCHITECTURE.md)
- [Relational Database ER Diagram](file:///C:/Users/Asus/.gemini/antigravity/scratch/scrapsetu/docs/ER_DIAGRAM.md)
- [SIH Presentation Package & Workflow](file:///C:/Users/Asus/.gemini/antigravity/scratch/scrapsetu/docs/SIH_PRESENTATION.md)
- [Complete REST API Specification](file:///C:/Users/Asus/.gemini/antigravity/scratch/scrapsetu/docs/API_SPEC.md)
- [Deployment & PostgreSQL Configuration](file:///C:/Users/Asus/.gemini/antigravity/scratch/scrapsetu/docs/DEPLOYMENT.md)
