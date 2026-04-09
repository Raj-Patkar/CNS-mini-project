import requests
from config import AUTH_BYPASS_PAYLOADS, TIMEOUT

def detect_auth_bypass(base_url):
    url = f"{base_url}/rest/user/login"

    for creds in AUTH_BYPASS_PAYLOADS:
        try:
            res = requests.post(
                url,
                json={
                    "email": creds["username"],
                    "password": creds["password"]
                },
                timeout=TIMEOUT
            )

            response = res.text.lower()

            # KEEP YOUR WORKING LOGIC (CORE)
            if "authentication failed" not in response:
                return {
                    "vulnerable": True,
                    "type": "Authentication Bypass",
                    "severity": "HIGH",
                    "confidence": "High",
                    "endpoint": url,
                    "payload": creds,
                    "evidence": "Login response did not contain failure message",
                    "fix": [
                        "Implement proper authentication checks",
                        "Use parameterized queries",
                        "Validate user credentials strictly",
                        "Implement account lockout mechanisms"
                    ]
                }

        except Exception:
            continue

    return {
        "vulnerable": False,
        "message": "No authentication bypass detected",
        "confidence": "Low"
    }