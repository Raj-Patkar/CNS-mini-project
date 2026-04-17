"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ScanResult } from "@/types/scan";

const COLORS = {
  HIGH: "#ef4444",
  MEDIUM: "#f59e0b",
  LOW: "#22c55e",
  SAFE: "#10b981",
};

export default function RiskChart({ data }: { data: ScanResult }) {
  const counts = {
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
    SAFE: 0,
  };

  const checks = [
    data.sqli,
    data.xss.dom,
    data.auth_bypass,
    data.headers,
  ];

  checks.forEach((item: any) => {
    if (!item?.vulnerable) {
      counts.SAFE++;
    } else if (item.severity === "HIGH") {
      counts.HIGH++;
    } else if (item.severity === "MEDIUM") {
      counts.MEDIUM++;
    } else {
      counts.LOW++;
    }
  });

  const chartData = Object.entries(counts)
    .filter(([_, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-slate-600 mb-4">
        Risk Distribution
      </h3>

      <div className="h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              innerRadius={50}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[entry.name as keyof typeof COLORS]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex gap-4 justify-center mt-4 text-xs">
        {chartData.map((item, i) => (
          <div key={i} className="flex items-center gap-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: COLORS[item.name as keyof typeof COLORS] }}
            />
            {item.name} ({item.value})
          </div>
        ))}
      </div>
    </div>
  );
}