# 🔐 Web Vulnerability Scanner

## 📌 Overview

This project is an automated web vulnerability detection tool that identifies common security issues in web applications such as:

* SQL Injection (SQLi)
* Cross-Site Scripting (XSS)
* Authentication Bypass

The tool accepts a target URL, performs controlled payload-based testing, analyzes server responses, and generates a structured report with recommended security fixes.

---

## 🎯 Objectives

* Automate detection of common web vulnerabilities
* Simulate basic attack scenarios using payload injection
* Analyze server responses to identify weaknesses
* Provide security recommendations for mitigation

---

## 🏗️ Tech Stack

* **Backend:** Python (Flask)
* **Libraries:** requests, BeautifulSoup
* **Testing Platform:** OWASP Juice Shop

---

## ⚙️ Features

* 🔍 Automated vulnerability scanning
* 💉 Payload-based testing (SQLi, XSS, Auth Bypass)
* 📊 JSON-based report generation
* 🛡️ Security recommendations for each vulnerability

---

## 📁 Project Structure

```
backend/
│
├── app.py
├── config.py
├── requirements.txt
│
├── scanner/
│   ├── sqli.py
│   ├── xss.py
│   ├── auth_bypass.py
│   ├── utils.py
│
├── routes/
│   └── scan_routes.py
```

---

## 🚀 How It Works

1. User provides a target URL
2. Backend sends crafted payloads to the application
3. Server responses are analyzed
4. Vulnerabilities are detected
5. A report is generated with fixes

---

## 🧪 API Usage

### Endpoint:

```
POST /api/scan
```

### Request Body:

```json
{
  "url": "http://localhost:3000"
}
```

### Sample Response:

```json
{
  "sqli": {
    "vulnerable": true,
    "payload": "' OR 1=1 --",
    "fix": "Use parameterized queries"
  },
  "xss": {
    "vulnerable": true,
    "payload": "<script>alert(1)</script>",
    "fix": "Sanitize user input"
  },
  "auth_bypass": {
    "vulnerable": true,
    "fix": "Implement proper authentication"
  }
}
```

---

## 🛠️ Installation & Setup

```bash
git clone <repo-url>
cd backend
pip install -r requirements.txt
python app.py
```

Server will run on:

```
http://127.0.0.1:5000
```

---

## 🧪 Testing

Test the API using tools like Postman.

Target application:

* OWASP Juice Shop

---

## ⚠️ Limitations

* Detects only basic/reflected vulnerabilities
* Limited to predefined payloads
* Does not cover advanced attack vectors

---

## 🚀 Future Enhancements

* Add more vulnerability modules (CSRF, SSRF)
* Improve detection accuracy
* Add frontend dashboard
* Generate PDF reports

---



## 📚 References

* OWASP Top 10
* OWASP Juice Shop Documentation

---

## 🧠 Conclusion

This project demonstrates how automated tools can assist in identifying common web vulnerabilities and improving application security through early detection and mitigation.

---
