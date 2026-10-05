"use client";

import {
  CompetencyId,
  UserCompetencyRecord,
  CompetencyStatus,
  AssessmentSubmission,
  LearningProgressItem,
  GeneratedQuiz,
  QuizAttempt,
  UserDashboardData,
  IGOTResourceItem,
  UploadedMaterial,
  AIFeedbackResult,
} from "@/types";
import {
  DEMO_USERS,
  COMPETENCIES,
  TARGET_BENCHMARK,
  IGOT_RESOURCES,
} from "./constants";

export interface UserPersistedState {
  userId: string;
  isEstablished: boolean; // false until initial assessment is submitted
  competencies: Record<CompetencyId, number>; // score 0-100
  assessments: AssessmentSubmission[];
  learningProgress: Record<string, LearningProgressItem>; // key: resourceId
  quizzes: GeneratedQuiz[];
  quizAttempts: QuizAttempt[];
  uploadedMaterials?: UploadedMaterial[];
}

const STORAGE_KEY_PREFIX = "kaushal_setu_user_v1_";
const CURRENT_USER_KEY = "kaushal_setu_active_user_v1";

export function getStatusForScore(score: number): CompetencyStatus {
  if (score < 40) return "High Priority Gap";
  if (score < 50) return "Needs Improvement";
  if (score < 70) return "Developing";
  if (score < 85) return "Proficient";
  return "Strong";
}

export function getInitialUserState(userId: string): UserPersistedState {
  const initialCompetencies: Record<CompetencyId, number> = {
    data_analysis: 0,
    statistical_methods: 0,
    data_visualization: 0,
    statistical_computing: 0,
    ai_digital_skills: 0,
  };

  return {
    userId,
    isEstablished: false,
    competencies: initialCompetencies,
    assessments: [],
    learningProgress: {},
    quizzes: [],
    quizAttempts: [],
    uploadedMaterials: [],
  };
}

export function getActiveUserId(): string {
  if (typeof window === "undefined") return DEMO_USERS[0].id;
  return localStorage.getItem(CURRENT_USER_KEY) || DEMO_USERS[0].id;
}

export function setActiveUserId(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CURRENT_USER_KEY, userId);
  window.dispatchEvent(new Event("kaushal_setu_user_changed"));
}

export function getUserState(userId: string): UserPersistedState {
  if (typeof window === "undefined") return getInitialUserState(userId);
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`);
    if (!raw) return getInitialUserState(userId);
    return JSON.parse(raw);
  } catch {
    return getInitialUserState(userId);
  }
}

export function saveUserState(state: UserPersistedState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${state.userId}`, JSON.stringify(state));
  window.dispatchEvent(new Event("kaushal_setu_state_updated"));
}

