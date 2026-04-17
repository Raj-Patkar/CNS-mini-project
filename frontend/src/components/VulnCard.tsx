"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  // ESC to close modal (pro UX)
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const severityConfig: Record<string, { badge: string; dot: string }> = {
    HIGH: {
      badge: "bg-red-50 text-red-600 border-red-200",
      dot: "bg-red-400",
    },
    MEDIUM: {
      badge: "bg-yellow-50 text-yellow-600 border-yellow-200",
      dot: "bg-yellow-400",
    },
    LOW: {
      badge: "bg-green-50 text-green-600 border-green-200",
      dot: "bg-green-400",
    },
  };

  const sev = severity ? severityConfig[severity] : null;

  return (
    <>
      {/* CARD */}
      <motion.div
        onClick={() => vulnerable && setOpen(true)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={vulnerable ? { scale: 1.02 } : {}}
        whileTap={vulnerable ? { scale: 0.98 } : {}}
        transition={{ duration: 0.25 }}
        className={`w-full bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 flex items-center gap-4
          ${vulnerable ? "cursor-pointer hover:shadow-md hover:border-slate-200" : "opacity-80"}`}
      >
        {/* Status dot */}
        <div
          className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${
            vulnerable ? sev?.dot ?? "bg-red-400" : "bg-emerald-400"
          }`}
        />

        {/* Title + Summary */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          {summary && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {summary}
            </p>
          )}
        </div>

        {/* Severity */}
        {sev && severity && (
          <span
            className={`flex-shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${sev.badge}`}
          >
            {severity}
          </span>
        )}

        {/* Status */}
        <span
          className={`flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full border ${
            vulnerable
              ? "bg-red-50 text-red-600 border-red-200"
              : "bg-emerald-50 text-emerald-600 border-emerald-200"
          }`}
        >
          {vulnerable ? "Vulnerable" : "Safe"}
        </span>

        {/* Arrow */}
        {vulnerable && (
          <svg
            className="flex-shrink-0 w-4 h-4 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </motion.div>

      {/* MODAL */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto border border-slate-100 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER */}
              <div className="sticky top-0 bg-white px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      sev?.dot ?? "bg-red-400"
                    }`}
                  />
                  <h2 className="text-base font-bold text-slate-800">
                    {title}
                  </h2>
                  {sev && severity && (
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${sev.badge}`}
                    >
                      {severity}
                    </span>
                  )}
                </div>

                {/* Close */}
                <button
                  onClick={() => setOpen(false)}
                  className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100 active:scale-90"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* BODY */}
              <div className="px-6 py-5 text-sm text-slate-600 space-y-4">
                {children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}