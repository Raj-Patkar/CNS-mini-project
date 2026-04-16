import json
import os
from datetime import datetime
from flask import Blueprint, request, jsonify

from scanner.sqli import detect_sqli
from scanner.auth_bypass import detect_auth_bypass
from scanner.headers import check_security_headers

# ✅ Updated XSS imports
from scanner.xss import detect_reflected_xss
from scanner.xss_dom import detect_dom_xss

scan_bp = Blueprint("scan", __name__)

REPORT_DIR = os.path.join(os.path.dirname(__file__), "..", "report")


def save_report(results: dict):
    """Saves the scan result to report/sample.json with a timestamp."""
    os.makedirs(REPORT_DIR, exist_ok=True)
    report_path = os.path.join(REPORT_DIR, "sample.json")

    report = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "results": results
    }

    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)

    return report_path


@scan_bp.route("/scan", methods=["POST"])
def scan():
    data = request.get_json()

    # --- Input validation ---
    if not data or "url" not in data:
        return jsonify({"error": "Missing 'url' in request body"}), 400

    url = data["url"].strip().rstrip("/")

    if not url.startswith(("http://", "https://")):
        return jsonify({"error": "Invalid URL. Must start with http:// or https://"}), 400

    # --- Run scanners ---

    # 🔥 Run both XSS scanners separately
    reflected_xss_result = detect_reflected_xss(url)
    dom_xss_result = detect_dom_xss(url)

    # 🔥 Combine XSS results
    xss_result = {
        "reflected": reflected_xss_result,
        "dom": dom_xss_result
    }

    results = {
        "target": url,
        "sqli": detect_sqli(url),
        "xss": xss_result,
        "auth_bypass": detect_auth_bypass(url),
        "headers": check_security_headers(url),
    }

    # --- Save to report ---
    save_report(results)

    return jsonify(results), 200