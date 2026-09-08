# 🎯 Test Strategy: Ukrainians in KW Community Web Platform
**Target System:** [ukrainianskw.ca](https://ukrainianskw.ca) (Ukrainian Community of Kitchener-Waterloo-Cambridge-Guelph)  
**Repository:** `kw-community-site`  
**Version:** 1.0.0  
**Author:** SDET / QA Lead  
**Date:** September 2026  

---

## 1. Executive Summary & Vision
The **Ukrainians in KW Community Platform** (`ukrainianskw.ca`) is a community-driven web application connecting Ukrainian newcomers and residents with verified Ukrainian specialists, local businesses, educational initiatives (Ukrainian School), and essential municipal services in Waterloo Region.

The primary objective of this **Test Strategy** is to establish a rigorous, automated, and maintainable Quality Assurance framework independent of external crowd-testing platforms, ensuring:
- **High Availability & Zero Downtime** on static CDN / GitHub Pages.
- **Data Integrity & Consistency** across the hybrid storage model (Static JSON + Firebase Firestore + Daily GitHub Actions Sync).
- **Fast, Error-Resilient User Experience** on mobile, tablet, and desktop devices.
- **Robust Security & Privacy** for specialist personal contact details and administrative moderation.
- **Full Bilingual Parity (UA/EN)** without layout breaks or missing translations.

---

## 2. Scope of Testing

### 2.1 In-Scope
* **Functional Testing:**
  - Homepage navigation, community initiatives, news/events banner, Ukrainian school page.
  - Interactive specialist catalog, instant client-side search, multi-faceted filtering (Category, City, Tags).
  - Specialist registration/application form (`apply.html`) with client-side validations and Firestore write pipeline.
  - Moderator/Admin portal (`admin.html`) with Firebase Auth (Email/Password), submission queues (Pending, Approved, Rejected), editing modal, one-click Approval, Rejection with EmailJS notification, and record deletion.
  - Feedback and bug reporting forms (`feedback.html`).
* **Non-Functional Testing:**
  - **Cross-Browser & Cross-Platform Compatibility:** Desktop (Chrome, Safari, Firefox, Edge), Mobile (iOS Safari, Android Chrome, Samsung Internet), Tablet (iPadOS Safari, Android Tablet).
  - **Responsive Design (RWD):** Viewports from 360px (mobile) to 2560px (4K desktop).
  - **Accessibility (a11y):** WCAG 2.1 Level AA compliance, semantic HTML, keyboard navigation (`Tab`/`Shift+Tab`/`Enter`), screen reader aria attributes, color contrast ratios.
  - **Performance & Core Web Vitals:** First Contentful Paint (FCP) < 1.2s, Largest Contentful Paint (LCP) < 2.0s, Cumulative Layout Shift (CLS) < 0.05, Lighthouse Score >= 95.
  - **Localization & Internationalization (i18n):** Ukrainian (default) & English toggle, persistent `localStorage` preference, SVG vector flags rendering across all OSes.
  - **Security & Data Protection:** Firebase Security Rules validation (preventing unauthorized read/writes on Firestore collections), XSS input sanitization in text areas, CSRF protection, protection of API keys and service account secrets.
  - **CI/CD & Batch Synchronization:** GitHub Actions workflow (`sync.yml`) transferring approved Firestore entries to `data/specialists.json` and cleaning up Firestore.

### 2.2 Out-of-Scope
* Load/Stress testing beyond 10,000 requests/sec (handled by Cloudflare CDN & GitHub Pages static infrastructure).
* Third-party email server infrastructure (EmailJS internal SMTP uptime).
* Direct penetration testing of Google Cloud / Firebase internal infrastructure.

---

## 3. Test Levels & Pyramid

```
                ▲
               / \
              /   \
             / E2E \       Playwright End-to-End (Critical User Flows & UI)
            /-------\
           / Integr. \     Firebase Auth/Firestore, EmailJS, GitHub Actions Sync
          /-----------\
         /  Unit Tests \   Vitest (Data Parsers, Filters, i18n Dictionaries, Validation)
        /---------------\
```

| Test Level | Scope | Framework / Tools | Target Coverage | Execution Trigger |
| :--- | :--- | :--- | :--- | :--- |
| **Unit Testing** | Data normalization, search indexing, filter predicates, i18n dictionaries, validation regexes | `Vitest` + Node stubs | > 85% Code Coverage | On every git commit / pre-push |
| **Integration Testing** | Firebase Firestore CRUD, Express sync API, EmailJS triggers, Service Account sync | `Supertest` + Firebase Emulators | 100% Critical API Paths | Pull Request / CI pipeline |
| **E2E UI Testing** | Complete user journeys (Form submission -> Admin moderation -> Catalog sync -> Search) | `Playwright` (Chromium, WebKit, Firefox) | 100% Core Scenarios | On PR merge & Daily Nightly Run |
| **Accessibility Testing** | WCAG 2.1 AA rules, contrast, keyboard traps, ARIA roles | `@axe-core/playwright` + Lighthouse | 0 Critical a11y Violations | Weekly Audit / Release Gate |
| **Performance Testing** | Core Web Vitals, image compression, payload bundle size | Google Lighthouse CLI / DevTools | Score >= 90 | Release Gate |

---

## 4. Test Environment & Matrix

### 4.1 Target Device Matrix
| Platform / Device | Viewport | OS Version | Browsers | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **Desktop (Primary)** | 1920×1080, 1440×900 | Windows 11, macOS, Ubuntu | Google Chrome, Safari, Firefox, MS Edge | **P1 (Tier 1)** |
| **Mobile (Primary)** | 390×844, 412×915 | iOS 17/18, Android 14/15 | Apple Mobile Safari, Google Chrome Mobile | **P1 (Tier 1)** |
| **Tablet** | 810×1080, 1200×800 | iPadOS 17, Android 14 (Tab S9 FE) | Safari Mobile, Chrome Tablet | **P2 (Tier 2)** |
| **Small Mobile** | 360×740 | Android (Budget devices) | Chrome Mobile, Samsung Internet | **P2 (Tier 2)** |

### 4.2 Environments
1. **Local Development / Test Environment:** `http://localhost:8080` (served via `http-server` or `server.js` with Firebase test config).
2. **Staging / GitHub Pages Mirror:** `https://nikolayantonyuk.github.io/kw-community-site/`
3. **Production Live Environment:** `https://ukrainianskw.ca/` (Proxied through Cloudflare with custom domain).

---

## 5. Tooling & Automation Tech Stack

| Functionality | Tool / Library | Justification |
| :--- | :--- | :--- |
| **E2E Automation** | `Playwright` (`@playwright/test`) | Multi-browser headless/headed support, auto-waiting, parallel execution, mobile viewport emulation. |
| **Unit / Component Testing** | `Vitest` | Lightning fast execution, native ES modules support, seamless integration with Node mocks. |
| **Test Reporting** | `Allure Framework` + `Playwright HTML Report` + `Testomatio` | Executive dashboards, step-by-step screenshots, failure videos, historical trend analysis. |
| **Accessibility Engine** | `axe-core` / `@axe-core/playwright` | Standard industry engine for automated WCAG compliance scanning. |
| **Performance Auditing** | `Lighthouse CI` | Automated Core Web Vitals and SEO checks. |
| **CI/CD Integration** | `GitHub Actions` (`playwright.yml`, `sync.yml`) | Automated regression test execution on every pull request and push to master. |

---

## 6. Defect Management & Classification

### 6.1 Severity Definitions
* **Critical (S1 / Blocker):** Total website downtime, data corruption in `specialists.json`, application form failing to save records, admin authentication bypass, or exposure of admin credentials.
* **High (S2):** Core functional failure without workaround (e.g. search filter completely broken, approved specialist not visible in catalog, rejection email failing to send).
* **Medium (S3):** Partial functional defect with workaround, broken links to external resources, layout misalignments on specific tablet resolutions, missing translations in minor labels.
* **Low (S4 / Trivial):** Minor visual glitches, spelling errors, subtle font discrepancies, minor spacing inconsistencies.

### 6.2 Defect Lifecycle
```
[New / Reported] ➔ [Triage & Verified] ➔ [Assigned / In Progress] ➔ [Fix Deployed] ➔ [Retested & Verified] ➔ [Closed]
                                   ↘
                                    [Rejected / Won't Fix]
```

---

## 7. Entry, Suspension, and Exit Criteria

### 7.1 Entry Criteria
- Code merged to `master` or PR branch.
- Firebase test project/database accessible.
- Local/Staging server successfully compiled and serving assets.

### 7.2 Suspension & Resumption Criteria
- **Suspension:** Firebase API outage or persistent network failure preventing test runs.
- **Resumption:** Firebase service restored and smoke tests passing.

### 7.3 Exit / Release Criteria
1. **100% of P1 (Critical) & P2 (High) Test Cases Passed.**
2. **0 Open S1 (Blocker) or S2 (High) Defects.**
3. **All Unit & E2E Automated Tests passing in GitHub Actions CI.**
4. **Lighthouse Performance, Accessibility, and Best Practices score >= 90.**
5. **Successful full-cycle manual verification of Application -> Moderation -> Sync pipeline.**
