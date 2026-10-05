"use client";

import React, { useState, use } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Download,
  FileText,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Award,
  ChevronUp,
  LayoutGrid,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import {
  UserDashboardData,
  CompetencyId,
  QuizAttempt,
  GeneratedQuiz,
} from "@/types";
import { COMPETENCIES, TARGET_BENCHMARK } from "@/lib/constants";
import { formatDeterministicDate } from "@/lib/utils";
import {
  getUserState,
  getQuizAttemptById,
  getLatestQuizAttempt,
  getQuizById,
} from "@/lib/store";

interface PageProps {
  params: Promise<{ quizId: string }>;
}

export default function AssessmentResultsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const quizId = resolvedParams.quizId;
  const searchParams = useSearchParams();
  const attemptIdParam = searchParams.get("attemptId");

  const [showReviewSolutions, setShowReviewSolutions] = useState(false);

  return (
    <AppShell>
      {(data: UserDashboardData) => {
        const { user, competencies } = data;
        const userState = getUserState(user.id);

        // Fetch attempt
        let attempt: QuizAttempt | undefined = undefined;
        if (attemptIdParam) {
          attempt = getQuizAttemptById(user.id, attemptIdParam);
        }
        if (!attempt) {
          attempt = getLatestQuizAttempt(user.id, quizId);
        }
        // Fallback dummy attempt if page opened directly
        if (!attempt) {
          attempt = {
            id: `att_default_${user.id}`,
            quizId,
            userId: user.id,
            quizTitle: "Statistical Methods & Survey Sampling Competency Evaluation",
            score: 80,
            totalQuestions: 10,
            correctCount: 8,
            completedAt: new Date().toISOString(),
            competencyId: "statistical_methods",
            competencyScores: userState.competencies,
            timeDurationSeconds: 9 * 60 + 32, // 9m 32s as in Stitch
            answers: [],
          };
        }

        const savedQuiz: GeneratedQuiz | undefined = getQuizById(user.id, quizId);

        const targetCompId: CompetencyId = attempt.competencyId || "statistical_methods";
        const compDef = COMPETENCIES.find((c) => c.id === targetCompId);

        // Calculation of Previous, New, and Target Scores
        const currentScore = Math.round(userState.competencies[targetCompId] ?? attempt.score);
        // Estimate pre-test score from Step 13 formula invert if available:
        // current = 0.7 * prev + 0.3 * quizScore => prev = (current - 0.3*quiz)/0.7
        let baselineScore = 52;
        if (currentScore && attempt.score) {
          const estimatedPrev = Math.round((currentScore - 0.3 * attempt.score) / 0.7);
          baselineScore = Math.max(0, Math.min(100, estimatedPrev));
          if (baselineScore === currentScore) {
            baselineScore = Math.max(20, currentScore - 9);
          }
        }
        const uplift = currentScore - baselineScore;
        const remainingToTarget = Math.max(0, TARGET_BENCHMARK - currentScore);

        // Score formatting
        const scorePercent = attempt.score;
        const correctCount = attempt.correctCount ?? Math.round((attempt.score / 100) * 10);
        const totalCount = attempt.totalQuestions ?? 10;
        const missedCount = totalCount - correctCount;

        const durationSeconds = attempt.timeDurationSeconds || 572;
        const durationMins = Math.floor(durationSeconds / 60);
        const durationSecs = durationSeconds % 60;
        const timeFormatted = `${durationMins}m ${durationSecs < 10 ? "0" : ""}${durationSecs}s`;

        // SVG progress stroke
        const radius = 42;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (scorePercent / 100) * circumference;

        const isQualified = scorePercent >= TARGET_BENCHMARK;

        // Feedback values
        const feedback = attempt.feedback || {
          strengths:
            "Strong demonstrated understanding of stratified sampling mechanics, finite population correction factors, and sample size allocation formulas across heterogenous survey districts.",
          areasToImprove:
            "Questions regarding cold-deck non-response imputation methods and multi-stage cluster variance estimation routines were missed, indicating conceptual uncertainty in large microdata scenarios.",
          recommendedAction:
            "Enrol in prescribed iGOT Karmayogi module on survey microdata verification to satisfy APAR statutory requirements.",
          prescribedModule:
            "KRM-MOSPI-2024-ST02: Applied Survey Sampling & Microdata Verification",
          prescribedDuration: "4.5 Hours • Self-Paced",
        };

        return (
          <div className="space-y-6 text-[#0f1f35] dark:text-[#F5F5F5]" suppressHydrationWarning>
            {/* Breadcrumb & Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-[#2A2A2E] pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-[#A1A1AA]">
                  <Link href="/assessment" className="hover:underline">
                    Assessments
                  </Link>
                  <span>/</span>
                  <span>Results &amp; Feedback</span>
                  <span>/</span>
                  <span className="font-mono text-slate-700 dark:text-[#F5F5F5] font-bold uppercase">
                    REF-2024-EV-94
                  </span>
                </div>
                <h1 className="mt-1.5 text-2xl font-black text-[#0f1f35] dark:text-[#F5F5F5] sm:text-3xl">
                  Assessment Results &amp; Competency Feedback
                </h1>
                <p className="mt-1 text-xs text-slate-500 dark:text-[#A1A1AA]">
                  Evaluation summary for {attempt.quizTitle || `${compDef?.name || "Statistical Methods"} Diagnostic Assessment`}.
                </p>
              </div>

              {/* Form 4-A Synchronized Badge */}
              <div className="inline-flex items-center gap-2 rounded-xl border border-blue-200 dark:border-[#2A2A2E] bg-blue-50/80 dark:bg-[#171719] px-3.5 py-2 text-xs font-bold text-blue-950 dark:text-blue-200 shadow-xs self-start sm:self-center">
                <ShieldCheck className="h-4 w-4 text-[#0b2945] dark:text-blue-400" />
                <div>
                  <div className="uppercase tracking-wider text-[10px] text-blue-900 dark:text-blue-300 font-extrabold">
                    FORM 4-A SYNCHRONIZED
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-[#A1A1AA] font-medium">
                    MoSPI Cadre Competency Portal
                  </div>
                </div>
              </div>
            </div>

            {/* TOP HERO RESULTS CARD */}
            <div className="rounded-2xl border border-slate-200 dark:border-[#2A2A2E] bg-white dark:bg-[#171719] p-6 sm:p-8 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* 1. Circular Score Gauge (4 cols) */}
                <div className="md:col-span-4 flex items-center gap-5 border-b md:border-b-0 md:border-r border-slate-100 dark:border-[#2A2A2E] pb-5 md:pb-0 md:pr-6">
                  {/* Circular SVG Gauge */}
                  <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
                    <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        className="stroke-slate-100 dark:stroke-[#2A2A2E]"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        className={scorePercent >= 70 ? "stroke-emerald-600 dark:stroke-emerald-500" : "stroke-amber-500 dark:stroke-amber-400"}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <div className="text-xl font-black text-[#0f1f35] dark:text-[#F5F5F5] leading-none">
                        {correctCount}
                        <span className="text-xs font-semibold text-slate-400 dark:text-[#71717A]">/{totalCount}</span>
                      </div>
                      <div className="mt-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        {scorePercent}% Score
                      </div>
                    </div>
                  </div>

                  {/* Benchmark cleared info */}
                  <div className="space-y-1">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                        isQualified
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60"
                          : "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60"
                      }`}
                    >
                      {isQualified ? "QUALIFIED • APAR EXCEEDED" : "DEVELOPING • TARGET PENDING"}
                    </span>
                    <h2 className="text-sm font-bold text-[#0f1f35] dark:text-[#F5F5F5]">
                      {isQualified ? "State Cadre Benchmark Cleared" : "Cadre Remediation Target"}
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-[#A1A1AA] leading-tight">
                      Passing requirement was 70% (7/10 score threshold)
                    </p>
                  </div>
                </div>

                {/* 2. Middle Accuracy & Cohort Metrics (5 cols) */}
                <div className="md:col-span-5 grid grid-cols-2 gap-4 border-b md:border-b-0 md:border-r border-slate-100 dark:border-[#2A2A2E] pb-5 md:pb-0 md:pr-6">
                  {/* Accuracy Count */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#71717A]">
                      Accuracy Count
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-400">
                        {correctCount} Correct
                      </span>
                      <span className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 px-2 py-1 text-xs font-bold text-red-800 dark:text-red-400">
                        {missedCount} Missed
                      </span>
                    </div>
                  </div>

                  {/* Time Duration */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#71717A]">
                      Time Duration
                    </div>
                    <div className="mt-1.5 text-sm font-black text-[#0f1f35] dark:text-[#F5F5F5]">
                      {timeFormatted}{" "}
                      <span className="text-xs font-medium text-slate-400 dark:text-[#71717A]">/ 15m allotted</span>
                    </div>
                  </div>

                  {/* State Cohort Standing */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#71717A]">
                      State Cohort Standing
                    </div>
                    <div className="mt-1.5 text-sm font-black text-[#0b2945] dark:text-blue-400">
                      84th{" "}
                      <span className="text-xs font-medium text-slate-500 dark:text-[#A1A1AA]">
                        Percentile ({user.stateCode} DES)
                      </span>
                    </div>
                  </div>

                  {/* Cadre Verification */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#71717A]">
                      Cadre Verification
                    </div>
                    <div className="mt-1.5 flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Cryptographically Sealed
                    </div>
                  </div>
                </div>

                {/* 3. Action Buttons (3 cols) */}
                <div className="md:col-span-3 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b2945] hover:bg-[#081f35] dark:bg-blue-600 dark:hover:bg-blue-500 py-2.5 text-xs font-bold text-white shadow-xs transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download Form 4-A PDF
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowReviewSolutions(!showReviewSolutions)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-blue-200 dark:border-[#2A2A2E] bg-blue-50/70 dark:bg-[#1D1D20] py-2.5 text-xs font-bold text-[#0b2945] dark:text-blue-400 hover:bg-blue-100/70 dark:hover:bg-[#2A2A2E] transition-colors"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    {showReviewSolutions ? "Hide Review Sheet" : "Review Sheet & Solutions"}
                  </button>
                </div>
              </div>
            </div>

            {/* EXPANDABLE REVIEW SOLUTIONS DRAWER */}
            {showReviewSolutions && (
              <div className="rounded-2xl border border-slate-200 dark:border-[#2A2A2E] bg-white dark:bg-[#171719] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#2A2A2E] pb-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#0f1f35] dark:text-[#F5F5F5]">
                    <FileText className="h-4 w-4 text-[#0b2945] dark:text-blue-400" />
                    Question-by-Question Solution &amp; Rationale Dossier
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowReviewSolutions(false)}
                    className="text-xs font-semibold text-slate-500 dark:text-[#A1A1AA] hover:text-slate-800 dark:hover:text-[#F5F5F5] flex items-center gap-1"
                  >
                    Collapse <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {(savedQuiz?.questions || attempt.answers).map((item, idx) => {
                    const qId = "id" in item ? item.id : item.questionId;
                    const ansRecord = attempt.answers?.find((a) => a.questionId === qId);
                    const isCorrect = ansRecord ? ansRecord.isCorrect : true;
                    const qText =
                      (item as { question?: string }).question ||
                      (item as { questionText?: string }).questionText ||
                      `Question ${idx + 1}`;
                    const exp =
                      (item as { explanation?: string }).explanation ||
                      "Official statistical protocol mandated under NSS Guidelines.";

                    return (
                      <div
                        key={idx}
                        className={`rounded-xl border p-4 text-xs space-y-2 ${
                          isCorrect
                            ? "border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20"
                            : "border-red-200 dark:border-red-900/60 bg-red-50/30 dark:bg-red-950/20"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-[#0f1f35] dark:text-[#F5F5F5]">Item {idx + 1}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                              isCorrect
                                ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300"
                                : "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300"
                            }`}
                          >
                            {isCorrect ? "Correct (+1 Mark)" : "Missed (0 Mark)"}
                          </span>
                        </div>
                        <p className="font-semibold text-slate-800 dark:text-[#F5F5F5]">{qText}</p>
                        <div className="rounded-lg bg-white dark:bg-[#111113] p-2.5 border border-slate-200/80 dark:border-[#2A2A2E] text-[11px] text-slate-600 dark:text-[#A1A1AA]">
                          <strong className="text-slate-800 dark:text-[#F5F5F5]">Pedagogical Rationale:</strong> {exp}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MAIN 2-COLUMN SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (7 cols): Progression & Competency Domain Breakdown */}
              <div className="lg:col-span-7 space-y-6">
                {/* CARD 1: Cadre Competency Score Progression */}
                <div className="rounded-2xl border border-slate-200 dark:border-[#2A2A2E] bg-white dark:bg-[#171719] p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#2A2A2E] pb-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#0f1f35] dark:text-[#F5F5F5]">
                      <TrendingUp className="h-4 w-4 text-[#0b2945] dark:text-blue-400" />
                      Cadre Competency Score Progression
                    </div>
                    <span className="rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 px-2.5 py-0.5 text-[10px] font-bold text-blue-900 dark:text-blue-300">
                      Cadre Cycle 2024-Q3
                    </span>
                  </div>

                  {/* 3-Step Milestone Progression */}
                  <div className="grid grid-cols-3 gap-2 items-center text-center">
                    {/* Baseline */}
                    <div className="rounded-xl border border-slate-200 dark:border-[#2A2A2E] bg-slate-50/70 dark:bg-[#111113] p-3.5 space-y-1">
                      <div className="text-[10px] font-bold uppercase text-slate-400 dark:text-[#71717A]">
                        Baseline Pre-Test
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-slate-700 dark:text-[#F5F5F5]">
                        {baselineScore}%
                      </div>
                      <span className="inline-block rounded bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 font-bold px-2 py-0.5 text-[10px]">
                        Deficit Status
                      </span>
                    </div>

                    {/* Arrow */}
                    <div className="flex flex-col items-center justify-center text-slate-400 dark:text-[#71717A]">
                      <ArrowRight className="h-5 w-5" />
                    </div>

                    {/* After Assessment */}
                    <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-[#111113] p-3.5 space-y-1">
                      <div className="text-[10px] font-bold uppercase text-slate-400 dark:text-[#71717A]">
                        After Assessment
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400">
                        {currentScore}%
                      </div>
                      <span className="inline-block rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-300 font-bold px-2 py-0.5 text-[10px]">
                        {uplift >= 0 ? `+${uplift}% Uplift` : `${uplift}%`}
                      </span>
                    </div>
                  </div>

                  {/* Target Callout Box */}
                  <div className="flex items-center justify-between rounded-xl bg-blue-50/50 dark:bg-[#111113] border border-blue-200 dark:border-[#2A2A2E] p-3 text-xs">
                    <div className="flex items-center gap-2 font-bold text-blue-950 dark:text-blue-200">
                      <Award className="h-4 w-4 text-[#0b2945] dark:text-blue-400" />
                      Statutory Target Level: 70%
                    </div>
                    <span className="font-semibold text-blue-900 dark:text-blue-300">
                      {remainingToTarget > 0
                        ? `${remainingToTarget}% Gap Remaining`
                        : "Target Achieved ✓"}
                    </span>
                  </div>

                  {/* Fulfillment Track Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-[#A1A1AA]">
                      <span>Overall Competency Fulfillment Track</span>
                      <span className="text-[#0b2945] dark:text-blue-400">
                        Current Gap to Target: {remainingToTarget}% Remaining
                      </span>
                    </div>

                    <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-[#2A2A2E] overflow-hidden relative">
                      <div
                        className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-500"
                        style={{ width: `${Math.min(100, currentScore)}%` }}
                      />
                      {/* 70% threshold marker */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-black/60 dark:bg-white/60"
                        style={{ left: "70%" }}
                        title="70% Mandate"
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400 dark:text-[#71717A] font-mono">
                      <span>0%</span>
                      <span>{baselineScore}% Baseline</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">{currentScore}% Evaluated</span>
                      <span className="font-bold text-slate-700 dark:text-[#F5F5F5]">70% Mandate</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Karmayogi Rule 14 Callout */}
                  <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 dark:bg-[#111113] border border-slate-200 dark:border-[#2A2A2E] p-3 text-xs text-slate-600 dark:text-[#A1A1AA]">
                    <RefreshCw className="h-4 w-4 text-[#0b2945] dark:text-blue-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Your competency profile has been automatically updated across official MoSPI and State Directorate of Economics &amp; Statistics ({user.stateCode}) integrated servers pursuant to <strong>Karmayogi Rule 14</strong>.
                    </p>
                  </div>
                </div>

                {/* CARD 2: Competency Domain Breakdown */}
                <div className="rounded-2xl border border-slate-200 dark:border-[#2A2A2E] bg-white dark:bg-[#171719] p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#2A2A2E] pb-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#0f1f35] dark:text-[#F5F5F5]">
                      <LayoutGrid className="h-4 w-4 text-[#0b2945] dark:text-blue-400" />
                      Competency Domain Breakdown
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-[#71717A]">
                      Statutory Benchmark: 70%
                    </span>
                  </div>

                  <div className="space-y-4">
                    {competencies.map((comp) => {
                      const compDefItem = COMPETENCIES.find((c) => c.id === comp.competencyId);
                      const score = comp.score;

                      let badgeClass = "bg-slate-100 dark:bg-[#2A2A2E] text-slate-700 dark:text-[#A1A1AA]";
                      let barColor = "bg-slate-400 dark:bg-slate-600";

                      if (score >= 85) {
                        badgeClass = "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300";
                        barColor = "bg-emerald-600 dark:bg-emerald-500";
                      } else if (score >= 70) {
                        badgeClass = "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60";
                        barColor = "bg-emerald-600 dark:bg-emerald-500";
                      } else if (score >= 50) {
                        badgeClass = "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60";
                        barColor = "bg-amber-500 dark:bg-amber-400";
                      } else {
                        badgeClass = "bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-900/60";
                        barColor = "bg-red-500 dark:bg-red-400";
                      }

                      return (
                        <div key={comp.competencyId} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#0f1f35] dark:text-[#F5F5F5]">
                              {compDefItem?.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded px-2 py-0.5 text-[10px] font-bold ${badgeClass}`}
                              >
                                {comp.competencyId === targetCompId && uplift > 0
                                  ? `Benchmark Cleared • +${uplift}% Uplift`
                                  : comp.status}
                              </span>
                              <span className="font-mono font-black text-[#0f1f35] dark:text-[#F5F5F5] w-8 text-right">
                                {score}%
                              </span>
                            </div>
                          </div>

                          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-[#2A2A2E] overflow-hidden">
                            <div
                              className={`h-full ${barColor} transition-all duration-300`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column (5 cols): AI Pedagogical Evaluation */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl border border-slate-200 dark:border-[#2A2A2E] bg-white dark:bg-[#171719] p-6 shadow-xs space-y-5">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-[#2A2A2E] pb-3">
                    <Sparkles className="h-4 w-4 text-[#0b2945] dark:text-blue-400" />
                    <div>
                      <h3 className="text-sm font-bold text-[#0f1f35] dark:text-[#F5F5F5]">
                        AI Pedagogical Evaluation
                      </h3>
                      <p className="text-[10px] text-slate-500 dark:text-[#71717A]">
                        Diagnostics by Karmayogi Large Reasoning Engine
                      </p>
                    </div>
                  </div>

                  {/* 1. Core Strengths */}
                  <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-[#111113] p-4 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase text-emerald-900 dark:text-emerald-300 tracking-wider">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      Demonstrated Core Strengths
                    </div>
                    <p className="text-xs text-slate-700 dark:text-[#A1A1AA] leading-relaxed">
                      {feedback.strengths}
                    </p>
                  </div>

                  {/* 2. Remediation Targets */}
                  <div className="rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/40 dark:bg-[#111113] p-4 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-900 dark:text-amber-300 tracking-wider">
                      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      Remediation Targets
                    </div>
                    <p className="text-xs text-slate-700 dark:text-[#A1A1AA] leading-relaxed">
                      {feedback.areasToImprove}
                    </p>
                  </div>

                  {/* 3. Prescribed Action Pathway */}
                  <div className="rounded-xl border border-blue-200 dark:border-[#2A2A2E] bg-blue-50/50 dark:bg-[#111113] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase text-blue-950 dark:text-blue-200 tracking-wider">
                        <Award className="h-4 w-4 text-[#0b2945] dark:text-blue-400" />
                        Prescribed Action Pathway
                      </div>
                      <span className="rounded bg-[#0b2945] dark:bg-blue-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 uppercase">
                        Mandatory APAR
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#0f1f35] dark:text-[#F5F5F5]">
                        {feedback.prescribedModule}
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                        Curated 4-hour module bridging imputation routines and sampling bias corrections in administrative state censuses.
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-blue-200/60 dark:border-[#2A2A2E] pt-2 text-xs">
                      <span className="text-[11px] text-slate-500 dark:text-[#71717A] font-medium">
                        {feedback.prescribedDuration}
                      </span>
                      <Link
                        href="/learning"
                        className="inline-flex items-center gap-1 font-bold text-[#0b2945] dark:text-blue-400 hover:underline text-xs"
                      >
                        Enrol Instantly <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>

                  {/* 4. Cadre Assessment Dossier Footer Box */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-[#2A2A2E] bg-slate-50/70 dark:bg-[#111113] p-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-[#1D1D20] border border-slate-200 dark:border-[#2A2A2E] font-bold text-slate-700 dark:text-[#F5F5F5] text-xs">
                        {user.stateCode}
                      </div>
                      <div>
                        <div className="font-bold text-[#0f1f35] dark:text-[#F5F5F5]">
                          Cadre Assessment Dossier
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-[#71717A]">
                          Signed by Evaluation Node: {user.stateName}-04
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-[10px] font-medium text-slate-500 dark:text-[#71717A]">
                      {formatDeterministicDate(attempt.completedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-[#2A2A2E]">
              <div className="text-[11px] text-slate-500 dark:text-[#71717A]">
                ⓘ Simulated platform benchmark data for official competency demonstration purposes only.
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/competency"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-[#2A2A2E] bg-white dark:bg-[#1D1D20] px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-[#F5F5F5] hover:bg-slate-50 dark:hover:bg-[#2A2A2E]"
                >
                  <Award className="h-3.5 w-3.5 text-slate-500 dark:text-[#71717A]" />
                  View Full Competency Profile
                </Link>

                <Link
                  href="/learning"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b2945] hover:bg-[#081f35] dark:bg-blue-600 dark:hover:bg-blue-500 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors"
                >
                  Continue to Next Learning Module <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        );
      }}
    </AppShell>
  );
}
