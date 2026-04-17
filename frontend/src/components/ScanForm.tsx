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
    <div className="flex flex-col items-center gap-4 w-full">

      <input
        type="text"
        placeholder="http://localhost:3000"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="px-4 py-2 w-96 rounded bg-gray-800 text-white border border-gray-600"
      />

      <button
        onClick={handleScan}
        className="px-6 py-2 bg-red-600 rounded hover:bg-red-700"
      >
        {loading ? "Scanning..." : "Start Scan"}
      </button>

      {data && <Results data={data} />}
    </div>
  );
}