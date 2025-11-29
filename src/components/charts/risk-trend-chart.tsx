"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function RiskTrendChart({ data }: { data: { date: string; avgRisk: number }[] }) {
  const formattedData = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 3]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="avgRisk" stroke="#115e59" strokeWidth={2} name="Avg Risk" />
      </LineChart>
    </ResponsiveContainer>
  );
}

