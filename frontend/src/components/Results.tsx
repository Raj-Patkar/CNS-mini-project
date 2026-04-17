import { ScanResult } from "@/types/scan";
import SummaryCard from "./SummaryCard";
import VulnCard from "./VulnCard";

export default function Results({ data }: { data: ScanResult }) {
  const r = data?.results;
  if (!r) return null;

  return (
    <div className="flex flex-col items-center gap-6 mt-6">

      <SummaryCard data={data} />

      <VulnCard title="SQL Injection" vulnerable={r?.sqli?.vulnerable}>
        {r?.sqli?.vulnerable && (
          <>
            <p>Endpoint: {r.sqli.endpoint}</p>
            <p>Payload: {r.sqli.payload}</p>
            <p>Evidence: {r.sqli.evidence}</p>
          </>
        )}
      </VulnCard>

      <VulnCard title="DOM XSS" vulnerable={r?.xss?.dom?.vulnerable}>
        {r?.xss?.dom?.vulnerable && (
          <>
            <p>Payload: {r.xss.dom.payload}</p>
            <p>Endpoint: {r.xss.dom.endpoint}</p>
            <p>Evidence: {r.xss.dom.evidence}</p>
          </>
        )}
      </VulnCard>

      <VulnCard title="Authentication Bypass" vulnerable={r?.auth_bypass?.vulnerable}>
        {r?.auth_bypass?.vulnerable && (
          <>
            <p>Endpoint: {r.auth_bypass.endpoint}</p>
            <p>
              Payload: {r.auth_bypass.payload?.username} /{" "}
              {r.auth_bypass.payload?.password}
            </p>
            <p>Evidence: {r.auth_bypass.evidence}</p>
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