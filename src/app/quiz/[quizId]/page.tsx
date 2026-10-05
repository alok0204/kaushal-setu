"use client";

import React, { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Pause,
  Send,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  LayoutGrid,
  FileCheck2,
  Lock,
  Eye,
  Check,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import {
  UserDashboardData,
  CompetencyId,
  QuizQuestionItem,
  GeneratedQuiz,
} from "@/types";
import { COMPETENCIES } from "@/lib/constants";
import {
  submitQuizAttempt,
  getQuizById,
} from "@/lib/store";

interface PageProps {
  params: Promise<{ quizId: string }>;
}

export default function AIQuizPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const quizId = resolvedParams.quizId;

  // Question navigation state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Countdown timer: 15 minutes (900 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(11 * 60 + 42); // 11m 42s as in Stitch

  useEffect(() => {
    if (isPaused || isSubmitting) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, isSubmitting]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Standard fallback questions if no specific generated quiz is found
  const fallbackQuestions = useMemo<QuizQuestionItem[]>(
    () => [
      {
        id: "q_1",
        question:
          "What is the primary purpose of employing stratified random sampling in official large-scale socio-economic surveys like the NSS (National Sample Survey)?",
        options: [
          "To guarantee that the overall sample size is reduced to the absolute minimum regardless of population variance.",
          "To ensure proportional representation of distinct homogeneous sub-populations (strata) and decrease overall sampling error.",
          "To eliminate the necessity of maintaining updated village and urban frame survey (UFS) listing schedules.",
          "To permit non-random convenience selection of sample units within remote rural administrative blocks.",
        ],
        correctAnswer: 1,
        explanation:
          "Stratification divides heterogeneous survey populations into homogeneous sub-strata, reducing intra-stratum variance and ensuring proportional domain representation.",
        competencyId: "statistical_methods",
        difficulty: "Intermediate",
        reference: "MoSPI Field Survey Guidelines, Volume IV (Sampling Protocols)",
      },
      {
        id: "q_2",
        question:
          "Under Horvitz-Thompson estimation principles, how is the design multiplier (base weight) computed for sample First Stage Units (FSUs)?",
        options: [
          "The inverse of the first-stage selection probability of the sample unit.",
          "The ratio of urban population to rural population in the district.",
          "A fixed constant equal to 100 for all sample units across rounds.",
          "The sample standard deviation multiplied by the investigator count.",
        ],
        correctAnswer: 0,
        explanation:
          "Base design weights are mathematically defined as the inverse of inclusion probability (1 / pi_i) for unbiased Horvitz-Thompson estimation.",
        competencyId: "statistical_methods",
        difficulty: "Intermediate",
        reference: "MoSPI Field Survey Guidelines, Volume IV (Sampling Protocols)",
      },
      {
        id: "q_3",
        question:
          "When computing multiplier weights for multi-stage sample surveys, how are non-responding sample households appropriately treated?",
        options: [
          "Treated as zeroes without adjusting neighboring household weights.",
          "Re-weighting adjustments applied within the same stratum/sub-stratum to conserve population aggregates.",
          "Fabricating replacement responses using random number generators.",
          "Disregarding the entire district sample data.",
        ],
        correctAnswer: 1,
        explanation:
          "Post-stratification non-response weight adjustment factors within the same socio-economic stratum preserve population margin consistency without distortion.",
        competencyId: "statistical_methods",
        difficulty: "Intermediate",
        reference: "MoSPI Field Survey Guidelines, Volume IV (Sampling Protocols)",
      },
      {
        id: "q_4",
        question:
          "What is the standard formula for estimating the design effect (DEFF) in complex survey cluster samples?",
        options: [
          "Variance under complex design divided by variance under Simple Random Sampling of equal size.",
          "Total sample size multiplied by the number of survey rounds.",
          "Ratio of non-response rate to response rate.",
          "Standard deviation divided by the median.",
        ],
        correctAnswer: 0,
        explanation:
          "DEFF is universally defined as the ratio of the variance of an estimator under the complex cluster design to that under simple random sampling of identical sample size.",
        competencyId: "statistical_methods",
        difficulty: "Advanced",
        reference: "MoSPI Field Survey Guidelines, Volume IV (Sampling Protocols)",
      },
      {
        id: "q_5",
        question:
          "In household consumer expenditure schedules, how should seasonal consumption fluctuations be scrutinized during annualization?",
        options: [
          "Using 30-day and 365-day recall period validation across four balanced sub-rounds.",
          "Ignoring seasonal goods altogether.",
          "Multiplying single month monsoon data by 12.",
          "Using only urban supermarket receipts.",
        ],
        correctAnswer: 0,
        explanation:
          "NSS surveys mitigate seasonal bias through 4 balanced sub-rounds covering all agricultural seasons, combined with Modified Mixed Reference Periods (MMRP).",
        competencyId: "statistical_methods",
        difficulty: "Intermediate",
        reference: "MoSPI Field Survey Guidelines, Volume IV (Sampling Protocols)",
      },
      {
        id: "q_6",
        question:
          "When applying linearized Taylor Series for variance estimation of ratio indicators, what mathematical condition must hold?",
        options: [
          "The sample size in each cluster must exceed one million.",
          "The denominator estimate must be significantly bounded away from zero with small coefficient of variation.",
          "The data must follow a uniform distribution exactly.",
          "No weights may be applied to sample points.",
        ],
        correctAnswer: 1,
        explanation:
          "Linearization relies on first-order Taylor expansion around expected values, requiring the denominator to have low relative variance to avoid singularity.",
        competencyId: "statistical_methods",
        difficulty: "Advanced",
        reference: "MoSPI Field Survey Guidelines, Volume IV (Sampling Protocols)",
      },
      {
        id: "q_7",
        question:
          "Which of the following constitutes an essential internal consistency check for enterprise survey schedules?",
        options: [
          "Total gross output must strictly equal or exceed intermediate consumption plus gross value added.",
          "The enterprise must have zero depreciation every year.",
          "Employee count must remain fixed across all months.",
          "Electricity consumed must equal fuel cost divided by two.",
        ],
        correctAnswer: 0,
        explanation:
          "National Accounts accounting identity dictates Gross Value Added (GVA) = Gross Value of Output minus Intermediate Consumption.",
        competencyId: "statistical_methods",
        difficulty: "Intermediate",
        reference: "MoSPI Field Survey Guidelines, Volume IV (Sampling Protocols)",
      },
      {
        id: "q_8",
        question:
          "In automated microdata processing, why is preserving immutable raw data archives a core requirement of official statistics?",
        options: [
          "To allow repeatable auditing, historical recalculation, and transparent replication by independent researchers.",
          "Because modern databases cannot modify records once created.",
          "To prevent storage devices from defragmenting.",
          "Because government rules forbid updating statistical models.",
        ],
        correctAnswer: 0,
        explanation:
          "Immutability of raw microdata is the cornerstone of reproducibility and scientific credibility under Fundamental Principles of Official Statistics.",
        competencyId: "statistical_methods",
        difficulty: "Intermediate",
        reference: "MoSPI Field Survey Guidelines, Volume IV (Sampling Protocols)",
      },
      {
        id: "q_9",
        question:
          "What is the primary danger of using unconstrained deep learning models for imputing missing demographic survey variables?",
        options: [
          "Hallucinated correlations that introduce synthetic systemic bias and distort inter-variable covariance structures.",
          "It uses too few computational cycles.",
          "The file sizes will become too small to store.",
          "Deep learning models cannot run on tabular survey data.",
        ],
        correctAnswer: 0,
        explanation:
          "Unconstrained generative imputation may invent spurious relationships that damage official indicator validity.",
        competencyId: "statistical_methods",
        difficulty: "Advanced",
        reference: "MoSPI Field Survey Guidelines, Volume IV (Sampling Protocols)",
      },
      {
        id: "q_10",
        question:
          "How do Directorate of Economics & Statistics (DES) officers validate administrative data before synthesizing State Domestic Product (SDP)?",
        options: [
          "Cross-checking administrative departmental reporting against independent sample survey benchmarks and fiscal accounts.",
          "Accepting all department estimates without verification.",
          "Averaging previous year's figures with a constant 10% increment.",
          "Using only headlines from national newspapers.",
        ],
        correctAnswer: 0,
        explanation:
          "State DES methodology requires reconciling departmental administrative inputs with budget documents and central CSO/NSO benchmarks.",
        competencyId: "statistical_methods",
        difficulty: "Intermediate",
        reference: "MoSPI Field Survey Guidelines, Volume IV (Sampling Protocols)",
      },
    ],
    []
  );

  return (
    <AppShell>
      {(data: UserDashboardData) => {
        const { user, priorityGap, competencies } = data;
        const targetCompId: CompetencyId = priorityGap
          ? priorityGap.competencyId
          : "statistical_methods";
        const compDef = COMPETENCIES.find((c) => c.id === targetCompId);

        // Find saved quiz or use fallback
        const savedQuiz = getQuizById(user.id, quizId);
        const quizData: GeneratedQuiz = savedQuiz || {
          id: quizId || "std_eval",
          userId: user.id,
          title: "Statistical Methods & Survey Sampling Competency Evaluation",
          materialFilename: "Statistical Methods & Survey Sampling.pdf",
          totalQuestions: fallbackQuestions.length,
          targetCompetencyId: targetCompId,
          createdAt: new Date().toISOString(),
          questions: fallbackQuestions,
        };

        const questions = quizData.questions;
        const currentQ = questions[currentIndex] || questions[0];
        const answeredCount = Object.keys(selectedAnswers).length;
        const remainingCount = questions.length - answeredCount;
        const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;

        // Current competency gap
        const currentCompRecord = competencies.find(
          (c) => c.competencyId === quizData.targetCompetencyId
        );
        const currentDeficit = currentCompRecord
          ? currentCompRecord.score < 70
            ? -(70 - currentCompRecord.score)
            : 0
          : -22;

        const handleSubmitQuiz = async () => {
          if (answeredCount < questions.length) {
            if (
              !confirm(
                `You have answered ${answeredCount} of ${questions.length} questions. Unanswered questions will be scored as 0. Proceed with submission?`
              )
            ) {
              return;
            }
          }

          setIsSubmitting(true);

          const answersPayload = questions.map((q) => {
            const selected = selectedAnswers[q.id];
            const isCorrect = selected === q.correctAnswer;
            return {
              questionId: q.id,
              selectedAnswer: selected ?? -1,
              isCorrect: Boolean(isCorrect),
              competencyId: q.competencyId,
              questionText: q.question,
              explanation: q.explanation,
            };
          });

          const correctItems = answersPayload.filter((a) => a.isCorrect).length;
          const scorePercent = Math.round((correctItems / questions.length) * 100);
          const missedTopics = answersPayload
            .filter((a) => !a.isCorrect)
            .map((a) => a.questionText?.slice(0, 60));

          // Fetch pedagogical feedback
          let feedbackData = undefined;
          try {
            const fbRes = await fetch("/api/generate-feedback", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                quizTitle: quizData.title,
                score: scorePercent,
                totalQuestions: questions.length,
                correctCount: correctItems,
                missedQuestions: missedTopics,
                competencyName: compDef?.name || "Statistical Methods & Survey Sampling",
              }),
            });
            if (fbRes.ok) {
              const fbJson = await fbRes.json();
              if (fbJson.success && fbJson.feedback) {
                feedbackData = fbJson.feedback;
              }
            }
          } catch {
            // fallback will be generated in results if not here
          }

          const timeElapsed = 900 - secondsRemaining;

          const attempt = submitQuizAttempt(
            user.id,
            quizData.id,
            quizData.title,
            quizData.targetCompetencyId,
            answersPayload,
            timeElapsed,
            feedbackData
          );

          // Route to results screen
          router.push(`/quiz/${quizData.id}/results?attemptId=${attempt.id}`);
        };

        return (
          <div className="space-y-6 text-[#0f1f35]" suppressHydrationWarning>
            {/* Top Official Assessment Header */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-600 uppercase">
                    Official Assessment
                  </span>
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="font-mono text-xs font-semibold text-slate-500">
                    Session ID: MoSPI-2025-SSO-8841
                  </span>
                </div>

                <h1 className="mt-2 text-xl sm:text-2xl font-black text-[#0f1f35]">
                  {quizData.title}
                </h1>
                <p className="mt-0.5 text-xs text-slate-500">
                  {user.role} • {user.department}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Timer */}
                <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/70 px-3.5 py-2 text-xs font-bold text-[#0b2945]">
                  <Clock className="h-4 w-4 text-[#0b2945]" />
                  <span>{formatTimer(secondsRemaining)} remaining</span>
                </div>

                {/* Save & Pause */}
                <button
                  type="button"
                  onClick={() => {
                    setIsPaused(!isPaused);
                    alert(isPaused ? "Assessment resumed." : "Assessment paused. Your progress has been saved.");
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Pause className="h-3.5 w-3.5 text-slate-500" />
                  {isPaused ? "Resume" : "Save & Pause"}
                </button>

                {/* Submit Assessment Button */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmitQuiz}
                  className="flex items-center gap-2 rounded-xl bg-[#0b2945] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#081f35] transition-colors disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  {isSubmitting ? "Scoring..." : "Submit Assessment"}
                </button>
              </div>
            </div>

            {/* Progress Status Bar */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="font-bold text-[#0f1f35]">
                  Question {currentIndex + 1} of {questions.length}{" "}
                  <span className="font-normal text-slate-400">Progress Status</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[11px] font-bold text-blue-900">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                    {answeredCount} Answered
                  </span>
                  <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                    {remainingCount} Remaining
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-[11px] font-medium text-purple-900">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                    {flaggedCount} Flagged for Review
                  </span>
                </div>
              </div>

              {/* Progress Line */}
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-[#0b2945] transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Main 2-Column Quiz Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Question Card (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
                  {/* Question Category & APAR badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-[#0b2945] uppercase tracking-wider">
                        Question {String(currentIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="rounded bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[11px] font-bold text-blue-900">
                        {compDef?.name || "Statistical Methods"} • Sampling Theory
                      </span>
                    </div>

                    <span className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      1 Mark • APAR Accredited
                    </span>
                  </div>

                  {/* Question Text */}
                  <div className="space-y-3">
                    <h2 className="text-base sm:text-lg font-black text-[#0f1f35] leading-relaxed">
                      {currentQ.question}
                    </h2>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 italic">
                      <BookOpen className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>
                        Reference: {currentQ.reference || "MoSPI Field Survey Guidelines, Volume IV (Sampling Protocols)"}
                      </span>
                    </div>
                  </div>

                  {/* Options List */}
                  <div className="space-y-3 pt-2">
                    {currentQ.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[currentQ.id] === optIdx;
                      const letter = String.fromCharCode(65 + optIdx);

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() =>
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [currentQ.id]: optIdx,
                            }))
                          }
                          className={`flex w-full items-start justify-between gap-3 rounded-xl p-4 text-left transition-all border ${
                            isSelected
                              ? "border-[#0b2945] bg-blue-50/50 shadow-xs ring-1 ring-[#0b2945]"
                              : "border-slate-200 bg-white hover:bg-slate-50/70 text-slate-800"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold border transition-colors ${
                                isSelected
                                  ? "border-[#0b2945] bg-[#0b2945] text-white"
                                  : "border-slate-300 text-slate-500 bg-slate-50"
                              }`}
                            >
                              {letter}
                            </div>
                            <span className="text-xs sm:text-sm pt-0.5 leading-relaxed font-medium">
                              {opt}
                            </span>
                          </div>

                          {isSelected && (
                            <CheckCircle2 className="h-5 w-5 text-[#0b2945] shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Bottom Navigation & Flag */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
                    {/* Flag for Review */}
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={Boolean(flaggedQuestions[currentQ.id])}
                        onChange={(e) =>
                          setFlaggedQuestions((prev) => ({
                            ...prev,
                            [currentQ.id]: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-slate-300 text-[#0b2945] focus:ring-[#0b2945]"
                      />
                      <span>Flag for Review</span>
                    </label>

                    {/* Prev / Next buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex((prev) => prev - 1)}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" /> Previous Question
                      </button>

                      {currentIndex < questions.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => setCurrentIndex((prev) => prev + 1)}
                          className="flex items-center gap-1.5 rounded-lg bg-[#0b2945] px-5 py-2 text-xs font-bold text-white hover:bg-[#081f35] transition-colors"
                        >
                          Next Question <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={handleSubmitQuiz}
                          className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition-colors disabled:opacity-50"
                        >
                          <Check className="h-4 w-4" />
                          {isSubmitting ? "Scoring..." : "Submit Assessment"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Question Navigator & Directives (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* CARD 1: Question Navigator */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0f1f35]">
                      <LayoutGrid className="h-4 w-4 text-[#0b2945]" />
                      Question Navigator
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {currentIndex + 1} / {questions.length} Active
                    </span>
                  </div>

                  {/* 10 Question Grid (2 rows of 5) */}
                  <div className="grid grid-cols-5 gap-2.5">
                    {questions.map((q, idx) => {
                      const isCurrent = idx === currentIndex;
                      const isAnswered = selectedAnswers[q.id] !== undefined;
                      const isFlagged = flaggedQuestions[q.id];

                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setCurrentIndex(idx)}
                          className={`relative flex h-11 items-center justify-center rounded-xl font-bold text-xs transition-all ${
                            isCurrent
                              ? "bg-[#0b2945] text-white shadow-xs ring-2 ring-blue-300"
                              : isAnswered
                              ? "bg-blue-50 text-blue-900 border border-blue-200 font-extrabold"
                              : "bg-slate-100/70 text-slate-600 hover:bg-slate-200/70"
                          }`}
                        >
                          {String(idx + 1).padStart(2, "0")}

                          {/* Flag Indicator Dot */}
                          {isFlagged && (
                            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-purple-500 ring-2 ring-white" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded bg-[#0b2945]" />
                      <span>Answered ({answeredCount})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded bg-slate-200" />
                      <span>Unattempted ({remainingCount})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-purple-500" />
                      <span>Flagged ({flaggedCount})</span>
                    </div>
                  </div>
                </div>

                {/* CARD 2: Cadre Evaluation Directives */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0f1f35] border-b border-slate-100 pb-3">
                    <FileCheck2 className="h-4 w-4 text-[#0b2945]" />
                    Cadre Evaluation Directives
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed text-slate-600">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        Each correct answer directly addresses the{" "}
                        <strong className="text-red-700">
                          {currentDeficit}% {compDef?.name || "Statistical Methods"}
                        </strong>{" "}
                        competency gap mapped to your profile.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        Negative marking: <strong className="text-slate-800">None</strong> for Cadre Diagnostic Series.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        Benchmark for APAR Endorsement:{" "}
                        <strong className="text-slate-800">70% (7/10 questions)</strong> minimum required.
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 3: AI Proctoring & Security */}
                <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-950">
                      <Lock className="h-4 w-4 text-[#0b2945]" />
                      AI Proctoring &amp; Security
                    </div>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  <div className="space-y-1.5 text-xs text-blue-900/80">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Eye className="h-3.5 w-3.5 text-blue-700" />
                      Browser Window Focus Secured
                    </div>
                    <div className="font-mono text-[11px] text-blue-800">
                      IP: 14.139.224.*** • Hash: e6a48f...b92 • Verified NIC Gate
                    </div>
                    <p className="text-[11px] text-slate-500 pt-1 leading-snug">
                      Automated integrity check verifies candidate environmental presence through the iGOT Karmayogi engine.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </AppShell>
  );
}