export function resetUserState(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}${userId}`);
  window.dispatchEvent(new Event("kaushal_setu_state_updated"));
}

export function getInitialDashboardData(userId: string = DEMO_USERS[0].id): UserDashboardData {
  const user = DEMO_USERS.find((u) => u.id === userId) || DEMO_USERS[0];
  const zeroCompetencies: UserCompetencyRecord[] = COMPETENCIES.map((c) => ({
    competencyId: c.id,
    score: 0,
    targetScore: TARGET_BENCHMARK,
    gap: TARGET_BENCHMARK,
    status: "Needs Improvement",
  }));

  return {
    user,
    overallCompetency: 0,
    assessmentsCount: 0,
    learningProgressPercent: 0,
    completedModulesCount: 0,
    totalModulesCount: 10,
    quizzesCount: 0,
    competencies: zeroCompetencies,
    priorityGap: null,
    gapsCount: 0,
    recentAssessment: null,
    recentQuizAttempt: null,
    recommendedResources: IGOT_RESOURCES.slice(0, 3),
    isEstablished: false,
    uploadedMaterials: [],
    quizHistory: [],
  };
}

export function getDashboardData(userId: string): UserDashboardData {
  const user = DEMO_USERS.find((u) => u.id === userId) || DEMO_USERS[0];
  const state = getUserState(userId);

  // If not established yet (zero state)
  if (!state.isEstablished || state.assessments.length === 0) {
    return getInitialDashboardData(userId);
  }

  // Calculate dynamic competency records
  const compRecords: UserCompetencyRecord[] = COMPETENCIES.map((c) => {
    const score = Math.round(state.competencies[c.id] ?? 0);
    const gap = TARGET_BENCHMARK - score;
    return {
      competencyId: c.id,
      score,
      targetScore: TARGET_BENCHMARK,
      gap,
      status: getStatusForScore(score),
    };
  });

  const sumScores = compRecords.reduce((acc, c) => acc + c.score, 0);
  const overallCompetency = Math.round(sumScores / compRecords.length);

  // Identify gaps (below 70%)
  const gaps = compRecords.filter((c) => c.score < TARGET_BENCHMARK);
  // Sort lowest score first to find Priority Gap
  const sortedByLowest = [...compRecords].sort((a, b) => a.score - b.score);
  const priorityGap = sortedByLowest.length > 0 && sortedByLowest[0].score < TARGET_BENCHMARK
    ? sortedByLowest[0]
    : null;

  // Learning progress
  const progressList = Object.values(state.learningProgress || {});
  const completedCount = progressList.filter((p) => p.status === "completed").length;
  const inProgressCount = progressList.filter((p) => p.status === "in_progress").length;
  // Compute overall learning percentage
  const totalBase = 10;
  const calculatedPercent = Math.min(
    100,
    Math.round(((completedCount * 1.0 + inProgressCount * 0.4) / totalBase) * 100)
  );

  // Dynamic recommendations based on priority gap
  let recommended: IGOTResourceItem[] = [];
  if (priorityGap) {
    const priorityResources = IGOT_RESOURCES.filter(
      (r) => r.competencyId === priorityGap.competencyId
    );
    const otherResources = IGOT_RESOURCES.filter(
      (r) => r.competencyId !== priorityGap.competencyId
    );
    recommended = [...priorityResources, ...otherResources].slice(0, 3);
  } else {
    recommended = IGOT_RESOURCES.slice(0, 3);
  }

  const recentAssessment =
    state.assessments.length > 0
      ? state.assessments[state.assessments.length - 1]
      : null;

  const recentQuizAttempt =
    state.quizAttempts.length > 0
      ? state.quizAttempts[state.quizAttempts.length - 1]
      : null;

  return {
    user,
    overallCompetency,
    assessmentsCount: state.assessments.length,
    learningProgressPercent: calculatedPercent,
    completedModulesCount: completedCount,
    totalModulesCount: totalBase,
    quizzesCount: state.quizAttempts.length,
    competencies: compRecords,
    priorityGap,
    gapsCount: gaps.length,
    recentAssessment,
    recentQuizAttempt,
    recommendedResources: recommended,
    isEstablished: true,
    uploadedMaterials: state.uploadedMaterials || [],
    quizHistory: state.quizAttempts || [],
  };
}

export function submitInitialAssessment(
  userId: string,
  answers: { questionId: string; selectedAnswer: number; isCorrect: boolean; competencyId: CompetencyId }[]
): AssessmentSubmission {
  const state = getUserState(userId);

  // Calculate scores per competency
  const countsByComp: Record<CompetencyId, { correct: number; total: number }> = {
    data_analysis: { correct: 0, total: 0 },
    statistical_methods: { correct: 0, total: 0 },
    data_visualization: { correct: 0, total: 0 },
    statistical_computing: { correct: 0, total: 0 },
    ai_digital_skills: { correct: 0, total: 0 },
  };

  answers.forEach((ans) => {
    if (countsByComp[ans.competencyId]) {
      countsByComp[ans.competencyId].total += 1;
      if (ans.isCorrect) {
        countsByComp[ans.competencyId].correct += 1;
      }
    }
  });

  const compScores: Record<CompetencyId, number> = {
    data_analysis: 0,
    statistical_methods: 0,
    data_visualization: 0,
    statistical_computing: 0,
    ai_digital_skills: 0,
  };

  let totalScoreSum = 0;
  COMPETENCIES.forEach((c) => {
    const item = countsByComp[c.id];
    const score = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
    compScores[c.id] = score;
    totalScoreSum += score;
  });

  const overallScore = Math.round(totalScoreSum / COMPETENCIES.length);

  const submission: AssessmentSubmission = {
    id: `asmt_${Date.now()}`,
    userId,
    type: "initial",
    overallScore,
    completedAt: new Date().toISOString(),
    competencyScores: compScores,
    answers: answers.map((a) => ({
      questionId: a.questionId,
      selectedAnswer: a.selectedAnswer,
      isCorrect: a.isCorrect,
    })),
  };

  state.isEstablished = true;
  state.competencies = compScores;
  state.assessments.push(submission);

  saveUserState(state);
  return submission;
}

export function setResourceProgress(
  userId: string,
  resourceId: string,
  status: "not_started" | "in_progress" | "completed"
): void {
  const state = getUserState(userId);
  if (!state.learningProgress) {
    state.learningProgress = {};
  }

  const percent = status === "completed" ? 100 : status === "in_progress" ? 40 : 0;
  state.learningProgress[resourceId] = {
    resourceId,
    status,
    progressPercent: percent,
    updatedAt: new Date().toISOString(),
  };

  saveUserState(state);
}

export function saveUploadedMaterial(userId: string, material: UploadedMaterial): void {
  const state = getUserState(userId);
  if (!state.uploadedMaterials) state.uploadedMaterials = [];
  state.uploadedMaterials.unshift(material);
  saveUserState(state);
}

export function getUploadedMaterials(userId: string): UploadedMaterial[] {
  const state = getUserState(userId);
  return state.uploadedMaterials || [];
}

export function saveGeneratedQuiz(userId: string, quiz: GeneratedQuiz): void {
  const state = getUserState(userId);
  if (!state.quizzes) state.quizzes = [];
  state.quizzes.push(quiz);
  saveUserState(state);
}

export function getQuizById(userId: string, quizId: string): GeneratedQuiz | undefined {
  const state = getUserState(userId);
  return state.quizzes?.find((q) => q.id === quizId);
}

export function getQuizAttemptById(userId: string, attemptId: string): QuizAttempt | undefined {
  const state = getUserState(userId);
  return state.quizAttempts?.find((a) => a.id === attemptId);
}

export function getLatestQuizAttempt(userId: string, quizId?: string): QuizAttempt | undefined {
  const state = getUserState(userId);
  if (!state.quizAttempts || state.quizAttempts.length === 0) return undefined;
  if (quizId) {
    const matched = state.quizAttempts.filter((a) => a.quizId === quizId);
    if (matched.length > 0) return matched[matched.length - 1];
  }
  return state.quizAttempts[state.quizAttempts.length - 1];
}

export function submitQuizAttempt(
  userId: string,
  quizId: string,
  quizTitle: string,
  competencyId: CompetencyId,
  answers: {
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;
    competencyId?: CompetencyId;
    questionText?: string;
    explanation?: string;
  }[],
  timeDurationSeconds?: number,
  feedback?: AIFeedbackResult
): QuizAttempt {
  const state = getUserState(userId);
  const totalQuestions = answers.length;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const quizScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // ==============================================================================
  // STEP 13 FORMULA:
  // new competency score = 70% previous score + 30% quiz score
  // If there is no previous score: new score = quiz score
  // ==============================================================================
  const currentCompScore = state.competencies[competencyId] ?? 0;
  let newCompScore = quizScore;
  if (state.isEstablished && currentCompScore > 0) {
    newCompScore = Math.round(0.7 * currentCompScore + 0.3 * quizScore);
  } else {
    newCompScore = quizScore;
  }

  // Ensure bounded within 0-100
  state.competencies[competencyId] = Math.max(0, Math.min(100, newCompScore));
  state.isEstablished = true;

  const snapshotCompetencyScores = { ...state.competencies };

  const attempt: QuizAttempt = {
    id: `att_${Date.now()}`,
    quizId,
    userId,
    quizTitle,
    score: quizScore,
    totalQuestions,
    correctCount,
    completedAt: new Date().toISOString(),
    competencyId,
    competencyScores: snapshotCompetencyScores,
    timeDurationSeconds: timeDurationSeconds || 540,
    feedback,
    answers,
  };

  if (!state.quizAttempts) state.quizAttempts = [];
  state.quizAttempts.push(attempt);

  saveUserState(state);
  return attempt;
}
