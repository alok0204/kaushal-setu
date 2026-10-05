"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function QuizRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "std_eval";

  useEffect(() => {
    router.replace(`/quiz/${id}`);
  }, [router, id]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafd] text-[#0f1f35]">
      <div className="text-center space-y-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0b2945] border-t-transparent mx-auto" />
        <p className="text-xs font-semibold text-slate-500">Loading AI Quiz...</p>
      </div>
    </div>
  );
}

export default function QuizIndexPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f8fafd] text-[#0f1f35]">
          <div className="text-center space-y-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0b2945] border-t-transparent mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Loading AI Quiz...</p>
          </div>
        </div>
      }
    >
      <QuizRedirect />
    </Suspense>
  );
}
