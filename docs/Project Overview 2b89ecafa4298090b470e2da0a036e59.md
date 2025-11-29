# Project Overview

**MITR – Intelligent Student Well-Being & Assessment Portal**

---

### *Machine for Interpersonal Thoughts Response*

*A Next.js + MCP + RAG + OpenAI powered early-intervention system for schools*

---

# **1. Vision**

MITR is an AI-powered student well-being assessment platform designed to proactively detect signs of emotional, social, and academic distress in school students.

It provides **safe, neutral, non-diagnostic assessments**, converts results into **actionable insights** for teachers and principals, and supports **human-in-the-loop decision-making** through intelligent AI conversations.

The goal:

👉 Identify student struggles **early**,

👉 Reduce unnoticed suffering,

👉 Empower teachers and counselors,

👉 Keep students safe, understood, and supported.

---

# **2. Core Domains of Assessment**

MITR specializes in eight risk domains:

1. **Bullying**
2. **Self-harm risk**
3. **Family stress**
4. **Academic pressure**
5. **Social isolation**
6. **Trauma**
7. **Neglect**
8. **Eating disorders**

All tests, patterns, insights, and alerts are based on these domains.

---

# **3. User Roles & Permissions**

### **3.1 Student**

- View basic profile
- Take baseline & follow-up MCQ tests
- No visibility into domains, scores, flags, or risk labels

### **3.2 Teacher**

- See class dashboard
- View domain-level results & explanations
- Upload notes, observations, or student work (images, assignments, PDFs)
- Chat with AI to interpret results and get guidance
- Mark tests as **False Alert**
- Receive high-risk alerts via email

### **3.3 Principal**

- See school-wide insights
- Monitor all student alerts
- Receive all high-risk alert emails
- Configure notification & threshold policies

### **3.4 Parent**

- View child’s profile
- See teacher observations and general well-being notes
- No access to domain breakdown or sensitive test details

---

# **4. Assessment Flow & Logic**

## **4.1 Phase 1 — Baseline Assessment (25 Questions)**

Purpose:

Build a complete initial understanding of each student across all 8 domains.

Characteristics:

- 25 questions
- 2–3 questions per domain
- Neutral tone (no mental health wording)
- Mostly 1–5 Likert scale
- 1–2 **personal interest questions** to build connection
    
    (e.g., “What do you like in nature?”)
    

This creates the **student’s first risk profile**.

---

## **4.2 Phase 2 — RAG-Driven Adaptive Follow-Up Assessments**

After baseline:

- Each student gets **10–15 question adaptive assessments**
- Focus on **domains where earlier tests showed concerns**
- Pulls context from:
    - Previous tests
    - Teacher notes
    - Student uploads (summarized)
    - Preferences
- Generates:
    - Domain-specific questions
    - 1–2 personalized engagement questions (e.g., “Last time you liked trees…”)

LLM + RAG ensures personalization while staying safe and non-invasive.

---

## **4.3 Domain Scoring**

Every test produces a **risk level** per domain:

- **0 — No concern**
- **1 — Mild concern (monitor)**
- **2 — Moderate concern (teacher action recommended)**
- **3 — High concern (serious attention needed)**

Follow-up logic uses these scores to:

- Trigger alerts
- Decide next test focus
- Update student’s risk trajectory

---

# **5. Core Features**

## **5.1 Teacher–AI Interactive Insight Chat**

Teachers can open a flagged test and ask:

- “Why was bullying flagged?”
- “Did something similar happen earlier?”
- “How to approach this student safely?”
- “Is this student usually shy?”

System responds using:

- LLM reasoning
- RAG history
- Domain rules
    
    **Without making diagnoses or clinical statements.**
    

This makes teachers feel supported, not left alone.

---

## **5.2 Alerts & Notifications**

Alerts are based on rules such as:

- **Self-harm ≥ 2** → Immediate red flag
- **Bullying ≥ 2 + Social Isolation ≥ 2** → Red flag
- **Multiple domains ≥ 1** → Yellow flag

**Recipients:**

- Teacher
- Principal

Includes:

- Student name & class
- Domains flagged
- Link to dashboard
- Short explanation

No alerts sent directly to parents.

---

## **5.3 False Alert Handling**

Teachers can mark tests as:

- **Valid**
- **Monitor**
- **False Alert**

If false alert:

- Test is **excluded from future scoring**
- Test is **excluded from vector embeddings**
- Shows in audit logs as “Invalidated by Teacher”

This prevents noisy data from contaminating RAG and future predictions.

---

## **5.4 Uploading Observations & Student Work**

Teachers can upload:

- Notes
- Photos
- Documents
- Student assignments / art

System processes using OpenAI:

