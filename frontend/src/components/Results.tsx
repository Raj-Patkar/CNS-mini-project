import { ScanResult } from "@/types/scan";
import SummaryCard from "./SummaryCard";
import VulnCard from "./VulnCard";

export default function Results({ data }: { data: ScanResult }) {
  const r = data;
  if (!r) return null;

  return (
    <div className="flex flex-col items-center gap-6 mt-6">

      <SummaryCard data={data} />

      <VulnCard title="SQL Injection" vulnerable={r?.sqli?.vulnerable} severity={r?.sqli?.severity}>
        {r?.sqli?.vulnerable && (
          <>
            <p>Endpoint: {r.sqli.endpoint}</p>
            <p>Payload: {r.sqli.payload}</p>
            <p>Evidence: {r.sqli.evidence}</p>
          </>
        )}
      </VulnCard>

      <VulnCard title="DOM XSS" vulnerable={r?.xss?.dom?.vulnerable} severity={r?.xss?.dom?.severity}>
        {r?.xss?.dom?.vulnerable && (
          <>
            <p>Payload: {r.xss.dom.payload}</p>
            <p>Endpoint: {r.xss.dom.endpoint}</p>
            <p>Evidence: {r.xss.dom.evidence}</p>
          </>
        )}
      </VulnCard>

      <VulnCard
        title="Authentication Bypass"
        vulnerable={r?.auth_bypass?.vulnerable}
        severity={r?.auth_bypass?.severity}
      >
        {r?.auth_bypass?.vulnerable && (
          <>
            <p><strong>Type:</strong> {r.auth_bypass.type}</p>
            <p><strong>Confidence:</strong> {r.auth_bypass.confidence}</p>

            <p className="mt-2"><strong>Endpoint:</strong> {r.auth_bypass.endpoint}</p>

            <p>
              <strong>Payload:</strong>{" "}
              {r.auth_bypass.payload?.username} / {r.auth_bypass.payload?.password}
            </p>

            <p><strong>Evidence:</strong> {r.auth_bypass.evidence}</p>

            {/* FIX SECTION */}
            <div className="mt-2">
              <p className="font-semibold text-green-400">Fix:</p>
              {r.auth_bypass.fix?.map((f, i) => (
                <p key={i}>• {f}</p>
              ))}
            </div>
          </>
        )}
      </VulnCard>

      <VulnCard title="Security Headers" vulnerable={r?.headers?.vulnerable}>
        {r?.headers?.vulnerable &&
          r.headers.missing_headers?.map((h, i) => (
            <p key={i}>
              {h.header} → {h.risk}
            </p>
          ))}
      </VulnCard>
    </div>
  );
}