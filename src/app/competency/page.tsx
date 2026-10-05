"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
  BarChart2,
  Terminal,
  Cpu,
  Sigma,
  Download,
  BookOpen,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { UserDashboardData, CompetencyId } from "@/types";
import { COMPETENCIES, TARGET_BENCHMARK } from "@/lib/constants";

export default function CompetencyPage() {
  const [filter, setFilter] = useState<"all" | "strengths" | "developing" | "gaps">("all");

  const getCompIcon = (id: CompetencyId) => {
    switch (id) {
      case "data_analysis":
        return FileText;
      case "statistical_methods":
        return Sigma;
      case "data_visualization":
        return BarChart2;
      case "statistical_computing":
        return Terminal;
      case "ai_digital_skills":
        return Cpu;
      default:
        return Award;
    }
  };

  return (
    <AppShell>
      {(data: UserDashboardData) => {
        const {
          user,
          overallCompetency,
          competencies,
          priorityGap,
          recentAssessment,
          recentQuizAttempt,
          isEstablished,
        } = data;

        // Filter counts
        const strengthsList = competencies.filter((c) => c.score >= 70);
        const developingList = competencies.filter((c) => c.score >= 50 && c.score < 70);
        const gapsList = competencies.filter((c) => c.score < 50);

        let filteredCompetencies = competencies;
        if (filter === "strengths") filteredCompetencies = strengthsList;
        else if (filter === "developing") filteredCompetencies = developingList;
        else if (filter === "gaps") filteredCompetencies = gapsList;

        const priorityDef = COMPETENCIES.find((c) => c.id === priorityGap?.competencyId);

        return (
          <div className="space-y-8 text-[#0f1f35]">
            {/* Top Header & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#0b2945]">
                  National Framework • MoSPI Competency Matrix 2024
                </div>
                <h1 className="mt-1 text-2xl font-extrabold text-[#0f1f35] sm:text-3xl">
                  Competency Analysis
                </h1>
                <p className="mt-0.5 text-xs text-slate-500">
                  Understand your strengths, identify skill gaps, and focus your learning across national statistical frameworks.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/80 px-3 py-1.5 text-xs font-semibold text-blue-900 shadow-xs">
                  <ShieldCheck className="h-4 w-4 text-[#0b2945]" />
                  Cadre Accreditation: Tier II Authorized
                </span>
              </div>
            </div>

            {/* User Profile Summary & Overall Benchmark Banner */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
                {/* Officer Details */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0b2945] text-white font-bold text-xl shadow-xs">
                      {user.fullName.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-extrabold text-[#0f1f35]">
                          {user.fullName}
                        </h2>
                        <span className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-700">
                          ID: {user.cadreId}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#0b2945]">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        State &amp; Directorate
                      </div>
                      <div className="mt-1 font-bold text-[#0f1f35]">
                        {user.stateName} ({user.department})
                      </div>
                    </div>
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        Statutory Cadre Affiliation
                      </div>
                      <div className="mt-1 font-bold text-[#0f1f35]">
                        Ministry of Statistics &amp; Programme Implementation (MoSPI)
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-slate-500">
                    <span>Cycle Evaluation: <strong>2024-Q3</strong></span>
                    <span>•</span>
                    <span>Official Field Validation: <strong>Eligible</strong></span>
                  </div>
                </div>

                {/* Overall Benchmark Gauge Card */}
                <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-slate-50/70 p-5 text-center flex flex-col items-center justify-center">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Overall Competency Benchmark
                  </div>

                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-8 border-slate-200">
                    <div
                      className="absolute inset-0 rounded-full border-8 border-[#0b2945] transition-all duration-700"
                      style={{
                        clipPath: `polygon(0 0, 100% 0, 100% ${overallCompetency}%, 0 ${overallCompetency}%)`,
                      }}
                    />
                    <div className="text-center">
                      <div className="text-2xl font-black text-[#0f1f35]">
                        {overallCompetency}%
                      </div>
                      <div className="text-[9px] text-slate-500 uppercase font-bold">Aggregate</div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs">
                    <span className="font-bold text-slate-800">
                      Target: {TARGET_BENCHMARK}%
                    </span>
                    <p className="mt-1 text-[11px] text-slate-600">
                      {overallCompetency >= TARGET_BENCHMARK ? (
                        <span className="text-emerald-700 font-semibold">
                          ✓ Benchmark Exceeded (+{overallCompetency - TARGET_BENCHMARK}%)
                        </span>
                      ) : (
                        <span className="text-amber-700 font-semibold">
                          ⚠️ Benchmark Deficit ({overallCompetency - TARGET_BENCHMARK}%)
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Validated against National NSSO Cadre Standard
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section: Profiles (Left 8) + AI Insights (Right 4) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left Column (8 cols): Competency Profiles */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-[#0f1f35]">
                      Competency Profile
                    </h2>
                    <p className="text-xs text-slate-500">
                      National statistical core proficiencies mapped to statutory mandates
                    </p>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 text-xs">
                    <button
                      onClick={() => setFilter("all")}
                      className={`rounded px-2.5 py-1 font-semibold transition-colors ${
                        filter === "all"
                          ? "bg-white text-[#0f1f35] shadow-xs"
                          : "text-slate-500 hover:text-[#0f1f35]"
                      }`}
                    >
                      All (5)
                    </button>
                    <button
                      onClick={() => setFilter("strengths")}
                      className={`rounded px-2.5 py-1 font-semibold transition-colors ${
                        filter === "strengths"
                          ? "bg-white text-[#0f1f35] shadow-xs"
                          : "text-slate-500 hover:text-[#0f1f35]"
                      }`}
                    >
                      Strengths ({strengthsList.length})
                    </button>
                    <button
                      onClick={() => setFilter("developing")}
                      className={`rounded px-2.5 py-1 font-semibold transition-colors ${
                        filter === "developing"
                          ? "bg-white text-[#0f1f35] shadow-xs"
                          : "text-slate-500 hover:text-[#0f1f35]"
                      }`}
                    >
                      Developing ({developingList.length})
                    </button>
                    <button
                      onClick={() => setFilter("gaps")}
                      className={`rounded px-2.5 py-1 font-semibold transition-colors ${
                        filter === "gaps"
                          ? "bg-white text-[#0f1f35] shadow-xs"
                          : "text-slate-500 hover:text-[#0f1f35]"
                      }`}
                    >
                      Priority Gaps ({gapsList.length})
                    </button>
                  </div>
                </div>

                {/* Cards List */}
                <div className="space-y-4">
                  {filteredCompetencies.map((comp) => {
                    const compDef = COMPETENCIES.find((c) => c.id === comp.competencyId);
                    const Icon = getCompIcon(comp.competencyId);
                    const score = comp.score;
                    const delta = score - TARGET_BENCHMARK;
                    const isPriority = comp.competencyId === priorityGap?.competencyId;

                    return (
                      <div
                        key={comp.competencyId}
                        className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#0b2945]">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-[#0f1f35]">
                                  {compDef?.name}
                                </h3>
                                {isPriority && (
                                  <span className="rounded bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-bold text-red-700">
                                    Priority: High
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Mandate: {compDef?.mandate}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center sm:justify-end gap-2">
                              <span className="text-base font-extrabold text-[#0f1f35]">
                                {score}%
                              </span>
                              <span className="text-xs text-slate-400">/ 70%</span>
                              <span
                                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                                  delta >= 0
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                    : "bg-red-50 text-red-800 border-red-200"
                                }`}
                              >
                                {delta >= 0 ? `+${delta}% Above Target` : `${delta}% Gap`}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              Status: <strong>{comp.status}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar with 70% Marker */}
                        <div className="relative h-2.5 w-full rounded-full bg-slate-100">
                          <div
                            className="absolute top-[-3px] bottom-[-3px] w-0.5 border-l-2 border-dashed border-slate-400 z-10"
                            style={{ left: "70%" }}
                          />
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              score >= 70
                                ? "bg-emerald-600"
                                : score >= 50
                                ? "bg-[#2563eb]"
                                : "bg-red-600"
                            }`}
                            style={{ width: `${Math.min(100, score)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                          <span>National Threshold: 70%</span>
                          <span>Domain: {compDef?.domain}</span>
                        </div>

                        {delta < 0 && (
                          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-xs text-red-900 flex items-center justify-between">
                            <span className="flex items-center gap-1.5 font-medium">
                              <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                              Action Required: {Math.abs(delta)}% gap to state accreditation
                            </span>
                            <Link
                              href="/learning"
                              className="font-bold underline text-red-900 hover:text-red-950"
                            >
                              Take Course
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column (4 cols): AI Insights & Target Delta */}
              <div className="lg:col-span-4 space-y-6">
                {/* AI Competency Insights */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0b2945] flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#0b2945]" />
                      AI Competency Insights
                    </span>
                    <span className="rounded bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-900">
                      Karmayogi Engine
                    </span>
                  </div>

                  {priorityGap ? (
                    <div className="space-y-3">
                      <div className="rounded-lg bg-red-50 p-3 text-xs text-red-950 border border-red-200">
                        <div className="font-bold flex items-center gap-1 text-red-800">
                          <AlertTriangle className="h-4 w-4" />
                          Priority Gap: {priorityDef?.name}
                        </div>
                        <p className="mt-1 text-xs text-red-800 leading-relaxed">
                          Current proficiency ({priorityGap.score}%) is {priorityGap.gap} points below the departmental threshold (70%). Sampling variance and hypothesis testing are the primary areas pulling down this score.
                        </p>
                      </div>

                      <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-700 space-y-1">
                        <div className="text-[10px] font-bold uppercase text-slate-400">
                          Recommended Action
                        </div>
                        <p className="text-xs text-slate-600">
                          Complete foundational statistical analysis training on iGOT Karmayogi and reassess your competency to unlock official survey validation permissions.
                        </p>
                        <div className="text-[11px] text-slate-400 pt-1">
                          ⏱ Estimated learning effort: 14 hours
                        </div>
                      </div>

                      <Link
                        href="/learning"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b2945] py-3 text-xs font-bold text-white shadow-xs hover:bg-[#081f35] transition-colors"
                      >
                        <BookOpen className="h-4 w-4" />
                        View Recommended Learning
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-xs text-slate-500">
                      {isEstablished
                        ? "All competencies meet or exceed national thresholds."
                        : "Take the initial diagnostic assessment to generate AI insights."}
                    </div>
                  )}
                </div>

                {/* Competency Target Delta */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Competency Target Delta
                  </div>
                  <p className="text-xs text-slate-500">
                    Cadre compliance progression indicator
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        Current Score
                      </div>
                      <div className="text-xl font-extrabold text-[#0b2945]">
                        {priorityGap ? `${priorityGap.score}%` : `${overallCompetency}%`}
                      </div>
                    </div>
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        Statutory Target
                      </div>
                      <div className="text-xl font-extrabold text-[#0f1f35]">
                        70%
                      </div>
                    </div>
                  </div>

                  {priorityGap && (
                    <div className="text-center text-xs font-bold text-[#0b2945]">
                      Trajectory Requirement: +{priorityGap.gap}% needed
                    </div>
                  )}

                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900 flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Achieving 70% in {priorityDef?.name || "all areas"} unlocks Level-3 National Sample Survey (NSS) supervisor accreditation.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section: Competency History & Progression Milestones */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-[#0f1f35]">
                    Competency History &amp; Progression
                  </h2>
                  <p className="text-xs text-slate-500">
                    Chronological progression across assessment and learning milestones
                  </p>
                </div>
                <span className="text-xs text-slate-500">
                  Assessment Validity: <strong>Valid till Dec 2025</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Milestone 1 */}
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">Milestone 1</span>
                    <span className="font-extrabold text-[#0b2945]">
                      {recentAssessment ? `${recentAssessment.overallScore}%` : "Pending"}
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-[#0f1f35]">
                    Initial Assessment
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Diagnostic evaluation upon cadre induction.
                  </p>
                  <div className="mt-3 text-[10px] text-slate-400">
                    {recentAssessment
                      ? new Date(recentAssessment.completedAt).toLocaleDateString()
                      : "Not completed"}
                  </div>
                </div>

                {/* Milestone 2 */}
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">Milestone 2</span>
                    <span className="font-extrabold text-[#0b2945]">
                      {data.completedModulesCount > 0 ? "Completed" : "In Progress"}
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-[#0f1f35]">
                    Completed Module 1
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Advanced sampling designs &amp; NSS verification courseware.
                  </p>
                  <div className="mt-3 text-[10px] text-slate-400">
                    iGOT Karmayogi Sync
                  </div>
                </div>

                {/* Milestone 3 */}
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">Milestone 3</span>
                    <span className="font-extrabold text-emerald-700">
                      {recentQuizAttempt ? `${recentQuizAttempt.score}%` : "Pending"}
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-[#0f1f35]">
                    AI Reassessment
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Objective evaluation generated from uploaded materials.
                  </p>
                  <div className="mt-3 text-[10px] text-slate-400">
                    {recentQuizAttempt
                      ? new Date(recentQuizAttempt.completedAt).toLocaleDateString()
                      : "Awaiting Quiz Attempt"}
                  </div>
                </div>

                {/* Current Projection */}
                <div className="rounded-lg bg-[#0b2945] p-4 text-white">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                      Current Path
                    </span>
                    <span className="text-emerald-400 font-extrabold">{overallCompetency}%</span>
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-white">
                    Current Projection
                  </h4>
                  <p className="mt-1 text-xs text-slate-300">
                    Aggregated overall progression pace across all active modules.
                  </p>
                  <div className="mt-3 text-[10px] text-slate-400">
                    Target: 70% Statutory Benchmark
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  Reassessment Cycle: <strong>Quarterly Cadre Review</strong> • MoSPI Central Validation Database Synchronized
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => alert(`Transcript for ${user.fullName} (${user.cadreId}):\nOverall Competency: ${overallCompetency}%\nState: ${user.stateName}`)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#0f1f35] hover:bg-slate-50"
                  >
                    <Download className="h-3.5 w-3.5 text-slate-500" />
                    Download Competency Transcript (PDF)
                  </button>

                  <Link
                    href="/assessment"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0b2945] px-4 py-2 text-xs font-semibold text-white hover:bg-[#081f35] transition-colors"
                  >
                    Take Re-assessment
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </AppShell>
  );
}
