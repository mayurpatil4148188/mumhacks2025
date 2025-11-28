"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type TestSummary = {
  id: string;
  templateType: string;
  status: string;
  createdAt: string;
  summary: string;
};

export function AssessmentList({ studentId }: { studentId: string }) {
  const [tests, setTests] = React.useState<TestSummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/principal/student-tests?studentId=${studentId}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setTests(data.tests || []);
    } catch (err: any) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, [studentId]);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (loading) return <p className="text-sm text-slate-600">Loading…</p>;
  if (tests.length === 0) return <p className="text-sm text-slate-600">No assessments found.</p>;

  return (
    <div className="space-y-2">
      {tests.map((t) => (
        <div key={t.id} className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {t.templateType} • {new Date(t.createdAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-slate-600">Status: {t.status}</p>
            </div>
            <Badge variant="outline">Summary</Badge>
          </div>
          <p className="mt-2 text-sm text-slate-700">{t.summary}</p>
        </div>
      ))}
    </div>
  );
}
