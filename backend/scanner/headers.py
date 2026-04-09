import requests
from config import TIMEOUT

def check_security_headers(base_url):
    try:
        res = requests.get(base_url, timeout=TIMEOUT)
        headers = res.headers

        missing_headers = []

        required_headers = {
            "Content-Security-Policy": "Helps prevent XSS attacks",
            "X-Frame-Options": "Prevents clickjacking",
            "X-Content-Type-Options": "Prevents MIME sniffing",
            "Strict-Transport-Security": "Enforces HTTPS"
        }

        for header, description in required_headers.items():
            if header not in headers:
                missing_headers.append({
                    "header": header,
                    "risk": description
                })

        if missing_headers:
            return {
                "vulnerable": True,
                "type": "Security Misconfiguration",
                "severity": "MEDIUM",
                "confidence": "High",
                "issue": "Missing important security headers",
                "missing_headers": missing_headers,
                "fix": "Configure proper HTTP security headers on the server"
            }

        return {
            "vulnerable": False,
            "message": "All important security headers are present"
        }

    except Exception as e:
        return {
            "vulnerable": False,
            "error": str(e)
        }