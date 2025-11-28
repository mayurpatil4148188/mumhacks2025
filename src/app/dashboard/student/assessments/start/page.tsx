"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Sparkles, Star, Smile, Sun, Heart, Rainbow, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { cn } from "@/lib/utils";
import { studentNav } from "../../nav";

interface Question {
  questionId?: string;
  id?: string;
  text: string;
  domainTags?: string[];
  options?: { key: string; text: string; riskLevel?: string; score: number }[];
  answerType?: string;
}

const defaultLikertOptions4 = [
  { key: "a", text: "Not at all / Never", score: 0 },
  { key: "b", text: "A little / Rarely", score: 1 },
  { key: "c", text: "Some / Sometimes", score: 2 },
  { key: "d", text: "A lot / Often", score: 3 },
];

const defaultLikertOptions5 = [
  { key: "a", text: "Never", score: 1 },
  { key: "b", text: "Rarely", score: 2 },
  { key: "c", text: "Sometimes", score: 3 },
  { key: "d", text: "Often", score: 4 },
  { key: "e", text: "Always", score: 5 },
];

export default function StartAssessmentPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { status } = useSession();
  const type = useMemo(() => {
    const normalized = (params.get("type") || "baseline").toLowerCase();
    return normalized === "followup" ? "FOLLOWUP" : "BASELINE";
  }, [params]);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [testId, setTestId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check baseline status before starting (only for baseline assessments)
  useEffect(() => {
    if (status === "loading" || type !== "BASELINE") {
      setCheckingStatus(false);
      return;
    }
    if (status === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    async function checkBaselineStatus() {
      try {
        const res = await fetch("/api/tests/status");
        const data = await res.json();
        if (data.baselineCompleted) {
          // Baseline already completed, redirect to assessments page
          router.push("/dashboard/student/assessments");
          return;
        }
      } catch (err) {
        // If check fails, continue with normal flow (API will handle the check)
      } finally {
        setCheckingStatus(false);
      }
    }
    checkBaselineStatus();
  }, [status, type, router]);

  useEffect(() => {
    if (status === "loading" || checkingStatus) return;
    if (status === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    const controller = new AbortController();
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/tests/start-${type === "BASELINE" ? "baseline" : "followup"}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
          signal: controller.signal,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const message = (data as any).error || "Could not start assessment.";
          // If baseline already completed, redirect to assessments page
          if (type === "BASELINE" && message.includes("already completed")) {
            router.push("/dashboard/student/assessments");
            return;
          }
          throw new Error(message);
        }
        setTestId(data.testInstanceId);
        setQuestions(data.questions || []);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError(err.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [router, status, type, checkingStatus]);

  async function submit() {
    if (!testId) {
      setError("Assessment is not ready yet. Please reload and try again.");
      return;
    }
    setError(null);
    setSubmitted(false);

    const payload = {
      testInstanceId: testId,
      answers: Object.entries(answers).map(([questionId, answerValue]) => ({
        questionId,
        answerValue,
      })),
    };

    try {
      const res = await fetch("/api/tests/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = (data as any).error || "Could not submit responses.";
        throw new Error(message);
      }
      setSubmitted(true);
      setShowSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    }
  }

  const title = type === "BASELINE" ? "Baseline check-in" : "Follow-up check-in";

  useEffect(() => {
    if (submitted && !showSuccess) {
      setRedirecting(true);
      router.push("/dashboard/student");
    }
  }, [router, showSuccess, submitted]);

  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => {
      setShowSuccess(false);
      setRedirecting(true);
      router.push("/dashboard/student");
    }, 1800);
    return () => clearTimeout(timer);
  }, [router, showSuccess]);

  const total = questions.length;
  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = total ? Math.round(((currentIndex + 1) / total) * 100) : 0;

  return (
    <DashboardShell
      title={title}
      description="Tap the option that feels most true for you today. No right or wrong answers."
      nav={studentNav}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-5 shadow-sm">
        <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-28 w-28 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="relative space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 shadow-inner">
                <Smile className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">You’ve got this</p>
                <p className="text-xs text-slate-600">Take it one question at a time.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-sm ring-1 ring-emerald-100">
              <Star className="h-4 w-4 text-amber-500" />
              {answeredCount} answered · {total} total
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Progress</span>
              <span>{progress || 0}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-4 text-sm text-slate-800 shadow-sm">
          <div className="flex items-center gap-2">
            <Rainbow className="h-5 w-5 text-sky-500" />
            <p className="font-semibold text-emerald-900">Quick tips</p>
          </div>
          <ul className="mt-2 grid gap-1 sm:grid-cols-3 sm:gap-3">
            <li className="rounded-lg bg-white/70 px-3 py-2 text-xs text-slate-700 shadow-inner">Pick what feels most like you.</li>
            <li className="rounded-lg bg-white/70 px-3 py-2 text-xs text-slate-700 shadow-inner">If unsure, choose the closest fit.</li>
            <li className="rounded-lg bg-white/70 px-3 py-2 text-xs text-slate-700 shadow-inner">You can go back before submitting.</li>
          </ul>
        </Card>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {redirecting ? (
          <Card className="p-4 text-sm text-emerald-700">Redirecting to your dashboard…</Card>
        ) : null}
        <div className="space-y-4">
          {(isLoading || checkingStatus) ? <p className="text-sm text-slate-600">Loading questions…</p> : null}
          {!isLoading && !checkingStatus && questions.length === 0 ? (
            <p className="text-sm text-slate-600">No questions were loaded for this assessment.</p>
          ) : null}
          {!isLoading && currentQuestion ? (
            <Card className="space-y-4 border-emerald-100 bg-white/90 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                  <Sun className="h-4 w-4" />
                  Question {currentIndex + 1} of {total}
                </div>
                <div className="text-xs font-semibold text-slate-500">Step {currentIndex + 1}</div>
              </div>
              <p className="text-base font-semibold leading-relaxed text-slate-900">{currentQuestion.text}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {(currentQuestion.options && currentQuestion.options.length
                  ? currentQuestion.options
                  : currentQuestion.answerType === "LIKERT_1_4"
                    ? defaultLikertOptions4
                    : defaultLikertOptions5
                ).map((opt) => {
                  const key = currentQuestion.questionId || currentQuestion.id || String(currentIndex);
                  const active = answers[key] === opt.score;
                  return (
                    <Button
                      key={opt.key}
                      type="button"
                      variant={active ? "default" : "outline"}
                      className={cn(
                        "justify-start text-left text-sm py-3 rounded-xl border transition-colors",
                        active
                          ? "border-emerald-300 bg-emerald-100 text-emerald-900 shadow-sm hover:bg-emerald-200"
                          : "border-emerald-100 bg-emerald-50/40 text-slate-800 hover:border-emerald-300 hover:bg-emerald-50"
                      )}
                      onClick={() => setAnswers({ ...answers, [key]: opt.score })}
                    >
                        <span className="flex items-center gap-2">
                          {active ? <Heart className="h-4 w-4 text-rose-500" /> : <Sparkles className="h-4 w-4 text-emerald-400" />}
                          {opt.text}
                        </span>
                      </Button>
                    );
                  })}
              </div>
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                >
                  Previous
                </Button>
                {currentIndex < total - 1 ? (
                  <Button
                    onClick={() => setCurrentIndex(Math.min(total - 1, currentIndex + 1))}
                    disabled={answers[(currentQuestion.questionId || currentQuestion.id || String(currentIndex))] == null}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={submit}
                    disabled={isLoading || submitted || answers[(currentQuestion.questionId || currentQuestion.id || String(currentIndex))] == null}
                  >
                    Submit responses
                  </Button>
                )}
              </div>
            </Card>
          ) : null}
        </div>
      </div>
      {showSuccess ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <Card className="w-full max-w-md space-y-4 p-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-900">Thanks for your answers!</h2>
              <p className="text-sm text-slate-600">
                Your responses have been saved. We will take you back to your dashboard now.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSuccess(false);
                  setRedirecting(true);
                  router.push("/dashboard/student");
                }}
              >
                Go to dashboard
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </DashboardShell>
  );
}
