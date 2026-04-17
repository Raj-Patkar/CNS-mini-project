import { ScanResult } from "@/types/scan";

export const calculateRisk = (data: ScanResult) => {
  let score = 0;

  // 🔹 SQLi (based on findings count)
  if (data?.sqli?.findings?.length) {
    score += Math.min(3, data.sqli.findings.length);
  }

  // 🔹 XSS (DOM + Reflected)
  if (data?.xss?.dom?.vulnerable) score += 3;
  if (data?.xss?.reflected?.vulnerable) score += 3;

  // 🔹 Auth Bypass
  if (data?.auth_bypass?.vulnerable) score += 3;

  // 🔹 Headers (ONLY ONCE based on severity)
  if (data?.headers?.vulnerable) {
    if (data.headers.severity === "HIGH") score += 3;
    else if (data.headers.severity === "MEDIUM") score += 2;
    else if (data.headers.severity === "LOW") score += 1;
  }

  // 🔹 Final Risk Level
  if (score >= 6) return { level: "HIGH", color: "text-red-500" };
  if (score >= 3) return { level: "MEDIUM", color: "text-yellow-400" };
  return { level: "SAFE", color: "text-green-500" };
};