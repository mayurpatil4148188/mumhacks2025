"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Alert {
  _id: string;
  domainFlags: { domain: string; riskLevel: number; alertLevel: string }[];
  studentId: string;
  status: string;
}

export default function TeacherAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/alerts")
      .then((res) => res.json())
      .then((data) => setAlerts(data || []));
  }, []);

  async function sendChat() {
    const res = await fetch("/api/chat/teacher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teacherId: "self",
        studentId: alerts[0]?.studentId,
        schoolId: "current",
        message,
      }),
    });
    const data = await res.json();
    setReply(data.reply || "");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Alerts</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {alerts.map((alert) => (
          <Card key={alert._id} className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Alert #{alert._id.slice(-6)}</p>
              <Badge variant={alert.domainFlags.some((d) => d.alertLevel === "RED") ? "danger" : "warning"}>
                {alert.domainFlags[0]?.alertLevel || "YELLOW"}
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-slate-700">
              {alert.domainFlags.map((f, idx) => (
                <p key={idx}>
                  {f.domain}: risk {f.riskLevel}
                </p>
              ))}
            </div>
            <Button size="sm" variant="outline">
              Mark as acknowledged
            </Button>
          </Card>
        ))}
      </div>

      <Card className="space-y-3 p-4">
        <p className="text-sm font-semibold text-slate-900">Chat with MITR assistant</p>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask for guidance"
        />
        <Button onClick={sendChat} disabled={!message}>
          Send
        </Button>
        {reply ? <p className="text-sm text-slate-700">Assistant: {reply}</p> : null}
      </Card>
    </div>
  );
}
