# High-Level System Architecture Diagram

# ✅ **1. High-Level System Architecture Diagram**

```
                     ┌──────────────────────────────┐
                     │         FRONTEND (UI)         │
                     │──────────────────────────────│
                     │  Next.js + Tailwind + ShadCN │
                     │                              │
Student ────────►    │  • Student Test Interface    │
Teacher ────────►    │  • Teacher Dashboard         │
Principal ──────►    │  • Alerts & Reports          │
Parent ─────────►    │  • AI Chat Panel             │
                     └──────────────┬───────────────┘
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │      BACKEND API SERVER       │
                     │   Node.js / FastAPI (REST)    │
                     │──────────────────────────────│
                     │  Auth, Roles, Policies       │
                     │  Test Management             │
                     │  Alerts Engine               │
                     │  File Uploads                │
                     └──────────────┬───────────────┘
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │        MCP SERVER LAYER       │
                     │  Multi-Agent Tool Orchestration│
                     │──────────────────────────────│
                     │ generate_assessment_tool     │
                     │ score_responses_tool         │
                     │ detect_patterns_tool         │
                     │ synthesize_insights_tool     │
                     │ teacher_ai_chat_tool         │
                     └──────────────┬───────────────┘
                                    │   (OpenAI Calls)
                                    ▼
         ┌────────────────────────────────────────────────────────────┐
         │                       OPENAI SERVICES                       │
         │────────────────────────────────────────────────────────────│
         │  GPT-4o / GPT-4o-mini → test generation, scoring, chat     │
         │  Embeddings API → vector creation for RAG                  │
         │  Moderation API → self-harm / abuse safety                 │
         └──────────────────────┬──────────────────────────────────────┘
                                │
                                ▼
         ┌────────────────────────────────────────────────────────────┐
         │                    VECTOR DATABASE (RAG)                    │
         │────────────────────────────────────────────────────────────│
         │ Stores:                                                    │
         │  • Past test summaries                                     │
         │  • Teacher notes / uploads (summaries)                     │
         │  • Student preference profiles                             │
         │  • Risk trajectory data                                    │
         └──────────────────────┬──────────────────────────────────────┘
                                │
                                ▼
         ┌────────────────────────────────────────────────────────────┐
         │                   MAIN DATABASE (MongoDB)                  │
         │────────────────────────────────────────────────────────────│
         │  Students, Users, Tests, Scores, Flags, Observations       │
         │  Alerts, Upload metadata, Parent links                     │
         └────────────────────────────────────────────────────────────┘

```

---

# ✅ **2. Detailed Component Architecture Diagram**

```
┌──────────────────────────────────────────────────────────────────────┐
│                           MITR SYSTEM                                │
└──────────────────────────────────────────────────────────────────────┘

Frontend (Next.js)
─────────────────────────────────────────────────────────────────────────
• Student Module
    - Test player (MCQ engine)
    - Progress save
• Teacher Module
    - Dashboard (class-level overview)
    - Alert viewer
    - Upload panel
    - Chat with AI
• Principal Module
    - School analytics
• Parent Module
    - Child overview

                            │  REST / GraphQL API Calls
                            ▼

Backend API Server
─────────────────────────────────────────────────────────────────────────
• Auth + Role-based access
• Test scheduling + management
• Risk-level computation rules
• Email alert sender
• Bridge to MCP layer
• File storage integration

                            │  MCP Tool Calls
                            ▼

MCP Server (AI Orchestration)
─────────────────────────────────────────────────────────────────────────
• Agent 1: Assessment Generator
• Agent 2: Response Scorer
• Agent 3: Pattern Detector
• Agent 4: Teacher-AI Chat
• Agent 5: Insight Synthesizer
• Agent 6: Content Embedder
• Guardrail policies + error handling

                            │  Embeddings + LLM Calls
                            ▼

OPENAI
─────────────────────────────────────────────────────────────────────────
• GPT-4o-mini (reasoning)
• GPT-4o (chat/insights)
• Embeddings API
• Moderation API

                            │  Upsert / Query Vectors
                            ▼

Vector DB (Pinecone / Qdrant / pgvector)
─────────────────────────────────────────────────────────────────────────
• Stores:
    - Past assessments
    - Teacher notes
    - Student preference summary
    - Class-wide behavioural patterns
• Used for:
    - Adaptive test generation
    - Teacher AI chat context
    - Insight synthesis

                            │  CRUD operations
                            ▼

MongoDB
─────────────────────────────────────────────────────────────────────────
• Users & Roles
• Student profiles
• Test questions & responses
• Domain risk scores
• Flags & Alerts
• Uploaded files metadata
• Audit logs

```

---

# ✅ **3. End-to-End Data Flow Diagram (DFD)**

*Illustrates one complete cycle.*

```
(1) Student starts test
┌──────────────────┐
│   Frontend UI    │
└──┬───────────────┘
   │ sends test start request
   ▼
┌──────────────────┐
│ Backend Server   │
└──┬───────────────┘
   │ requests assessment generation
   ▼
┌──────────────────┐
│   MCP Server     │
└──┬───────────────┘
   │ fetch RAG history
   ▼
┌──────────────────┐
│  Vector Database │
└──┬───────────────┘
   │ returns context → passed to OpenAI
   ▼
┌──────────────────┐
│     OpenAI       │
│ GPT-4o-mini      │
└──┬───────────────┘
   │ generates questions
   ▼
┌──────────────────┐
│ Backend returns  │
│ test to student  │
└──┬───────────────┘
   │ student answers
   ▼
┌──────────────────┐
│ Backend submits  │
│ answers to MCP   │
└──┬───────────────┘
   │ scoring + risk evaluation
   ▼
┌──────────────────┐
│     OpenAI       │
│  scoring agent   │
└──┬───────────────┘
   │ returns risk per domain
   ▼
┌──────────────────┐
│ Backend saves in │
│ MongoDB          │
└──┬───────────────┘
   │ generate summary
   ▼
┌──────────────────┐
│ MCP → OpenAI     │
│ Insight synthesis│
└──┬───────────────┘
   │ store summary in vector DB
   ▼
┌──────────────────┐
│ Vector Database  │
└──┬───────────────┘
   │ check alert rules
   ▼
┌──────────────────┐
│ Backend          │
│ (Alert Engine)   │
└──┬───────────────┘
   │ email teachers/principal if red flag
   ▼
┌──────────────────┐
│ Email Service    │
└──────────────────┘

```

---