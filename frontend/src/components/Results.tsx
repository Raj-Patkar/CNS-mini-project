import { ScanResult } from "@/types/scan";
import SummaryCard from "./SummaryCard";
import VulnCard from "./VulnCard";

/** Small helper to render a labeled field row inside the modal */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <div className="text-sm text-slate-700">{children}</div>
    </div>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-mono text-red-500 overflow-x-auto whitespace-pre-wrap break-all">
      {children}
    </pre>
  );
}

function FixBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-xs text-emerald-700">
      {children}
    </div>
  );
}

export default function Results({ data }: { data: ScanResult }) {
  const r = data;
  if (!r) return null;

  return (
    <div className="flex flex-col gap-3 mt-2 w-full">
      <SummaryCard data={data} />

      <div className="flex flex-col gap-2">
        {/* Section label */}
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 mt-2">
          Vulnerability Checks
        </p>

        {/* SQL Injection */}
        <VulnCard
          title="SQL Injection"
          vulnerable={r?.sqli?.vulnerable}
          severity={r?.sqli?.severity}
          summary={r?.sqli?.vulnerable ? `${r.sqli.type} · ${r.sqli.confidence} confidence` : "No issues detected"}
        >
          <Field label="Type">{r.sqli?.type}</Field>
          <Field label="Confidence">{r.sqli?.confidence}</Field>
          <Field label="Endpoint">
            <span className="font-mono text-slate-600 text-xs">{r.sqli?.endpoint}</span>
          </Field>
          <Field label="Status Code">{r.sqli?.status_code}</Field>
          <Field label="Payload"><CodeBlock>{r.sqli?.payload}</CodeBlock></Field>
          <Field label="Evidence"><p className="text-slate-600">{r.sqli?.evidence}</p></Field>
          <Field label="Remediation"><FixBlock>{r.sqli?.fix}</FixBlock></Field>
        </VulnCard>

        {/* DOM XSS */}
        <VulnCard
          title="DOM XSS"
          vulnerable={r?.xss?.dom?.vulnerable}
          severity={r?.xss?.dom?.severity}
          summary={r?.xss?.dom?.vulnerable ? `${r.xss.dom.type} · ${r.xss.dom.confidence} confidence` : "No issues detected"}
        >
          <Field label="Type">{r.xss?.dom?.type}</Field>
          <Field label="Confidence">{r.xss?.dom?.confidence}</Field>
          <Field label="Endpoint">
            <span className="font-mono text-slate-600 text-xs">{r.xss?.dom?.endpoint}</span>
          </Field>
          <Field label="Payload"><CodeBlock>{r.xss?.dom?.payload}</CodeBlock></Field>
          <Field label="Evidence"><p className="text-slate-600">{r.xss?.dom?.evidence}</p></Field>
          <Field label="Remediation">
            <FixBlock>
              {r.xss?.dom?.fix?.map((f, i) => <p key={i}>• {f}</p>)}
            </FixBlock>
          </Field>
        </VulnCard>

        {/* Authentication Bypass */}
        <VulnCard
          title="Authentication Bypass"
          vulnerable={r?.auth_bypass?.vulnerable}
          severity={r?.auth_bypass?.severity}
          summary={r?.auth_bypass?.vulnerable ? `${r.auth_bypass.type} · ${r.auth_bypass.confidence} confidence` : "No issues detected"}
        >
          <Field label="Type">{r.auth_bypass?.type}</Field>
          <Field label="Confidence">{r.auth_bypass?.confidence}</Field>
          <Field label="Endpoint">
            <span className="font-mono text-slate-600 text-xs">{r.auth_bypass?.endpoint}</span>
          </Field>
          <Field label="Payload">
            <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-mono space-y-1">
              <p><span className="text-slate-400">Username:</span> {r.auth_bypass?.payload?.username}</p>
              <p><span className="text-slate-400">Password:</span> <span className="text-red-500">{r.auth_bypass?.payload?.password}</span></p>
            </div>
          </Field>
          <Field label="Evidence"><p className="text-slate-600">{r.auth_bypass?.evidence}</p></Field>
          <Field label="Remediation">
            <FixBlock>
              {r.auth_bypass?.fix?.map((f, i) => <p key={i}>• {f}</p>)}
            </FixBlock>
          </Field>
        </VulnCard>

        {/* Security Headers */}
        <VulnCard
          title="Security Headers"
          vulnerable={r?.headers?.vulnerable}
          severity={r?.headers?.severity}
          summary={r?.headers?.vulnerable ? r.headers.issue : "All required headers present"}
        >
          <Field label="Type">{r.headers?.type}</Field>
          <Field label="Confidence">{r.headers?.confidence}</Field>
          <Field label="Issue">
            <p className="text-yellow-600 font-medium">{r.headers?.issue}</p>
          </Field>
          <Field label="Missing Headers">
            <div className="space-y-1.5">
              {r.headers?.missing_headers?.map((h, i) => (
                <div key={i} className="flex items-start gap-2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                  <span className="font-mono text-slate-700 text-xs font-semibold flex-shrink-0">{h.header}</span>
                  <span className="text-slate-400 text-xs">→ {h.risk}</span>
                </div>
              ))}
            </div>
          </Field>
          <Field label="Remediation"><FixBlock>{r.headers?.fix}</FixBlock></Field>
        </VulnCard>
      </div>
    </div>
  );
}
