import { ScanResult } from "@/types/scan";
import SummaryCard from "./SummaryCard";
import VulnCard from "./VulnCard";

export default function Results({ data }: { data: ScanResult }) {
  const r = data;
  if (!r) return null;

  return (
    <div className="flex flex-col items-center gap-6 mt-6 w-full">

      <SummaryCard data={data} />

      {/* SQL Injection */}
      <VulnCard
        title="SQL Injection"
        vulnerable={r?.sqli?.vulnerable}
        severity={r?.sqli?.severity}
      >
        {r?.sqli?.vulnerable && (
          <div className="space-y-2">

            <div>
              <p><strong>Type:</strong> {r.sqli.type}</p>
              <p><strong>Confidence:</strong> {r.sqli.confidence}</p>
            </div>

            <div className="bg-gray-800 p-3 rounded">
              <p><strong>Endpoint:</strong> {r.sqli.endpoint}</p>
              <p><strong>Status Code:</strong> {r.sqli.status_code}</p>
            </div>

            <div>
              <p className="font-semibold text-blue-400">Payload:</p>
              <p className="bg-gray-800 p-2 rounded mt-1 text-red-400">
                {r.sqli.payload}
              </p>
            </div>

            <div>
              <p><strong>Evidence:</strong> {r.sqli.evidence}</p>
            </div>

            <div>
              <p className="font-semibold text-green-400">Fix:</p>
              <p className="bg-gray-800 p-2 rounded mt-1">{r.sqli.fix}</p>
            </div>

          </div>
        )}
      </VulnCard>

      {/* DOM XSS */}
      <VulnCard
        title="DOM XSS"
        vulnerable={r?.xss?.dom?.vulnerable}
        severity={r?.xss?.dom?.severity}
      >
        {r?.xss?.dom?.vulnerable && (
          <div className="space-y-2">

            <div>
              <p><strong>Type:</strong> {r.xss.dom.type}</p>
              <p><strong>Confidence:</strong> {r.xss.dom.confidence}</p>
            </div>

            <div className="bg-gray-800 p-3 rounded">
              <p><strong>Endpoint:</strong> {r.xss.dom.endpoint}</p>
            </div>

            <div>
              <p className="font-semibold text-blue-400">Payload:</p>
              <p className="bg-gray-800 p-2 rounded mt-1 text-red-400">
                {r.xss.dom.payload}
              </p>
            </div>

            <div>
              <p><strong>Evidence:</strong> {r.xss.dom.evidence}</p>
            </div>

            <div>
              <p className="font-semibold text-green-400">Fix:</p>
              <div className="bg-gray-800 p-2 rounded mt-1">
                {r.xss.dom.fix?.map((f, i) => (
                  <p key={i}>• {f}</p>
                ))}
              </div>
            </div>

          </div>
        )}
      </VulnCard>

      {/* Authentication Bypass */}
      <VulnCard
        title="Authentication Bypass"
        vulnerable={r?.auth_bypass?.vulnerable}
        severity={r?.auth_bypass?.severity}
      >
        {r?.auth_bypass?.vulnerable && (
          <div className="space-y-2">

            <div>
              <p><strong>Type:</strong> {r.auth_bypass.type}</p>
              <p><strong>Confidence:</strong> {r.auth_bypass.confidence}</p>
            </div>

            <div className="bg-gray-800 p-3 rounded">
              <p><strong>Endpoint:</strong> {r.auth_bypass.endpoint}</p>
            </div>

            <div>
              <p className="font-semibold text-blue-400">Payload:</p>
              <div className="bg-gray-800 p-3 rounded mt-1">
                <p>
                  <span className="text-gray-400">Username:</span>{" "}
                  {r.auth_bypass.payload?.username}
                </p>
                <p>
                  <span className="text-gray-400">Password:</span>{" "}
                  <span className="text-red-400">
                    {r.auth_bypass.payload?.password}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <p><strong>Evidence:</strong> {r.auth_bypass.evidence}</p>
            </div>

            <div>
              <p className="font-semibold text-green-400">Fix:</p>
              <div className="bg-gray-800 p-2 rounded mt-1">
                {r.auth_bypass.fix?.map((f, i) => (
                  <p key={i}>• {f}</p>
                ))}
              </div>
            </div>

          </div>
        )}
      </VulnCard>

      {/* Security Headers */}
      <VulnCard
        title="Security Headers"
        vulnerable={r?.headers?.vulnerable}
        severity={r?.headers?.severity}
      >
        {r?.headers?.vulnerable && (
          <div className="space-y-2">

            <div>
              <p><strong>Type:</strong> {r.headers.type}</p>
              <p><strong>Confidence:</strong> {r.headers.confidence}</p>
            </div>

            <div className="bg-gray-800 p-3 rounded text-yellow-400">
              <p><strong>Issue:</strong> {r.headers.issue}</p>
            </div>

            <div>
              <p className="font-semibold text-red-400">Missing Headers:</p>
              <div className="bg-gray-800 p-2 rounded mt-1">
                {r.headers.missing_headers?.map((h, i) => (
                  <p key={i}>
                    • <span className="font-medium">{h.header}</span> → {h.risk}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold text-green-400">Fix:</p>
              <p className="bg-gray-800 p-2 rounded mt-1">
                {r.headers.fix}
              </p>
            </div>

          </div>
        )}
      </VulnCard>

    </div>
  );
}