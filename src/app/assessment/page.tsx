"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Check,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { UserDashboardData, CompetencyId } from "@/types";
import { INITIAL_ASSESSMENT_QUESTIONS, COMPETENCIES } from "@/lib/constants";
import { submitInitialAssessment } from "@/lib/store";

export default function AssessmentPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedResult, setCompletedResult] = useState<{
    overallScore: number;
    competencyScores: Record<CompetencyId, number>;
  } | null>(null);

  const questions = INITIAL_ASSESSMENT_QUESTIONS;
  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSubmit = (userId: string) => {
    if (answeredCount < questions.length) {
      if (
        !confirm(
          `You have answered ${answeredCount} of ${questions.length} questions. Unanswered questions will be scored as 0%. Proceed with submission?`
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
      };
    });

    const result = submitInitialAssessment(userId, answersPayload);
    setCompletedResult({
      overallScore: result.overallScore,
      competencyScores: result.competencyScores,
    });
    setIsSubmitting(false);
  };

  return (
    <AppShell>
      {(data: UserDashboardData) => {
        const { user } = data;

        if (completedResult) {
          return (
            <div className="max-w-2xl mx-auto space-y-6 text-center py-8">
              <div className="rounded-2xl border border-emerald-200 bg-white p-8 shadow-sm dark:border-emerald-900 dark:bg-zinc-900 space-y-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <div>
                  <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                    Diagnostic Assessment Evaluated!
                  </h1>
                  <p className="text-xs text-zinc-500 mt-1">
                    Your baseline performance has been recorded into the National Statistical Systems matrix.
                  </p>
                </div>

                <div className="rounded-xl bg-zinc-50 p-6 border border-zinc-200/80 dark:bg-zinc-800/50 dark:border-zinc-800">
                  <div className="text-xs font-bold uppercase text-zinc-400">Overall Competency Established</div>
                  <div className="text-5xl font-black text-blue-600 my-2">
                    {completedResult.overallScore}%
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">
                    National Benchmark Target: <strong>70%</strong>
                  </div>
                </div>

                <div className="text-left space-y-2 pt-2">
                  <div className="text-xs font-bold uppercase text-zinc-400">Competency Breakdown</div>
                  {COMPETENCIES.map((c) => {
                    const sc = completedResult.competencyScores[c.id] ?? 0;
                    return (
                      <div key={c.id} className="flex items-center justify-between text-xs py-1 border-b border-zinc-100 dark:border-zinc-800">
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">{c.name}</span>
                        <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{sc}%</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={() => router.push("/competency")}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow hover:bg-blue-700 transition-colors"
                  >
                    View Competency Analysis <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="flex-1 rounded-xl border border-zinc-200 bg-white py-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          );
        }

        const compDef = COMPETENCIES.find((c) => c.id === currentQ.competencyId);

        return (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                  <ClipboardCheck className="h-4 w-4" />
                  MoSPI Initial Diagnostic Assessment
                </div>
                <h1 className="mt-1 text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  Official Statistical System Competency Baseline
                </h1>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 rounded bg-zinc-100 px-2.5 py-1 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  <Clock className="h-3.5 w-3.5" /> 10 Questions
                </span>
                <span className="rounded bg-blue-100 px-2.5 py-1 font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  Answered: {answeredCount}/{questions.length}
                </span>
              </div>
            </div>

            {/* Question Progress Stepper */}
            <div className="grid grid-cols-10 gap-1.5">
              {questions.map((q, idx) => {
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const isCurrent = idx === currentQuestionIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
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
                  Domain: {compDef?.name}
                </span>
                <span className="font-mono text-zinc-400">
                  Question {currentQuestionIndex + 1} of {questions.length}
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
                      onClick={() => handleSelectOption(currentQ.id, optIdx)}
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

              {/* Navigation Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-30 dark:border-zinc-700 dark:text-zinc-300"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Previous
                </button>

                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="flex items-center gap-1.5 rounded-lg bg-[#0c1829] px-5 py-2 text-xs font-bold text-white hover:bg-black transition-colors"
                  >
                    Next Question <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSubmit(user.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />
                    {isSubmitting ? "Scoring Assessment..." : "Submit Diagnostic Assessment"}
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="text-center text-[11px] text-zinc-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-zinc-500" />
              Evaluation adheres to MoSPI Competency Evaluation Standards &amp; iGOT Karmayogi Framework
            </div>
          </div>
        );
      }}
    </AppShell>
  );
}
