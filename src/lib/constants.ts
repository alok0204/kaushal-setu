export const APP_CONFIG = {
  name: "Kaushal Setu",
  nameHindi: "कौशल सेतु",
  tagline: "AI-Powered Competency & Personalized Learning Platform",
  description:
    "An intelligent competency assessment and personalized capacity-building platform for India's Official Statistical System, aligned with the iGOT Karmayogi ecosystem.",
  version: "0.1.0",
  targetEcosystem: "India's Official Statistical System (MoSPI, State DES, Subordinate Cadres)",
  frameworkAlignment: "iGOT Karmayogi & Mission Karmayogi Competency Framework",
} as const;

export interface PlannedModule {
  id: string;
  title: string;
  description: string;
  category: "Core" | "Intelligence" | "Ecosystem" | "Evaluation";
  status: "Planned" | "Foundation Ready";
}

export const PLANNED_MODULES: PlannedModule[] = [
  {
    id: "auth",
    title: "1. Authentication & Role Access",
    description: "Secure role-based authentication for statistical officers, state DES staff, and administrators.",
    category: "Core",
    status: "Planned",
  },
  {
    id: "profiles",
    title: "2. Dynamic User Profiles",
    description: "Cadre, department, designation, and current skill portfolio management.",
    category: "Core",
    status: "Planned",
  },
  {
    id: "state-ut",
    title: "3. State & UT Statistical Directory",
    description: "Hierarchical statistical structure across Central ministries and State/UT Directorates of Economics and Statistics (DES).",
    category: "Core",
    status: "Planned",
  },
  {
    id: "competency-tracking",
    title: "4. Competency Tracking Matrix",
    description: "Domain-specific, functional, and behavioral statistical competency mapping.",
    category: "Core",
    status: "Planned",
  },
  {
    id: "ai-gap-analysis",
    title: "5. AI Competency-Gap Analysis",
    description: "AI-driven diagnostics mapping current officer skills against target role benchmarks.",
    category: "Intelligence",
    status: "Planned",
  },
  {
    id: "personalized-learning",
    title: "6. Personalized Learning Pathways",
    description: "Curated learning journeys targeted at eliminating identified competency gaps.",
    category: "Intelligence",
    status: "Planned",
  },
  {
    id: "igot-karmayogi",
    title: "7. iGOT Karmayogi Resource Integration",
    description: "Course mapping and progress sync with government-certified learning repositories.",
    category: "Ecosystem",
    status: "Planned",
  },
  {
    id: "ai-quizzes",
    title: "8. AI-Generated Quizzes from Materials",
    description: "Dynamic assessment generator created from uploaded training manuals and statistical standards.",
    category: "Intelligence",
    status: "Planned",
  },
  {
    id: "quiz-results",
    title: "9. Assessment Diagnostics & Feedback",
    description: "Granular scoring, automated explanations, and targeted revision recommendations.",
    category: "Evaluation",
    status: "Planned",
  },
  {
    id: "learning-progress",
    title: "10. Learning Progress & Analytics",
    description: "Comprehensive officer, cadre, and department-level progress dashboards.",
    category: "Evaluation",
    status: "Planned",
  },
  {
    id: "dynamic-updates",
    title: "11. Dynamic Competency Updating",
    description: "Real-time updates to official competency profiles upon successful module completion.",
    category: "Core",
    status: "Planned",
  },
];
