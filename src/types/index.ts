/**
 * Kaushal Setu Domain Types
 * Modular type definitions for statistical competency, learning, and assessment.
 */

export type UserRole = "officer" | "state_nodal_officer" | "administrator" | "reviewer";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  cadre: string; // e.g., "Indian Statistical Service (ISS)", "Subordinate Statistical Service (SSS)", "State DES"
  department: string;
  designation: string;
  stateUtCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StateUTInfo {
  code: string;
  name: string;
  type: "state" | "union_territory";
  nodalDepartment: string; // e.g., "Directorate of Economics & Statistics"
}

export type CompetencyDomain =
  | "Statistical Methodology & Survey Design"
  | "National Accounts & Economic Statistics"
  | "Data Analytics, AI & Visualization"
  | "Official Data Dissemination & Governance"
  | "Field Operations & Data Collection";

export type ProficiencyLevel = 1 | 2 | 3 | 4 | 5; // Basic to Expert

export interface Competency {
  id: string;
  code: string;
  title: string;
  domain: CompetencyDomain;
  description: string;
  requiredLevel: ProficiencyLevel;
}

export interface CompetencyAssessment {
  competencyId: string;
  currentLevel: ProficiencyLevel;
  targetLevel: ProficiencyLevel;
  gap: number;
  lastAssessedAt: string;
}

export interface IGOTResource {
  id: string;
  courseId: string;
  title: string;
  provider: string;
  durationMinutes: number;
  url: string;
  alignedCompetencies: string[];
}

export interface LearningPath {
  id: string;
  userId: string;
  title: string;
  targetCompetencyId: string;
  recommendedResources: IGOTResource[];
  progressPercent: number;
  status: "not_started" | "in_progress" | "completed";
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  relatedCompetencyId: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  recommendedRevisionTopics: string[];
}
