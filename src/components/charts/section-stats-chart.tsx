"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function SectionStatsChart({
  data,
}: {
  data: { section: string; students: number; baselineCompleted: number; followups: number; alerts: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="section" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="students" fill="#115e59" name="Students" />
        <Bar dataKey="baselineCompleted" fill="#10b981" name="Baseline Done" />
        <Bar dataKey="followups" fill="#0ea5e9" name="Follow-ups" />
        <Bar dataKey="alerts" fill="#f59e0b" name="Alerts" />
      </BarChart>
    </ResponsiveContainer>
  );
}

