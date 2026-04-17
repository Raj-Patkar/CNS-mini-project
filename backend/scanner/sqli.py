import requests
import time
from config import SQLI_PAYLOADS, TIMEOUT

def detect_sqli(base_url):
    endpoints = [
        f"{base_url}/rest/products/search?q=",
        f"{base_url}/rest/products/",
    ]

    error_keywords = [
        "sql syntax",
        "mysql",
        "sqlite",
        "syntax error",
        "unexpected token",
        "unterminated"
    ]

    findings = []

    for endpoint in endpoints:
        try:
            # 🔹 Baseline request
            normal_res = requests.get(endpoint + "test", timeout=TIMEOUT)
            normal_text = normal_res.text.lower()
            baseline_time = normal_res.elapsed.total_seconds()

            for payload in SQLI_PAYLOADS:
                target_url = endpoint + payload

                try:
                    start_time = time.time()
                    res = requests.get(target_url, timeout=TIMEOUT)
                    end_time = time.time()
                except requests.exceptions.RequestException:
                    continue

                response_text = res.text.lower()
                response_time = end_time - start_time

                #  1. Error-based SQLi
                if any(err in response_text for err in error_keywords):
                    findings.append({
                        "type": "Error-based SQL Injection",
                        "severity": "HIGH",
                        "confidence": "High",
                        "endpoint": target_url,
                        "payload": payload,
                        "status_code": res.status_code,
                        "evidence": "Database error message detected in response",
                        "fix": "Use parameterized queries and avoid exposing DB errors"
                    })

                #  2. Boolean-based SQLi (better logic)
                elif response_text != normal_text:
                    findings.append({
                        "type": "Boolean-based SQL Injection",
                        "severity": "MEDIUM",
                        "confidence": "Medium",
                        "endpoint": target_url,
                        "payload": payload,
                        "status_code": res.status_code,
                        "evidence": "Response content differs from baseline request, indicating possible SQL query manipulation",
                        "fix": "Sanitize inputs and use prepared statements"
                    })

                #  3. Time-based SQLi (baseline comparison)
                elif (response_time - baseline_time) > 3:
                    findings.append({
                        "type": "Time-based SQL Injection",
                        "severity": "HIGH",
                        "confidence": "Medium",
                        "endpoint": target_url,
                        "payload": payload,
                        "status_code": res.status_code,
                        "evidence": f"Delayed response detected ({round(response_time,2)}s)",
                        "fix": "Use parameterized queries and limit query execution time"
                    })

        except requests.exceptions.RequestException:
            continue

    #  Deduplicate by type (important)
    unique_findings = {}
    for f in findings:
        key = f["type"]
        if key not in unique_findings:
            unique_findings[key] = f

    findings = list(unique_findings.values())

    #  Final response
    if findings:
        severity = "LOW"
        if any(f["severity"] == "HIGH" for f in findings):
            severity = "HIGH"
        elif any(f["severity"] == "MEDIUM" for f in findings):
            severity = "MEDIUM"

        return {
            "vulnerable": True,
            "type": "SQL Injection",
            "severity": severity,
            "confidence": "High",
            "findings": findings
        }

    return {
        "vulnerable": False,
        "message": "No SQL Injection detected",
        "confidence": "Low"
    }