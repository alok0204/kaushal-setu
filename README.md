# Kaushal Setu (कौशल सेतु)

> **AI-Powered Competency & Personalized Learning Platform for India's Official Statistical System**  
> *Aligned with the iGOT Karmayogi Ecosystem*

---

## 📌 Overview

**Kaushal Setu** is an intelligent capacity-building and competency tracking platform tailored for the statistical personnel of the Indian Official Statistical System (including the Ministry of Statistics and Programme Implementation - MoSPI, State & UT Directorates of Economics and Statistics - DES, and subordinate statistical cadres).

The platform integrates competency frameworks with personalized learning pathways, leveraging the iGOT Karmayogi infrastructure and AI-driven skill gap assessments.

---

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode enabled)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Code Quality & Linting**: ESLint
- **Deployment Target**: [Vercel](https://vercel.com/) (Standard zero-config deployment)
- **Architecture**: Modular, component-driven, single monolith (no microservices or Docker required)

---

## 📂 Project Structure

```text
kaushal-setu/
├── .env.example              # Environment variables template (no secrets committed)
├── .gitignore                # Git exclusions (env files, .next, node_modules)
├── next.config.ts            # Next.js configuration
├── package.json              # Dependency manifests and run scripts
├── tsconfig.json             # TypeScript configuration (@/* path alias configured)
├── README.md                 # Project documentation
└── src/
    ├── app/                  # Next.js App Router root
    │   ├── globals.css       # Tailwind stylesheet
    │   ├── layout.tsx        # App root layout with metadata & theme
    │   └── page.tsx          # Base verification homepage
    ├── components/           # Reusable UI & Layout components
    │   ├── layout/           # Navbar, Footer
    │   └── ui/               # Modular UI primitives (Card, Badge)
    ├── lib/                  # Application utilities & platform constants
    │   ├── constants.ts      # Platform metadata & roadmap configuration
    │   └── utils.ts          # Minimal class utility helper
    └── types/                # Domain TypeScript interfaces
        └── index.ts          # Competency, Officer, Assessment & Resource types
```

---

## 🔒 Security & Environment Variables

**Rule:** Never commit secrets, database credentials, or API keys directly to the repository.

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Populate the required values locally:
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` (future)
   - `GEMINI_API_KEY` (future)
   - `IGOT_KARMAYOGI_API_URL` (future)
3. `.env` and `.env.local` files are strictly excluded via `.gitignore`.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js `v18.18+` or `v20+` (tested on Node v24 LTS)
- npm `v10+` (or yarn / pnpm / bun)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Check TypeScript & Production Build
```bash
npm run build
```

### 4. Run Linting
```bash
npm run lint
```

---

## 🗺️ Planned Roadmap (Phase 2+)

1. **Authentication**: Secure role-based login for central & state statistical officers.
2. **Dynamic User Profiles**: Designation, cadre (ISS/SSS/DES), and competency profiles.
3. **State & UT Statistical Directory**: State DES and departmental hierarchy mapping.
4. **Competency Tracking**: Domain, functional, and behavioral statistical competencies.
5. **AI Competency-Gap Analysis**: Automated diagnostics against target benchmark standards.
6. **Personalized Learning**: AI-curated training journeys.
7. **iGOT Karmayogi Integration**: Sync with government-certified training courses.
8. **AI-Generated Quizzes**: Dynamic assessment generation from uploaded official statistical material.
9. **Quiz Results & Feedback**: Diagnostic reports and revision suggestions.
10. **Learning Progress**: Individual and departmental analytics dashboards.
11. **Dynamic Competency Updates**: Real-time capability scores updating upon module completion.

---

## 🚢 Deployment

The application is optimized for deployment on **Vercel**:
1. Push this repository to GitHub.
2. Import the repository into the Vercel dashboard.
3. Configure environment variables in the Vercel project settings.
4. Deploy!