- Extract text (OCR later)
- Summarize meaning & emotional context
- Store in vector DB for future RAG queries

These uploads significantly strengthen insight explanations.

---

# **6. Technical Architecture**

## **6.1 Frontend (Next.js + Tailwind + ShadCN)**

Modules:

- Student testing interface
- Teacher dashboards
- Principal analytics
- Parent view
- AI chat panel
- Alerts listing
- Upload interface

Front-end never sees raw LLM keys; everything goes through MCP backend tools.

---

## **6.2 MCP Server Layer (Python/Node.js)**

*The “brain” connecting everything.*

### Exposed Tools:

1. **generate_assessment_tool**
2. **score_responses_tool**
3. **detect_patterns_tool**
4. **synthesize_insights_tool**
5. **teacher_ai_chat_tool**
6. **embed_content_tool**

Each tool wraps:

- OpenAI API calls
- RAG retrieval
- Domain logic
- Guardrails & safety filters

---

## **6.3 OpenAI (LLM + Embeddings)**

OpenAI handles **all intelligence**:

### Used for:

- Test generation
- Follow-up adaptive test creation
- Domain scoring
- Explanation summaries
- Teacher-AI chat
- Summarizing teacher uploads
- Embedding all text for vector DB

### Models:

- `gpt-4o-mini` (fast, cost-effective reasoning)
- `gpt-4o` for deeper teacher chat sessions
- `text-embedding-3-small` for RAG
- Moderation endpoint for self-harm / abuse content

---

## **6.4 Vector Database (RAG Index)**

Stores:

- Summaries of past assessments
- Teacher notes
- Extracted meaning from uploads
- Long-term behaviour patterns
- Student preference profile (“likes trees”, “likes maths”, etc.)

Used in:

- Personalized test generation
- Teacher AI chat
- Insight synthesis

---

## **6.5 Backend (Node.js or FastAPI)**

Handles:

- Authentication & roles
- Student data & consent
- Test flow management
- Storing scores & explanations
- Triggering alerts
- Serving dashboards
- API for file uploads
- Email notifications

Database options:

- MongoDB (flexible for variable question formats)
- PostgreSQL optional

---

# **7. Data Flow Summary**

### **1. Student logs in → Starts Baseline Test**

↓

### **2. OpenAI scores answers → Risk per domain**

↓

### **3. RAG stores summaries & embeddings**

↓

### **4. Teacher sees results + explanations**

↓

### **5. If red flag → Email alert sent**

↓

### **6. Teacher uploads notes or uses AI chat for understanding**

↓

### **7. Next test is generated adaptively based on RAG**

↓

### **8. Continuous monitoring & updates**

↓

### **9. Parents see high-level notes in their portal**

---

# **8. Safety & Ethics**

- No diagnosis — screening only
- Risk scoring is rule-guided (LLM stays constrained)
- Student identity protected
- High-risk answers instantly processed through moderation filters
- Human-in-the-loop for all escalations
- Parents receive filtered, sensitive-safe versions
- Students are never shown domain labels or risk scores

---

# **9. MVP Scope (Hackathon Ready)**

To ship a working version in limited time:

### **Student side**

- 25-question baseline test
- Follow-up 10-question test
- Basic portal

### **Teacher side**

- Class dashboard
- AI chat (MVP, basic RAG)
- Alert screen
- Mark as False Alert

### **Principal**

- View all alerts
- Email notifications

### **Parent**

- Basic profile + teacher notes

### **Backend**

- MongoDB + Next.js + Python MCP
- OpenAI for all intelligence
- Basic RAG store

This is a fully functional MVP.

---

# **10. Long-Term Enhancements**

- OCR for document uploads
- Daily/weekly automated teacher briefing reports
- Cross-student trend analysis
- Behaviour & attendance integration
- Mobile app versions
- Gamified student engagement
- Multi-language test support
- Regional psychological guideline compliance

---

# **11. Expected Outcomes**

With MITR, schools get:

- Earlier detection of hidden struggles
- Reduced bullying & social isolation issues
- Better support for academic pressure
- Structured handover between teachers & counselors
- Data-backed well-being insights
- More confident teachers with AI-backed guidance
- Students who feel more understood & supported

---

# **12. Final Summary**

**MITR is a complete AI-driven well-being platform for schools.**

It respects privacy, empowers teachers, protects students, and uses advanced AI only as a supportive assistant — not a decision-maker.

It blends:

- Baseline assessments
- Personalized follow-up tests
- RAG-powered context-awareness
- Teacher-AI collaboration
- Safe alerting
- Structured data tracking
- Multi-role dashboards

All with **OpenAI as the exclusive intelligence engine.**

---