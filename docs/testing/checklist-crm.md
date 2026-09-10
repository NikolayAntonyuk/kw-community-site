# CRM Management Portal — Test Checklist
**Suite:** CRM Management  
**Description:** Тестування панелі керування CRM для адміністрування спеціалістами, заявками, листами та зворотніх зв'язків  
**Priority:** High 🔴  
**Status:** Active

---

## Module 1: Authentication & Login (TC-CRM-001, TC-CRM-002, TC-CRM-003, TC-CRM-018)

| # | Test Case | Steps | Expected | Status |
|---|-----------|-------|----------|--------|
| 1 | Load CRM login page | 1. Navigate to https://ukrainianskw.ca/crm.html | Login form displays with email/password fields; app view hidden | ☐ Pass ☐ Fail |
| 2 | Invalid credentials error | 1. Enter wrong email/password 2. Click "Увійти" | Error message "Помилка" displays; auth fails | ☐ Pass ☐ Fail |
| 3 | Successful login | 1. Enter valid Firebase credentials 2. Click "Увійти" | Dashboard displays with all tabs; user logged in | ☐ Pass ☐ Fail |
| 4 | Logout functionality | 1. Click "Вийти" button in app | Login form re-displays; session terminated | ☐ Pass ☐ Fail |

---

## Module 2: Navigation & Tab Switching (TC-CRM-004)

| # | Test Case | Steps | Expected | Status |
|---|-----------|-------|----------|--------|
| 1 | Tab Navigation | 1. Click each tab (📊 Dashboard, 👥 Specialists, ✉️ Emails, 📋 Applications, 📦 Archived, ⚠️ Feedback) | Correct tab displays; previous hidden; active highlighted | ☐ Pass ☐ Fail |

---

## Module 3: Dashboard (TC-CRM-005)

| # | Test Case | Steps | Expected | Status |
|---|-----------|-------|----------|--------|
| 1 | Dashboard stats | 1. Open Dashboard tab | Stats cards show: Total Specialists, Pending Apps, Rejected, Emails | ☐ Pass ☐ Fail |
| 2 | Dashboard table load | 1. Inspect application list | Table renders with correct data from Firestore | ☐ Pass ☐ Fail |

---

## Module 4: Specialists Catalog (TC-CRM-006, TC-CRM-007, TC-CRM-008, TC-CRM-009, TC-CRM-010, TC-CRM-017)

| # | Test Case | Steps | Expected | Status |
|---|-----------|-------|----------|--------|
| 1 | Load specialists table | 1. Open Specialists tab | Table displays approved specialists from Firestore (status='approved') | ☐ Pass ☐ Fail |
| 2 | Add new specialist modal | 1. Click ➕ button | Modal opens with title "Новий спеціаліст"; all fields empty | ☐ Pass ☐ Fail |
| 3 | Edit specialist modal | 1. Click edit button on a specialist | Modal opens with "Редагувати"; fields pre-populated with data | ☐ Pass ☐ Fail |
| 4 | Save specialist changes | 1. Modify specialist fields 2. Click "Зберегти" | Firestore updates; table reflects changes immediately | ☐ Pass ☐ Fail |
| 5 | Delete specialist | 1. Click delete button 2. Confirm | Specialist archived; removed from active list | ☐ Pass ☐ Fail |
| 6 | Search/filter specialists | 1. Type name or city in search box | Table filters in real-time showing only matches | ☐ Pass ☐ Fail |

---

## Module 5: Applications Queue (TC-CRM-011, TC-CRM-012, TC-CRM-013)

| # | Test Case | Steps | Expected | Status |
|---|-----------|-------|----------|--------|
| 1 | Pending applications list | 1. Open Applications tab | Displays all pending applications (status='pending') from Firestore | ☐ Pass ☐ Fail |
| 2 | Approve application | 1. Click "Підтвердити" on pending app | Status updates to 'approved' in Firestore; specialist appears in Catalog | ☐ Pass ☐ Fail |
| 3 | Reject application | 1. Click "Відхилити" 2. Select/type reason 3. Confirm | Status updates to 'rejected'; EmailJS sends notification to applicant | ☐ Pass ☐ Fail |

---

## Module 6: Emails (TC-CRM-014)

| # | Test Case | Steps | Expected | Status |
|---|-----------|-------|----------|--------|
| 1 | Load emails inbox | 1. Open Emails tab | Displays emails from /api/emails endpoint; sender, subject, date visible | ☐ Pass ☐ Fail |

---

## Module 7: Archived Specialists (TC-CRM-015)

| # | Test Case | Steps | Expected | Status |
|---|-----------|-------|----------|--------|
| 1 | View archived specialists | 1. Open Archived tab | Displays specialists from archived_specialists collection (read-only) | ☐ Pass ☐ Fail |

---

## Module 8: Feedback & Error Reports (TC-CRM-016)

| # | Test Case | Steps | Expected | Status |
|---|-----------|-------|----------|--------|
| 1 | View feedback reports | 1. Open Feedback tab | Displays user feedback from feedback collection with timestamps & category tags | ☐ Pass ☐ Fail |

---

## Module 9: Error Handling & Resilience (TC-CRM-019)

| # | Test Case | Steps | Expected | Status |
|---|-----------|-------|----------|--------|
| 1 | Firebase offline handling | 1. Block Firebase URLs / disconnect network 2. Try to load/save data | Friendly error message displays; app doesn't crash | ☐ Pass ☐ Fail |

---

## Data Validation

| Field | Required | Format | Notes |
|-------|----------|--------|-------|
| Email | Yes | valid@example.com | Firebase Auth |
| Password | Yes | 6+ chars | Firebase Auth |
| Specialist Name | Yes | Text (3-100 chars) | Ukrainian/English |
| Category | Yes | Dropdown | From specialists.json |
| Phone | Yes | +1 519 XXX XXXX | E.164 format |
| Email (Spec) | No | valid@example.com | Contact info |
| Location | Yes | Dropdown | Kitchener/Waterloo/etc |

---

## Environments

- **Development (Local):** http://localhost:8080 + Firebase Emulator
- **Production:** https://ukrainianskw.ca/crm.html

---

## Browsers Tested

- Chrome (Desktop) — primary
- Firefox (Desktop) — cross-browser
- Safari (macOS) — cross-browser
- Chrome Mobile (Android) — mobile
- Safari Mobile (iOS) — mobile

---

## Dependencies

- Firebase SDK (Auth + Firestore)
- Playwright E2E tests: `/tests/e2e/crm.spec.ts`
- Firestore collections: `pending_specialists`, `archived_specialists`, `feedback`

---

## Automation Status

✅ All test cases have corresponding Playwright E2E tests in `/tests/e2e/crm.spec.ts`

---

**Last Updated:** 2026-09-10  
**Created by:** AI Assistant  
**Status:** Ready for TestoMat import
