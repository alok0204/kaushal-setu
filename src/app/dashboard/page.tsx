"use client";

import React from "react";
import Link from "next/link";
import {
  Trophy,
  BookOpen,
  ClipboardCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { UserDashboardData } from "@/types";
import { COMPETENCIES } from "@/lib/constants";

export default function DashboardPage() {
  return (
    <AppShell>
      {(data: UserDashboardData) => {
        const {
          user,
          overallCompetency,
          assessmentsCount,
          learningProgressPercent,
          completedModulesCount,
          totalModulesCount,
          competencies,
          priorityGap,
          gapsCount,
          recentAssessment,
          recentQuizAttempt,
          recommendedResources,
          isEstablished,
        } = data;

        // Dynamic AI Insight text
        const sortedScores = [...competencies].sort((a, b) => b.score - a.score);
        const bestComp = sortedScores[0];
        const weakestComp = sortedScores[sortedScores.length - 1];

        const bestCompDef = COMPETENCIES.find((c) => c.id === bestComp?.competencyId);
        const weakestCompDef = COMPETENCIES.find((c) => c.id === weakestComp?.competencyId);

        return (
          <div className="space-y-8">
            {/* Top Directorate Banner */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                    National Statistical Systems Capacity Directorate
                  </div>
                  <h1 className="mt-1 text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                    Good morning, {user.fullName.split(" ")[0]}
                  </h1>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    Your personalized competency and learning overview benchmarked against MoSPI guidelines.
                  </p>
                </div>

                {/* Right Metadata Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 font-medium text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                    Role: <strong className="text-zinc-900 dark:text-zinc-100">{user.role}</strong>
                  </span>
                  <span className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 font-medium text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                    System: <strong>Official Statistical System</strong>
                  </span>
                  <span className="rounded-lg border border-blue-200 bg-blue-50/80 px-3 py-1.5 font-medium text-blue-800 shadow-sm dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300">
                    State: <strong>{user.stateName} ({user.stateCode})</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Zero State Alert Banner if not established */}
            {!isEstablished && (
              <div className="rounded-2xl border border-amber-300 bg-amber-50/90 p-6 shadow-sm dark:border-amber-800 dark:bg-amber-950/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-bold text-amber-900 dark:text-amber-200">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      Competency Profile: Not Established
                    </div>
                    <p className="text-xs text-amber-800/90 dark:text-amber-300">
                      Complete your initial assessment to identify your statistical competency gaps and unlock personalized iGOT learning recommendations.
                    </p>
                  </div>
                  <Link
                    href="/assessment"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-amber-700 transition-colors shrink-0"
                  >
                    Start Initial Assessment
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* 4 Metric Cards Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Card 1: Overall Competency */}
              <div className="rounded-xl border border-zinc-200/90 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Overall Competency
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    <Trophy className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                    {overallCompetency}%
                  </span>
                  {isEstablished ? (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        overallCompetency >= 70
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {overallCompetency >= 70
                        ? `+${overallCompetency - 70}% margin`
                        : `${overallCompetency - 70}% deficit`}
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-400 font-medium">pending</span>
                  )}
                </div>
                <div className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                  MoSPI Benchmark: <strong>70%</strong>
                </div>
              </div>

              {/* Card 2: Learning Progress */}
              <div className="rounded-xl border border-zinc-200/90 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Learning Progress
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                    <BookOpen className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                    {learningProgressPercent}%
                  </span>
                  <span className="text-xs text-zinc-500">
                    {completedModulesCount} of {totalModulesCount} modules
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${learningProgressPercent}%` }}
                  />
                </div>
              </div>

              {/* Card 3: Assessments */}
              <div className="rounded-xl border border-zinc-200/90 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Assessments
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    <ClipboardCheck className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                    {assessmentsCount}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {assessmentsCount > 0 ? "verified evaluations" : "none taken yet"}
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                  Cadre Status: <strong>{isEstablished ? "Evaluated Pool" : "Not Evaluated"}</strong>
                </div>
              </div>

              {/* Card 4: Competency Gaps */}
              <div className="rounded-xl border border-zinc-200/90 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Competency Gaps
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                    {isEstablished ? gapsCount : 0}
                  </span>
                  {priorityGap && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-950 dark:text-red-300">
                      1 high priority
                    </span>
                  )}
                </div>
                <div className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                  Target Closure: <strong>18 Days Remaining</strong>
                </div>
              </div>
            </div>

            {/* Main Middle Section: 2 Columns */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left Column (8 cols): Competency Overview */}
              <div className="lg:col-span-8 rounded-xl border border-zinc-200/90 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-4 dark:border-zinc-800">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      Competency Overview
                    </h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Benchmark comparison against Statistical Officer national standard (70% threshold)
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    <Layers className="h-3.5 w-3.5" /> All 5 Functional Domains
                  </span>
                </div>

                {/* Mandate Target Notice */}
                <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50/70 px-4 py-2.5 text-xs text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span>
                      National Mandate Target is locked at <strong>70% proficiency</strong> across State DES Cadres.
                    </span>
                  </div>
                  <span className="font-bold">Target = 70%</span>
                </div>

                {/* 5 Competency Bars */}
                <div className="space-y-5 pt-2">
                  {competencies.map((comp) => {
                    const compDef = COMPETENCIES.find((c) => c.id === comp.competencyId);
                    const score = comp.score;
                    const status = comp.status;

                    let barColor = "bg-emerald-500";
                    let badgeClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
                    if (score < 40) {
                      barColor = "bg-red-600";
                      badgeClass = "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300";
                    } else if (score < 50) {
                      barColor = "bg-amber-500";
                      badgeClass = "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
                    } else if (score < 70) {
                      barColor = "bg-blue-600";
                      badgeClass = "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
                    }

                    return (
                      <div key={comp.competencyId} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">
                              {compDef?.name}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${badgeClass}`}>
                              {status}
                            </span>
                          </div>
                          <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            {score}%
                          </span>
                        </div>

                        {/* Relative Bar with 70% Marker */}
                        <div className="relative h-3 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                          {/* 70% target dotted marker line */}
                          <div
                            className="absolute top-[-4px] bottom-[-4px] w-0.5 border-l-2 border-dashed border-zinc-500 z-10"
                            style={{ left: "70%" }}
                            title="70% National Benchmark"
                          />
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                            style={{ width: `${Math.min(100, score)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4 text-[11px] text-zinc-500 dark:border-zinc-800">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Strong (≥70%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-600" />
                      Developing (50–69%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      Needs Improvement (&lt;50%)
                    </span>
                  </div>
                  <span className="italic">
                    {isEstablished ? `Calculated from ${assessmentsCount} official assessment(s)` : "Awaiting initial assessment"}
                  </span>
                </div>
              </div>

              {/* Right Column (4 cols): Urgent Action & AI Diagnostics */}
              <div className="lg:col-span-4 space-y-6">
                {/* Urgent Action Card */}
                <div className="rounded-xl border border-zinc-200/90 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    <span>Urgent Action</span>
                    <span className="flex items-center gap-1 text-red-600">
                      <AlertTriangle className="h-3 w-3" /> Critical Action Needed
                    </span>
                  </div>

                  {priorityGap ? (
                    <div>
                      <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                        {COMPETENCIES.find((c) => c.id === priorityGap.competencyId)?.name}
                      </h3>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        Statutory calculations, sampling probability variance, and hypothesis validity testing deficit.
                      </p>

                      <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-zinc-50 p-3 text-center border border-zinc-100 dark:bg-zinc-800/50 dark:border-zinc-800">
                        <div>
                          <div className="text-[10px] text-zinc-400 uppercase font-semibold">Current</div>
                          <div className="text-sm font-extrabold text-red-600">{priorityGap.score}%</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-zinc-400 uppercase font-semibold">Standard</div>
                          <div className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">70%</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-zinc-400 uppercase font-semibold">Deficit</div>
                          <div className="text-sm font-extrabold text-red-600">-{priorityGap.gap}%</div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs">
                        <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          {priorityGap.status}
                        </span>
                        <span className="text-[11px] text-zinc-400">Target for promotion roster</span>
                      </div>

                      <Link
                        href="/competency"
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0c1829] py-2.5 text-xs font-semibold text-white hover:bg-black transition-colors"
                      >
                        View Competency Analysis
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-6 space-y-2">
                      <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                      <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        {isEstablished ? "No critical competency deficits!" : "No assessment submitted yet"}
                      </p>
                      <Link
                        href={isEstablished ? "/competency" : "/assessment"}
                        className="inline-block mt-2 text-xs font-bold text-blue-600 hover:underline"
                      >
                        {isEstablished ? "View Full Matrix" : "Take Initial Assessment"}
                      </Link>
                    </div>
                  )}
                </div>

                {/* iGOT AI Diagnostic Insight Card */}
                <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-300">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    iGOT AI DIAGNOSTIC INSIGHT
                  </div>

                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {isEstablished ? (
                      <>
                        Your strongest area is <strong>{bestCompDef?.name} ({bestComp?.score}%)</strong>.
                        {weakestComp && weakestComp.score < 70 ? (
                          <>
                            {" "}However, <strong>{weakestCompDef?.name} ({weakestComp?.score}%)</strong> requires focused learning to meet MoSPI department benchmarks.
                          </>
                        ) : (
                          " You have reached national proficiency across all core official statistical domains."
                        )}
                      </>
                    ) : (
                      "Your personalized AI insights will generate automatically once you complete the initial 10-question diagnostic assessment."
                    )}
                  </p>

                  <div className="pt-2 text-[10px] text-zinc-500 flex items-center gap-1.5 border-t border-blue-100 dark:border-blue-900/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Automated Cadre Review Active
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Recommended Learning (Official Curated) */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      Recommended Learning
                    </h2>
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300 uppercase">
                      Official Curated
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    High-impact certified pathways sourced directly from the iGOT Karmayogi Digital Repository
                  </p>
                </div>
                <Link
                  href="/learning"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  Explore All Cadre Modules <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {recommendedResources.map((res) => {
                  const comp = COMPETENCIES.find((c) => c.id === res.competencyId);
                  return (
                    <div
                      key={res.id}
                      className="rounded-xl border border-zinc-200/90 bg-white p-5 shadow-sm hover:shadow-md transition-shadow dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                            iGOT Karmayogi
                          </span>
                          {res.curatedTag && (
                            <span className="rounded bg-amber-50 px-2 py-0.5 text-amber-700 border border-amber-200/60 dark:bg-amber-950 dark:text-amber-300">
                              {res.curatedTag}
                            </span>
                          )}
                        </div>

                        <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                          {comp?.name}
                        </div>

                        <h3 className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                          {res.title}
                        </h3>

                        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                          {res.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
                          <span>{res.difficulty}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {res.durationHours} Hours
                          </span>
                        </div>

                        <Link
                          href="/learning"
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors dark:bg-blue-950/60 dark:text-blue-300"
                        >
                          View Learning <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Assessment Completed Banner */}
            {(recentAssessment || recentQuizAttempt) && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                          Recent Assessment Completed
                        </span>
                        <span className="rounded bg-emerald-200/80 px-2 py-0.5 text-xs font-extrabold text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100">
                          {recentQuizAttempt
                            ? `${recentQuizAttempt.score}%`
                            : `${recentAssessment?.overallScore}%`}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-900/80 dark:text-emerald-300/80 mt-0.5">
                        {recentQuizAttempt
                          ? `Topic: ${recentQuizAttempt.quizTitle}`
                          : "Topic: National Official Statistical System Comprehensive Diagnostic"}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/competency"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-900 shadow-sm border border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 shrink-0"
                  >
                    View Matrix &amp; Gaps <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        );
      }}
    </AppShell>
  );
}
