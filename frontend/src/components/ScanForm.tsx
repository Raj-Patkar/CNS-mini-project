"use client";

import { useState } from "react";
import { scanWebsite } from "@/lib/api";
import Results from "./Results";

export default function ScanForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleScan = async () => {
    if (!url) return alert("Enter a URL");
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
      {/* Input row */}
      <div className="flex items-center w-full gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-red-100 focus-within:border-red-300 transition-all">
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
        <button
          onClick={handleScan}
          disabled={loading}
          className="flex-shrink-0 px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Scanning…
            </span>
          ) : (
            "Scan →"
          )}
        </button>
      </div>

      {loading && (
        <div className="w-full bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-red-400 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Running security checks…</p>
        </div>
      )}

      {data && !loading && <Results data={data} />}
    </div>
  );
}
