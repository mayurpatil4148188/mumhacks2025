"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Question {
  questionId?: string;
  id?: string;
  text: string;
  domainTags?: string[];
}

export default function StartAssessmentPage() {
  const params = useSearchParams();
  const type = (params.get("type") || "baseline").toUpperCase();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testId, setTestId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/tests/start-${type === "BASELINE" ? "baseline" : "followup"}`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setTestId(data.testInstanceId);
      setQuestions(data.questions || []);
    }
    load();
  }, [type]);

  async function submit() {
    if (!testId) return;
    const payload = {
      testInstanceId: testId,
      answers: Object.entries(answers).map(([questionId, answerValue]) => ({
        questionId,
        answerValue,
      })),
    };
    await fetch("/api/tests/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    alert("Submitted! Thank you for checking in.");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">{type === "BASELINE" ? "Baseline" : "Follow-up"} check-in</h1>
      <p className="text-sm text-slate-600">Answer honestly. There are no right or wrong answers.</p>
      <div className="space-y-3">
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
      <Button onClick={submit} className="mt-4">
        Submit responses
      </Button>
    </div>
  );
}
