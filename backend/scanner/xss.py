from config import XSS_PAYLOADS
from scanner.utils import send_get_request
import html
import urllib.parse

def detect_xss(base_url):
    endpoint = f"{base_url}/rest/products/search?q="

    # Baseline response
    baseline = send_get_request(endpoint + "normaltest")
    baseline_length = len(baseline)

    for payload in XSS_PAYLOADS:
        encoded_payload = urllib.parse.quote(payload)
        test_url = endpoint + encoded_payload

        response = send_get_request(test_url)

        if not response:
            continue

        response_lower = response.lower()

        # Variants of payload
        escaped_payload = html.escape(payload)
        url_encoded_payload = encoded_payload

        # Detection checks
        reflection = (
            payload in response or
            escaped_payload in response or
            url_encoded_payload in response
        )

        # JSON reflection check (IMPORTANT)
        json_reflection = any(
            keyword in response_lower
            for keyword in ["name", "description", "search"]
        )

        # Response difference
        diff = abs(len(response) - baseline_length)

        # Final logic
        if reflection and (json_reflection or diff > 15):
            return {
                "vulnerable": True,
                "type": "Reflected XSS (JSON-based)",
                "payload": payload,
                "endpoint": "/rest/products/search",
                "evidence": "User input reflected in JSON response",
                "severity": "MEDIUM",
                "fix": [
                    "Sanitize and validate user inputs",
                    "Use proper output encoding",
                    "Implement Content Security Policy (CSP)"
                ]
            }

    return {
        "vulnerable": False,
        "message": "No reflected XSS detected (or requires DOM-based detection)"
    }