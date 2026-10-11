# ScrapSetu: REST API Documentation Specification

Base URL: `http://localhost:5000/api`

---

## 1. Authentication & Profiles (`/auth`)

| Method | Endpoint | Role Guard | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Create user with role (`HOUSEHOLD`, `BUSINESS`, `COLLECTOR`, `RECYCLER`) |
| `POST` | `/auth/login` | Public | Authenticate email & password, returns JWT token |
| `GET` | `/auth/me` | Authenticated | Retrieve authenticated user profile and addresses |
| `PATCH`| `/auth/language` | Authenticated | Update user language preference (`en`, `hi`) |
| `POST` | `/auth/addresses`| Authenticated | Register a new user dispatch address |

---

## 2. Pickup Requests & Lifecycle (`/pickups`)

| Method | Endpoint | Role Guard | Description |
|---|---|---|---|
| `POST` | `/pickups` | Authenticated | Create pickup request with items, valuation & notification |
| `GET` | `/pickups` | Authenticated | Role-filtered pickup listings with privacy coordinate fuzzing |
| `GET` | `/pickups/:id` | Authenticated | Get pickup details (exact address unlocked only to assigned collector) |
| `POST` | `/pickups/:id/cancel` | Requester/Admin | Cancel pickup request with reason |
| `POST` | `/pickups/:id/dispute` | Participant | File grievance / dispute case |

---

## 3. Collector Operations (`/collectors`)

| Method | Endpoint | Role Guard | Description |
|---|---|---|---|
| `GET` | `/collectors/nearby` | `COLLECTOR` | Browse open pickup jobs within service radius |
| `POST` | `/collectors/pickups/:id/accept` | `COLLECTOR` | Atomic acceptance lock preventing race conditions |
| `PATCH`| `/collectors/pickups/:id/status` | `COLLECTOR` | Update state to `IN_PROGRESS` (arrived on site) |
| `POST` | `/collectors/pickups/:id/complete` | `COLLECTOR` | Input weighed kilograms, generate SHA-256 digital receipt |
| `GET` | `/collectors/earnings` | `COLLECTOR` | Daily, weekly, monthly earnings ledger |
| `GET` | `/collectors/route-plan` | `COLLECTOR` | Evaluated TSP sequence for multiple active stops |

---

## 4. Recycler Facility Portal (`/recyclers`)

| Method | Endpoint | Role Guard | Description |
|---|---|---|---|
| `GET` | `/recyclers/offers` | Public | View active buying rate sheets and lot requirements |
| `POST` | `/recyclers/offers` | `RECYCLER` | Publish buying rate per kg by material grade |
| `POST` | `/recyclers/intakes` | `RECYCLER` | Generate gate weighbridge intake slip |
| `GET` | `/recyclers/dashboard` | `RECYCLER` | Recycler monthly throughput analytics |

---

## 5. Pricing & AI Services (`/pricing`, `/ai`, `/transactions`, `/impact`)

| Method | Endpoint | Role Guard | Description |
|---|---|---|---|
| `GET` | `/pricing/rates` | Public | Material categories and indicative mandi benchmark rates |
| `POST` | `/pricing/estimate` | Public | Calculate itemized valuation with grade adjustments |
| `POST` | `/ai/classify` | Authenticated | Image vision material classification with confidence scores |
| `GET` | `/transactions/receipt/:receiptNumber` | Public | Cryptographic verification and details of digital receipt |
| `GET` | `/impact/public` | Public | Aggregate platform ecological savings (CO₂e, trees, water) |

---

## 6. Regulatory & Administration (`/admin`)

| Method | Endpoint | Role Guard | Description |
|---|---|---|---|
| `GET` | `/admin/overview` | `ADMIN` | Platform-wide telemetry, completion rates, and cashflow |
| `GET` | `/admin/users` | `ADMIN` | Manage users and verification KYC approvals |
| `PATCH`| `/admin/users/:userId/verification` | `ADMIN` | Approve or revoke collector/recycler credentials |
| `PATCH`| `/admin/prices/:priceId` | `ADMIN` | Update benchmark indicative rates with audit logging |
| `POST` | `/admin/disputes/:disputeId/resolve` | `ADMIN` | Issue official dispute resolution |
| `GET` | `/admin/audit-logs` | `ADMIN` | Review tamper-evident administrative audit ledger |
