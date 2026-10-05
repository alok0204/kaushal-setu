"use client";

import React, { useState, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Clock,
  ShieldCheck,
  TrendingUp,
  Award,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { UserDashboardData, CompetencyId, QuizQuestionItem } from "@/types";
import { COMPETENCIES } from "@/lib/constants";
import { getUserState, submitQuizAttempt } from "@/lib/store";

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizIdParam = searchParams.get("id");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    quizScore: number;
    prevScore: number;
    newScore: number;
    competencyName: string;
  } | null>(null);

  const defaultStandardQuestions = useMemo<QuizQuestionItem[]>(
    () => [
      {
        id: "q_eval_1",
        question:
          "In multi-stage stratified survey sampling, what is the impact on standard error if cluster sizes (intra-cluster correlation) increase?",
        options: [
          "Standard errors decrease significantly",
          "Standard errors increase, raising the required Design Effect (DEFF)",
          "Cluster size has zero impact on variance",
          "The survey cannot be computed",
        ],
        correctAnswer: 1,
        explanation:
          "Positive intra-class correlation within clusters inflates sampling variance compared to simple random sampling.",
        competencyId: "statistical_methods",
        difficulty: "Intermediate",
      },
      {
        id: "q_eval_2",
        question:
          "How should sampling weights be adjusted when sample units across a sub-district exhibit systematic non-response?",
        options: [
          "Replace non-respondents with fabricated responses",
          "Reweight responding units in the same socio-economic sub-stratum proportionally",
          "Drop the entire district dataset",
          "Average the results with neighboring states",
        ],
        correctAnswer: 1,
        explanation:
          "Post-stratification or non-response reweighting inside homogeneous strata prevents bias.",
        competencyId: "statistical_methods",
        difficulty: "Intermediate",
      },
      {
        id: "q_eval_3",
        question:
          "Which variance estimation formula is universally mandated by MoSPI guidelines for ratio estimators in stratified multi-stage designs?",
        options: [
          "First-order Taylor Series Linearization or Balanced Repeated Replication (BRR)",
          "Basic sample variance divided by total respondents",
          "Fixed 5% standard error addition",
          "Median absolute deviation without weighting",
        ],
        correctAnswer: 0,
        explanation:
          "Taylor linearization or replication methods are the official standard for complex survey ratio estimation.",
        competencyId: "statistical_methods",
        difficulty: "Advanced",
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

        // Find saved quiz or use standard questions
        const userState = getUserState(user.id);
        const savedQuiz = userState.quizzes?.find((q) => q.id === quizIdParam) || userState.quizzes?.[userState.quizzes.length - 1];

        const currentActiveQuiz = savedQuiz
          ? {
              id: savedQuiz.id,
              title: savedQuiz.title,
              competencyId: savedQuiz.targetCompetencyId,
              questions: savedQuiz.questions,
            }
          : {
              id: `quiz_std_${user.id}`,
              title: `AI Assessment: ${compDef?.name || "Statistical Methods"} Certification`,
              competencyId: targetCompId,
              questions: defaultStandardQuestions,
            };

        const questions = currentActiveQuiz.questions;
        const currentQ = questions[currentIndex] || questions[0];
        const answeredCount = Object.keys(selectedAnswers).length;

        const handleSubmitQuiz = () => {
          setIsSubmitting(true);
          const prevScore =
            competencies.find(
              (c) => c.competencyId === currentActiveQuiz.competencyId
            )?.score ?? 0;

          const answersPayload = questions.map((q) => {
            const selected = selectedAnswers[q.id];
            const isCorrect = selected === q.correctAnswer;
            return {
              questionId: q.id,
              selectedAnswer: selected ?? -1,
              isCorrect: Boolean(isCorrect),
            };
          });

          const attempt = submitQuizAttempt(
            user.id,
            currentActiveQuiz.id,
            currentActiveQuiz.title,
            currentActiveQuiz.competencyId,
            answersPayload
          );

          const updatedState = getUserState(user.id);
          const newScore =
            updatedState.competencies[currentActiveQuiz.competencyId] ??
            attempt.score;

          setQuizResult({
            quizScore: attempt.score,
            prevScore,
            newScore,
            competencyName: compDef?.name || "Official Statistical Methods",
          });
          setIsSubmitting(false);
        };

        if (quizResult) {
          const delta = quizResult.newScore - quizResult.prevScore;

          return (
            <div className="max-w-2xl mx-auto space-y-6 text-center py-8">
              <div className="rounded-2xl border border-emerald-200 bg-white p-8 shadow-sm dark:border-emerald-900 dark:bg-zinc-900 space-y-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto dark:bg-emerald-950 dark:text-emerald-400">
                  <Award className="h-10 w-10" />
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    AI Assessment Completed &amp; Competency Uplifted!
                  </div>
                  <h1 className="mt-3 text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                    {currentActiveQuiz.title}
                  </h1>
                  <p className="text-xs text-zinc-500 mt-1">
                    Evaluated by Karmayogi Competency Engine using Step 13 Official Formula.
                  </p>
                </div>

                {/* Score Comparison Grid */}
                <div className="grid grid-cols-3 gap-3 rounded-xl bg-zinc-50 p-4 border border-zinc-200/80 dark:bg-zinc-800/50 dark:border-zinc-800">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-zinc-400">
                      Quiz Score
                    </div>
                    <div className="text-2xl font-black text-blue-600 mt-1">
                      {quizResult.quizScore}%
                    </div>
                    <div className="text-[10px] text-zinc-500">Evaluation</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-zinc-400">
                      Previous Score
                    </div>
                    <div className="text-2xl font-black text-zinc-500 mt-1">
                      {quizResult.prevScore}%
                    </div>
                    <div className="text-[10px] text-zinc-500">Baseline</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-zinc-400">
                      New Competency
                    </div>
                    <div className="text-2xl font-black text-emerald-600 mt-1">
                      {quizResult.newScore}%
                    </div>
                    <div className="text-[10px] text-emerald-700 font-bold">
                      {delta >= 0 ? `+${delta}% Uplift` : `${delta}%`}
                    </div>
                  </div>
                </div>

                {/* Formula Explanation Callout */}
                <div className="rounded-lg bg-blue-50/80 p-3 text-left text-xs text-blue-900 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    Transparent Competency Update Formula Applied:
                  </div>
                  <p className="font-mono text-[11px] text-blue-800 dark:text-blue-300">
                    New Score = (70% × Previous {quizResult.prevScore}%) + (30% ×
                    Quiz {quizResult.quizScore}%) = <strong>{quizResult.newScore}%</strong>
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Your dynamic matrix records have been updated and synchronized with the dashboard.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow hover:bg-blue-700 transition-colors"
                  >
                    View Updated Dashboard <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => router.push("/competency")}
                    className="flex-1 rounded-xl border border-zinc-200 bg-white py-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    View Competency Matrix
                  </button>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  AI-Generated Competency Assessment
                </div>
                <h1 className="mt-1 text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  {currentActiveQuiz.title}
                </h1>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 rounded bg-zinc-100 px-2.5 py-1 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  <Clock className="h-3.5 w-3.5" /> {questions.length} Items
                </span>
                <span className="rounded bg-blue-100 px-2.5 py-1 font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  Completed: {answeredCount}/{questions.length}
                </span>
              </div>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-10 gap-1.5">
              {questions.map((q, idx) => {
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      isCurrent
                        ? "bg-blue-600 ring-2 ring-blue-300"
                        : isAnswered
                        ? "bg-emerald-500"
                        : "bg-zinc-200 dark:bg-zinc-800"
                    }`}
                    title={`Question ${idx + 1}`}
                  />
                );
              })}
            </div>

            {/* Question Card */}
            <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
              <div className="flex items-center justify-between text-xs">
                <span className="rounded bg-blue-50 px-2.5 py-1 font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  Target Domain: {compDef?.name}
                </span>
                <span className="font-mono text-zinc-400">
                  Item {currentIndex + 1} of {questions.length}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-relaxed">
                {currentQ.question}
              </h2>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === optIdx;
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
                      className={`flex w-full items-start gap-3 rounded-xl p-4 text-left transition-all border ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/70 text-blue-950 font-medium shadow-sm dark:bg-blue-950/40 dark:text-blue-200"
                          : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100 hover:border-zinc-300 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-200"
                      }`}
                    >
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold border ${
                          isSelected
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-zinc-300 text-zinc-500 bg-white dark:border-zinc-700 dark:bg-zinc-800"
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="text-xs sm:text-sm pt-0.5 leading-relaxed">
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-30 dark:border-zinc-700 dark:text-zinc-300"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Previous
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="flex items-center gap-1.5 rounded-lg bg-[#0c1829] px-5 py-2 text-xs font-bold text-white hover:bg-black transition-colors"
                  >
                    Next <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmitQuiz}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {isSubmitting ? "Calculating Uplift..." : "Submit & Update Competency"}
                  </button>
                )}
              </div>
            </div>

            <div className="text-center text-[11px] text-zinc-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-zinc-500" />
              Automated scoring dynamically modifies official competency records upon submission.
            </div>
          </div>
        );
      }}
    </AppShell>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading quiz...
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
}
