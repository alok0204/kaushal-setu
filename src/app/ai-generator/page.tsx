"use client";

import React, { useState, useRef, useId } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UploadCloud,
  FileText,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Eye,
  Sliders,
  RefreshCw,
  X,
  Compass,
  BarChart3,
  BookOpen,
  Lock,
  Info,
  Clock,
  Layers,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import {
  UserDashboardData,
  CompetencyId,
  GeneratedQuiz,
  QuizQuestionItem,
  UploadedMaterial,
} from "@/types";
import { COMPETENCIES } from "@/lib/constants";
import {
  saveGeneratedQuiz,
  saveUploadedMaterial,
  getUserState,
} from "@/lib/store";
import { generateUniqueId } from "@/lib/utils";

export default function AIGeneratorPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const includeRationaleId = useId();

  // State
  const [stagedFile, setStagedFile] = useState<{
    name: string;
    size: string;
    fileObj?: File;
  }>({
    name: "Statistical Methods & Survey Sampling.pdf",
    size: "4.8 MB",
  });

  const [numQuestions, setNumQuestions] = useState("10");
  const [difficulty, setDifficulty] = useState("Mixed (Foundational to Interm...)");
  const [includeRationale, setIncludeRationale] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parseProgress, setParseProgress] = useState(100);
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuiz | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setStagedFile({
        name: file.name,
        size: `${sizeMB} MB`,
        fileObj: file,
      });
    }
  };

  const handleAnalyze = async (userId: string, targetCompId: CompetencyId) => {
    setIsAnalyzing(true);
    setParseProgress(20);

    const timer = setInterval(() => {
      setParseProgress((p) => (p < 90 ? p + 25 : p));
    }, 250);

    try {
      const formData = new FormData();
      if (stagedFile.fileObj) {
        formData.append("file", stagedFile.fileObj);
        formData.append("title", stagedFile.fileObj.name);
      } else {
        formData.append("title", stagedFile.name.replace(".pdf", ""));
        formData.append(
          "sampleText",
          `Official MoSPI guidelines on ${targetCompId}: Stratified multi-stage sampling frames, design multipliers, Horvitz-Thompson estimation, and NSS survey schedule validation.`
        );
      }
      formData.append("targetCompetency", targetCompId);

      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      clearInterval(timer);
      setParseProgress(100);

      if (data.success && data.questions) {
        // Save uploaded material
        const newMaterial: UploadedMaterial = {
          id: generateUniqueId("mat"),
          userId,
          fileName: stagedFile.name,
          fileSize: stagedFile.size,
          status: "completed",
          createdAt: new Date().toISOString(),
        };
        saveUploadedMaterial(userId, newMaterial);

        // Build generated quiz
        const newQuiz: GeneratedQuiz = {
          id: generateUniqueId("quiz"),
          userId,
          title: `Diagnostic Evaluation: ${data.title || "Statistical Methods & Survey Sampling"}`,
          materialFilename: stagedFile.name,
          totalQuestions: data.questions.length,
          targetCompetencyId: targetCompId,
          secondaryCompetencyId: "data_analysis",
          createdAt: new Date().toISOString(),
          questions: data.questions.map(
            (q: {
              question: string;
              options: string[];
              correctAnswer: number;
              explanation: string;
              difficulty?: string;
            }, idx: number): QuizQuestionItem => ({
              id: `q_ai_${idx + 1}`,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer ?? 0,
              explanation: q.explanation || "Aligned with official MoSPI sampling manual.",
              competencyId: targetCompId,
              difficulty: q.difficulty || "Intermediate",
              reference: "MoSPI Field Survey Guidelines, Volume IV (Sampling Protocols)",
            })
          ),
        };

        saveGeneratedQuiz(userId, newQuiz);
        setGeneratedQuiz(newQuiz);
      }
    } catch (err) {
      console.error("Analysis error:", err);
      clearInterval(timer);
      setParseProgress(100);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AppShell>
      {(data: UserDashboardData) => {
        const { user, priorityGap } = data;
        const targetCompId: CompetencyId = priorityGap
          ? priorityGap.competencyId
          : "statistical_methods";
        const compDef = COMPETENCIES.find((c) => c.id === targetCompId);

        return (
          <div className="space-y-6 text-[#0f1f35]" suppressHydrationWarning>
            {/* Breadcrumb & Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Link href="/assessment" className="hover:underline">
                    Assessments
                  </Link>
                  <span>/</span>
                  <span className="font-bold text-[#0b2945]">AI Question Generator</span>
                </div>
                <h1 className="mt-1.5 text-2xl font-black text-[#0f1f35] sm:text-3xl">
                  AI Assessment Generator
                </h1>
                <p className="mt-1 text-xs text-slate-500 max-w-2xl">
                  Upload institutional learning material to generate competency-mapped evaluations and MCQs using verified civil service algorithms.
                </p>
              </div>

              {/* FRAC Framework Badge */}
              <div className="inline-flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50/70 px-3.5 py-2 text-xs font-semibold text-blue-950 shadow-xs shrink-0 self-start sm:self-center">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#0b2945]" />
                  <span>FRAC Framework v3.2 Aligned</span>
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>NSSTA Accredited Engine</span>
                </div>
              </div>
            </div>

            {/* Main 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (Cards 1, 2, 3) */}
              <div className="lg:col-span-7 space-y-6">
                {/* CARD 1: Upload Learning Material */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-[#0b2945]">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-[#0f1f35]">
                          Upload Learning Material
                        </h2>
                        <p className="text-xs text-slate-500">
                          MoSPI Cadre Manuals, NSS Directives, or Course Modules
                        </p>
                      </div>
                    </div>
                    <span className="rounded-md bg-slate-100 border border-slate-200 px-2.5 py-1 font-mono text-[11px] font-bold text-slate-600">
                      MoSPI-DOC-SEC-01
                    </span>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group cursor-pointer rounded-xl border-2 border-dashed border-slate-200 hover:border-[#0b2945] bg-slate-50/60 hover:bg-blue-50/30 p-8 text-center transition-all"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-slate-200 shadow-xs mx-auto text-slate-400 group-hover:text-[#0b2945] transition-colors">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-sm font-bold text-[#0f1f35]">
                      Drag and drop institutional documents here
                    </p>
                    <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                      Secure document ingestion with automated redaction of classified tags
                    </p>

                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
                      >
                        <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                        Browse Official Documents
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                      <span className="rounded bg-slate-200/70 px-2 py-0.5">PDF</span>
                      <span className="rounded bg-slate-200/70 px-2 py-0.5">PPT</span>
                      <span className="rounded bg-slate-200/70 px-2 py-0.5">PPTX</span>
                      <span className="rounded bg-slate-200/70 px-2 py-0.5">DOCX</span>
                      <span className="text-slate-400 font-normal lowercase">
                        (Max Payload: 50MB)
                      </span>
                    </div>
                  </div>

                  {/* STAGED DOCUMENT FOR ANALYSIS */}
                  {stagedFile && (
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Staged Document for Analysis
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0b2945] text-white font-bold text-xs">
                            PDF
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#0f1f35]">
                              {stagedFile.name}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                              <span>{stagedFile.size}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-blue-700 font-semibold">
                                <ShieldCheck className="h-3 w-3" /> CERT-In Antivirus Scan Passed
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                          >
                            <RefreshCw className="h-3 w-3" /> Replace
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setStagedFile({
                                name: "Statistical Methods & Survey Sampling.pdf",
                                size: "4.8 MB",
                              })
                            }
                            className="p-1 text-slate-400 hover:text-slate-600"
                            title="Reset Document"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Main Analyze Button */}
                  <button
                    type="button"
                    disabled={isAnalyzing}
                    onClick={() => handleAnalyze(user.id, targetCompId)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0b2945] py-3 text-xs font-bold text-white shadow-xs hover:bg-[#081f35] transition-colors disabled:opacity-60"
                  >
                    <Sparkles className="h-4 w-4" />
                    {isAnalyzing
                      ? "Analyzing Material with AI (Parsing Cadre Source)..."
                      : "Analyze Material with AI (Re-Parse Cadre Source)"}
                  </button>
                </div>

                {/* CARD 2: AI Assessment Configuration */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#0f1f35]">
                      <Sliders className="h-4 w-4 text-[#0b2945]" />
                      AI Assessment Configuration
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Parameters Auto-Tuned
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Number of Questions */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Number of Questions
                      </label>
                      <select
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-xs font-semibold text-[#0f1f35] focus:border-[#0b2945] focus:outline-none"
                      >
                        <option value="10">10 Questions (Standard Evaluation)</option>
                        <option value="5">5 Questions (Rapid Assessment)</option>
                        <option value="15">15 Questions (Cadre Audit)</option>
                      </select>
                    </div>

                    {/* Difficulty Level */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Difficulty Level
                      </label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-xs font-semibold text-[#0f1f35] focus:border-[#0b2945] focus:outline-none"
                      >
                        <option value="Mixed (Foundational to Interm...)">
                          Mixed (Foundational to Intermediate)
                        </option>
                        <option value="Foundational (Junior Cadre)">
                          Foundational (Junior Cadre)
                        </option>
                        <option value="Intermediate (SSO Cadre)">
                          Intermediate (SSO Cadre)
                        </option>
                        <option value="Advanced (Senior Director)">
                          Advanced (Senior Director)
                        </option>
                      </select>
                    </div>

                    {/* Competency Framework */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Competency Framework
                      </label>
                      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-xs font-semibold text-slate-700">
                        <Layers className="h-3.5 w-3.5 text-[#0b2945]" />
                        <span>Auto-detect via FRAC Dictionary (v3.2)</span>
                      </div>
                    </div>

                    {/* Delivery Format */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Delivery Format
                      </label>
                      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-xs font-semibold text-slate-700">
                        <Clock className="h-3.5 w-3.5 text-[#0b2945]" />
                        <span>Multiple Choice (MCQ) • Timed (15m)</span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Row */}
                  <div className="flex items-center justify-between rounded-xl bg-blue-50/50 border border-blue-100 p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-blue-200 text-[#0b2945]">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <label
                          htmlFor={includeRationaleId}
                          className="cursor-pointer text-xs font-bold text-[#0f1f35]"
                        >
                          Include Explanatory Rationale for Service Dossier
                        </label>
                        <p className="text-[11px] text-slate-500">
                          Generates statutory justification notes for each answer to support APAR score validation
                        </p>
                      </div>
                    </div>

                    {/* Switch Toggle */}
                    <button
                      id={includeRationaleId}
                      role="switch"
                      aria-checked={includeRationale}
                      type="button"
                      onClick={() => setIncludeRationale(!includeRationale)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        includeRationale ? "bg-[#0b2945]" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          includeRationale ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* CARD 3: AI Parsing & Extraction Status */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#0b2945]">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0f1f35]">
                          AI Parsing &amp; Extraction Status
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Semantic verification against National Statistical Cadre Standards
                        </div>
                      </div>
                    </div>

                    <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-[11px] font-bold text-blue-900">
                      {isAnalyzing
                        ? `Parsing (${parseProgress}%)`
                        : "Analysis Complete • 100% Parsed"}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium text-slate-600">
                      <span>Domain Tokenization &amp; Question Synthesis</span>
                      <span className="font-mono font-bold text-[#0f1f35]">
                        {isAnalyzing
                          ? `${Math.round((parseProgress / 100) * 1248)} / 1,248 Nodes Analyzed`
                          : "1,248 / 1,248 Nodes Analyzed"}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-[#0b2945] transition-all duration-300"
                        style={{ width: `${parseProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Extracted Curricular Verticals
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "NSS 78th Round Sampling Frame",
                        "Stratified Multi-stage Design",
                        "Multiplier Calculation",
                        "Variance Estimation Protocols",
                      ].map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (Generation Dossier & Governance) */}
              <div className="lg:col-span-5 space-y-6">
                {/* CARD 1: Generation Dossier */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Generation Dossier
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      Validation Passed
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-[#0f1f35] leading-snug">
                      Diagnostic Evaluation: {compDef?.name || "Statistical Methods"} &amp; Survey Sampling
                    </h3>
                  </div>

                  {/* 3 Metric Tiles */}
                  <div className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-3 border border-slate-200 text-center">
                    <div>
                      <div className="text-2xl font-black text-[#0b2945]">10</div>
                      <div className="text-[10px] font-bold uppercase text-slate-500">
                        MCQ Items
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-[#0b2945]">15</div>
                      <div className="text-[10px] font-bold uppercase text-slate-500">
                        Minutes
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-[#0b2945]">70%</div>
                      <div className="text-[10px] font-bold uppercase text-slate-500">
                        Pass Target
                      </div>
                    </div>
                  </div>

                  {/* Detected Cadre Competencies */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Detected Cadre Competencies
                    </div>

                    <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Compass className="h-4 w-4 text-[#0b2945]" />
                        <span className="text-xs font-bold text-[#0f1f35]">
                          {compDef?.name || "Statistical Methods"}
                        </span>
                      </div>
                      <span className="rounded bg-blue-100 text-blue-900 font-bold px-2 py-0.5 text-[10px]">
                        Primary Focus • Gap Remediation
                      </span>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <BarChart3 className="h-4 w-4 text-slate-600" />
                        <span className="text-xs font-bold text-[#0f1f35]">
                          Data Analysis &amp; Interpretation
                        </span>
                      </div>
                      <span className="rounded bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 text-[10px]">
                        Secondary Cadre Competency
                      </span>
                    </div>
                  </div>

                  {/* Question Blueprint Composition */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <span>Question Blueprint Composition</span>
                      <span className="text-slate-500 font-semibold">10 Total Items</span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-slate-700 font-medium">
                          <span className="h-2 w-2 rounded-full bg-[#0b2945]" />
                          Conceptual Understanding
                        </span>
                        <span className="font-bold text-[#0f1f35]">4 Items (40%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-slate-700 font-medium">
                          <span className="h-2 w-2 rounded-full bg-blue-400" />
                          Formula &amp; Multiplier Application
                        </span>
                        <span className="font-bold text-[#0f1f35]">4 Items (40%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-slate-700 font-medium">
                          <span className="h-2 w-2 rounded-full bg-slate-400" />
                          Fieldwork Inspection Protocols
                        </span>
                        <span className="font-bold text-[#0f1f35]">2 Items (20%)</span>
                      </div>
                    </div>

                    {/* Segmented bar */}
                    <div className="flex h-2 w-full rounded-full overflow-hidden bg-slate-100">
                      <div className="w-[40%] bg-[#0b2945]" />
                      <div className="w-[40%] bg-blue-400" />
                      <div className="w-[20%] bg-slate-400" />
                    </div>
                  </div>

                  {/* Big Action Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const userState = getUserState(user.id);
                      const qId =
                        generatedQuiz?.id ||
                        (userState.quizzes && userState.quizzes.length > 0
                          ? userState.quizzes[userState.quizzes.length - 1].id
                          : "std-eval");
                      router.push(`/quiz/${qId}`);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0b2945] py-3.5 text-xs font-bold text-white shadow-xs hover:bg-[#081f35] transition-colors"
                  >
                    Start Assessment Now <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(true)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Eye className="h-3.5 w-3.5 text-slate-500" />
                    Review Question Pool (Officer Preview)
                  </button>
                </div>

                {/* Institutional AI Governance Card */}
                <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-950">
                    <Lock className="h-4 w-4 text-[#0b2945]" />
                    Institutional AI Governance &amp; Impartiality Guardrail
                  </div>
                  <p className="text-xs text-blue-900/80 leading-relaxed">
                    Assessment questions are synthesized strictly from uploaded canonical material and calibrated to the official MoSPI FRAC competency taxonomy. All evaluation algorithms undergo audit verification to uphold civil service impartiality.
                  </p>
                  <div className="flex items-center justify-between border-t border-blue-200/60 pt-2.5 text-[10px] text-blue-800 font-medium">
                    <span>Security Protocol: ISO 27001 / MeitY Empanelled</span>
                    <span>Engine Build: v4.12-GOI</span>
                  </div>
                </div>

                {/* Bottom Note */}
                <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-500">
                  <Info className="h-3.5 w-3.5 text-slate-400" />
                  Simulated UI demonstration under MoSPI Digital Capacity Building Initiative
                </div>
              </div>
            </div>

            {/* Officer Preview Modal */}
            {showPreviewModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#0f1f35]">
                      <Eye className="h-4 w-4 text-[#0b2945]" />
                      Question Pool Preview (Officer Sandbox)
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPreviewModal(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500">
                    Sample questions curated by the AI engine from &ldquo;{stagedFile.name}&rdquo;:
                  </p>

                  <div className="space-y-3">
                    {[
                      {
                        q: "In multi-stage stratified survey sampling, what is the impact on standard error if intra-cluster correlation increases?",
                        ans: "Standard errors increase, raising the required Design Effect (DEFF)",
                      },
                      {
                        q: "How should sampling weights be adjusted when sample units across a sub-district exhibit systematic non-response?",
                        ans: "Reweight responding units in the same socio-economic sub-stratum proportionally",
                      },
                      {
                        q: "Which variance estimation formula is universally mandated by MoSPI guidelines for ratio estimators?",
                        ans: "First-order Taylor Series Linearization or Balanced Repeated Replication (BRR)",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs space-y-1.5"
                      >
                        <div className="font-bold text-[#0f1f35]">
                          {idx + 1}. {item.q}
                        </div>
                        <div className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Correct Key: {item.ans}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowPreviewModal(false)}
                      className="rounded-lg bg-[#0b2945] px-4 py-2 text-xs font-bold text-white"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }}
    </AppShell>
  );
}
