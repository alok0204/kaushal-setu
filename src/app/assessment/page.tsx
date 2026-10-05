"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ClipboardCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Check,
  Sparkles,
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
            <div className="max-w-2xl mx-auto space-y-6 text-center py-8 text-[#0f1f35] dark:text-[#F5F5F5]" suppressHydrationWarning>
              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white dark:bg-[#171719] p-8 shadow-xs space-y-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 mx-auto">
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <div>
                  <h1 className="text-2xl font-extrabold text-[#0f1f35] dark:text-[#F5F5F5]">
                    Diagnostic Assessment Evaluated!
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-[#A1A1AA] mt-1">
                    Your baseline performance has been recorded into the National Statistical Systems matrix.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-[#111113] p-6 border border-slate-200 dark:border-[#2A2A2E]">
                  <div className="text-xs font-bold uppercase text-slate-400 dark:text-[#71717A]">
                    Overall Competency Established
                  </div>
                  <div className="text-5xl font-black text-[#0b2945] dark:text-blue-400 my-2">
                    {completedResult.overallScore}%
                  </div>
                  <div className="text-xs text-slate-600 dark:text-[#A1A1AA]">
                    National Benchmark Target: <strong>70%</strong>
                  </div>
                </div>

                <div className="text-left space-y-2 pt-2">
                  <div className="text-xs font-bold uppercase text-slate-400 dark:text-[#71717A]">
                    Competency Breakdown
                  </div>
                  {COMPETENCIES.map((c) => {
                    const sc = completedResult.competencyScores[c.id] ?? 0;
                    return (
                      <div
                        key={c.id}
                        className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-[#2A2A2E]"
                      >
                        <span className="font-semibold text-slate-700 dark:text-[#A1A1AA]">{c.name}</span>
                        <span className="font-mono font-bold text-[#0f1f35] dark:text-[#F5F5F5]">{sc}%</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={() => router.push("/competency")}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#0b2945] hover:bg-[#081f35] dark:bg-blue-600 dark:hover:bg-blue-500 py-3 text-xs font-bold text-white shadow-xs transition-colors"
                  >
                    View Competency Analysis <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="flex-1 rounded-xl border border-slate-200 dark:border-[#2A2A2E] bg-white dark:bg-[#1D1D20] py-3 text-xs font-semibold text-slate-700 dark:text-[#F5F5F5] hover:bg-slate-50 dark:hover:bg-[#2A2A2E]"
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
          <div className="max-w-3xl mx-auto space-y-6 text-[#0f1f35] dark:text-[#F5F5F5]" suppressHydrationWarning>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-[#2A2A2E] pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0b2945] dark:text-blue-400">
                  <ClipboardCheck className="h-4 w-4" />
                  MoSPI Initial Diagnostic Assessment
                </div>
                <h1 className="mt-1 text-xl font-extrabold text-[#0f1f35] dark:text-[#F5F5F5]">
                  Official Statistical System Competency Baseline
                </h1>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 rounded bg-white dark:bg-[#171719] border border-slate-200 dark:border-[#2A2A2E] px-2.5 py-1 text-slate-600 dark:text-[#A1A1AA]">
                  <Clock className="h-3.5 w-3.5" /> 10 Questions
                </span>
                <span className="rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 px-2.5 py-1 font-bold text-blue-900 dark:text-blue-300">
                  Answered: {answeredCount}/{questions.length}
                </span>
              </div>
            </div>

            {/* Switcher Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-blue-200 dark:border-[#2A2A2E] bg-blue-50/70 dark:bg-[#171719] p-3.5 shadow-2xs">
              <div className="flex items-center gap-2.5 text-xs">
                <Sparkles className="h-4 w-4 text-[#0b2945] dark:text-blue-400 shrink-0" />
                <div>
                  <span className="font-bold text-[#0f1f35] dark:text-[#F5F5F5]">Looking to generate custom assessments from official PDFs? </span>
                  <span className="text-slate-500 dark:text-[#A1A1AA]">Upload cadre manuals or survey guides.</span>
                </div>
              </div>
              <Link
                href="/ai-generator"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0b2945] hover:bg-[#081f35] dark:bg-blue-600 dark:hover:bg-blue-500 px-3.5 py-1.5 text-xs font-bold text-white transition-colors shrink-0"
              >
                AI Assessment Generator <ArrowRight className="h-3 w-3" />
              </Link>
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
                        ? "bg-[#0b2945] dark:bg-blue-500 ring-2 ring-blue-300 dark:ring-blue-700"
                        : isAnswered
                        ? "bg-emerald-600 dark:bg-emerald-500"
                        : "bg-slate-200 dark:bg-[#2A2A2E]"
                    }`}
                    title={`Question ${idx + 1}`}
                  />
                );
              })}
            </div>

            {/* Question Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-[#2A2A2E] bg-white dark:bg-[#171719] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between text-xs">
                <span className="rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 px-2.5 py-1 font-bold text-[#0b2945] dark:text-blue-300">
                  Domain: {compDef?.name}
                </span>
                <span className="font-mono text-slate-400 dark:text-[#71717A]">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-[#0f1f35] dark:text-[#F5F5F5] leading-relaxed">
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
                          ? "border-[#0b2945] dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 font-semibold shadow-xs"
                          : "border-slate-200 dark:border-[#2A2A2E] bg-white dark:bg-[#1D1D20] hover:bg-slate-50 dark:hover:bg-[#2A2A2E] text-slate-800 dark:text-[#F5F5F5]"
                      }`}
                    >
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold border ${
                          isSelected
                            ? "border-[#0b2945] dark:border-blue-500 bg-[#0b2945] dark:bg-blue-600 text-white"
                            : "border-slate-300 dark:border-[#2A2A2E] text-slate-500 dark:text-[#A1A1AA] bg-slate-50 dark:bg-[#111113]"
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
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-[#2A2A2E]">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#2A2A2E] bg-white dark:bg-[#1D1D20] px-4 py-2 text-xs font-semibold text-slate-700 dark:text-[#F5F5F5] hover:bg-slate-50 dark:hover:bg-[#2A2A2E] disabled:opacity-30"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Previous
                </button>

                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="flex items-center gap-1.5 rounded-lg bg-[#0b2945] hover:bg-[#081f35] dark:bg-blue-600 dark:hover:bg-blue-500 px-5 py-2 text-xs font-bold text-white transition-colors"
                  >
                    Next Question <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSubmit(user.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-colors disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />
                    {isSubmitting ? "Scoring Assessment..." : "Submit Diagnostic Assessment"}
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="text-center text-[11px] text-slate-500 dark:text-[#71717A] flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-500 dark:text-[#71717A]" />
              Evaluation adheres to MoSPI Competency Evaluation Standards &amp; iGOT Karmayogi Framework
            </div>
          </div>
        );
      }}
    </AppShell>
  );
}
