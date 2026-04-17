import { ScanResult } from "@/types/scan";
import { calculateRisk } from "@/lib/risk";

export default function SummaryCard({ data }: { data: ScanResult }) {
  const risk = calculateRisk(data);

  const riskBg: Record<string, string> = {
    "text-red-500":   "bg-red-50 text-red-600 border-red-200",
    "text-yellow-400":"bg-yellow-50 text-yellow-600 border-yellow-200",
    "text-green-400": "bg-green-50 text-green-600 border-green-200",
    "text-gray-400":  "bg-slate-50 text-slate-500 border-slate-200",
  };
  const badgeClass = riskBg[risk.color] ?? "bg-slate-50 text-slate-500 border-slate-200";

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0">
      {/* Target + Timestamp */}
      <div className="flex-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Target
        </p>
        <p className="text-slate-800 font-semibold text-sm break-all">{data.target}</p>
        
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px bg-slate-100 h-12 mx-6" />

      {/* Risk Level */}
      <div className="flex items-center gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Overall Risk
          </p>
          <span className={`inline-block text-sm font-bold px-3 py-1 rounded-full border ${badgeClass}`}>
            {risk.level}
          </span>
        </div>
      </div>
    </div>
  );
}
