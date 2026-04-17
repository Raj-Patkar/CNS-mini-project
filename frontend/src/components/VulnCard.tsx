"use client";

import { useState } from "react";

export default function VulnCard({
  title,
  vulnerable,
  severity,
  children,
}: {
  title: string;
  vulnerable: boolean;
  severity?: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const getSeverityColor = (level?: string) => {
    if (level === "HIGH") return "text-red-500";
    if (level === "MEDIUM") return "text-yellow-400";
    if (level === "LOW") return "text-green-400";
    return "text-gray-400";
  };

  return (
    <div
      onClick={() => setOpen(!open)}
      className="bg-gray-900 p-5 rounded-xl border border-gray-700 w-full max-w-3xl cursor-pointer transition hover:border-gray-500"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>

        <div className="flex items-center gap-3">
          {/* Severity */}
          {severity && (
            <span className={`text-xs font-semibold ${getSeverityColor(severity)}`}>
              {severity}
            </span>
          )}

          {/* Status */}
          <span
            className={`text-sm font-bold ${
              vulnerable ? "text-red-500" : "text-green-500"
            }`}
          >
            {vulnerable ? "VULNERABLE" : "SAFE"}
          </span>
        </div>
      </div>

      {/* Expand Hint */}
      <p className="text-xs text-gray-500 mb-2">
        {open ? "Click to collapse ▲" : "Click to view details ▼"}
      </p>

      {/* Content */}
      {open && (
        <div className="text-sm text-gray-300 mt-2 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}