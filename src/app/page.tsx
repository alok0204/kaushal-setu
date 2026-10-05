"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Award,
  BookOpen,
  BrainCircuit,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Server,
  Building2,
} from "lucide-react";
import { DEMO_USERS } from "@/lib/constants";
import { setActiveUserId } from "@/lib/store";
import { DemoUser } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<DemoUser>(DEMO_USERS[0]);
  const [email, setEmail] = useState<string>(DEMO_USERS[0].email);
  const [password, setPassword] = useState<string>("••••••••••••");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const handleSelectPersona = (user: DemoUser) => {
    setSelectedUser(user);
    setEmail(user.email);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveUserId(selectedUser.id);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f8fafd] flex items-center justify-center p-4 sm:p-6 lg:p-12 text-[#0f1f35]" suppressHydrationWarning>
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Side: National Statistical Governance Branding */}
        <div className="lg:col-span-6 space-y-6 lg:pr-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-900">
            <Building2 className="h-3.5 w-3.5 text-[#0b2945]" />
            NATIONAL STATISTICAL GOVERNANCE
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f1f35] leading-tight">
            AI-Powered Learning for Better Competencies
          </h1>

          <p className="text-base text-slate-600 sm:text-lg leading-relaxed">
            Personalized learning and competency development for India&apos;s Official Statistical System.
          </p>

          {/* 3 Pillar Features */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-800 border border-blue-100 font-bold">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0f1f35]">
                  Identify competency gaps with precision analytics
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Diagnostic frameworks benchmarked against statutory statistical protocols.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0f1f35]">
                  Discover personalized learning through iGOT Karmayogi integration
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Curated pathways dynamically mapped to central civil service competencies.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-100 font-bold">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0f1f35]">
                  Assess learning with AI-generated role-based evaluations
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Continuous objective appraisal modeled on live field sampling and microdata standards.
                </p>
              </div>
            </div>
          </div>

          {/* Continuous Competency Cycle Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100">
              <span>Continuous Competency Cycle</span>
              <span className="text-[#0b2945]">ISO 9001:2015 Aligned</span>
            </div>
            <div className="grid grid-cols-4 gap-2 pt-3 text-center">
              <div className="rounded-lg bg-slate-50 p-2 text-xs font-semibold text-slate-800 border border-slate-200">
                Assessment
              </div>
              <div className="rounded-lg bg-slate-50 p-2 text-xs font-semibold text-slate-800 border border-slate-200">
                Learning
              </div>
              <div className="rounded-lg bg-slate-50 p-2 text-xs font-semibold text-slate-800 border border-slate-200">
                Reassessment
              </div>
              <div className="rounded-lg bg-blue-50 p-2 text-xs font-semibold text-blue-900 border border-blue-200">
                Improvement
              </div>
            </div>
          </div>

          {/* Bottom Trust Badges */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              NIC Cert-In Compliant
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-[#0b2945]" />
              iGOT SPV Integrated
            </div>
            <div className="flex items-center gap-1.5">
              <Server className="h-4 w-4 text-slate-600" />
              Sovereign Data Center
            </div>
          </div>
        </div>

        {/* Right Side: Sign-In / Demo Personas Card */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-[#0f1f35]">
                Welcome back
              </h2>
              <p className="text-xs text-slate-500">
                Sign in to continue your personalized learning journey.
              </p>
            </div>

            <form onSubmit={handleSignIn} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Official Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-[#0f1f35] focus:border-[#0b2945] focus:outline-none focus:ring-1 focus:ring-[#0b2945]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("For demonstration purposes, click any demo persona below.")}
                    className="text-xs font-semibold text-[#0b2945] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-[#0f1f35] focus:border-[#0b2945] focus:outline-none focus:ring-1 focus:ring-[#0b2945]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-[#0b2945] focus:ring-[#0b2945] h-3.5 w-3.5"
                  />
                  Remember my credentials
                </label>
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Lock className="h-3 w-3" /> SSL 256-bit
                </span>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0b2945] py-3 text-sm font-bold text-white shadow-sm hover:bg-[#081f35] transition-all"
              >
                Sign In to Dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Persona Switcher Section */}
            <div className="mt-6 border-t border-slate-100 pt-5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                <span>Or Explore Demonstration Profiles</span>
                <span className="text-[10px] text-[#0b2945] font-semibold lowercase">quick select</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEMO_USERS.map((user) => {
                  const isSelected = user.id === selectedUser.id;
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleSelectPersona(user)}
                      className={`flex items-center justify-between rounded-xl p-3 text-left transition-all border ${
                        isSelected
                          ? "border-[#0b2945] bg-blue-50/70 shadow-xs"
                          : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-[#0f1f35]">
                          {user.stateName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {user.role}
                        </div>
                      </div>
                      <div className="shrink-0 ml-2">
                        {isSelected ? (
                          <CheckCircle2 className="h-4 w-4 text-[#0b2945]" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-slate-300" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom National Programme Badge */}
            <div className="mt-6 rounded-lg bg-blue-50/60 p-3 text-center border border-blue-100/80">
              <p className="text-xs font-bold text-blue-950 flex items-center justify-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#0b2945]" />
                Powered by AI • Integrated with iGOT Karmayogi
              </p>
              <p className="text-[10px] text-blue-900/70 mt-0.5">
                National Programme for Civil Services Capacity Building (NPCSCB)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
