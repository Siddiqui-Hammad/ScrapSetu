# ScrapSetu: System Architecture & Technical Specifications
**A Digital Bridge to Sustainable Recycling**

---

## 1. Executive Summary

ScrapSetu is a full-stack, inclusive digital platform designed to formalize, transparently price, and digitally integrate India's informal scrap collection ecosystem. By connecting urban households and commercial bulk waste generators directly with local doorstep waste collectors (*kabadiwalas*), aggregators, and certified recycling plants, ScrapSetu solves critical industry bottlenecks:

- **Unfair and Arbitrary Scrap Pricing:** Replaced with open regional benchmark indices.
- **Unreliable Pickup Coordination:** Replaced with proximity-based matching and route planning.
- **Poor Waste Segregation:** Improved via AI-assisted material vision categorization and quality grade incentives.
- **Lack of Digital Ledger:** Replaced with tamper-evident digital receipts secured with cryptographic SHA-256 hashes.
- **Traceability to Formal Recyclers:** Direct intake record linking between collectors and certified processing mills.

---

## 2. Full Architecture Topology

```mermaid
graph TB
    subgraph UI_Layer["User Experience Layer (React 18 + TypeScript + Tailwind)"]
        HH["Household Resident\n(Doorstep booking, live rates)"]
        COM["Commercial Bulk Generator\n(Recurring schedules, multi-hub)"]
        KAB["Waste Collector / Kabadiwala\n(Mobile-first Hindi/English terminal)"]
        REC["Recycling Facility\n(Inbound intake slips, buying offers)"]
        ADM["Platform Admin\n(KYC approvals, mandi rates, audit logs)"]
    end

    subgraph Service_Layer["Backend Services (Node.js + Express + TypeScript)"]
        AUTH_SVC["Auth & RBAC Guard\n(JWT, Role Isolation)"]
        PICKUP_SVC["State Machine Engine\n(OPEN -> ACCEPTED -> IN_PROGRESS -> COMPLETED)"]
        MATCH_SVC["Collector Scoring & Matching\n(Distance, Capacity, Rating, Materials)"]
        ROUTE_SVC["Evaluated Route Optimizer\n(Nearest-Neighbor TSP)"]
        PRICE_SVC["Indicative Pricing Engine\n(MRAI Mandi benchmarks + grade multipliers)"]
        AI_SVC["AI Vision Classification Layer\n(Multi-modal inference + explainable heuristic fallback)"]
        TXN_SVC["Digital Receipt & Settlement\n(Cryptographic SHA-256 Hashes)"]
        GEO_SVC["Geolocation & Privacy Proxy\n(Fuzzy coords before acceptance)"]
        IMPACT_SVC["ESG Ecological Accounting\n(CPCB & EPA WARM carbon models)"]
    end

    subgraph Persistence_Layer["Data & Persistence Layer"]
        DB[(Prisma ORM with SQLite / PostgreSQL)]
        AUDIT_LOG[(Immutable Audit Trail)]
        MEDIA_STORE[Secure Document & Image Storage]
    end

    HH -->|REST API + JWT| Service_Layer
    COM -->|REST API + JWT| Service_Layer
    KAB -->|REST API + JWT| Service_Layer
    REC -->|REST API + JWT| Service_Layer
    ADM -->|REST API + JWT| Service_Layer

    Service_Layer --> DB
    Service_Layer --> AUDIT_LOG
    Service_Layer --> MEDIA_STORE
```

---

## 3. Controlled State Machine

The pickup lifecycle follows a deterministic server-enforced state machine:

```mermaid
stateDiagram-v2
    [*] --> OPEN : Requester books pickup
    OPEN --> ACCEPTED : Collector accepts (atomic lock)
    OPEN --> CANCELLED : Cancelled by user before assignment
    ACCEPTED --> IN_PROGRESS : Collector arrives on-site with scale
    ACCEPTED --> CANCELLED : Cancelled with logged reason
    IN_PROGRESS --> COMPLETED : Material weighed mutually & receipt issued
    IN_PROGRESS --> DISPUTED : Scale/price disagreement
    COMPLETED --> DISPUTED : Post-transaction grievance
    DISPUTED --> COMPLETED : Dispute resolved by Admin
    DISPUTED --> CANCELLED : Transaction voided by Admin
```

---

## 4. Privacy-First Geolocation Engine

- **Open Listings:** Coordinate fuzzing adds an intentional $\pm 400\text{m}$ offset to latitude and longitude for public or unaccepted job views.
- **On Acceptance:** Exact street addresses and telephone numbers are unlocked **only** to the assigned collector.
- **Auditing:** All address unlocks and state transitions are recorded in the central audit ledger.
