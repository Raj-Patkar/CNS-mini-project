"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scanWebsite } from "@/lib/api";
import Results from "./Results";

const steps = [
  "🔍 Initializing scan...",
  "💉 Testing SQL Injection...",
  "⚡ Checking XSS...",
  "🔐 Testing Auth Bypass...",
  "🛡 Checking Security Headers...",
];

export default function ScanForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [stepIndex, setStepIndex] = useState(0);

  // Fake progress steps animation
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 700);

    return () => clearInterval(interval);
  }, [loading]);

  const handleScan = async () => {
    if (!url) return alert("Enter a URL");

    setData(null);
    setStepIndex(0);
    setLoading(true);

    try {
      const result = await scanWebsite(url);
      setData(result);
    } catch (err) {
      alert("Scan failed");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-3xl">

      {/* INPUT */}
      <motion.div
        className="flex items-center w-full gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-red-100 focus-within:border-red-300"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>

        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleScan()}
          className="flex-1 bg-transparent text-slate-800 placeholder-slate-300 text-sm outline-none py-1"
        />

        <motion.button
          onClick={handleScan}
          disabled={loading}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Scanning..." : "Scan →"}
        </motion.button>
      </motion.div>

      {/* LOADER */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="w-full bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {/* Spinner */}
            <motion.div
              className="w-10 h-10 border-2 border-slate-200 border-t-red-400 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />

            {/* Steps */}
            <div className="flex flex-col items-center gap-1 text-sm">
              {steps.map((step, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0.3 }}
                  animate={{
                    opacity: i === stepIndex ? 1 : 0.3,
                    scale: i === stepIndex ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className={
                    i === stepIndex
                      ? "text-slate-700 font-medium"
                      : "text-slate-400"
                  }
                >
                  {step}
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RESULTS */}
      <AnimatePresence>
        {data && !loading && (
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Results data={data} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}