# AI Resume Assistant & ATS Score Auditor

> A production-ready, SaaS web application that provides instant AI resume analysis, 0–100 ATS scoring, missing skill gap detection, actionable recommendations, and tailored cover letter generation using Google Gemini AI (`@google/genai`) and Supabase.

---

## 🌟 Core Features

- **Multi-Format Resume Parser**: Drag-and-drop or paste PDF, DOCX, and TXT resume files with real-time text extraction.
- **Structured AI Resume Audit**: Returns strict structured JSON with Executive Summary, Strengths, Weaknesses, Missing Skill Gaps, and Improvement Checklist.
- **0–100 ATS Score Meter**: Dynamic, animated circular gauge displaying ATS scanner readiness and keyword density fit.
- **Tailored Cover Letter Architect**: Generates customized cover letters based on resume content, company name, target job title, and selectable writing tone (Professional, Enthusiastic, Technical, Executive).
- **History & Analysis Management**: Full database tracking of previous scans and cover letter drafts with search and JSON export.
- **Supabase Authentication & Row Level Security (RLS)**: Enforces multi-tenant data privacy across PostgreSQL tables.
- **Zero-Config Fallback Sandbox**: Runs out-of-the-box in local development even before Supabase or Gemini API keys are configured.

---

## 📁 Folder Structure

```
collage/
├── server/
│   ├── index.ts               # Express Server with CORS, Rate Limiting & Error Handlers
│   ├── routes/
│   │   ├── resume.ts          # File Upload (multer) & Parser Route (/api/resume/upload)
│   │   ├── analyze.ts         # AI Resume Analysis API (/api/resume/analyze & /api/analysis/:id)
│   │   ├── coverLetter.ts     # Cover Letter Generation API (/api/cover-letter)
│   │   └── history.ts         # Saved History API (/api/history)
│   ├── services/
│   │   ├── gemini.ts          # @google/genai SDK Integration & Structured Prompt Engineering
│   │   ├── parser.ts          # PDF (pdf-parse) & DOCX (mammoth) Text Extractor
│   │   └── supabase.ts        # Supabase Admin Service Client & Memory Database Fallback
│   └── validators/
│       └── schemas.ts         # Zod Request Payload Validation Schemas
├── src/
│   ├── components/            # UI Components (Navbar, Footer, ATSScoreGauge, FileDropzone)
│   ├── context/               # AuthContext (Supabase Auth + Demo Sandbox Session)
│   ├── lib/                   # Supabase & Frontend API Client
│   ├── pages/                 # LandingPage, AuthPage, DashboardPage, NewResumePage, AnalysisDetailPage, CoverLetterGeneratorPage, HistoryPage, ProfilePage
│   ├── types/                 # TypeScript Domain Interfaces
│   ├── App.tsx                # App Routing & Layout Wrappers
│   ├── main.tsx               # Application Entrypoint
│   └── index.css              # Tailwind Base Directives & Glassmorphism Design System
├── supabase/
│   └── schema.sql             # Complete PostgreSQL DDL, RLS Policies, Indexes & Triggers
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express.js, Multer, `pdf-parse`, `mammoth`, Express Rate Limit
- **AI Integration**: Google GenAI SDK (`@google/genai`), Gemini 2.5 Flash Model
- **Database & Auth**: Supabase (PostgreSQL + RLS + Auth + Storage)
- **Validation**: Zod Schemas

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js >= 18.x
- npm / yarn / pnpm

### 2. Installation & Running
```bash
# Install dependencies
npm install

# Start both Express API Server (port 3001) and Vite Frontend (port 5173) concurrently
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google Gemini API Key
GEMINI_API_KEY=your-gemini-api-key

# Server Port
PORT=3001
```

---

## 🗄️ Database Setup (Supabase)

1. Open your Supabase Dashboard project -> **SQL Editor**.
2. Run the contents of `supabase/schema.sql`.
3. This creates:
   - `public.profiles`
   - `public.resumes`
   - `public.analyses`
   - `public.cover_letters`
   - Automatic user profile trigger on signup.
   - Row Level Security (RLS) policies allowing users to read/write only their own records.

---

## ☁️ Production Deployment Guide

### Deploying to Vercel (Frontend & Serverless API)

1. Push your repository to GitHub / GitLab.
2. Import project into Vercel.
3. Set Environment Variables in Vercel Project Settings (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
4. Set Build Command: `npm run build`
5. Vercel automatically deploys Vite frontend and serverless API endpoints.
