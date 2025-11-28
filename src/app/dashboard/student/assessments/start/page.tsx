"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { studentNav } from "../../nav";

interface Question {
  questionId?: string;
  id?: string;
  text: string;
  domainTags?: string[];
}

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
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    }
  }

  const title = type === "BASELINE" ? "Baseline check-in" : "Follow-up check-in";

  return (
    <DashboardShell
      title={title}
      description="Answer honestly. There are no right or wrong answers."
      nav={studentNav}
    >
      <div className="space-y-4">
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {submitted ? (
          <Card className="p-4 text-sm text-emerald-700">
            Thank you for submitting your responses. You can close this page now.
          </Card>
        ) : null}
        <div className="space-y-3">
          {isLoading ? <p className="text-sm text-slate-600">Loading questions…</p> : null}
          {!isLoading && questions.length === 0 ? (
            <p className="text-sm text-slate-600">No questions were loaded for this assessment.</p>
          ) : null}
          {questions.map((q, index) => (
            <Card key={q.questionId || q.id || index} className="p-4">
              <p className="text-sm font-semibold text-slate-900">{q.text}</p>
              <Input
                type="number"
                min={1}
                max={5}
                placeholder="1-5"
                className="mt-2 w-32"
                onChange={(e) =>
                  setAnswers({ ...answers, [q.questionId || q.id || String(index)]: Number(e.target.value) })
                }
              />
            </Card>
          ))}
        </div>
        <Button onClick={submit} className="mt-4" disabled={isLoading || submitted}>
          Submit responses
        </Button>
      </div>
    </DashboardShell>
  );
}
