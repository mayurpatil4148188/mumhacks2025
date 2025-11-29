"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["#10b981", "#0ea5e9", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function DomainDistributionChart({ data }: { data: { domain: string; count: number; percentage?: number }[] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ domain, count }) => {
            const pct = total > 0 ? ((count / total) * 100).toFixed(0) : "0";
            return `${domain}: ${pct}%`;
          }}
          outerRadius={80}
          fill="#8884d8"
          dataKey="count"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number, name: string, props: any) => {
          const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
          return [`${value} (${pct}%)`, name];
        }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

