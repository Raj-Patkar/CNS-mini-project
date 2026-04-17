from playwright.sync_api import sync_playwright
from config import XSS_PAYLOADS

def detect_dom_xss(base_url):
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False)
            page = browser.new_page()

            page.goto(base_url)

            #  STEP 1: CLOSE WELCOME POPUP
            try:
                page.wait_for_selector('button:has-text("Dismiss")', timeout=5000)
                page.click('button:has-text("Dismiss")')
            except:
                pass

            page.wait_for_timeout(2000)

            #  STEP 2: OPEN SEARCH BAR
            try:
                page.click('mat-icon:has-text("search")')
            except:
                pass

            page.wait_for_timeout(1000)

            for payload in XSS_PAYLOADS:
                try:
                    detected = {"flag": False}

                    #  STEP 3: ATTACH ALERT LISTENER BEFORE ACTION
                    def handle_dialog(dialog):
                        dialog.dismiss()
                        detected["flag"] = True

                    page.on("dialog", handle_dialog)

                    #  STEP 4: FIND SEARCH INPUT
                    search_box = page.locator('input[type="text"]').first

                    search_box.click()
                    search_box.fill("")

                    # Type payload slowly for reliability
                    search_box.type(payload, delay=50)

                    page.keyboard.press("Enter")

                    # Wait for JS execution
                    page.wait_for_timeout(2000)

                    #  STEP 5: CHECK IF ALERT TRIGGERED
                    if detected["flag"]:
                        browser.close()
                        return {
                            "vulnerable": True,
                            "type": "DOM-based XSS",
                            "severity": "HIGH",
                            "confidence": "High",
                            "payload": payload,
                            "endpoint": base_url,
                            "evidence": "JavaScript alert executed in browser",
                            "fix": [
                                "Sanitize DOM inputs",
                                "Avoid unsafe DOM rendering (innerHTML)",
                                "Implement Content Security Policy (CSP)"
                            ]
                        }

                except Exception:
                    continue

            browser.close()

    except Exception as e:
        return {
            "vulnerable": False,
            "error": str(e),
            "confidence": "Low"
        }

    return {
        "vulnerable": False,
        "message": "No DOM-based XSS detected",
        "confidence": "Low"
    }