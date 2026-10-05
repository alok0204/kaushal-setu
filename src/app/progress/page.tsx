"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  ClipboardCheck,
  CheckCircle2,
  ArrowRight,
  Download,
  RefreshCw,
  Building2,
  MapPin,
  Clock,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { UserDashboardData } from "@/types";
import { COMPETENCIES, TARGET_BENCHMARK, IGOT_RESOURCES } from "@/lib/constants";
import { getUserState } from "@/lib/store";
import { formatDeterministicDate } from "@/lib/utils";

export default function ProgressPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncToast(true);
      setTimeout(() => setSyncToast(false), 3000);
    }, 700);
  };

  return (
    <AppShell>
      {(data: UserDashboardData) => {
        const {
          user,
          overallCompetency,
          learningProgressPercent,
          completedModulesCount,
          totalModulesCount,
          assessmentsCount,
          quizzesCount,
          competencies,
          recentAssessment,
          recentQuizAttempt,
        } = data;

        const userState = getUserState(user.id);
        const quizHistory = userState.quizAttempts || [];
        const isEstablished = data.isEstablished;

        // Calculate hours logged dynamically
        let totalHours = 0;
        IGOT_RESOURCES.forEach((r) => {
          const prog = userState.learningProgress?.[r.id];
          if (prog?.status === "completed") {
            totalHours += r.durationHours;
          } else if (prog?.status === "in_progress") {
            totalHours += r.durationHours * 0.4;
          }
        });
        const hoursLogged = isEstablished
          ? Math.max(12.5, Math.round(totalHours * 10) / 10)
          : 0;
        const statutoryTargetHours = 40.0;
        const hoursPercent = Math.min(100, Math.round((hoursLogged / statutoryTargetHours) * 100));

        // Latest assessment title & score
        const latestTitle = recentQuizAttempt
          ? recentQuizAttempt.quizTitle
          : recentAssessment
          ? "Diagnostic Baseline"
          : "None";
        const latestScore = recentQuizAttempt
          ? `${recentQuizAttempt.score}%`
          : recentAssessment
          ? `${recentAssessment.overallScore}%`
          : "0%";

        // Baseline vs current overall
        const baselineOverall = isEstablished ? Math.max(30, overallCompetency - 8) : 0;
        const overallGrowth = overallCompetency - baselineOverall;

        // Officer initials
        const nameParts = user.fullName.split(" ");
        const initials =
          nameParts.length > 1
            ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
            : user.fullName.slice(0, 2).toUpperCase();

        return (
          <div className="space-y-6 text-[#0f1f35]" suppressHydrationWarning>
            {/* Breadcrumb & Header Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  SSS Cadre Evaluation Dossier • Karmayogi Learning Intelligence (KLI)
                </div>
                <h1 className="mt-1 text-2xl font-black text-[#0f1f35] sm:text-3xl">
                  Learning Progress &amp; Cadre Analytics
                </h1>
                <p className="mt-1 text-xs text-slate-500">
                  Track statutory competency growth, iGOT Karmayogi course completions, and proctored assessment history.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
                >
                  <Download className="h-3.5 w-3.5 text-slate-500" />
                  Export Official Cadre Transcript (PDF)
                </button>

                <button
                  type="button"
                  disabled={isSyncing}
                  onClick={handleSync}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0b2945] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#081f35] transition-colors disabled:opacity-60"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                  {isSyncing ? "Synchronizing..." : "Synchronize with iGOT Bharat"}
                </button>
              </div>
            </div>

            {/* Sync Toast */}
            {syncToast && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Synchronized successfully with iGOT Karmayogi portal! All training records verified.
              </div>
            )}

            {/* OFFICER PROFILE BANNER CARD */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Officer Avatar & Identity (5 cols) */}
                <div className="lg:col-span-5 flex items-center gap-4">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0b2945] text-white font-black text-lg shadow-xs">
                    {initials}
                    <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-base font-black text-[#0f1f35]">
                      <span>Shri {user.fullName}</span>
                      <CheckCircle2 className="h-4 w-4 text-blue-600 fill-blue-50" />
                    </div>
                    <div className="text-xs font-bold text-[#0b2945]">
                      {user.role} ({user.role === "Statistical Officer" ? "SSO" : "DA"})
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-500">
                      Subordinate Statistical Service (SSS) • Cadre ID: {user.cadreId}
                    </div>
                  </div>
                </div>

                {/* Cadre Deployment Info (4 cols) */}
                <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <Building2 className="h-3 w-3 text-slate-400" />
                    Cadre Deployment
                  </div>
                  <div className="text-xs font-bold text-[#0f1f35]">
                    Directorate of Economics &amp; Statistics (DES)
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Planning Department, Government of {user.stateName}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-0.5">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    State Directorate, State Capital Complex ({user.stateCode})
                  </div>
                </div>

                {/* Annual APAR Cycle (3 cols) */}
                <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Annual APAR Reporting Cycle
                  </div>
                  <div className="text-lg font-black text-[#0f1f35]">2024–2025</div>
                  <div className="text-[11px] text-slate-500">Q3 Evaluation Period (Oct–Dec)</div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      In Good Standing
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 KEY METRIC TILES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Overall Competency */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <span>Overall Competency</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#0b2945]">
                    <Award className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-black text-[#0f1f35]">
                    {overallCompetency}%
                  </div>
                  {overallGrowth > 0 && (
                    <span className="rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      +{overallGrowth}%
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>Baseline: {baselineScore(overallCompetency)}%</span>
                  <span className="font-semibold text-[#0b2945]">
                    Target: {TARGET_BENCHMARK}% {overallCompetency >= 70 ? "Cleared" : "Pending"}
                  </span>
                </div>
              </div>

              {/* 2. Learning Progress */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <span>Learning Progress</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#0b2945]">
                    <BookOpen className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-black text-[#0f1f35]">
                    {learningProgressPercent}%
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Statutory Modules</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>
                    {completedModulesCount} of {totalModulesCount} completed
                  </span>
                  <span className="font-semibold text-slate-700">
                    {totalModulesCount - completedModulesCount} Pending
                  </span>
                </div>
              </div>

              {/* 3. Assessments Completed */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <span>Assessments Completed</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#0b2945]">
                    <ClipboardCheck className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-black text-[#0f1f35]">
                    {assessmentsCount + quizzesCount}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Proctored &amp; Diagnostics</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 truncate">
                  <span className="truncate">Latest: {latestTitle.slice(0, 16)}...</span>
                  <span className="font-bold text-emerald-700">{latestScore}</span>
                </div>
              </div>

              {/* 4. Learning Effort */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <span>Learning Effort</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#0b2945]">
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-black text-[#0f1f35]">
                    {hoursLogged}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Hours</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>Target: {statutoryTargetHours}h statutory</span>
                  <span className="font-bold text-[#0b2945]">{hoursPercent}% logged</span>
                </div>
              </div>
            </div>

            {/* MIDDLE SECTION: Trajectory Over Time & Statutory Competency Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left (7 cols): Competency Trajectory Over Time */}
              <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-[#0f1f35]">
                      Competency Trajectory Over Time
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Statutory SSS Officer Capacity Benchmark • Calendar Year 2024
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold text-blue-900">
                    +{Math.max(16, overallGrowth + 16)}% Cumulative Growth
                  </span>
                </div>

                {/* SVG Area Line Chart */}
                <div className="relative rounded-xl bg-slate-50/70 p-4 border border-slate-100">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-2">
                    <span>PROFICIENCY SCORE (%)</span>
                    <span className="font-bold text-[#0b2945]">
                      MINISTRY BENCHMARK THRESHOLD: 70%
                    </span>
                  </div>

                  {/* SVG Canvas */}
                  <div className="h-44 w-full relative">
                    <svg className="h-full w-full" viewBox="0 0 500 160" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0b2945" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#0b2945" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* 70% benchmark line (y = 160 - 70*1.4 = 62) */}
                      <line
                        x1="0"
                        y1="62"
                        x2="500"
                        y2="62"
                        stroke="#0b2945"
                        strokeDasharray="4 4"
                        strokeWidth="1.5"
                        opacity="0.4"
                      />
                      <text x="440" y="58" fill="#0b2945" fontSize="9" fontWeight="bold">
                        70% Target
                      </text>

                      {/* Gradient Fill under path */}
                      <path
                        d="M 50 110 C 130 95, 170 85, 230 75 C 290 65, 340 50, 430 40 L 430 160 L 50 160 Z"
                        fill="url(#curveGradient)"
                      />

                      {/* Main Stroke Path */}
                      <path
                        d="M 50 110 C 130 95, 170 85, 230 75 C 290 65, 340 50, 430 40"
                        fill="none"
                        stroke="#0b2945"
                        strokeWidth="2.5"
                      />

                      {/* Data Points */}
                      <circle cx="50" cy="110" r="4" fill="#0b2945" />
                      <circle cx="170" cy="85" r="4" fill="#0b2945" />
                      <circle cx="290" cy="65" r="4" fill="#0b2945" />
                      <circle cx="430" cy="40" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                    </svg>
                  </div>

                  {/* Milestones row */}
                  <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-200/80 text-center">
                    <div>
                      <div className="text-[10px] text-slate-400">Jan 2024</div>
                      <div className="text-xs font-black text-slate-700">48%</div>
                      <div className="text-[9px] text-slate-500">Baseline Induction</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Apr 2024</div>
                      <div className="text-xs font-black text-slate-700">56%</div>
                      <div className="text-[9px] text-slate-500">NSSTA Foundation</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Jul 2024</div>
                      <div className="text-xs font-black text-slate-700">63%</div>
                      <div className="text-[9px] text-slate-500">Mid-Term Diagnostic</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Oct 2024</div>
                      <div className="text-xs font-black text-emerald-700">
                        {Math.max(72, overallCompetency)}%
                      </div>
                      <div className="text-[9px] text-emerald-800 font-bold">
                        {overallCompetency >= 70 ? "Target Cleared" : "In Progress"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statutory Clearance Callout */}
                <div className="flex items-start gap-3 rounded-xl bg-blue-50/60 border border-blue-200 p-3.5 text-xs text-slate-700">
                  <Award className="h-5 w-5 text-[#0b2945] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#0b2945]">
                      {overallCompetency >= 70
                        ? "Statutory Clearance Attained"
                        : "Statutory Remediation Track Active"}
                    </div>
                    <p className="mt-0.5 leading-relaxed text-slate-600">
                      Shri {user.fullName}{" "}
                      {overallCompetency >= 70
                        ? "has crossed the mandatory 70% threshold set forth under MoSPI Cadre Modernization Mandate 2024. Competency score qualified for Q3 administrative increment and advanced supervisory duties."
                        : "is currently progressing through personalized iGOT learning modules. Completing the prescribed assessments will unlock official cadre clearance."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right (5 cols): Statutory Competency Breakdown */}
              <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#0f1f35]">
                    <BarChart3 className="h-4 w-4 text-[#0b2945]" />
                    Statutory Competency Breakdown
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Benchmark: 70%
                  </span>
                </div>

                {/* 5 Competency progress bars */}
                <div className="space-y-4">
                  {competencies.map((comp) => {
                    const compDef = COMPETENCIES.find((c) => c.id === comp.competencyId);
                    const score = comp.score;
                    const diff = score - TARGET_BENCHMARK;

                    let label = `${score}%`;
                    let barBg = "bg-slate-300";

                    if (score >= 70) {
                      barBg = "bg-emerald-600";
                      label = diff > 0 ? `${score}% (+${diff}% Above Target)` : `${score}% Target Met`;
                    } else if (score >= 50) {
                      barBg = "bg-amber-500";
                      label = `${score}% Gap: ${diff}%`;
                    } else {
                      barBg = "bg-red-500";
                      label = `${score}% Priority Gap (${diff}%)`;
                    }

                    return (
                      <div key={comp.competencyId} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#0f1f35]">
                            {compDef?.name}
                          </span>
                          <span className="font-mono text-[11px] font-bold text-slate-600">
                            {label}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full ${barBg} transition-all duration-500`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] text-slate-500 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded bg-emerald-600" />
                    <span>≥70% Satisfied</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded bg-amber-500" />
                    <span>50-69% Moderate</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded bg-red-500" />
                    <span>&lt;50% Critical</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION: Recent Learning Resource Activity & Assessment History */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left (7 cols): Recent Learning Resource Activity */}
              <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#0f1f35]">
                      Recent Learning Resource Activity
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Synchronized with iGOT Karmayogi Bharat Platform
                    </p>
                  </div>
                  <Link
                    href="/learning"
                    className="text-xs font-bold text-[#0b2945] hover:underline flex items-center gap-1"
                  >
                    View All Courses <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                {/* 4 Course cards */}
                <div className="space-y-3">
                  {IGOT_RESOURCES.slice(0, 4).map((r, idx) => {
                    const prog = userState.learningProgress?.[r.id];
                    // default realistic progress states
                    const isComp = prog ? prog.status === "completed" : idx === 0 || idx === 2;
                    const isInProg = prog ? prog.status === "in_progress" : idx === 1;

                    return (
                      <div
                        key={r.id}
                        className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                              isComp
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : isInProg
                                ? "bg-blue-100 text-blue-900 border border-blue-200"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {isComp ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            ) : isInProg ? (
                              <Clock className="h-4 w-4 text-blue-700" />
                            ) : (
                              <BookOpen className="h-4 w-4 text-slate-500" />
                            )}
                          </div>

                          <div>
                            <div className="text-xs font-bold text-[#0f1f35]">
                              {r.title}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {r.provider} • {r.durationHours} Hours
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          {isComp ? (
                            <div>
                              <span className="rounded bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                                100% Completed
                              </span>
                              <div className="text-[10px] text-slate-400 mt-1">
                                Certificate Issued
                              </div>
                            </div>
                          ) : isInProg ? (
                            <div>
                              <span className="rounded bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-[10px] font-bold">
                                In Progress (40%)
                              </span>
                              <div className="text-[10px] text-slate-400 mt-1">
                                2.2 of {r.durationHours}h completed
                              </div>
                            </div>
                          ) : (
                            <div>
                              <span className="rounded bg-slate-200 text-slate-700 px-2 py-0.5 text-[10px] font-medium">
                                Recommended / Queued
                              </span>
                              <div className="text-[10px] text-slate-400 mt-1">
                                Enrolled • Not Started
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right (5 cols): Official Assessment History */}
              <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#0f1f35]">
                      Official Assessment History
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Authenticated proctored evaluation log
                    </p>
                  </div>
                  <ClipboardCheck className="h-4 w-4 text-[#0b2945]" />
                </div>

                {/* Assessment History list */}
                <div className="space-y-3">
                  {/* Latest Quiz Attempts if any */}
                  {quizHistory.length > 0 ? (
                    quizHistory.slice(0, 3).map((att) => (
                      <div
                        key={att.id}
                        className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-[#0f1f35]">
                            {att.quizTitle}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Conducted {formatDeterministicDate(att.completedAt)}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-mono font-black text-emerald-700">
                            {att.correctCount}/{att.totalQuestions} ({att.score}%)
                          </div>
                          <span className="rounded bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 text-[9px] font-bold">
                            Uplift Recorded
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-[#0f1f35]">
                            Statistical Methods &amp; Survey Sampling
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Conducted Oct 14, 2024
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono font-black text-emerald-700">
                            8/10 (80%)
                          </div>
                          <span className="rounded bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 text-[9px] font-bold">
                            Impact: +9% on Methods
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-[#0f1f35]">
                            National Accounts Standard Evaluation
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Conducted Sep 25, 2024
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono font-black text-emerald-700">
                            9/10 (90%)
                          </div>
                          <span className="rounded bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 text-[9px] font-bold">
                            Impact: +14% on Accounts
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-[#0f1f35]">
                            Preliminary Cadre Induction Diagnostic
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Conducted Jul 10, 2024
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono font-black text-slate-700">
                            5/10 (50%)
                          </div>
                          <span className="rounded bg-slate-200 text-slate-700 px-1.5 py-0.2 text-[9px] font-semibold">
                            Baseline Benchmark
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <Link
                  href="/assessment"
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  View Full Assessment Archive ({assessmentsCount + quizzesCount + 3} Historical Records){" "}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Official Record Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  Official record maintained under Rule 14 of the Central Statistical Cadre Guidelines. Digitally signed by MoSPI Karmayogi Cadre Node.
                </span>
              </div>
              <span className="font-mono text-slate-400 text-[10px]">
                Govt. of India • UI design demonstration
              </span>
            </div>
          </div>
        );
      }}
    </AppShell>
  );
}

function baselineScore(currentScore: number) {
  if (currentScore === 0) return 0;
  return Math.max(30, currentScore - 8);
}
