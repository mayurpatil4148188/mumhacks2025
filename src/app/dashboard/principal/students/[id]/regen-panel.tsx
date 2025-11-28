"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Rocket, RefreshCw } from "lucide-react";

export function RegenPanel({ studentId, onComplete }: { studentId: string; onComplete?: () => void }) {
  const [running, setRunning] = React.useState(false);
  const [statusLines, setStatusLines] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  async function run() {
    setRunning(true);
    setError(null);
    setStatusLines(["Starting re-generation...", "Re-scoring assessments...", "Updating personas..."]);
    try {
      const res = await fetch(`/api/tests/reindex?studentId=${studentId}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to re-generate");
      setStatusLines((lines) => [...lines, `Completed ${data.reindexed} assessments.`, "Done. Refreshing data..."]);
      onComplete?.();
    } catch (err: any) {
      setError(err.message || "Failed to re-generate");
      setStatusLines((lines) => [...lines, "Encountered an error."]);
    } finally {
      setRunning(false);
    }
  }

  return (
    <Card className="space-y-2 p-4">
      <div className="flex items-center gap-2">
        <Rocket className="h-5 w-5 text-emerald-600" />
        <h3 className="text-lg font-semibold text-slate-900">Re-generate summaries & personas</h3>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button onClick={run} disabled={running} className="w-fit">
        {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
        Run refresh
      </Button>
      <div className="space-y-1 text-sm text-slate-700">
        {statusLines.length === 0 ? <p>No recent activity.</p> : null}
        {statusLines.map((line, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {running && idx === statusLines.length - 1 ? (
              <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            )}
            <span>{line}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
