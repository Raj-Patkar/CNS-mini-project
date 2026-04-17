import { ScanResult } from "@/types/scan";
import { calculateRisk } from "@/lib/risk";

export default function SummaryCard({ data }: { data: ScanResult }) {
  const risk = calculateRisk(data);

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 w-full max-w-3xl">
      <h2 className="text-xl font-semibold mb-2">Scan Summary</h2>

      <p className="text-gray-400">Target:</p>
      <p className="mb-3">{data.target}</p>

      <p className="text-gray-400">Timestamp:</p>
      <p className="mb-3">
        {data?.timestamp ? new Date(data.timestamp).toLocaleString() : "N/A"}
      </p>

      <p className="text-gray-400">Overall Risk:</p>
      <p className={`text-lg font-bold ${risk.color}`}>
        {risk.level}
      </p>
    </div>
  );
}