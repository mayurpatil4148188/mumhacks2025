"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function ClassDomainChart({ data }: { data: { domain: string; count: number; avgRisk: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="domain" angle={-45} textAnchor="end" height={80} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#115e59" name="Alerts" />
        <Bar dataKey="avgRisk" fill="#f59e0b" name="Avg Risk" />
      </BarChart>
    </ResponsiveContainer>
  );
}

