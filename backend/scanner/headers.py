import requests
from config import TIMEOUT

def check_security_headers(base_url):
    endpoints = ["", "/login", "/admin"]

    # ✅ Use map to avoid duplicates
    issues_map = {}

    required_headers = {
        "content-security-policy": {
            "risk": "Helps prevent XSS attacks",
            "severity": "HIGH"
        },
        "x-frame-options": {
            "risk": "Prevents clickjacking",
            "severity": "MEDIUM"
        },
        "x-content-type-options": {
            "risk": "Prevents MIME sniffing",
            "severity": "LOW"
        },
        "strict-transport-security": {
            "risk": "Enforces HTTPS",
            "severity": "HIGH"
        },
        "referrer-policy": {
            "risk": "Controls referrer information leakage",
            "severity": "LOW"
        }
    }

    try:
        for path in endpoints:
            url = f"{base_url}{path}"
            res = requests.get(url, timeout=TIMEOUT)

            headers = {k.lower(): v for k, v in res.headers.items()}

            # 🔹 Missing headers check (DEDUP FIX)
            for header, info in required_headers.items():
                if header not in headers:
                    if header not in issues_map:
                        issues_map[header] = {
                            "header": header,
                            "risk": info["risk"],
                            "severity": info["severity"],
                            "endpoints": []
                        }
                    issues_map[header]["endpoints"].append(url)

            # 🔹 X-Frame-Options validation
            if "x-frame-options" in headers:
                if headers["x-frame-options"].upper() not in ["DENY", "SAMEORIGIN"]:
                    key = "x-frame-options-invalid"
                    if key not in issues_map:
                        issues_map[key] = {
                            "header": "X-Frame-Options",
                            "risk": "Improper value (should be DENY or SAMEORIGIN)",
                            "severity": "MEDIUM",
                            "endpoints": []
                        }
                    issues_map[key]["endpoints"].append(url)

            # 🔹 X-Content-Type-Options validation
            if "x-content-type-options" in headers:
                if headers["x-content-type-options"].lower() != "nosniff":
                    key = "x-content-type-options-invalid"
                    if key not in issues_map:
                        issues_map[key] = {
                            "header": "X-Content-Type-Options",
                            "risk": "Should be 'nosniff'",
                            "severity": "LOW",
                            "endpoints": []
                        }
                    issues_map[key]["endpoints"].append(url)

            # 🔹 Cookie security checks
            cookies = res.headers.get("Set-Cookie", "")

            if cookies:
                if "httponly" not in cookies.lower():
                    key = "cookie-httponly"
                    if key not in issues_map:
                        issues_map[key] = {
                            "header": "Set-Cookie",
                            "risk": "Missing HttpOnly flag (can lead to XSS cookie theft)",
                            "severity": "HIGH",
                            "endpoints": []
                        }
                    issues_map[key]["endpoints"].append(url)

                if "secure" not in cookies.lower():
                    key = "cookie-secure"
                    if key not in issues_map:
                        issues_map[key] = {
                            "header": "Set-Cookie",
                            "risk": "Missing Secure flag (cookies sent over HTTP)",
                            "severity": "HIGH",
                            "endpoints": []
                        }
                    issues_map[key]["endpoints"].append(url)

        # ✅ Convert map → list
        all_issues = list(issues_map.values())

        # 🔥 Overall severity calculation
        severity = "LOW"
        if any(i["severity"] == "HIGH" for i in all_issues):
            severity = "HIGH"
        elif any(i["severity"] == "MEDIUM" for i in all_issues):
            severity = "MEDIUM"

        if all_issues:
            return {
                "vulnerable": True,
                "type": "Security Misconfiguration",
                "severity": severity,
                "confidence": "High",
                "issue": "Security headers misconfigured or missing",
                "missing_headers": all_issues,
                "fix": "Implement proper security headers with correct values and cookie flags"
            }

        return {
            "vulnerable": False,
            "message": "All security headers properly configured"
        }

    except Exception as e:
        return {
            "vulnerable": False,
            "error": str(e)
        }