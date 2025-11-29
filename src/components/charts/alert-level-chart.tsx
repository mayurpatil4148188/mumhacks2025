"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const COLORS = {
  RED: "#dc2626",
  YELLOW: "#f59e0b",
  GREEN: "#10b981",
};

export function AlertLevelChart({ data }: { data: { level: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="level" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" name="Alerts">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.level as keyof typeof COLORS] || "#94a3b8"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

