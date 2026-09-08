# 📋 Black-Box Master Test Plan: Ukrainians in KW
**Target:** [https://ukrainianskw.ca](https://ukrainianskw.ca)  
**Testing Mode:** 100% Black-Box Web Testing  
**Version:** 1.0 (Black-Box Focus)  
**Date:** September 2026  

---

## 1. Introduction & Objectives
This Test Plan outlines the black-box testing activities for the public web platform **Ukrainians in Kitchener-Waterloo** (`ukrainianskw.ca`).

The focus is entirely on validating the system behavior, visual presentation, user journeys, and reliability strictly from the outside (end-user perspective), ensuring every visitor has an effortless, reliable, and accessible experience.

---

## 2. Real-World User Personas & Test Journeys

```
 ┌───────────────────────────┐         ┌───────────────────────────┐
 │   Persona A: Newcomer     │         │   Persona B: Specialist   │
 │   • Needs Ukrainian Plumber│        │   • Fills Application     │
 │   • Filters by Waterloo   │         │   • Expects Confirmation  │
 │   • Clicks Telegram / Call│         │   • Gets Moderation Note  │
 └─────────────┬─────────────┘         └─────────────┬─────────────┘
               │                                     │
               ▼                                     ▼
      ┌─────────────────────────────────────────────────────┐
      │             https://ukrainianskw.ca                 │
      └─────────────────────────────────────────────────────┘
               ▲                                     ▲
               │                                     │
 ┌─────────────┴─────────────┐         ┌─────────────┴─────────────┐
 │   Persona C: School Parent│         │   Persona D: Moderator    │
 │   • Explores Classes & Map│         │   • Logs In to Admin      │
 │   • Clicks Registration   │         │   • Approves / Rejects    │
 └───────────────────────────┘         └───────────────────────────┘
```

| Persona | Role | Primary Goal on Site | Key Flows Tested |
| :--- | :--- | :--- | :--- |
| **Persona 1: Community Seeker** | Ukrainian newcomer in Waterloo Region | Find a verified Ukrainian-speaking specialist (doctor, mechanic, tutor, accountant) | Search, Category tabs, City filter, Action buttons (`tel:`, Telegram, Instagram, Email). |
| **Persona 2: Service Provider** | Local Ukrainian specialist / small business | Submit service listing to be listed in community directory | `apply.html` form, validation checks, submission confirmation. |
| **Persona 3: Parent** | Ukrainian parent in KW | Enroll children in Ukrainian weekend school & cultural activities | `school.html` schedule, age group review, map directions, registration CTA. |
| **Persona 4: Moderator** | Community volunteer / admin | Review, edit, approve, or reject specialist applications | `admin.html` login, Pending queue review, modal editor, Approve, Reject with reason. |
| **Persona 5: Community Member** | Active resident | Send suggestions, report broken info, or contact organizers | `feedback.html` form, category selection, toast notification. |

---

## 3. Black-Box Test Suites Structure

```
qa/
├── BLACKBOX_TEST_STRATEGY.md       # High-level black-box testing strategy
├── BLACKBOX_TEST_PLAN.md           # This master operational plan
├── BLACKBOX_TEST_CASES.md          # Complete suite of 60+ black-box test cases
└── suites/
    ├── 01_homepage_suite.md        # Detailed test cases for Homepage
    ├── 02_catalog_search_suite.md  # Detailed test cases for Catalog & Multi-filters
    ├── 03_application_suite.md     # Detailed test cases for Specialist Application Form
    ├── 04_school_portal_suite.md   # Detailed test cases for School Portal
    ├── 05_admin_portal_suite.md    # Detailed test cases for Admin/Moderation Portal
    ├── 06_i18n_responsive_suite.md # Detailed test cases for i18n & Mobile/Tablet RWD
    └── 07_security_a11y_suite.md   # Detailed test cases for Black-box Security & a11y
```

---

## 4. Test Execution Phases

### Phase 1: Smoke & Critical Path Verification (1-2 Hours)
- Verify all pages load with 200 OK.
- Verify catalog loads specialist cards.
- Verify language switcher functions between UA and EN.
- Verify mobile navigation opens and closes.

### Phase 2: Detailed Functional & Boundary Testing (4-6 Hours)
- Test all search keyword variations and multi-filter combinations.
- Test form validation boundaries (Equivalence Partitioning & Boundary Value Analysis).
- Submit test application and observe end-user feedback.
- Moderator login and queue moderation actions.

### Phase 3: Cross-Device & Responsive Verification (3-4 Hours)
- Physical Tablet verification (Samsung Galaxy Tab S9 FE).
- Mobile browser testing (iOS Safari, Android Chrome).
- Desktop resolutions (1920×1080, 1366×768, 1440×900).

### Phase 4: Usability, Accessibility & Performance Audit (2-3 Hours)
- Full keyboard navigation test (`Tab` through all pages).
- Visual contrast and button readability check.
- Lighthouse performance and SEO audit.

---

## 5. Black-Box Test Deliverables
1. **Black-Box Test Strategy Document** (`BLACKBOX_TEST_STRATEGY.md`)
2. **Black-Box Master Test Plan Document** (`BLACKBOX_TEST_PLAN.md`)
3. **Black-Box Test Cases Matrix** (`BLACKBOX_TEST_CASES.md`)
4. **Execution Summary & Quality Gate Sign-Off Report**
