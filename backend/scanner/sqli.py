import requests
from config import SQLI_PAYLOADS, TIMEOUT


def detect_sqli(base_url):
    """
    Tests for SQL Injection on the /rest/user/login endpoint of OWASP Juice Shop.

        Strategy:
    - Inject SQLi payloads into the 'email' field
    - A fixed dummy password is used so only the email field is being tested
    - If login succeeds (i.e., no 'authentication failed' in response and
      status != 401), the endpoint is considered vulnerable 
    """
    url = f"{base_url}/rest/user/login"
    results = []

    for payload in SQLI_PAYLOADS:
        data = {
            "email": payload,       # Injecting only into email field
            "password": "dummy123"  # Fixed password — not the injection point
        }

        try:
            res = requests.post(url, json=data, timeout=TIMEOUT)
            response_text = res.text.lower()
            status_code = res.status_code
            # Juice Shop returns 401 + "Invalid email or password" on failure
            # A successful SQLi bypass returns 200 with a token
            is_vulnerable = (
                status_code == 200 and
                "authentication failed" not in response_text and
                "invalid email" not in response_text
            )

            if is_vulnerable:
                return {
                    "vulnerable": True,
                    "type": "SQL Injection",
                    "severity": "HIGH",
                    "confidence": "High",
                    "endpoint": url,
                    "payload": payload,
                    "status_code": status_code,
                    "evidence": "Login succeeded with injected SQL payload",
                    "fix": (
                        "Use parameterized queries or an ORM. "
                        "Never interpolate user input directly into SQL strings. "
                        "Also enforce strict input validation on the email field."
                    )
                }
            
            # Track attempted payloads for debugging
            results.append({
                "payload": payload,
                "status_code": status_code,
                "result": "not vulnerable"
            })

        except requests.exceptions.ConnectionError:
            return {
                "vulnerable": False,
                "error": f"Could not connect to {url}. Is Juice Shop running?",
                "confidence": "Low"
            }

        except requests.exceptions.Timeout:
            return {
                "vulnerable": False,
                "error": f"Request timed out after {TIMEOUT}s for payload: {payload}",
                "confidence": "Low"
            }

        except Exception as e:
            return {
                "vulnerable": False,
                "error": str(e),
                "confidence": "Low"
            }

    return {
        "vulnerable": False,
        "message": "No SQL Injection detected with current payloads",
        "tested_payloads": results,
        "confidence": "Low"
    }