"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { studentNav } from "../../nav";

interface Question {
  questionId?: string;
  id?: string;
  text: string;
  domainTags?: string[];
  options?: { label: string; value: number }[];
}

const defaultLikertOptions = [
  { label: "Never", value: 1 },
  { label: "Rarely", value: 2 },
  { label: "Sometimes", value: 3 },
  { label: "Often", value: 4 },
  { label: "Always", value: 5 },
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

  useEffect(() => {
    if (status === "loading") return;
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
  }, [router, status, type]);

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

  return (
    <DashboardShell
      title={title}
      description="Answer honestly. There are no right or wrong answers."
      nav={studentNav}
    >
      <div className="space-y-4">
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {redirecting ? (
          <Card className="p-4 text-sm text-emerald-700">Redirecting to your dashboard…</Card>
        ) : null}
        <div className="space-y-3">
          {isLoading ? <p className="text-sm text-slate-600">Loading questions…</p> : null}
          {!isLoading && questions.length === 0 ? (
            <p className="text-sm text-slate-600">No questions were loaded for this assessment.</p>
          ) : null}
          {questions.map((q, index) => {
            const opts = q.options && q.options.length ? q.options : defaultLikertOptions;
            const key = q.questionId || q.id || String(index);
            return (
              <Card key={key} className="space-y-3 p-4">
                <p className="text-sm font-semibold text-slate-900">{q.text}</p>
                <div className="flex flex-wrap gap-2">
                  {opts.map((opt) => {
                    const active = answers[key] === opt.value;
                    return (
                      <Button
                        key={opt.value}
                        type="button"
                        variant={active ? "default" : "outline"}
                        className="text-xs"
                        onClick={() => setAnswers({ ...answers, [key]: opt.value })}
                      >
                        {opt.label}
                      </Button>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
        <Button onClick={submit} className="mt-4" disabled={isLoading || submitted}>
          Submit responses
        </Button>
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
