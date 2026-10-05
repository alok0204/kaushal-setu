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
          <div className="space-y-8 text-[#0f1f35]">
            {/* Top Breadcrumb & Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#0b2945]">
                  iGOT Karmayogi Platform Integration • SS Ref: {user.cadreId}
                </div>
                <h1 className="mt-1 text-2xl font-extrabold text-[#0f1f35] sm:text-3xl">
                  Personalized Learning
                </h1>
                <p className="mt-0.5 text-xs text-slate-500">
                  Learning recommendations dynamically matched to your competency profile and administrative role.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs">
                  Synced with DoPT Karmayogi: <strong>12 Mins Ago</strong>
                </span>
              </div>
            </div>

            {/* Dynamic Hero Box: Learning Path Generated for You */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-6 shadow-xs">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0b2945] uppercase tracking-wide">
                    <span className="h-2 w-2 rounded-full bg-[#0b2945]" />
                    Learning Path Generated for You
                  </div>

                  <p className="text-xs text-slate-700 max-w-2xl leading-relaxed">
                    Synthesized by the Karmayogi Competency Engine following your diagnostic assessment. Curated to close prioritized domain performance gaps in official statistical standards.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="rounded-lg bg-white px-2.5 py-1 font-semibold text-slate-800 shadow-xs border border-slate-200">
                      Role: {user.role}
                    </span>
                    <span className="rounded-lg bg-white px-2.5 py-1 font-semibold text-slate-800 shadow-xs border border-slate-200">
                      State: {user.stateName}
                    </span>
                    <span className="rounded-lg bg-red-50 border border-red-200 px-2.5 py-1 font-bold text-red-800">
                      Priority Gap: {priorityDef.name} ({priorityGap ? `Target: +${priorityGap.gap}%` : "Benchmark: 70%"})
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0b2945]">
                      <Sparkles className="h-3.5 w-3.5" /> AI Recommendation Engine v2.4 Active
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-white p-4 text-center border border-slate-200 shadow-xs shrink-0 min-w-[200px]">
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    Mandatory Cycle Deadline
                  </div>
                  <div className="mt-1 text-lg font-black text-[#0f1f35]">
                    31 Dec 2024
                  </div>
                  <div className="text-xs font-semibold text-red-600 mt-0.5">
                    42 Days Remaining
                  </div>
                </div>
              </div>
            </div>

            {/* Structured 3-Step Learning Path */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#0f1f35]">
                  Structured 3-Step Learning Path
                </h2>
                <span className="text-xs text-slate-400">
                  Sequenced by Prerequisite Weight
                </span>
              </div>

              {/* Step 1: Foundational Course */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0b2945] text-white font-bold text-sm">
                    1
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded bg-blue-50 border border-blue-200 px-2 py-0.5 font-bold text-[#0b2945]">
                          STEP 1 OF 3 • IN PROGRESS
                        </span>
                        <span className="text-slate-600 font-medium">✨ Recommended by AI</span>
                        <span className="text-slate-400">• Source: iGOT Karmayogi</span>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        Started (2 of 5 modules completed)
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#0f1f35]">
                      {primaryCourse.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Recommended to address your {priorityDef.name} competency gap identified in recent assessment. Co-authored by {primaryCourse.provider}.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span>Level: <strong>{primaryCourse.difficulty}</strong></span>
                      <span>Duration: <strong>{primaryCourse.durationHours} Hours</strong></span>
                      <span>Units: <strong>5 Modules</strong></span>
                      <span>Language: <strong>English &amp; Hindi</strong></span>
                    </div>

                    {/* Completion bar */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>Course Completion Status</span>
                        <span className="font-bold text-[#0f1f35]">
                          {completedModulesCount > 0 ? "100% Complete" : "40% Complete"}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[#0b2945] transition-all duration-500"
                          style={{ width: completedModulesCount > 0 ? "100%" : "40%" }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <span className="font-mono text-xs text-slate-400">
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
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100"
                        >
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          {completedModulesCount > 0 ? "Completed ✓" : "Mark Learning Complete"}
                        </button>
                        <a
                          href={primaryCourse.igotUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0b2945] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#081f35] transition-colors"
                        >
                          Open in iGOT <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Applied Course */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 font-bold text-sm">
                    2
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 font-bold text-slate-700">
                          STEP 2 OF 3 • NEXT
                        </span>
                        <span className="text-slate-400">• Source: iGOT Karmayogi</span>
                        <span className="text-slate-400">• Prerequisite: Step 1</span>
                      </div>
                      <span className="text-xs text-slate-400">Queued for activation</span>
                    </div>

                    <h3 className="text-base font-bold text-[#0f1f35]">
                      {secondaryCourse.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {secondaryCourse.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span>Level: <strong>{secondaryCourse.difficulty}</strong></span>
                      <span>Duration: <strong>{secondaryCourse.durationHours} Hours</strong></span>
                      <span>Units: <strong>8 Modules</strong></span>
                      <span>Accredited: <strong>{secondaryCourse.provider}</strong></span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <span className="font-mono text-xs text-slate-400">
                        Course ID: {secondaryCourse.courseCode}
                      </span>
                      <a
                        href={secondaryCourse.igotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        Open in iGOT <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Milestone Evaluation & AI Quiz Generation from Uploaded Material */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0b2945] text-white font-bold text-sm">
                    3
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded bg-blue-50 border border-blue-200 px-2 py-0.5 font-bold text-[#0b2945]">
                          STEP 3 OF 3 • MILESTONE EVALUATION
                        </span>
                        <span className="text-[#0b2945] font-semibold">📍 Accreditation Gateway</span>
                      </div>
                      <span className="text-xs text-[#0b2945] font-bold flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" /> Dynamic AI Test Generator Ready
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#0f1f35]">
                        AI Assessment: {priorityDef.name} Certification
                      </h3>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                        Test your understanding using high-fidelity questions generated dynamically from your completed iGOT learning material. Validates competency uplift from your previous score toward the 70% threshold.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Question Pool</div>
                        <div className="text-sm font-bold text-[#0f1f35]">10 Adaptive Items</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Duration</div>
                        <div className="text-sm font-bold text-[#0f1f35]">15 Minutes</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Benchmark Goal</div>
                        <div className="text-sm font-bold text-[#0b2945]">70% Minimum Pass</div>
                      </div>
                    </div>

                    {/* Upload Learning Material Box */}
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#0f1f35]">
                          <Upload className="h-4 w-4 text-[#0b2945]" />
                          Upload Material or Select Training Guide
                        </div>
                        <span className="text-[11px] text-slate-400">PDF, TXT, or Curriculum Guide</span>
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
                              ? "border-[#0b2945] bg-blue-50/70 text-blue-950 font-semibold"
                              : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <FileText className="h-5 w-5 text-[#0b2945] shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold">NSSO Sampling Manual 2024</div>
                            <div className="text-[11px] text-slate-500 font-normal">
                              Official stratified survey &amp; multiplier protocols
                            </div>
                          </div>
                        </button>

                        <label className={`flex items-center justify-center gap-2 rounded-lg p-3 border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-xs text-slate-700 transition-colors ${selectedFile ? "border-[#0b2945] bg-blue-50 text-blue-950 font-semibold" : ""}`}>
                          <Upload className="h-4 w-4 text-slate-500" />
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
                        <p className="text-xs font-semibold text-[#0b2945] flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-[#0b2945]" />
                          {uploadStatus}
                        </p>
                      )}

                      <button
                        onClick={() => handleGenerateQuiz(user.id, priorityDef.id)}
                        disabled={uploading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b2945] py-3 text-xs font-bold text-white shadow-xs hover:bg-[#081f35] transition-colors disabled:opacity-50"
                      >
                        <Sparkles className="h-4 w-4" />
                        {uploading ? "Analyzing Material & Generating MCQs..." : "Generate AI Assessment & Start Quiz"}
                        <ArrowRight className="h-4 w-4" />
                      </button>

                      <Link
                        href="/ai-generator"
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-[#0b2945]" />
                        Open AI Assessment Generator Studio
                      </Link>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      Passing automatically updates your Official Statistical System competency score.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lower Section: Why Recommendations & Progress Stats */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left Column (6 cols): Why these recommendations? */}
              <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#0f1f35]">
                  <FileCheck className="h-4 w-4 text-[#0b2945]" />
                  Why these recommendations?
                </div>

                <div className="space-y-3 pt-1">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-[#0f1f35]">
                        Based on your competency gaps
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Directly targets {priorityDef.name} ({priorityGap ? `-${priorityGap.gap}% deficit` : "target 70%"}) identified during statewide diagnostic review.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-[#0f1f35]">
                        Matched to your role
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Aligned with official National Statistical Commission (NSC) competency guidelines for {user.role}s in State DES cadres.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-[#0f1f35]">
                        Designed to improve measurable proficiency
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Structured to convert course completion into measurable competency score gains upon automated post-assessment validation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                  <span>Framework: FRAC v3.0 (iGOT)</span>
                  <span>Regulatory Verified</span>
                </div>
              </div>

              {/* Right Column (6 cols): Your Learning Progress */}
              <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#0f1f35]">
                    <Clock className="h-4 w-4 text-[#0b2945]" />
                    Your Learning Progress
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Cycle 2024–2025</span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-3xl font-extrabold text-[#0f1f35]">
                      {learningProgressPercent}%
                    </span>
                    <span className="ml-2 text-xs text-slate-500 font-medium">Overall Completion</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {completedModulesCount} of {totalModulesCount} learning activities completed
                  </span>
                </div>

                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#0b2945] transition-all duration-500"
                    style={{ width: `${learningProgressPercent}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Hours Learned</div>
                    <div className="text-base font-extrabold text-[#0f1f35]">
                      {completedModulesCount * 4 + 2.5}
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Assessments</div>
                    <div className="text-base font-extrabold text-[#0f1f35]">
                      {data.assessmentsCount + data.quizzesCount}
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Certificates</div>
                    <div className="text-base font-extrabold text-[#0f1f35]">
                      {completedModulesCount}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50/70 border border-blue-200/80 p-2.5 text-xs text-blue-950 flex items-center justify-between">
                  <span>Recent milestone: Survey Methodology Fundamentals</span>
                  <strong className="text-emerald-700">88% score</strong>
                </div>
              </div>
            </div>

            {/* Bottom Cohort Bar */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-[#0f1f35]">
                  Statistical Cadre Cohort: {user.stateName} Sub-Division
                </span>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  42 Statistical Officers currently enrolled in this pathway. Average milestone completion rate is 71%.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    alert(`Cohort benchmark for ${user.stateName}: 71% average completion.`)
                  }
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
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
