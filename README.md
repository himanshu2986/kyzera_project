# Kyzera • Problem Statement 04 Solution

### Question 04 • Artificial Intelligence, Web Development, Data Analytics
**Task**: Verified Access, Intelligent Classification, Duplicate Grouping, Priority Detection & Admin Dashboard

---

## 🎯 Direct Problem Statement Mapping Matrix

| # | Core Requirement | How It Is Solved in Kyzera | Live Screen / Component |
|---|------------------|--------------------------------|-------------------------|
| **1** | **Verified Access**<br>• Register & log in using college email<br>• Simple verification mechanism | Supports institutional email verification (`@kyzera.edu`, `@college.edu`), passwordless 6-digit cryptographic OTP verification with countdown timer, and Fast SSO (Canvas LMS, Google Workspace Edu). Includes both **Sign In** and **New College User Registration** modes. | `Login.jsx`<br>`/login` |
| **2** | **Complaint Submission**<br>• Submit complaint or suggestion<br>• Description, category, optional image | Interactive submission form with Complaint vs Suggestion mode toggles, title character counter, precise campus location picker, rich description with AI summarizer, and drag-and-drop image/photo evidence upload with size tags and previews. | `SubmitComplaint.jsx`<br>`/submit` |
| **3** | **Intelligent Classification**<br>• Automatic categorization into Infrastructure, Sanitation, Academics, Student Services | Real-time Rule-based + NLP semantic classifier that analyzes title & description as the user types and automatically tags the exact core areas: **Sanitation & Facilities**, **Infrastructure & Safety**, **Academics & Faculty**, and **Student Services & Dining** with match confidence percentages (e.g., 98.4%). | `SubmitComplaint.jsx`<br>`aiAnalysis` engine |
| **4** | **Duplicate Detection**<br>• Identify similar complaints<br>• Group to reveal recurring issues | Real-time cosine vector similarity detector compares new submissions against existing database tickets, surfaces 3 most similar complaints with match percentages (e.g., 92%, 89%, 81%), and provides a 1-click button to view/upvote the master ticket. Dedicated **Cluster Deduplication View (`#CL-882`)** merges 34+ reports into high-momentum canonical incidents. | `SubmitComplaint.jsx`<br>`DuplicateCluster.jsx` |
| **5** | **Priority Detection**<br>• Flag potentially urgent complaints<br>• Predefined rules or text classification | NLP severity classifier inspects life-safety hazards, electrical fire risk, campus water supply outages, and exam disruptions, automatically flagging tickets as `URGENT`, `HIGH`, `MEDIUM`, or `LOW` with written operational rationale. | `SubmitComplaint.jsx`<br>`AdminCommandCenter.jsx` |
| **6** | **Admin Dashboard**<br>• Categories, recurring issues, priority levels, submission trends, resolution status | Executive Command Center featuring: 5 top KPI summary cards, interactive 30-day SVG submission trends chart (Submissions, Merged, Resolved), donut chart of complaints by core domain, recurring cluster issues list, and departmental resolution progress bars. | `AdminCommandCenter.jsx`<br>`/admin` |
| **7** | **Status Tracking**<br>• Update complaints through Submitted, Under Review, In Progress, Resolved | Real-time status pipeline where administrators can transition tickets through `Submitted` ➔ `Under Review` ➔ `In Progress` ➔ `Resolved`. Every status transition dynamically updates the resolution roadmap stepper, department resolution metrics, and the live stream ticker. | `AdminCommandCenter.jsx`<br>`ComplaintDetail.jsx` |
| **8** | **Privacy & Accountability**<br>• Hide submitters' identities from public views<br>• Maintain record of administrative access | Submissions display publicly with zero-knowledge masked tokens (e.g. `Anonymous Student #CP-8841`). Unmasking is strictly restricted to authorized administrators via a **Dual-Faculty Cryptographic Ethics Protocol** under Campus Charter §4.2, recorded permanently in an immutable audit ledger with SHA-256 block hashes. | `PrivacyAudit.jsx`<br>`/privacy-audit` |

---

## 👥 Interactive Persona Switcher (For Judges)

The top-right navigation bar includes a **Persona Switcher** allowing you to test the app from all three stakeholder perspectives on the fly:
1. **Anonymous Student** (`Student #CP-8841`): File issues, test AI auto-categorisation, upvote issues, track SLA roadmap.
2. **Chief Admin** (`Eng. David Tan - Facilities Lead`): Triage complaints, change ticket statuses (`Submitted` ➔ `Under Review` ➔ `In Progress` ➔ `Resolved`), manage clusters, and trigger emergency broadcasts.
3. **Ethics Officer** (`Dr. Robert Chen - Chief Dean`): Inspect immutable privacy audit ledger, execute dual-faculty signatures to reveal student identities during life-safety emergencies.

---

## 🚀 How to Run the Prototype

```powershell
# In terminal (d:\HK project)
npm run dev
```

Visit in your browser:
**`http://localhost:3000`**

### Build Check
```powershell
npm run build
```
*(Verified: compiles in ~4 seconds with zero errors).*
