# 📋 Master Test Plan: Ukrainians in KW Web Platform
**Project:** Ukrainians in KW Community Site  
**Domain:** [https://ukrainianskw.ca](https://ukrainianskw.ca)  
**Version:** 1.0  
**Target Release:** Production 2026  
**Document Status:** Approved / Active  

---

## 1. Introduction & Objectives
The purpose of this Test Plan is to outline the scope, approach, resources, schedule, and deliverables for verifying the functionality, usability, security, and performance of `ukrainianskw.ca`.

### Primary Objectives:
1. Ensure all specialist submissions, admin approvals, and catalog updates function seamlessly without data loss.
2. Verify responsive behavior across all supported screen resolutions (mobile, tablet, desktop).
3. Validate strict data sanitization and Firebase security permissions.
4. Guarantee full multilingual support (Ukrainian & English).
5. Maintain 100% CI test pass rate in GitHub Actions before deploying to GitHub Pages.

---

## 2. Test Items & Modules Under Test

```
                               ┌─────────────────────────────┐
                               │   ukrainianskw.ca Platform  │
                               └──────────────┬──────────────┘
        ┌───────────────────┬─────────────────┼───────────────────┬───────────────────┐
        ▼                   ▼                 ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐   ┌──────────────┐    ┌──────────────┐   ┌──────────────┐
│  Homepage &  │    │ Specialists  │   │ Application  │    │  Moderator   │   │  Sync Engine │
│  School Hub  │    │   Catalog    │   │     Form     │    │ Admin Portal │   │  & GitHub CI │
└──────────────┘    └──────────────┘   └──────────────┘    └──────────────┘   └──────────────┘
```

### Module Breakdown:
| Module ID | Module Name | Core Pages & Scripts | Description |
| :--- | :--- | :--- | :--- |
| **MOD-01** | **Homepage & Information Hub** | `index.html`, `js/home.js` | Community introduction, quick navigation links, hero section, announcement banners, social media links. |
| **MOD-02** | **Specialists Catalog & Search** | `catalog.html`, `js/app.js`, `js/filters.js`, `js/render.js`, `data/specialists.json` | Search bar (instant full-text search), category tabs, location multi-select (Kitchener, Waterloo, Cambridge, Guelph), specialty tag pills, specialist cards with verified badges and direct contact action links (Call, Email, Telegram, Instagram, Website). |
| **MOD-03** | **Specialist Application Flow** | `apply.html`, `js/apply.js` | Form fields (Name, Category, Subcategory, City, Phone, Email, Telegram, Instagram, Website, Description, Photo URL), real-time input validations, duplicate protection, submission to Firebase Firestore `pending_specialists`. |
| **MOD-04** | **Admin & Moderation Portal** | `admin.html`, `js/admin.js`, `firebase.js` | Secure Firebase Auth login, queue management (`pending`, `approved`, `rejected`), modal editor for applicant details, approve action (promotes to `approved`), reject action (promotes to `rejected` with EmailJS notification sent to applicant with reason), hard delete, CSV/JSON export. |
| **MOD-05** | **Ukrainian School Portal** | `school.html` | Program details, age groups, curriculum overview, schedule, location map, registration call-to-action, contact form. |
| **MOD-06** | **Feedback & Community Inquiries** | `feedback.html`, `js/feedback.js` | Feedback submission, bug reporting form, contact organizer form, client-side validation. |
| **MOD-07** | **Internationalization (i18n)** | `js/i18n.js`, `assets/flags/*.svg` | Instant language toggle (UA / EN), DOM translation via `data-i18n` attributes, `localStorage` language persistence, dynamic string interpolation. |
| **MOD-08** | **Data Synchronization Engine** | `.github/workflows/sync.yml`, `scripts/sync.js`, `server.js` | Daily cron & manual GitHub Actions trigger, reading `approved` records from Firestore, merging into `data/specialists.json`, purging processed Firestore records, committing and deploying to GitHub Pages. |

---

## 3. Features Not Tested (Out of Scope)
- Internal Firebase infrastructure reliability (Google Cloud SLA).
- Direct banking/payment processing (all community services are direct-contact without on-site financial transactions).
- Third-party social platform APIs availability (Telegram / Instagram server uptime).

---

## 4. Test Approach & Execution Strategy

### 4.1 Test Types
1. **Smoke Testing:** Quick post-deployment check verifying that the site loads, catalog renders >= 50 specialists, and navigation links are healthy.
2. **Functional Regression Testing:** Automated Playwright test suite executing all positive and negative user paths across all 8 modules.
3. **Integration & Contract Testing:** Verifying Firebase Firestore read/write rules, EmailJS payload structures, and GitHub Actions cron execution.
4. **Visual & Cross-Browser Testing:** Pixel-accurate rendering on Chromium, Firefox, WebKit (Safari), and mobile emulators (Pixel 7, iPhone 14, Samsung Galaxy Tab).
5. **Accessibility (a11y) Audits:** Automated `axe-core` assertions + manual keyboard navigation check.
6. **Performance & SEO Audits:** Automated Lighthouse runs verifying Core Web Vitals, metadata tags, and favicon/OpenGraph headers.

### 4.2 Test Schedule & Execution Cadence
| Milestone / Activity | Frequency / Trigger | Owner | Output Artifact |
| :--- | :--- | :--- | :--- |
| **Unit Tests (`vitest`)** | Every commit / PR | Developer / SDET | Terminal test report (0 failures) |
| **E2E Tests (`playwright`)** | On every PR & master push | SDET / CI | Playwright HTML & Allure Report |
| **Daily Health Check** | Daily at 00:30 (after sync) | Automated Monitor | System health log / Telegram alert |
| **Full Release Regression** | Pre-production release | QA Lead | Signed-off Test Summary Report |

---

## 5. Roles and Responsibilities

| Role | Name / Assignee | Core Responsibilities |
| :--- | :--- | :--- |
| **QA Lead / SDET** | Mykola Antoniuk (MegaClaw SDET) | Test Strategy & Plan creation, Playwright/Vitest automation architecture, CI pipeline maintenance, security & a11y sign-off. |
| **Frontend Developer** | Core Dev Team | Feature implementation, bug fixes, unit test authoring, code reviews. |
| **Community Admin / Moderator** | Community Board | User Acceptance Testing (UAT), moderation workflow review, production content validation. |

---

## 6. Risk Analysis & Mitigation Matrix

| # | Identified Risk | Severity | Probability | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **R1** | **Firestore Rate Limits or API Key Quota Exhaustion** | High | Low | Static `data/specialists.json` acts as primary resilient catalog fallback. Firestore is only queried for new pending/approved additions. |
| **R2** | **Spam or Malicious Submissions on `apply.html`** | High | Medium | Client-side rate-limiting, strict input sanitization against XSS, required phone/email formatting, and mandatory moderator approval before publishing. |
| **R3** | **Broken Images / Missing Specialist Avatars** | Medium | Medium | Default SVG fallback avatar displayed whenever an image URL returns 404 or fails to load. |
| **R4** | **Unsaved Admin Changes during Session Expiry** | High | Low | Auto-save draft in `sessionStorage`, confirmation modals before closing edit views, and clear toast notifications on network errors. |
| **R5** | **Sync Pipeline Overwriting Valid Data in `specialists.json`** | Critical | Low | GitHub Actions script validates JSON schema and ensures record count never drops unexpectedly before committing changes. |

---

## 7. Test Deliverables
1. **Master Test Strategy (`TEST_STRATEGY.md`)**
2. **Master Test Plan (`TEST_PLAN.md`)**
3. **Comprehensive Test Cases Suite (`TEST_CASES.md`)**
4. **Automated E2E Suite (`tests/e2e/*.spec.ts`)**
5. **Unit Test Suite (`tests/unit/*.test.js`)**
6. **Allure & Playwright HTML Test Execution Reports**
7. **Production Quality Gate Sign-Off Certificate**
