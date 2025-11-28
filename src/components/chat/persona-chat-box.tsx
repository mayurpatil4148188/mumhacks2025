"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, User, Bot } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

export function PersonaChatBox({
  studentId,
  studentName,
  persona,
}: {
  studentId: string;
  studentName: string;
  persona: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage() {
    if (!input.trim()) return;
    setError(null);
    const newMessages = [...messages, { role: "user", content: input.trim() }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/principal/student-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, message: input.trim(), persona }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = (data as any).error || "Chat failed";
        throw new Error(msg);
      }
      const reply = (data as any).reply || "";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err: any) {
      setError(err.message || "Chat failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-emerald-600" />
        <div>
          <p className="text-sm font-semibold text-slate-900">Chat about {studentName}</p>
          <p className="text-xs text-slate-600">Ask for insights or next steps using the persona.</p>
        </div>
      </div>
      <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/60 p-3 max-h-64 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-xs text-slate-500">Start the conversation by asking about this student.</p>
        ) : (
          messages.map((m, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 rounded-md bg-white px-3 py-2 shadow-sm"
            >
              {m.role === "user" ? (
                <User className="mt-1 h-4 w-4 text-slate-500" />
              ) : (
                <Bot className="mt-1 h-4 w-4 text-emerald-600" />
              )}
              <p className="text-sm text-slate-800">{m.content}</p>
            </div>
          ))
        )}
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      <div className="space-y-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${studentName}'s wellbeing or next steps...`}
          rows={3}
        />
        <div className="flex justify-end">
          <Button onClick={sendMessage} disabled={loading || !input.trim()}>
            <Send className="mr-1 h-4 w-4" />
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
}
