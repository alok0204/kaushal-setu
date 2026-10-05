import React from "react";
import { APP_CONFIG, PLANNED_MODULES } from "@/lib/constants";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero / Verification Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-b from-white to-zinc-50/50 p-8 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950 sm:p-12">
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success">Phase 1: Project Foundation</Badge>
            <Badge variant="outline">Next.js App Router</Badge>
            <Badge variant="outline">TypeScript</Badge>
            <Badge variant="outline">Tailwind CSS</Badge>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-50">
            {APP_CONFIG.name}{" "}
            <span className="font-normal text-zinc-500">
              ({APP_CONFIG.nameHindi})
            </span>
          </h1>

          <p className="text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
            {APP_CONFIG.description}
          </p>

          <div className="pt-2 flex flex-wrap gap-3 text-xs font-mono text-zinc-600 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Build Status: Passing
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1">
              🔒 Security: Zero Hardcoded Secrets
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1">
              ▲ Target: Vercel-Ready
            </span>
          </div>
        </div>
      </section>

      {/* Tech Stack Foundation Status */}
      <section className="mt-12">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Foundation Stack &amp; Verification
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          The base environment is initialized and verified against core technical constraints.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card hoverEffect>
            <div className="text-xs font-mono uppercase text-zinc-400">Framework</div>
            <div className="mt-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">Next.js (App Router)</div>
            <p className="mt-1 text-xs text-zinc-500">
              Modern server &amp; client component architecture with Turbopack bundler.
            </p>
          </Card>

          <Card hoverEffect>
            <div className="text-xs font-mono uppercase text-zinc-400">Language</div>
            <div className="mt-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">TypeScript (Strict)</div>
            <p className="mt-1 text-xs text-zinc-500">
              Type-safe foundation with domain model scaffolding in <code className="font-mono">@/types</code>.
            </p>
          </Card>

          <Card hoverEffect>
            <div className="text-xs font-mono uppercase text-zinc-400">Styling</div>
            <div className="mt-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">Tailwind CSS</div>
            <p className="mt-1 text-xs text-zinc-500">
              Utility-first styling with responsive, dark-mode and print support.
            </p>
          </Card>

          <Card hoverEffect>
            <div className="text-xs font-mono uppercase text-zinc-400">Code Quality</div>
            <div className="mt-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">ESLint &amp; Git Guard</div>
            <p className="mt-1 text-xs text-zinc-500">
              Strict linting and .gitignore protecting keys and environment variables.
            </p>
          </Card>
        </div>
      </section>

      {/* Upcoming Modules Scaffolding Preview */}
      <section className="mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Planned Platform Capabilities (Roadmap)
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Modular architecture ready to accommodate all 11 core functional modules in subsequent steps.
            </p>
          </div>
          <Badge variant="info">Phase 2+ Feature Scope</Badge>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLANNED_MODULES.map((item) => (
            <Card key={item.id} hoverEffect className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px]">
                    {item.category}
                  </Badge>
                  <span className="text-xs font-medium text-zinc-400">
                    {item.status}
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
