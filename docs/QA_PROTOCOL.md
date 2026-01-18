# AI Agents 3000 — QA Verification Protocol (v3.6)

> **Execution Method:** Manual verification via Agent Browser Tool.
> **Frequency:** After every deployment to Production.

## 1. 🚨 Smoke Test (Critical Path)

*Goal: Ensure the site handles basic traffic without crashing.*

| ID | Test Case | Steps | Expected Result |
|----|-----------|-------|-----------------|
| **QA-001** | **Homepage Load** | 1. Navigate to `/`.<br>2. Wait for hydration. | • Page loads < 2s.<br>• "Stop Losing Revenue" H1 is visible.<br>• No console errors. |
| **QA-002** | **Navigation Menu** | 1. Click "Services".<br>2. Click "Pricing".<br>3. Click "Contact". | • Smooth scroll or navigation to sections.<br>• No 404s. |
| **QA-003** | **Mobile Responsiveness** | 1. Resize browser to 375px width.<br>2. Check Navigation. | • Hamburger menu appears.<br>• Text is readable (no horizontal scroll). |

---

## 2. 💰 Lead Generation Tools

*Goal: Verify calculators and forms are functioning (Business Critical).*

| ID | Test Case | Steps | Expected Result |
|----|-----------|-------|-----------------|
| **QA-004** | **ROI Calculator Logic** | 1. Go to `/` (Interactive Calculator).<br>2. Set "Missed Calls" to **5**.<br>3. Set "Customer Value" to **$500**. | • "Annual Revenue Lost" updates dynamically.<br>• Calculation matches formula (~$100k+). |
| **QA-005** | **Multi-Step Audit** | 1. Go to `/roofing-audit`.<br>2. Click "Start Audit".<br>3. Answer Question 1. | • Progress bar moves to 20%.<br>• Next question appears smoothly. |
| **QA-006** | **Contact Form Validation** | 1. Go to `/contact`.<br>2. Click "Submit" (empty). | • Error messages: "Name is required", "Email is required". |

---

## 3. 🤖 AI Demo (Retell Integration)

*Goal: Verify the Voice Widget is ready for interaction.*

| ID | Test Case | Steps | Expected Result |
|----|-----------|-------|-----------------|
| **QA-007** | **Widget Load** | 1. Go to `/ai-receptionist`.<br>2. Scroll to demo section. | • "Call Me" or "Start Demo" widget is visible.<br>• Status is "Idle". |
| **QA-008** | **Mic Permissions** | 1. Click "Start Call". | • **Browser requests Microphone permission.**<br>• Frontend shows "Connecting..." or "Requesting Mic". |
| **QA-009** | **Error Handling** | 1. `(Mock Test)` Block Mic permission. | • UI shows clear error: "Microphone Access Denied". |

---

## 4. 🔐 Admin Dashboard (Requires Auth)

*Goal: Ensure backend connectivity.*

| ID | Test Case | Steps | Expected Result |
|----|-----------|-------|-----------------|
| **QA-010** | **Login Page** | 1. Go to `/admin`. | • Redirects to `/auth` if not logged in. |
| **QA-011** | **Analytics Load** | 1. Login (if creds available).<br>2. View Dashboard. | • GA4 Data cards populate (not "0" or Error).<br>• Date filter defaults to "Today". |

---

## ❓ Execution Questions for User

1. **Target Environment:** Are we testing `localhost:8080` (Local) or `aiagents3000.com` (Production)?
2. **Form Submission:** Should I complete a full submission (creating a junk lead) to verify the database write?
3. **Admin Creds:** Do you want me to test the Admin Login? (I will need temporary credentials).
