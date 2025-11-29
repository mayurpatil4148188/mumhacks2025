"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function AssessmentTrendChart({
  data,
}: {
  data: { date: string; baseline: number; followup: number }[];
}) {
  const formattedData = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="baseline" stroke="#115e59" strokeWidth={2} name="Baseline" />
        <Line type="monotone" dataKey="followup" stroke="#0ea5e9" strokeWidth={2} name="Follow-up" />
      </LineChart>
    </ResponsiveContainer>
  );
}

