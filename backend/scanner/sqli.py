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

    for endpoint in endpoints:
        try:
            # 🔹 Baseline request (normal)
            normal_res = requests.get(endpoint + "test", timeout=TIMEOUT)
            normal_text = normal_res.text.lower()

            for payload in SQLI_PAYLOADS:
                target_url = endpoint + payload

                # 🔹 Send payload
                start_time = time.time()
                res = requests.get(target_url, timeout=TIMEOUT)
                end_time = time.time()

                response_text = res.text.lower()
                response_time = end_time - start_time

                # ✅ 1. Error-based detection
                if any(err in response_text for err in error_keywords):
                    return {
                        "vulnerable": True,
                        "type": "Error-based SQL Injection",
                        "severity": "HIGH",
                        "confidence": "High",
                        "endpoint": target_url,
                        "payload": payload,
                        "status_code": res.status_code,
                        "evidence": "Database error message detected in response",
                        "fix": "Use parameterized queries and avoid exposing DB errors"
                    }

                # ✅ 2. Boolean-based detection (response difference)
                if abs(len(response_text) - len(normal_text)) > 50:
                    return {
                        "vulnerable": True,
                        "type": "Boolean-based SQL Injection",
                        "severity": "MEDIUM",
                        "confidence": "Medium",
                        "endpoint": target_url,
                        "payload": payload,
                        "status_code": res.status_code,
                        "evidence": "Response differs from normal input",
                        "fix": "Sanitize inputs and use prepared statements"
                    }

                # ✅ 3. Time-based detection
                if response_time > 4:
                    return {
                        "vulnerable": True,
                        "type": "Time-based SQL Injection",
                        "severity": "HIGH",
                        "confidence": "Medium",
                        "endpoint": target_url,
                        "payload": payload,
                        "status_code": res.status_code,
                        "evidence": f"Delayed response detected ({round(response_time,2)}s)",
                        "fix": "Use parameterized queries and limit query execution time"
                    }

        except requests.exceptions.RequestException:
            continue

    return {
        "vulnerable": False,
        "message": "No SQL Injection detected",
        "confidence": "Low"
    }