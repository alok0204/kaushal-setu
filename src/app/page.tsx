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
    <div className="min-h-screen bg-[#f3f5f8] flex items-center justify-center p-4 sm:p-6 lg:p-12">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: National Statistical Governance Branding */}
        <div className="lg:col-span-6 space-y-6 lg:pr-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-800 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300">
            <Building2 className="h-3.5 w-3.5" />
            NATIONAL STATISTICAL GOVERNANCE
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 leading-tight">
            AI-Powered Learning for Better Competencies
          </h1>

          <p className="text-base text-zinc-600 sm:text-lg leading-relaxed">
            Personalized learning and competency development for India&apos;s Official Statistical System.
          </p>

          {/* 3 Pillar Features */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">
                  Identify competency gaps with precision analytics
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Diagnostic frameworks benchmarked against statutory statistical protocols.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">
                  Discover personalized learning through iGOT Karmayogi integration
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Curated pathways dynamically mapped to central civil service competencies.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700 font-bold">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">
                  Assess learning with AI-generated role-based evaluations
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Continuous objective appraisal modeled on live field sampling and microdata standards.
                </p>
              </div>
            </div>
          </div>

          {/* Continuous Competency Cycle Card */}
          <div className="rounded-xl border border-zinc-200/90 bg-white/80 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between text-[11px] font-bold text-zinc-500 uppercase tracking-wider pb-2 border-b border-zinc-100">
              <span>Continuous Competency Cycle</span>
              <span className="text-blue-700">ISO 9001:2015 Aligned</span>
            </div>
            <div className="grid grid-cols-4 gap-2 pt-3 text-center">
              <div className="rounded-lg bg-zinc-50 p-2 text-xs font-semibold text-zinc-800 border border-zinc-200/60">
                Assessment
              </div>
              <div className="rounded-lg bg-zinc-50 p-2 text-xs font-semibold text-zinc-800 border border-zinc-200/60">
                Learning
              </div>
              <div className="rounded-lg bg-zinc-50 p-2 text-xs font-semibold text-zinc-800 border border-zinc-200/60">
                Reassessment
              </div>
              <div className="rounded-lg bg-blue-50 p-2 text-xs font-semibold text-blue-800 border border-blue-200">
                Improvement
              </div>
            </div>
          </div>

          {/* Bottom Trust Badges */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-zinc-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              NIC Cert-In Compliant
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-blue-600" />
              iGOT SPV Integrated
            </div>
            <div className="flex items-center gap-1.5">
              <Server className="h-4 w-4 text-zinc-600" />
              Sovereign Data Center
            </div>
          </div>
        </div>

        {/* Right Side: Sign-In / Demo Personas Card */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-xl">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                Welcome back
              </h2>
              <p className="text-xs text-zinc-500">
                Sign in to continue your personalized learning journey.
              </p>
            </div>

            <form onSubmit={handleSignIn} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Official Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-3 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-zinc-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("For demonstration purposes, choose a demo profile below.")}
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-10 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-zinc-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                  />
                  Remember my credentials
                </label>
                <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                  <Lock className="h-3 w-3" /> SSL 256-bit
                </span>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#091524] py-3 text-sm font-semibold text-white shadow-md hover:bg-black transition-all"
              >
                Sign In to Dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Persona Switcher Section */}
            <div className="mt-6 border-t border-zinc-200/80 pt-5">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
                <span>Or Explore Demonstration Profiles</span>
                <span className="text-[10px] text-blue-600 font-medium lowercase">quick select</span>
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
                          ? "border-blue-600 bg-blue-50/70 shadow-sm"
                          : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100 hover:border-zinc-300"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-zinc-900">
                          {user.stateName}
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          {user.role}
                        </div>
                      </div>
                      <div className="shrink-0 ml-2">
                        {isSelected ? (
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-zinc-300" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom National Programme Badge */}
            <div className="mt-6 rounded-lg bg-blue-50/70 p-3 text-center border border-blue-100">
              <p className="text-xs font-semibold text-blue-900 flex items-center justify-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                Powered by AI • Integrated with iGOT Karmayogi
              </p>
              <p className="text-[10px] text-blue-700/80 mt-0.5">
                National Programme for Civil Services Capacity Building (NPCSCB)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
