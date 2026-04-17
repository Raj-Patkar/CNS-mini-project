import { ScanResult } from "@/types/scan";

export const calculateRisk = (data: ScanResult) => {
  let score = 0;

  if (data?.sqli?.findings?.length) {
    score += Math.min(3, data.sqli.findings.length);
  }
  if (data?.xss?.dom?.vulnerable) score += 3;
  if (data?.auth_bypass?.vulnerable) score += 3;
  if (data?.headers?.vulnerable) score += 1;

  // ✅ ADD THIS BLOCK
  if (data.headers?.vulnerable) {
    if (data.headers.severity === "HIGH") score += 3;
    else if (data.headers.severity === "MEDIUM") score += 2;
    else if (data.headers.severity === "LOW") score += 1;
  }
  if (score >= 6) return { level: "HIGH", color: "text-red-500" };
  if (score >= 3) return { level: "MEDIUM", color: "text-yellow-400" };
  return { level: "SAFE", color: "text-green-500" };
};
