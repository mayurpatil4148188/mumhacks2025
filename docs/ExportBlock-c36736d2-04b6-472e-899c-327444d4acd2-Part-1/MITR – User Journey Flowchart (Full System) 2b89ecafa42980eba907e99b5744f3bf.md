# MITR – User Journey Flowchart (Full System)

```
                            ┌────────────────────────────┐
                            │        MASTER ADMIN         │
                            └──────────────┬─────────────┘
                                           │
                      Login to Master Admin Portal
                                           │
                                           ▼
                            ┌────────────────────────────┐
                            │  Create / Manage Schools   │
                            │  Add Principal Accounts     │
                            │  Configure Global Settings  │
                            └──────────────┬─────────────┘
                                           │
                                           ▼
                                   END OF FLOW

```

---

# **PRINCIPAL JOURNEY**

```
                           ┌────────────────────────────┐
                           │         PRINCIPAL           │
                           └────────────┬───────────────┘
                                        │ Login
                                        ▼
                           ┌────────────────────────────┐
                           │    Principal Dashboard      │
                           │  - School Overview          │
                           │  - Risk Heatmaps            │
                           │  - Recent Alerts            │
                           └────────────┬───────────────┘
                                        │
                                        ▼
                           ┌────────────────────────────┐
                           │ Manage Teachers & Students  │
                           │ Add/Link Teacher Accounts   │
                           │ Assign Classes/Sections     │
                           └────────────┬───────────────┘
                                        │
                                        ▼
                           ┌────────────────────────────┐
                           │ View Alerts & Summaries     │
                           │ Acknowledge Alerts          │
                           │ Forward to teachers         │
                           └────────────┬───────────────┘
                                        │
                                        ▼
                                    END FLOW

```

---

# **TEACHER JOURNEY**

```
                           ┌──────────────────────────┐
                           │          TEACHER         │
                           └────────────┬─────────────┘
                                        │ Login
                                        ▼
                           ┌──────────────────────────┐
                           │     Teacher Dashboard     │
                           │ - Class List              │
                           │ - Students                │
                           │ - Domain Risk Colors      │
                           └────────────┬─────────────┘
                                        │
             ┌──────────────────────────┴───────────────────────────┐
             │                                                      │
             ▼                                                      ▼
┌────────────────────────┐                               ┌────────────────────────┐
│ Start New Assessment    │                               │ View Student Profile   │
│ (Baseline / Follow-up) │                               │ - Past Scores          │
│                        │                               │ - Risk Domains         │
└───────────┬────────────┘                               │ - Alerts               │
            │                                            └───────────┬────────────┘
            ▼                                                        │
┌────────────────────────┐                                          ▼
│ Student Takes Test via │                           ┌──────────────────────────┐
│ Student Portal         │                           │ Open Test Instance       │
│                        │                           │ - See Answers            │
└───────────┬────────────┘                           │ - Domain Scores          │
            │                                        │ - Explanation            │
            ▼                                        └──────────┬───────────────┘
┌────────────────────────┐                                      │
│ AI Scores Test          │                                      ▼
│ Teacher Sees Results   │                          ┌──────────────────────────┐
└───────────┬────────────┘                          │ Actions:                 │
            │                                        │  • Mark Valid            │
            │                                        │  • Mark Monitor          │
            │                                        │  • Mark False Alert      │
            ▼                                        │  (removes from RAG)      │
┌────────────────────────┐                          └──────────┬───────────────┘
│ AI Chat for Explanation│                                      │
│ - “Why bullying flagged?”                                     │
│ - “How to approach child?”                                    ▼
└───────────┬────────────┘                          END FLOW FOR TEACHER
            │
            ▼
      END FLOW

```

---

# **STUDENT JOURNEY**

```
                           ┌────────────────────────────┐
                           │          STUDENT           │
                           └────────────┬───────────────┘
                                        │ Login
                                        ▼
                           ┌────────────────────────────┐
                           │     Student Dashboard       │
                           │  - Profile                  │
                           │  - “Take Test” Button       │
                           └────────────┬───────────────┘
                                        │
                                        ▼
                           ┌────────────────────────────┐
                           │ Baseline Test (25 Q)       │
                           │ Neutral, MCQ-only          │
                           │ No domain names            │
                           └────────────┬───────────────┘
                                        │
                                        ▼
                           ┌────────────────────────────┐
                           │ Test Submitted              │
                           │ AI Scoring Happens Backend  │
                           │ Student sees only “Thanks”  │
                           └────────────┬───────────────┘
                                        │
                                        ▼
                           ┌────────────────────────────┐
                           │ Follow-up Tests Assigned   │
                           │ Personalized 10–15 Q        │
                           └────────────┬───────────────┘
                                        │
                                        ▼
                                      END

```

---

# **PARENT JOURNEY**

```
                           ┌────────────────────────────┐
                           │           PARENT            │
                           └────────────┬───────────────┘
                                        │ Login
                                        ▼
                           ┌────────────────────────────┐
                           │    Parent Dashboard         │
                           │  - Child List               │
                           │  - Basic Profile            │
                           │  - Teacher Observations     │
                           │  - High-level Notes         │
                           │    (no domain or risk scores)
                           └────────────┬───────────────┘
                                        │
                                        ▼
                                    END FLOW

```

---

# **SYSTEM-WIDE TECH JOURNEY (BONUS FLOWCHART)**

*(End-to-end flow across backend, AI, and RAG)*

```
Student Takes Test
        │
        ▼
Backend Saves Answers
        │
        ▼
MCP Server → OpenAI
(Scoring + Explanation)
        │
        ▼
Domain Scores Generated
        │
        ▼
Alert Engine Checks Threshold
        │
     ┌──┴────────────────────────────┐
     │                               │
     ▼                               ▼
NO Alert                         RED/YELLOW Alert
     │                               │
     ▼                               ▼
Store Results                    Email Teacher/Principal
     │                               │
     ▼                               ▼
Write Summary to RAG            Teacher Opens Alert
     │                               │
     ▼                               ▼
Generate Follow-up Test          Teacher–AI Chat
     │                               │
     ▼                               ▼
Student Takes Next Test         Teacher Marks Valid/Invalid

```

---

![ChatGPT Image Nov 27, 2025, 11_48_28 AM.png](MITR%20%E2%80%93%20User%20Journey%20Flowchart%20(Full%20System)/ChatGPT_Image_Nov_27_2025_11_48_28_AM.png)