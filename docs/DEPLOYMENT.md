# ScrapSetu: Deployment, Infrastructure & Production Guidelines

---

## 1. Quick Local Setup

### Prerequisites
- Node.js (v18.0.0 or higher - Node 24 LTS verified)
- npm (v9.0.0 or higher)

### Setup Steps
```bash
# 1. Install root, server, and client dependencies
npm --prefix server install
npm --prefix client install

# 2. Database Sync & Seed
cd server
npx prisma db push
npx tsx prisma/seed.ts
cd ..

# 3. Run Development Servers
# Terminal 1: Backend API (Port 5000)
cd server && npx tsx watch src/server.ts

# Terminal 2: Frontend Client (Port 5173)
cd client && npx vite
```

Open `http://localhost:5173` in your browser.

---

## 2. Production Environment Variables

### Server (`server/.env`)
```ini
PORT=5000
NODE_ENV=production
DATABASE_URL="file:./dev.db" # or postgresql://user:password@host:5432/scrapsetu
JWT_SECRET="generate_a_cryptographically_secure_256_bit_secret_string"
JWT_EXPIRES_IN="7d"
GEMINI_API_KEY="" # Optional external AI key (fallback heuristic vision engine activates automatically)
UPLOAD_DIR="./uploads"
CLIENT_URL="https://yourdomain.com"
```

---

## 3. Switching from SQLite to Hosted PostgreSQL (Supabase / AWS RDS / GCP Cloud SQL)

1. In `server/prisma/schema.prisma`, update the datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Set `DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/scrapsetu"` in `server/.env`.
3. Run `npx prisma db push` and `npx tsx prisma/seed.ts`.

---

## 4. Production Docker Containerization (Optional)

```dockerfile
# Multi-stage Dockerfile
FROM node:24-alpine AS base
WORKDIR /app

# Backend Build
COPY server/package*.json ./server/
RUN cd server && npm install
COPY server/ ./server/
RUN cd server && npx prisma generate && npx tsc

# Frontend Build
COPY client/package*.json ./client/
RUN cd client && npm install
COPY client/ ./client/
RUN cd client && npx vite build

EXPOSE 5000
CMD ["node", "server/dist/server.js"]
```
