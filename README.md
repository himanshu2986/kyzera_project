# Kyzera • Problem Statement 04 Solution

> **Next-Generation Campus Incident Governance & Feedback Intelligence Platform**  
> *Track: Artificial Intelligence • Web Development • Data Analytics*  
> **Core Pillars**: Verified Access • Intelligent Classification • Duplicate Grouping • Priority Detection • Real-Time Dynamic Admin Command Center • Automated Email Dispatch

---

## 🎯 Direct Problem Statement Mapping Matrix

| # | Core Requirement | How It Is Solved in Kyzera | Live Screen / Component |
|---|------------------|--------------------------------|-------------------------|
| **1** | **Verified Access**<br>• Register & log in using college email<br>• Simple verification mechanism | Institutional email verification (`@kyzera.edu`, `@college.edu`), 6-digit cryptographic OTP relay with countdown timer, role-based authentication (Student vs. Teacher/Admin), and Fast SSO. | [`src/pages/Login.jsx`](file:///d:/HK%20project/src/pages/Login.jsx)<br>`/login` |
| **2** | **Complaint Submission**<br>• Submit complaint or suggestion<br>• Description, category, photo evidence | Dual-mode Submission form (Complaint vs Suggestion), real-time title character counter, precise campus location picker, rich description with AI summarizer, drag-and-drop photo evidence upload with thumbnail preview and high-resolution Lightbox modal. | [`src/pages/SubmitComplaint.jsx`](file:///d:/HK%20project/src/pages/SubmitComplaint.jsx)<br>`/submit` |
| **3** | **Intelligent Classification**<br>• Automatic categorization into Infrastructure, Sanitation, Academics, Services | Real-time NLP semantic classifier that analyzes the user's title and description as they type, automatically categorizing into **Sanitation & Facilities**, **Infrastructure & Safety**, **Academics & Faculty**, **Student Services**, and **IT & Network** with confidence ratings (e.g. 98.4%). | [`src/pages/SubmitComplaint.jsx`](file:///d:/HK%20project/src/pages/SubmitComplaint.jsx)<br>`aiAnalysis` engine |
| **4** | **Duplicate Detection**<br>• Identify similar complaints<br>• Group to reveal recurring issues | Real-time cosine vector similarity detector compares new submissions against existing database tickets, surfaces similar complaints with match percentages (e.g. 92%, 89%), and prompts 1-click upvoting. Dedicated **Cluster Deduplication View (`#CL-882`)** unifies merged reports into high-momentum canonical incidents. | [`src/pages/SubmitComplaint.jsx`](file:///d:/HK%20project/src/pages/SubmitComplaint.jsx)<br>[`src/pages/DuplicateCluster.jsx`](file:///d:/HK%20project/src/pages/DuplicateCluster.jsx) |
| **5** | **Priority Detection**<br>• Flag potentially urgent complaints<br>• Predefined rules or text classification | Multi-layered severity classifier inspects life-safety hazards, electrical fire risk, campus water outages, and academic disruptions, automatically assigning `URGENT`, `HIGH`, `MEDIUM`, or `LOW` priority with clear operational rationales and SLA countdown timers. | [`src/pages/SubmitComplaint.jsx`](file:///d:/HK%20project/src/pages/SubmitComplaint.jsx)<br>[`src/pages/AdminCommandCenter.jsx`](file:///d:/HK%20project/src/pages/AdminCommandCenter.jsx) |
| **6** | **Dynamic Admin Dashboard**<br>• Categories, recurring issues, priority levels, submission trends, resolution status | Executive Command Center featuring **100% dynamic analytics** calculated in real-time from active tickets: live Donut chart of core domains, department resolution progress bars, 7-day rolling submission/merged/resolution trend chart, top recurring clusters, and single-click CSV audit export. | [`src/pages/AdminCommandCenter.jsx`](file:///d:/HK%20project/src/pages/AdminCommandCenter.jsx)<br>`/admin` |
| **7** | **Status Tracking & Real-Time Sync**<br>• Update complaints through Submitted, Under Review, In Progress, Resolved | Real-time status pipeline where administrators update tickets through `Submitted` ➔ `Under Review` ➔ `In Progress` ➔ `Resolved`. Bi-directional sync across all connected browser tabs via **Google Cloud Firestore**. Status transitions trigger automated student notification emails. | [`src/pages/AdminCommandCenter.jsx`](file:///d:/HK%20project/src/pages/AdminCommandCenter.jsx)<br>[`src/pages/ComplaintDetail.jsx`](file:///d:/HK%20project/src/pages/ComplaintDetail.jsx) |
| **8** | **Privacy, Accountability & Feedback**<br>• Hide submitters' identities from public views<br>• Maintain record of administrative access | Students browse public feeds with zero-knowledge masked tokens (e.g. `Anonymous Student #CP-8841`). Authorized faculty/admins have clearance in the triage directory to inspect verified real student names, roll numbers, and dorm rooms to facilitate rapid on-site resolution. Includes post-resolution 5-star ratings and student self-withdrawal. | [`src/pages/PrivacyAudit.jsx`](file:///d:/HK%20project/src/pages/PrivacyAudit.jsx)<br>[`src/pages/ComplaintDetail.jsx`](file:///d:/HK%20project/src/pages/ComplaintDetail.jsx) |

---

## ✨ Advanced Features & Capabilities

### ⚡ 1. 100% Dynamic Admin Analytics & Telemetry
- **Dynamic Category Donut Chart**: Proportional SVG ring and domain breakdown calculated in real-time from active tickets (e.g., if 1 complaint exists in Sanitation, it displays `1 TICKET` with a $100\%$ blue arc).
- **Status Distribution by Department**: Real-time progress bars showing exact total complaint volume and closure percentage by campus division.
- **7-Day Rolling Incident Trends**: Smooth SVG area chart tracking daily student submissions, auto-merged duplicates, and resolved tickets with live telemetry point markers.
- **Live User Telemetry**: Navbar badges indicating active online students and faculty members.

### 🔄 2. Multi-Device Real-Time Cloud Firestore Sync
- Kyzera integrates **Google Cloud Firestore** for bi-directional live updates:
  - Ticket creations, status transitions, community upvotes, and comments sync instantly across multiple devices and browsers without page refreshes.
  - Offline-first architecture ensures full functionality with local persistence (`localStorage`) when running offline.

### 📧 3. Automated Student Email Notification Dispatch
- Built-in Node.js SMTP relay service ([`server.js`](file:///d:/HK%20project/server.js)) powered by Nodemailer.
- Whenever a teacher or administrator changes a ticket's status (`Submitted` ➔ `Under Review` ➔ `In Progress` ➔ `Resolved`), an HTML status update email is automatically sent to the student submitter's verified inbox with SLA details, roadmap steps, and case links.

### ⭐ 4. Post-Resolution 5-Star Ratings & Student Self-Resolution
- Once an issue is marked **Resolved**, students can rate their satisfaction from 1 to 5 stars and submit feedback notes directly to the administration.
- Students can also self-resolve or withdraw their own tickets if the problem is fixed before dispatch.

### 🖼️ 5. Photo Evidence Lightbox Modal
- Submissions support attached image evidence with drag-and-drop upload.
- Students and administrators can click any image attachment to open an interactive Lightbox Modal with zoom controls, full-resolution inspection, and direct image download.

---

## 👥 Interactive Persona Switcher (For Evaluators)

Use the top-right **Persona Switcher** to test Kyzera from both key stakeholder perspectives:

1. **Student Persona (`Aditya Sharma` / `Anonymous Student #CP-041`)**:
   - File complaints or suggestions with real-time AI classification and duplicate detection.
   - Upvote issues on the public feed (auto-escalates ticket priority upon reaching momentum thresholds).
   - Track live roadmap milestones, rate resolved tickets, or withdraw issues.
2. **Faculty / Administrator Persona (`Prof. Sarah Jenkins` / `Admin`)**:
   - Access the **Governance Command Center** with full student submitter clearance (view real student names, roll numbers, email, and dormitory rooms).
   - Triage tickets with search, department filters, priority filters, and CSV export.
   - Update statuses, automatically triggering real-time sync and student email dispatch.
   - Broadcast instant campus-wide emergency banners.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, Vite 6, Tailwind CSS, Lucide Icons, KaTeX / crypto utilities
- **Real-Time Database**: Google Cloud Firestore (Live bi-directional synchronization)
- **Local Persistence**: Browser `localStorage` (Zero-latency fallback)
- **Backend / SMTP Relay**: Standalone Node.js HTTP server (`server.js`) with Nodemailer
- **Privacy & Security**: Zero-Knowledge token masking, SHA-256 cryptographic hashes, role-based view isolation

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18.0 or higher
- **npm** v9.0 or higher

### 2. Installation
```powershell
# Navigate to the project root
cd "d:\HK project"

# Install dependencies
npm install
```

### 3. Environment Configuration
Create or verify the `.env` file in the project root:
```env
# Google Cloud Firestore Configuration
VITE_FIREBASE_API_KEY=AIzaSyD3IahRv4T-l1ulJq87lUw-UfTwgQZ8GDU
VITE_FIREBASE_AUTH_DOMAIN=planning-with-ai-7ade4.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=planning-with-ai-7ade4
VITE_FIREBASE_STORAGE_BUCKET=planning-with-ai-7ade4.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=518079060102
VITE_FIREBASE_APP_ID=1:518079060102:web:97b80e047bb5b853165907

# Gmail SMTP Email Dispatch Credentials (Optional)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

### 4. Running the Development Server
```powershell
npm run dev
```
Open your browser at **`http://localhost:3000`** (or `http://localhost:3001` if port 3000 is occupied).

### 5. Running Production Server with Email Relay
```powershell
# Build production bundle
npm run build

# Start standalone Node.js server with active email relay
npm start
```

---

## 📂 Project Directory Structure

```
d:\HK project\
├── public/                    # Static public assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── EmergencyBanner.jsx # Real-time emergency broadcast banner
│   │   ├── EmergencyModal.jsx  # Admin emergency alert composer
│   │   ├── LightboxModal.jsx   # Image evidence viewer with zoom
│   │   ├── Navbar.jsx          # Responsive header & persona switcher
│   │   ├── Footer.jsx          # Institutional footer
│   │   └── Toast.jsx           # Animated floating notifications
│   ├── context/
│   │   └── CampusContext.jsx   # Global state, Firestore listener & triage engine
│   ├── data/
│   │   └── initialData.js      # Clean baseline entities and preset profiles
│   ├── pages/
│   │   ├── Landing.jsx         # Public presentation & platform overview
│   │   ├── Login.jsx           # Verified email login & 6-digit OTP relay
│   │   ├── StudentDashboard.jsx# Student incident center & public feed
│   │   ├── SubmitComplaint.jsx # Multi-domain AI categorization & duplicate detection
│   │   ├── ComplaintDetail.jsx # Case view, roadmap tracker & 5-star rating
│   │   ├── AdminCommandCenter.jsx # Dynamic analytics & student submitter triage
│   │   ├── DuplicateCluster.jsx# Cluster deduplication & canonical view
│   │   └── PrivacyAudit.jsx    # Cryptographic privacy ledger
│   ├── services/
│   │   ├── firebase.js         # Cloud Firestore initialization & listeners
│   │   └── emailService.js     # Client API client for status update emails
│   ├── utils/
│   │   └── crypto.js           # SHA-256 token hashing & CSV export
│   ├── App.jsx                # Application root & role router
│   ├── index.css              # Custom styles, dark scrollbars & themed selects
│   └── main.jsx               # React DOM entry point
├── server.js                  # Production Node.js server & SMTP relay
├── package.json               # NPM packages & build scripts
└── vite.config.js             # Vite configuration & /api proxy routes
```

---

## 📜 Compliance & Verification

- **Production Build**: Verified with `npm run build` — compiles cleanly in under 5 seconds with zero errors or warnings.
- **Privacy Standard**: Zero student identities exposed to other students; real identity unmasking restricted to authenticated teachers/administrators.
- **Brand Consistency**: Unified under the **Kyzera** design language with dark-mode optimized components and responsive mobile/desktop layouts.
