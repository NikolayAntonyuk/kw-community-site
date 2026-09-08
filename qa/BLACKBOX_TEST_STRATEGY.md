# 🎯 Black-Box Test Strategy: Ukrainians in KW (`ukrainianskw.ca`)
**Target System:** [https://ukrainianskw.ca](https://ukrainianskw.ca)  
**Methodology:** Pure Black-Box Testing (End-User & Behavioral Perspective)  
**Author:** SDET / QA Lead  
**Version:** 1.0 (Black-Box Focus)  
**Date:** September 2026  

---

## 1. Executive Summary & Black-Box Philosophy
This Test Strategy defines a strict **Black-Box Testing Approach** for the **Ukrainians in KW Community Web Platform** (`ukrainianskw.ca`).

Under this strategy:
- The system is treated as an **opaque box** — testing is conducted solely through user-accessible inputs, browser interfaces, visual presentations, and observable outputs.
- No internal code logic or database queries are assumed. All verification relies on realistic end-user interactions across desktop, tablet, and mobile browsers.
- Testing verifies that the platform satisfies business requirements, community needs, usability expectations, and accessibility standards.

---

## 2. Scope of Black-Box Testing

```
                               ┌─────────────────────────────────────────┐
                               │   ukrainianskw.ca (Black-Box Testing)   │
                               └────────────────────┬────────────────────┘
        ┌─────────────────────────┬─────────────────┴─────────────────┬─────────────────────────┐
        ▼                         ▼                                   ▼                         ▼
┌──────────────┐          ┌──────────────┐                    ┌──────────────┐          ┌──────────────┐
│  Functional  │          │    UI/UX &   │                    │     i18n     │          │ a11y & Perf  │
│  & Usability │          │ Responsive   │                    │ Localization │          │   Security   │
└──────────────┘          └──────────────┘                    └──────────────┘          └──────────────┘
```

### 2.1 In-Scope Pages & Interfaces
1. **Homepage (`/` / `index.html`):** Hero section, navigation, quick links, community initiatives, school banner, social links, footer.
2. **Specialists Catalog (`/catalog.html`):** Search input, category pills, city multi-select, specialty tags, card list rendering, direct action buttons (Phone, Email, Telegram, Instagram, Website), empty states.
3. **Application / Registration Form (`/apply.html`):** Field validation, character limits, error messages, form submission, confirmation modal/toast.
4. **Ukrainian School Hub (`/school.html`):** Program cards, schedule tables, registration CTA, Google Maps integration.
5. **Feedback & Inquiries (`/feedback.html`):** Inquiry categories, input validation, submission feedback.
6. **Moderator Login & Dashboard (`/admin.html`):** Authentication form, queue tabs (Pending, Approved, Rejected), review/edit modal, action buttons (Approve, Reject, Delete).

### 2.2 Out-of-Scope
- Server-side source code review / White-box code inspection.
- Direct database / Firestore console manipulation.
- Internal infrastructure penetration testing.

---

## 3. Black-Box Test Design Techniques Applied

| Technique | Description & Application in `ukrainianskw.ca` |
| :--- | :--- |
| **Equivalence Partitioning (EP)** | Partitioning input domains into valid and invalid classes (e.g. valid phone `519-555-0123` vs invalid `abc12`, valid email `test@domain.com` vs invalid `test@`). |
| **Boundary Value Analysis (BVA)** | Testing boundary values on input fields (e.g. Name min 2 vs 1 char; Description max 1000 chars vs 1001 chars). |
| **State Transition Testing** | Validating state progression: `[Draft Form]` ➔ `[Submit]` ➔ `[Pending Queue]` ➔ `[Admin Approve]` ➔ `[Live in Catalog]`. |
| **Decision Table Testing** | Verifying multi-criteria search filtering combinations (Category × City × Keyword search combinations). |
| **Use Case & User Journeys** | Testing complete real-world scenarios for 5 user personas (Newcomer seeker, Specialist applicant, Community parent, Moderator, General visitor). |
| **Error Guessing & Exploratory** | Probing edge cases: rapid clicks, copy-pasting special symbols/emojis, network throttling, back/forward button navigation during form filling. |

---

## 4. Black-Box Test Types

### 4.1 Functional & Business Flow Testing
* Navigation integrity (0 broken links / 404s).
* Search responsiveness and keyword matching accuracy.
* Form submission and user notification feedback.
* Action button triggers (`tel:`, `mailto:`, external socials).

### 4.2 Cross-Browser & Responsive UI/UX Testing
* **Desktop Resolutions:** 1920×1080 (FHD), 1440×900 (MacBook), 1366×768 (Standard laptop).
* **Tablet Resolutions:** 768×1024 (iPad Portrait), 1200×800 (Samsung Galaxy Tab Landscape).
* **Mobile Resolutions:** 375×667 (iPhone SE), 390×844 (iPhone 14), 412×915 (Pixel / Samsung Galaxy).
* **Browsers:** Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge, Samsung Internet.

### 4.3 Localization & Language Parity (i18n)
* Instant toggle between Ukrainian (UA) and English (EN).
* Persistent language selection across navigation and browser reloads (`localStorage`).
* Visual rendering of vector SVG flags (UA / CA) on all OS platforms.
* 100% label translation without untranslated raw keys.

### 4.4 Black-Box Accessibility (WCAG 2.1 AA)
* 100% full keyboard navigability (`Tab`, `Shift+Tab`, `Enter`, `Space`).
* Visible focus indicators on all interactive controls.
* Visual contrast verification (>= 4.5:1 text contrast).
* ARIA labels for icon-only action buttons.

### 4.5 Black-Box Security & Input Resilience
* Client-side XSS injection resilience in all form fields (`<script>`, `onerror` payloads).
* URL parameter tampering tests.
* Form spam protection & double-submit prevention.

### 4.6 Performance & Core Web Vitals
* Page load time < 2.0s on 4G connection.
* Smooth 60fps scrolling and instant client-side filtering (< 50ms latency).
* Zero layout shifts (CLS < 0.05).

---

## 5. Black-Box Defect Classification

| Severity Level | Definition | Example |
| :--- | :--- | :--- |
| **S1 - Blocker** | Website unavailable, critical flow unusable, data lost upon submission | Form fails to submit with valid data; blank catalog page. |
| **S2 - Critical** | Core feature broken with no workaround | Search or category filter returns 0 results for valid queries; approve button non-functional. |
| **S3 - Major** | Feature partially impaired or broken external action | Social link opens 404; language toggle leaves certain sections untranslated. |
| **S4 - Minor / Visual** | Cosmetic glitch, typo, slight alignment issue | Spacing offset on mobile; typo in Ukrainian/English copy. |

---

## 6. Exit & Release Criteria for Black-Box Testing
1. **100% of P1 & P2 Black-Box test cases executed and passed.**
2. **0 open S1 (Blocker) or S2 (Critical) defects.**
3. **All user journeys validated on real Mobile, Tablet, and Desktop viewports.**
4. **All forms successfully submit with clear user confirmation.**
5. **Bilingual UA/EN check verified on all pages.**
