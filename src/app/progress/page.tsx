"use client";

import React from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  ClipboardCheck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { UserDashboardData } from "@/types";
import { COMPETENCIES } from "@/lib/constants";

export default function ProgressPage() {
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

        return (
          <div className="space-y-8 text-[#0f1f35]">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#0b2945]">
                Cadre Progression &amp; Continuous Learning
              </div>
              <h1 className="mt-1 text-2xl font-extrabold text-[#0f1f35] sm:text-3xl">
                Learning Progress &amp; Analytics
              </h1>
              <p className="mt-0.5 text-xs text-slate-500">
                Official career progression transcripts and competency milestone timeline for {user.fullName}.
              </p>
            </div>

            {/* Top Overview Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                  <span>Overall Competency</span>
                  <Award className="h-4 w-4 text-[#0b2945]" />
                </div>
                <div className="mt-2 text-3xl font-extrabold text-[#0f1f35]">
                  {overallCompetency}%
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Target: 70% National Benchmark
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                  <span>iGOT Learning Completion</span>
                  <BookOpen className="h-4 w-4 text-purple-700" />
                </div>
                <div className="mt-2 text-3xl font-extrabold text-[#0f1f35]">
                  {learningProgressPercent}%
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {completedModulesCount} of {totalModulesCount} Modules Completed
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                  <span>Evaluations Completed</span>
                  <ClipboardCheck className="h-4 w-4 text-emerald-700" />
                </div>
                <div className="mt-2 text-3xl font-extrabold text-[#0f1f35]">
                  {assessmentsCount + quizzesCount}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {assessmentsCount} Diagnostic, {quizzesCount} AI Reassessments
                </p>
              </div>
            </div>

            {/* Current Competency Matrix Summary */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-[#0f1f35]">
                  Active Competency Breakdown
                </h2>
                <Link
                  href="/competency"
                  className="text-xs font-bold text-[#0b2945] hover:underline flex items-center gap-1"
                >
                  View Full Matrix <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {competencies.map((comp) => {
                  const compDef = COMPETENCIES.find((c) => c.id === comp.competencyId);
                  return (
                    <div
                      key={comp.competencyId}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center space-y-1"
                    >
                      <div className="text-xs font-bold text-slate-700 truncate">
                        {compDef?.name}
                      </div>
                      <div className="text-2xl font-black text-[#0b2945]">
                        {comp.score}%
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold">
                        {comp.status}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activity History Timeline */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-[#0f1f35]">
                Official Validation Activity History
              </h2>

              <div className="space-y-3 pt-2">
                {recentQuizAttempt && (
                  <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0f1f35]">
                          AI Assessment Submitted: {recentQuizAttempt.quizTitle}
                        </span>
                        <span className="font-mono text-emerald-800 font-bold">
                          {recentQuizAttempt.score}%
                        </span>
                      </div>
                      <p className="text-slate-500 mt-0.5">
                        Competency updated via Step 13 formula. Verified in official cadre pool.
                      </p>
                    </div>
                  </div>
                )}

                {recentAssessment && (
                  <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50/60 p-3.5">
                    <CheckCircle2 className="h-5 w-5 text-[#0b2945] shrink-0 mt-0.5" />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0f1f35]">
                          Initial Diagnostic Assessment Completed
                        </span>
                        <span className="font-mono text-[#0b2945] font-bold">
                          {recentAssessment.overallScore}%
                        </span>
                      </div>
                      <p className="text-slate-500 mt-0.5">
                        Baseline competency established across all 5 national statistical domains.
                      </p>
                    </div>
                  </div>
                )}

                {!recentAssessment && !recentQuizAttempt && (
                  <div className="text-center py-6 text-xs text-slate-500">
                    No assessments or quizzes completed yet. Start with the Initial Assessment.
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }}
    </AppShell>
  );
}
