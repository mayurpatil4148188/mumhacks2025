 "use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle, Clock3 } from "lucide-react";

export function BaselineStatus() {
  const [loading, setLoading] = useState(true);
  const [baselineCompleted, setBaselineCompleted] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/tests/status");
        const data = await res.json();
        if (!mounted) return;
        setBaselineCompleted(Boolean(data.baselineCompleted));
        setStatus(data.status || null);
      } catch (err) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="text-sm text-slate-600">
        <Clock3 className="mr-1 inline h-4 w-4 text-emerald-500" />
        Checking your assessment status…
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="space-y-4 p-5">
        <div className="flex items-center gap-2">
          {baselineCompleted ? (
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          ) : (
            <Sparkles className="h-5 w-5 text-amber-500" />
          )}
          <h2 className="text-lg font-semibold text-slate-900">Baseline check-in</h2>
        </div>
        <p className="text-sm text-slate-600">
          A quick set of questions to understand how you are feeling overall.
        </p>
        <Button asChild disabled={baselineCompleted}>
          <Link href="/dashboard/student/assessments/start?type=baseline">
            {baselineCompleted ? "Already completed" : "Start baseline"}
          </Link>
        </Button>
        {baselineCompleted ? (
          <p className="text-xs font-semibold text-emerald-700">
            You already completed your baseline assessment. Thank you!
          </p>
        ) : null}
        {status && !baselineCompleted ? (
          <p className="text-xs text-slate-500">Current status: {status}</p>
        ) : null}
      </Card>
      <Card className="space-y-4 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-sky-500" />
          <h2 className="text-lg font-semibold text-slate-900">Follow-up check-in</h2>
        </div>
        <p className="text-sm text-slate-600">
          Short follow-up on areas that need a bit more attention.
        </p>
        <Button variant="outline" asChild>
          <Link href="/dashboard/student/assessments/start?type=followup">Start follow-up</Link>
        </Button>
      </Card>
    </div>
  );
}
