"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ExternalLink,
  Sparkles,
  Upload,
  ArrowRight,
  Clock,
  FileText,
  FileCheck,
  CheckCircle2,
  Check,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import {
  UserDashboardData,
  IGOTResourceItem,
  CompetencyId,
  GeneratedQuiz,
  QuizQuestionItem,
} from "@/types";
import { COMPETENCIES } from "@/lib/constants";
import { setResourceProgress, saveGeneratedQuiz } from "@/lib/store";
import { generateUniqueId } from "@/lib/utils";

interface ApiQuestionResponse {
  question: string;
  options: string[];
  correctAnswer?: number;
  explanation?: string;
  difficulty?: string;
}

export default function LearningPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customTitle, setCustomTitle] = useState<string>(
    "National Sample Survey Sampling Methodology Guide"
  );
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleToggleProgress = (
    userId: string,
    resourceId: string,
    currentStatus?: string
  ) => {
    const nextStatus = currentStatus === "completed" ? "in_progress" : "completed";
    setResourceProgress(userId, resourceId, nextStatus);
  };

  const handleGenerateQuiz = async (
    userId: string,
    targetCompId: CompetencyId
  ) => {
    setUploading(true);
    setUploadStatus("Synthesizing learning material and querying AI engine...");

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
        formData.append("title", selectedFile.name);
      } else {
        formData.append("title", customTitle);
        formData.append(
          "sampleText",
          `MoSPI Guidelines on ${targetCompId}: Stratified sampling, multiplier calculation, NSSO survey schedule scrutiny, and microdata imputation techniques.`
        );
      }
      formData.append("targetCompetency", targetCompId);

      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.questions) {
        setUploadStatus("Quiz generated successfully! Launching assessment...");
        const newQuiz: GeneratedQuiz = {
          id: generateUniqueId("quiz"),
          userId,
          title: data.title || "AI Evaluation: Statistical Competency",
          materialFilename: selectedFile ? selectedFile.name : `${customTitle}.pdf`,
          createdAt: new Date().toISOString(),
          totalQuestions: data.questions.length,
          targetCompetencyId: targetCompId,
          questions: data.questions.map(
            (q: ApiQuestionResponse, idx: number): QuizQuestionItem => ({
              id: `gq_${idx + 1}`,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer ?? 0,
              explanation: q.explanation || "Official statistical guideline standard.",
              competencyId: targetCompId,
              difficulty: q.difficulty || "Intermediate",
            })
          ),
        };

        saveGeneratedQuiz(userId, newQuiz);
        setTimeout(() => {
          router.push(`/quiz/${newQuiz.id}`);
        }, 600);
      } else {
        setUploadStatus("Failed to generate quiz. Please retry.");
        setUploading(false);
      }
    } catch {
      setUploadStatus("Error generating quiz. Please retry.");
      setUploading(false);
    }
  };

  return (
    <AppShell>
      {(data: UserDashboardData) => {
        const {
          user,
          learningProgressPercent,
          completedModulesCount,
          totalModulesCount,
          priorityGap,
          recommendedResources,
        } = data;

        const priorityDef =
          COMPETENCIES.find((c) => c.id === priorityGap?.competencyId) ||
          COMPETENCIES[1];

        const primaryCourse: IGOTResourceItem = recommendedResources[0] || {
          id: "res_sm_01",
          title: "Foundations of Statistical Data Analysis",
          competencyId: priorityDef.id,
          difficulty: "Intermediate",
          durationHours: 4.0,
          igotUrl: "https://igotkarmayogi.gov.in/",
          description:
            "Master variance calculations, stratification algorithms, and state-level sampling frameworks co-authored by NSSTA.",
          provider: "National Statistical Systems Training Academy (NSSTA)",
          courseCode: "KRM-MOSP-2024-ST1",
        };

        const secondaryCourse: IGOTResourceItem = recommendedResources[1] || {
          id: "res_sm_02",
          title: "Applied Statistical Methods & Survey Sampling",
          competencyId: priorityDef.id,
          difficulty: "Intermediate",
          durationHours: 5.5,
          igotUrl: "https://igotkarmayogi.gov.in/",
          description:
            "Builds on competency to prepare for complex state-level survey analytics and NSSO round calculations.",
          provider: "MoSPI Central Training Division",
          courseCode: "KRM-MOSP-2024-ST2",
        };

        return (
          <div className="space-y-8 text-[#0f1f35] dark:text-[#F5F5F5]" suppressHydrationWarning>
            {/* Top Breadcrumb & Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#0b2945] dark:text-blue-400">
                  iGOT Karmayogi Platform Integration • SS Ref: {user.cadreId}
                </div>
                <h1 className="mt-1 text-2xl font-extrabold text-[#0f1f35] dark:text-[#F5F5F5] sm:text-3xl">
                  Personalized Learning
                </h1>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-[#A1A1AA]">
                  Learning recommendations dynamically matched to your competency profile and administrative role.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-white dark:bg-[#171719] border border-slate-200 dark:border-[#2A2A2E] px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-[#A1A1AA] shadow-xs">
                  Synced with DoPT Karmayogi: <strong>12 Mins Ago</strong>
                </span>
              </div>
            </div>

            {/* Dynamic Hero Box: Learning Path Generated for You */}
            <div className="rounded-2xl border border-blue-200 dark:border-[#2A2A2E] bg-blue-50/70 dark:bg-[#171719] p-6 shadow-xs">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0b2945] dark:text-blue-400 uppercase tracking-wide">
                    <span className="h-2 w-2 rounded-full bg-[#0b2945] dark:bg-blue-400" />
                    Learning Path Generated for You
                  </div>

                  <p className="text-xs text-slate-700 dark:text-[#A1A1AA] max-w-2xl leading-relaxed">
                    Synthesized by the Karmayogi Competency Engine following your diagnostic assessment. Curated to close prioritized domain performance gaps in official statistical standards.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="rounded-lg bg-white dark:bg-[#1D1D20] px-2.5 py-1 font-semibold text-slate-800 dark:text-[#F5F5F5] shadow-xs border border-slate-200 dark:border-[#2A2A2E]">
                      Role: {user.role}
                    </span>
                    <span className="rounded-lg bg-white dark:bg-[#1D1D20] px-2.5 py-1 font-semibold text-slate-800 dark:text-[#F5F5F5] shadow-xs border border-slate-200 dark:border-[#2A2A2E]">
                      State: {user.stateName}
                    </span>
                    <span className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 px-2.5 py-1 font-bold text-red-800 dark:text-red-300">
                      Priority Gap: {priorityDef.name} ({priorityGap ? `Target: +${priorityGap.gap}%` : "Benchmark: 70%"})
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0b2945] dark:text-blue-400">
                      <Sparkles className="h-3.5 w-3.5" /> AI Recommendation Engine v2.4 Active
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-white dark:bg-[#1D1D20] p-4 text-center border border-slate-200 dark:border-[#2A2A2E] shadow-xs shrink-0 min-w-[200px]">
                  <div className="text-[10px] font-bold uppercase text-slate-400 dark:text-[#71717A]">
                    Mandatory Cycle Deadline
                  </div>
                  <div className="mt-1 text-lg font-black text-[#0f1f35] dark:text-[#F5F5F5]">
                    31 Dec 2024
                  </div>
                  <div className="text-xs font-semibold text-red-600 dark:text-red-400 mt-0.5">
                    42 Days Remaining
                  </div>
                </div>
              </div>
            </div>

            {/* Structured 3-Step Learning Path */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#0f1f35] dark:text-[#F5F5F5]">
                  Structured 3-Step Learning Path
                </h2>
                <span className="text-xs text-slate-400 dark:text-[#71717A]">
                  Sequenced by Prerequisite Weight
                </span>
              </div>

              {/* Step 1: Foundational Course */}
              <div className="rounded-xl border border-slate-200 dark:border-[#2A2A2E] bg-white dark:bg-[#171719] p-6 shadow-xs space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0b2945] dark:bg-blue-600 text-white font-bold text-sm">
                    1
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 px-2 py-0.5 font-bold text-[#0b2945] dark:text-blue-300">
                          STEP 1 OF 3 • IN PROGRESS
                        </span>
                        <span className="text-slate-600 dark:text-[#A1A1AA] font-medium">✨ Recommended by AI</span>
                        <span className="text-slate-400 dark:text-[#71717A]">• Source: iGOT Karmayogi</span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-[#A1A1AA] font-medium">
                        Started (2 of 5 modules completed)
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#0f1f35] dark:text-[#F5F5F5]">
                      {primaryCourse.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                      Recommended to address your {priorityDef.name} competency gap identified in recent assessment. Co-authored by {primaryCourse.provider}.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-[#A1A1AA] pt-1">
                      <span>Level: <strong>{primaryCourse.difficulty}</strong></span>
                      <span>Duration: <strong>{primaryCourse.durationHours} Hours</strong></span>
                      <span>Units: <strong>5 Modules</strong></span>
                      <span>Language: <strong>English &amp; Hindi</strong></span>
                    </div>

                    {/* Completion bar */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#A1A1AA] mb-1">
                        <span>Course Completion Status</span>
                        <span className="font-bold text-[#0f1f35] dark:text-[#F5F5F5]">
                          {completedModulesCount > 0 ? "100% Complete" : "40% Complete"}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-[#2A2A2E]">
                        <div
                          className="h-full rounded-full bg-[#0b2945] dark:bg-blue-600 transition-all duration-500"
                          style={{ width: completedModulesCount > 0 ? "100%" : "40%" }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-[#2A2A2E]">
                      <span className="font-mono text-xs text-slate-400 dark:text-[#71717A]">
                        Course ID: {primaryCourse.courseCode}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleToggleProgress(
                              user.id,
                              primaryCourse.id,
                              completedModulesCount > 0 ? "completed" : "in_progress"
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#2A2A2E] bg-slate-50 dark:bg-[#1D1D20] px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-[#F5F5F5] hover:bg-slate-100 dark:hover:bg-[#2A2A2E]"
                        >
                          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          {completedModulesCount > 0 ? "Completed ✓" : "Mark Learning Complete"}
                        </button>
                        <a
                          href={primaryCourse.igotUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0b2945] hover:bg-[#081f35] dark:bg-blue-600 dark:hover:bg-blue-500 px-4 py-1.5 text-xs font-bold text-white transition-colors"
                        >
                          Open in iGOT <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Applied Course */}
              <div className="rounded-xl border border-slate-200 dark:border-[#2A2A2E] bg-white dark:bg-[#171719] p-6 shadow-xs space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-[#2A2A2E] text-slate-700 dark:text-[#A1A1AA] font-bold text-sm">
                    2
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded bg-slate-100 dark:bg-[#1D1D20] border border-slate-200 dark:border-[#2A2A2E] px-2 py-0.5 font-bold text-slate-700 dark:text-[#A1A1AA]">
                          STEP 2 OF 3 • NEXT
                        </span>
                        <span className="text-slate-400 dark:text-[#71717A]">• Source: iGOT Karmayogi</span>
                        <span className="text-slate-400 dark:text-[#71717A]">• Prerequisite: Step 1</span>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-[#71717A]">Queued for activation</span>
                    </div>

                    <h3 className="text-base font-bold text-[#0f1f35] dark:text-[#F5F5F5]">
                      {secondaryCourse.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                      {secondaryCourse.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-[#A1A1AA] pt-1">
                      <span>Level: <strong>{secondaryCourse.difficulty}</strong></span>
                      <span>Duration: <strong>{secondaryCourse.durationHours} Hours</strong></span>
                      <span>Units: <strong>8 Modules</strong></span>
                      <span>Accredited: <strong>{secondaryCourse.provider}</strong></span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-[#2A2A2E]">
                      <span className="font-mono text-xs text-slate-400 dark:text-[#71717A]">
                        Course ID: {secondaryCourse.courseCode}
                      </span>
                      <a
                        href={secondaryCourse.igotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#2A2A2E] bg-white dark:bg-[#1D1D20] px-4 py-1.5 text-xs font-semibold text-slate-800 dark:text-[#F5F5F5] hover:bg-slate-50 dark:hover:bg-[#2A2A2E]"
                      >
                        Open in iGOT <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Milestone Evaluation & AI Quiz Generation from Uploaded Material */}
              <div className="rounded-xl border border-slate-200 dark:border-[#2A2A2E] bg-white dark:bg-[#171719] p-6 shadow-xs space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0b2945] dark:bg-blue-600 text-white font-bold text-sm">
                    3
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 px-2 py-0.5 font-bold text-[#0b2945] dark:text-blue-300">
                          STEP 3 OF 3 • MILESTONE EVALUATION
                        </span>
                        <span className="text-[#0b2945] dark:text-blue-400 font-semibold">📍 Accreditation Gateway</span>
                      </div>
                      <span className="text-xs text-[#0b2945] dark:text-blue-400 font-bold flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" /> Dynamic AI Test Generator Ready
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#0f1f35] dark:text-[#F5F5F5]">
                        AI Assessment: {priorityDef.name} Certification
                      </h3>
                      <p className="mt-1 text-xs text-slate-600 dark:text-[#A1A1AA] leading-relaxed">
                        Test your understanding using high-fidelity questions generated dynamically from your completed iGOT learning material. Validates competency uplift from your previous score toward the 70% threshold.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="rounded-lg bg-slate-50 dark:bg-[#111113] p-3 border border-slate-200 dark:border-[#2A2A2E]">
                        <div className="text-[10px] text-slate-400 dark:text-[#71717A] uppercase font-bold">Question Pool</div>
                        <div className="text-sm font-bold text-[#0f1f35] dark:text-[#F5F5F5]">10 Adaptive Items</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 dark:bg-[#111113] p-3 border border-slate-200 dark:border-[#2A2A2E]">
                        <div className="text-[10px] text-slate-400 dark:text-[#71717A] uppercase font-bold">Duration</div>
                        <div className="text-sm font-bold text-[#0f1f35] dark:text-[#F5F5F5]">15 Minutes</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 dark:bg-[#111113] p-3 border border-slate-200 dark:border-[#2A2A2E]">
                        <div className="text-[10px] text-slate-400 dark:text-[#71717A] uppercase font-bold">Benchmark Goal</div>
                        <div className="text-sm font-bold text-[#0b2945] dark:text-blue-400">70% Minimum Pass</div>
                      </div>
                    </div>

                    {/* Upload Learning Material Box */}
                    <div className="rounded-xl border border-dashed border-slate-300 dark:border-[#2A2A2E] bg-slate-50/50 dark:bg-[#111113] p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#0f1f35] dark:text-[#F5F5F5]">
                          <Upload className="h-4 w-4 text-[#0b2945] dark:text-blue-400" />
                          Upload Material or Select Training Guide
                        </div>
                        <span className="text-[11px] text-slate-400 dark:text-[#71717A]">PDF, TXT, or Curriculum Guide</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setCustomTitle("National Sample Survey Sampling Methodology Guide");
                          }}
                          className={`flex items-start gap-3 rounded-lg p-3 text-left border transition-all text-xs ${
                            !selectedFile
                              ? "border-[#0b2945] dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 font-semibold"
                              : "border-slate-200 dark:border-[#2A2A2E] bg-white dark:bg-[#1D1D20] hover:bg-slate-50 dark:hover:bg-[#2A2A2E] text-slate-700 dark:text-[#A1A1AA]"
                          }`}
                        >
                          <FileText className="h-5 w-5 text-[#0b2945] dark:text-blue-400 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold">NSSO Sampling Manual 2024</div>
                            <div className="text-[11px] text-slate-500 dark:text-[#71717A] font-normal">
                              Official stratified survey &amp; multiplier protocols
                            </div>
                          </div>
                        </button>

                        <label className={`flex items-center justify-center gap-2 rounded-lg p-3 border border-slate-200 dark:border-[#2A2A2E] bg-white dark:bg-[#1D1D20] hover:bg-slate-50 dark:hover:bg-[#2A2A2E] cursor-pointer text-xs text-slate-700 dark:text-[#A1A1AA] transition-colors ${selectedFile ? "border-[#0b2945] dark:border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 font-semibold" : ""}`}>
                          <Upload className="h-4 w-4 text-slate-500 dark:text-[#71717A]" />
                          <span>
                            {selectedFile ? selectedFile.name : "Upload Custom Material (PDF)"}
                          </span>
                          <input
                            type="file"
                            accept=".pdf,.txt,.doc"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setSelectedFile(e.target.files[0]);
                                setCustomTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ""));
                              }
                            }}
                          />
                        </label>
                      </div>

                      {uploadStatus && (
                        <p className="text-xs font-semibold text-[#0b2945] dark:text-blue-400 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-[#0b2945] dark:bg-blue-400" />
                          {uploadStatus}
                        </p>
                      )}

                      <button
                        onClick={() => handleGenerateQuiz(user.id, priorityDef.id)}
                        disabled={uploading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b2945] hover:bg-[#081f35] dark:bg-blue-600 dark:hover:bg-blue-500 py-3 text-xs font-bold text-white shadow-xs transition-colors disabled:opacity-50"
                      >
                        <Sparkles className="h-4 w-4" />
                        {uploading ? "Analyzing Material & Generating MCQs..." : "Generate AI Assessment & Start Quiz"}
                        <ArrowRight className="h-4 w-4" />
                      </button>

                      <Link
                        href="/ai-generator"
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-[#2A2A2E] bg-white dark:bg-[#1D1D20] py-2.5 text-xs font-semibold text-slate-700 dark:text-[#F5F5F5] hover:bg-slate-50 dark:hover:bg-[#2A2A2E] transition-colors"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-[#0b2945] dark:text-blue-400" />
                        Open AI Assessment Generator Studio
                      </Link>
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-[#A1A1AA] flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                      Passing automatically updates your Official Statistical System competency score.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lower Section: Why Recommendations & Progress Stats */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left Column (6 cols): Why these recommendations? */}
              <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-[#2A2A2E] bg-white dark:bg-[#171719] p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#0f1f35] dark:text-[#F5F5F5]">
                  <FileCheck className="h-4 w-4 text-[#0b2945] dark:text-blue-400" />
                  Why these recommendations?
                </div>

                <div className="space-y-3 pt-1">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-[#0f1f35] dark:text-[#F5F5F5]">
                        Based on your competency gaps
                      </div>
                      <p className="text-xs text-slate-500 dark:text-[#A1A1AA] mt-0.5">
                        Directly targets {priorityDef.name} ({priorityGap ? `-${priorityGap.gap}% deficit` : "target 70%"}) identified during statewide diagnostic review.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-[#0f1f35] dark:text-[#F5F5F5]">
                        Matched to your role
                      </div>
                      <p className="text-xs text-slate-500 dark:text-[#A1A1AA] mt-0.5">
                        Aligned with official National Statistical Commission (NSC) competency guidelines for {user.role}s in State DES cadres.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-[#0f1f35] dark:text-[#F5F5F5]">
                        Designed to improve measurable proficiency
                      </div>
                      <p className="text-xs text-slate-500 dark:text-[#A1A1AA] mt-0.5">
                        Structured to convert course completion into measurable competency score gains upon automated post-assessment validation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#2A2A2E] text-[11px] text-slate-400 dark:text-[#71717A]">
                  <span>Framework: FRAC v3.0 (iGOT)</span>
                  <span>Regulatory Verified</span>
                </div>
              </div>

              {/* Right Column (6 cols): Your Learning Progress */}
              <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-[#2A2A2E] bg-white dark:bg-[#171719] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#0f1f35] dark:text-[#F5F5F5]">
                    <Clock className="h-4 w-4 text-[#0b2945] dark:text-blue-400" />
                    Your Learning Progress
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-[#71717A] font-mono">Cycle 2024–2025</span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-3xl font-extrabold text-[#0f1f35] dark:text-[#F5F5F5]">
                      {learningProgressPercent}%
                    </span>
                    <span className="ml-2 text-xs text-slate-500 dark:text-[#A1A1AA] font-medium">Overall Completion</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-[#A1A1AA]">
                    {completedModulesCount} of {totalModulesCount} learning activities completed
                  </span>
                </div>

                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-[#2A2A2E]">
                  <div
                    className="h-full rounded-full bg-[#0b2945] dark:bg-blue-600 transition-all duration-500"
                    style={{ width: `${learningProgressPercent}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="rounded-lg bg-slate-50 dark:bg-[#111113] border border-slate-200 dark:border-[#2A2A2E] p-2.5">
                    <div className="text-[10px] text-slate-400 dark:text-[#71717A] uppercase font-semibold">Hours Learned</div>
                    <div className="text-base font-extrabold text-[#0f1f35] dark:text-[#F5F5F5]">
                      {completedModulesCount * 4 + 2.5}
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-[#111113] border border-slate-200 dark:border-[#2A2A2E] p-2.5">
                    <div className="text-[10px] text-slate-400 dark:text-[#71717A] uppercase font-semibold">Assessments</div>
                    <div className="text-base font-extrabold text-[#0f1f35] dark:text-[#F5F5F5]">
                      {data.assessmentsCount + data.quizzesCount}
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-[#111113] border border-slate-200 dark:border-[#2A2A2E] p-2.5">
                    <div className="text-[10px] text-slate-400 dark:text-[#71717A] uppercase font-semibold">Certificates</div>
                    <div className="text-base font-extrabold text-[#0f1f35] dark:text-[#F5F5F5]">
                      {completedModulesCount}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 p-2.5 text-xs text-blue-950 dark:text-blue-200 flex items-center justify-between">
                  <span>Recent milestone: Survey Methodology Fundamentals</span>
                  <strong className="text-emerald-700 dark:text-emerald-400">88% score</strong>
                </div>
              </div>
            </div>

            {/* Bottom Cohort Bar */}
            <div className="rounded-xl border border-slate-200 dark:border-[#2A2A2E] bg-white dark:bg-[#171719] p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-[#0f1f35] dark:text-[#F5F5F5]">
                  Statistical Cadre Cohort: {user.stateName} Sub-Division
                </span>
                <p className="text-slate-500 dark:text-[#A1A1AA] text-[11px] mt-0.5">
                  42 Statistical Officers currently enrolled in this pathway. Average milestone completion rate is 71%.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    alert(`Cohort benchmark for ${user.stateName}: 71% average completion.`)
                  }
                  className="rounded-lg border border-slate-200 dark:border-[#2A2A2E] bg-white dark:bg-[#1D1D20] px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-[#A1A1AA] hover:bg-slate-50 dark:hover:bg-[#2A2A2E]"
                >
                  Cohort Benchmarks
                </button>
              </div>
            </div>
          </div>
        );
      }}
    </AppShell>
  );
}
