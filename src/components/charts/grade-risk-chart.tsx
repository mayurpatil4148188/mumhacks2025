"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function GradeRiskChart({ data }: { data: { grade: string; avgRisk: number; studentCount: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="grade" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="avgRisk" fill="#f59e0b" name="Avg Risk" />
        <Bar dataKey="studentCount" fill="#115e59" name="Students" />
      </BarChart>
    </ResponsiveContainer>
  );
}

