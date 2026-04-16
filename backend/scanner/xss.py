from config import XSS_PAYLOADS
from scanner.utils import send_get_request
import urllib.parse
import html

def detect_reflected_xss(base_url):
    endpoint = f"{base_url}/rest/products/search?q="

    for payload in XSS_PAYLOADS:
        encoded_payload = urllib.parse.quote(payload)
        url = endpoint + encoded_payload

        res = send_get_request(url)
        if not res:
            continue

        response = res.text.lower()

        if payload.lower() in response:
            return {
                "vulnerable": True,
                "type": "Reflected XSS",
                "severity": "MEDIUM",
                "confidence": "High",
                "endpoint": endpoint,
                "payload": payload,
                "evidence": "Payload reflected in response",
                "fix": [
                    "Sanitize user input",
                    "Escape output",
                    "Implement CSP"
                ]
            }

        escaped_payload = html.escape(payload).lower()
        if escaped_payload in response:
            return {
                "vulnerable": True,
                "type": "Reflected XSS (Encoded)",
                "severity": "LOW",
                "confidence": "Medium",
                "endpoint": endpoint,
                "payload": payload,
                "evidence": "Payload reflected in encoded form",
                "fix": [
                    "Ensure proper encoding"
                ]
            }

    return {
        "vulnerable": False,
        "message": "No reflected XSS detected",
        "confidence": "Low"
    }