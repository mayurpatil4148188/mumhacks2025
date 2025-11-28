# MITR – Intelligent Student Well-Being & Assessment Portal

Multi-tenant SaaS-style Next.js 14 app for school well-being assessments with role-based dashboards, AI scoring, alerting, and RAG search.

## Stack
- Next.js 14 (App Router), TypeScript
- MongoDB + Mongoose
- NextAuth (credentials)
- Tailwind + ShadCN-inspired UI primitives
- OpenAI (question generation, scoring, chat), simple Mongo-backed RAG
- Nodemailer for SMTP alerts

## Getting started
1. Copy `.env.example` to `.env` and fill values (Mongo URI, OpenAI key, SMTP, NextAuth secret).
2. Install deps: `npm install` (or `pnpm install`).
3. Run dev server: `npm run dev`.
4. Seed a master admin: `npm run seed` (creates `admin@mitr.local` / `admin123`).

## Key folders
- `src/app` – App Router pages and API routes
- `src/models` – Mongoose models for all entities
- `src/lib` – helpers, validators
- `src/services` – test orchestration and alert engine
- `src/ai` – OpenAI clients and stubs
- `src/rag` – embedding + naive cosine search in Mongo
- `src/email` – SMTP mailer
- `uploads/` – temporary local file storage (switchable to S3 later)

## Notes
- AI prompts and adaptive follow-ups are stubbed but structured for drop-in prompt tuning.
- Alerts use deterministic rules; adjust in `src/services/alert-engine.ts`.
- RAG uses Mongo for embeddings; replace with a vector store when needed.
