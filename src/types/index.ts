export interface DemoUser {
  id: string;
  email: string;
  fullName: string;
  cadreId: string;
  role: string;
  stateCode: string;
  stateName: string;
  department: string;
}

export type CompetencyId =
  | "data_analysis"
  | "statistical_methods"
  | "data_visualization"
  | "statistical_computing"
  | "ai_digital_skills";

export interface CompetencyDefinition {
  id: CompetencyId;
  name: string;
  domain: string;
  mandate: string;
  targetScore: number; // default 70
  description: string;
}

export type CompetencyStatus =
  | "Needs Improvement"
  | "High Priority Gap"
  | "Developing"
  | "Proficient"
  | "Strong";

export interface UserCompetencyRecord {
  competencyId: CompetencyId;
  score: number; // 0 - 100
  targetScore: number; // 70
  gap: number; // targetScore - score (positive means deficit)
  status: CompetencyStatus;
  assessedAt?: string;
  history?: { score: number; date: string; source: string }[];
}

export interface AssessmentQuestion {
  id: string;
  competencyId: CompetencyId;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
}

export interface AssessmentSubmission {
  id: string;
  userId: string;
  type: "initial" | "reassessment";
  overallScore: number;
  completedAt: string;
  competencyScores: Record<CompetencyId, number>;
  answers: { questionId: string; selectedAnswer: number; isCorrect: boolean }[];
}

export interface IGOTResourceItem {
  id: string;
  title: string;
  competencyId: CompetencyId;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  durationHours: number;
  igotUrl: string;
  description: string;
  provider: string;
  courseCode: string;
  curatedTag?: string;
}

export interface LearningProgressItem {
  resourceId: string;
  status: "not_started" | "in_progress" | "completed";
  progressPercent: number; // 0 to 100
  updatedAt: string;
}

export interface QuizQuestionItem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  competencyId: CompetencyId;
  difficulty: string;
}

export interface GeneratedQuiz {
  id: string;
  userId: string;
  title: string;
  materialFilename: string;
  createdAt: string;
  targetCompetencyId: CompetencyId;
  questions: QuizQuestionItem[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  quizTitle: string;
  score: number; // 0 - 100
  totalQuestions: number;
  correctCount: number;
  completedAt: string;
  competencyId: CompetencyId;
  answers: { questionId: string; selectedAnswer: number; isCorrect: boolean }[];
}

export interface UserDashboardData {
  user: DemoUser;
  overallCompetency: number; // 0 if new user
  assessmentsCount: number;
  learningProgressPercent: number;
  completedModulesCount: number;
  totalModulesCount: number;
  quizzesCount: number;
  competencies: UserCompetencyRecord[];
  priorityGap: UserCompetencyRecord | null;
  gapsCount: number;
  recentAssessment: AssessmentSubmission | null;
  recentQuizAttempt: QuizAttempt | null;
  recommendedResources: IGOTResourceItem[];
  isEstablished: boolean; // false if 0 assessments
}
