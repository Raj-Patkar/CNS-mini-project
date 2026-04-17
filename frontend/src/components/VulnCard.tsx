"use client";

import { useState } from "react";

interface VulnCardProps {
  title: string;
  vulnerable: boolean;
  severity?: string;
  summary?: string;
  children?: React.ReactNode;
}

export default function VulnCard({
  title,
  vulnerable,
  severity,
  summary,
  children,
}: VulnCardProps) {
  const [open, setOpen] = useState(false);

  const severityConfig: Record<string, { badge: string; dot: string }> = {
    HIGH:   { badge: "bg-red-50 text-red-600 border-red-200",      dot: "bg-red-400" },
    MEDIUM: { badge: "bg-yellow-50 text-yellow-600 border-yellow-200", dot: "bg-yellow-400" },
    LOW:    { badge: "bg-green-50 text-green-600 border-green-200", dot: "bg-green-400" },
  };
  const sev = severity ? severityConfig[severity] : null;

  return (
    <>
      {/* Horizontal Card */}
      <div
        onClick={() => vulnerable && setOpen(true)}
        className={`w-full bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 flex items-center gap-4 transition-all duration-150
          ${vulnerable ? "cursor-pointer hover:shadow-md hover:border-slate-200 hover:-translate-y-px" : "opacity-80"}`}
      >
        {/* Status dot */}
        <div className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${vulnerable ? (sev?.dot ?? "bg-red-400") : "bg-emerald-400"}`} />

        {/* Title */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          {summary && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">{summary}</p>
          )}
        </div>

        {/* Severity badge */}
        {sev && severity && (
          <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${sev.badge}`}>
            {severity}
          </span>
        )}

        {/* Status badge */}
        <span
          className={`flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full border ${
            vulnerable
              ? "bg-red-50 text-red-600 border-red-200"
              : "bg-emerald-50 text-emerald-600 border-emerald-200"
          }`}
        >
          {vulnerable ? "Vulnerable" : "Safe"}
        </span>

        {/* Chevron */}
        {vulnerable && (
          <svg className="flex-shrink-0 w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto border border-slate-100 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="sticky top-0 bg-white px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${sev?.dot ?? "bg-red-400"}`} />
                <h2 className="text-base font-bold text-slate-800">{title}</h2>
                {sev && severity && (
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${sev.badge}`}>
                    {severity}
                  </span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 text-sm text-slate-600 space-y-4">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
