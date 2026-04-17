"use client";

import { ScanResult } from "@/types/scan";
import SummaryCard from "./SummaryCard";
import VulnCard from "./VulnCard";
import { motion } from "framer-motion";
import RiskChart from "./RiskChart";

/** Small helper to render a labeled field row inside the modal */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
        {label}
      </p>
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
    <motion.div
      className="flex flex-col gap-4 mt-4 w-full"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >

      {/* Summary */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <SummaryCard data={data} />
      </motion.div>
      <RiskChart data={data} />
      {/* Section Label */}
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 mt-2">
        Vulnerability Checks
      </p>

      {/* Security Headers */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <VulnCard
          title="Security Headers"
          vulnerable={r?.headers?.vulnerable}
          severity={r?.headers?.severity}
          summary={
            r?.headers?.vulnerable
              ? r.headers.issue
              : "All required headers present"
          }
        >
          <Field label="Type">{r.headers?.type}</Field>
          <Field label="Confidence">{r.headers?.confidence}</Field>
          <Field label="Issue">
            <p className="text-yellow-600 font-medium">
              {r.headers?.issue}
            </p>
          </Field>
          <Field label="Missing Headers">
            <div className="space-y-1.5">
              {r.headers?.missing_headers?.map((h, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-1 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-700 text-xs font-semibold">
                      {h.header}
                    </span>

                    {/* 🔥 Severity Badge */}
                    {h.severity && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                        {h.severity}
                      </span>
                    )}
                  </div>

                  <span className="text-slate-400 text-xs">
                    → {h.risk}
                  </span>

                  {/* 🔥 Endpoint */}
                  {h.endpoint && (
                    <span className="text-[10px] text-slate-300 font-mono">
                      {h.endpoint}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Field>
          <Field label="Remediation">
            <FixBlock>{r.headers?.fix}</FixBlock>
          </Field>
        </VulnCard>
      </motion.div>

      {/* Authentication Bypass */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <VulnCard
          title="Authentication Bypass"
          vulnerable={r?.auth_bypass?.vulnerable}
          severity={r?.auth_bypass?.severity}
          summary={
            r?.auth_bypass?.vulnerable
              ? `${r.auth_bypass.type} · ${r.auth_bypass.confidence} confidence`
              : "No issues detected"
          }
        >
          <Field label="Type">{r.auth_bypass?.type}</Field>
          <Field label="Confidence">{r.auth_bypass?.confidence}</Field>
          <Field label="Endpoint">
            <span className="font-mono text-slate-600 text-xs">
              {r.auth_bypass?.endpoint}
            </span>
          </Field>
          <Field label="Payload">
            <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-mono space-y-1">
              <p>
                <span className="text-slate-400">Username:</span>{" "}
                {r.auth_bypass?.payload?.username}
              </p>
              <p>
                <span className="text-slate-400">Password:</span>{" "}
                <span className="text-red-500">
                  {r.auth_bypass?.payload?.password}
                </span>
              </p>
            </div>
          </Field>
          <Field label="Evidence">
            <p className="text-slate-600">{r.auth_bypass?.evidence}</p>
          </Field>
          <Field label="Remediation">
            <FixBlock>
              {r.auth_bypass?.fix?.map((f, i) => (
                <p key={i}>• {f}</p>
              ))}
            </FixBlock>
          </Field>
        </VulnCard>
      </motion.div>
      {/* SQL Injection */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <VulnCard
          title="SQL Injection"
          vulnerable={r?.sqli?.vulnerable}
          severity={r?.sqli?.severity}
          summary={
            r?.sqli?.vulnerable
              ? `${r.sqli.findings?.length} SQLi type(s) detected`
              : "No issues detected"
          }
        >
          {r.sqli?.findings?.length ? (
            r.sqli.findings.map((f, i) => (
              <div
                key={i}
                className="border border-slate-100 rounded-xl p-4 bg-slate-50 space-y-3"
              >
                <Field label="Type">{f.type}</Field>
                <Field label="Confidence">{f.confidence}</Field>

                <Field label="Endpoint">
                  <span className="font-mono text-slate-600 text-xs">
                    {f.endpoint}
                  </span>
                </Field>

                <Field label="Status Code">{f.status_code}</Field>

                <Field label="Payload">
                  <CodeBlock>{f.payload}</CodeBlock>
                </Field>

                <Field label="Evidence">
                  <p className="text-slate-600">{f.evidence}</p>
                </Field>

                <Field label="Remediation">
                  <FixBlock>{f.fix}</FixBlock>
                </Field>
              </div>
            ))
          ) : (
            // 🔥 FALLBACK (old format support)
            <>
              <Field label="Type">{r.sqli?.type}</Field>
              <Field label="Confidence">{r.sqli?.confidence}</Field>

              <Field label="Endpoint">
                <span className="font-mono text-slate-600 text-xs">
                  {r.sqli?.endpoint}
                </span>
              </Field>

              <Field label="Status Code">{r.sqli?.status_code}</Field>

              <Field label="Payload">
                <CodeBlock>{r.sqli?.payload}</CodeBlock>
              </Field>

              <Field label="Evidence">
                <p className="text-slate-600">{r.sqli?.evidence}</p>
              </Field>

              <Field label="Remediation">
                <FixBlock>{r.sqli?.fix}</FixBlock>
              </Field>
            </>
          )}
        </VulnCard>
      </motion.div>

      {/* XSS (Combined) */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <VulnCard
          title="Cross-Site Scripting (XSS)"
          vulnerable={
            r?.xss?.dom?.vulnerable ||
            r?.xss?.reflected?.vulnerable
          }
          severity={
            r?.xss?.dom?.severity ||
            r?.xss?.reflected?.severity
          }
          summary={
            r?.xss?.dom?.vulnerable || r?.xss?.reflected?.vulnerable
              ? "DOM / Reflected XSS detected"
              : "No issues detected"
          }
        >
          {/* 🔹 DOM XSS */}
          {r.xss?.dom?.vulnerable && (
            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50 space-y-3">
              <Field label="Type">{r.xss.dom.type}</Field>
              <Field label="Confidence">{r.xss.dom.confidence}</Field>

              <Field label="Endpoint">
                <span className="font-mono text-slate-600 text-xs">
                  {r.xss.dom.endpoint}
                </span>
              </Field>

              <Field label="Payload">
                <CodeBlock>{r.xss.dom.payload}</CodeBlock>
              </Field>

              <Field label="Evidence">
                <p className="text-slate-600">{r.xss.dom.evidence}</p>
              </Field>

              <Field label="Remediation">
                <FixBlock>
                  {r.xss.dom.fix?.map((f, i) => (
                    <p key={i}>• {f}</p>
                  ))}
                </FixBlock>
              </Field>
            </div>
          )}

          {/* 🔹 Reflected XSS */}
          <div className="border border-slate-100 rounded-xl p-4 bg-slate-50 space-y-3">
            <Field label="Type">Reflected XSS</Field>

            {r.xss?.reflected?.vulnerable ? (
              <>
                <Field label="Confidence">
                  {r.xss.reflected.confidence}
                </Field>
              </>
            ) : (
              <p className="text-green-600 text-sm">
                {r.xss?.reflected?.message || "No reflected XSS detected"}
              </p>
            )}
          </div>

          {/* 🔹 No XSS */}
          {!r.xss?.dom?.vulnerable && !r.xss?.reflected?.vulnerable && (
            <p className="text-green-600 text-sm">
              {r.xss?.reflected?.message || "No XSS vulnerabilities detected"}
            </p>
          )}
        </VulnCard>
      </motion.div>




    </motion.div>
  );
}