import { ScanResult } from "@/types/scan";

export const calculateRisk = (data: ScanResult) => {
  let score = 0;

  if (data.results.sqli.vulnerable) score += 3;
  if (data.results.xss.dom.vulnerable) score += 3;
  if (data.results.auth_bypass.vulnerable) score += 3;
  if (data.results.headers.vulnerable) score += 1;

  if (score >= 6) return { level: "HIGH", color: "text-red-500" };
  if (score >= 3) return { level: "MEDIUM", color: "text-yellow-400" };
  return { level: "SAFE", color: "text-green-500" };
};