# 📑 Comprehensive Test Cases Suite: Ukrainians in KW Web Platform
**Target:** [https://ukrainianskw.ca](https://ukrainianskw.ca)  
**Total Test Cases:** 60+  
**Execution Type:** Automated (Playwright / Vitest) + Exploratory Manual  
**Standard:** IEEE 829 / ISTQB  

---

## 📑 Table of Contents
1. [Module 1: Homepage & Navigation (TC-HOME)](#module-1-homepage--navigation)
2. [Module 2: Specialists Catalog & Multi-filtering (TC-CAT)](#module-2-specialists-catalog--multi-filtering)
3. [Module 3: Specialist Registration & Application (TC-APPLY)](#module-3-specialist-registration--application)
4. [Module 4: Moderator & Admin Portal (TC-ADMIN)](#module-4-moderator--admin-portal)
5. [Module 5: Ukrainian School Portal (TC-SCH)](#module-5-ukrainian-school-portal)
6. [Module 6: Feedback & Bug Reporting (TC-FDB)](#module-6-feedback--bug-reporting)
7. [Module 7: Multilingual Subsystem & i18n (TC-I18N)](#module-7-multilingual-subsystem--i18n)
8. [Module 8: Data Synchronization & CI/CD Pipeline (TC-SYNC)](#module-8-data-synchronization--cicd-pipeline)
9. [Module 9: Accessibility & WCAG 2.1 AA (TC-A11Y)](#module-9-accessibility--wcag-21-aa)
10. [Module 10: Security, Privacy & Performance (TC-SEC)](#module-10-security-privacy--performance)

---

## Module 1: Homepage & Navigation

| TC ID | Title | Priority | Type | Pre-conditions | Test Steps | Expected Result | Auto Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-HOME-001** | Verify Homepage loads with 200 OK and valid title | P1 - Critical | Functional / Smoke | Browser opened | 1. Navigate to `https://ukrainianskw.ca/`<br>2. Check HTTP status code and `<title>` tag. | Page returns 200 OK, title contains "Українці в Kitchener-Waterloo" (or EN equivalent). | ✅ Automated (`home.spec.ts`) |
| **TC-HOME-002** | Verify Header navigation links | P1 - High | Functional | On homepage | 1. Click "Каталог" (Catalog)<br>2. Click "Школа" (School)<br>3. Click "Подати заявку" (Apply) | Each link navigates to the respective page without 404 errors. | ✅ Automated (`home.spec.ts`) |
| **TC-HOME-003** | Verify Hero Section CTA button ("Знайти спеціаліста") | P1 - High | Functional | On homepage | 1. Click the primary CTA button in the hero section. | Browser navigates smoothly to `catalog.html`. | ✅ Automated (`home.spec.ts`) |
| **TC-HOME-004** | Verify Responsive Mobile Burger Menu | P2 - High | UI / Responsive | Viewport 375×667 | 1. Open homepage on mobile viewport.<br>2. Tap hamburger icon.<br>3. Tap menu items.<br>4. Tap close/backdrop. | Navigation drawer slides open smoothly, all links are clickable, closes on backdrop click. | ✅ Automated (`home.spec.ts`) |
| **TC-HOME-005** | Verify Community Initiatives Cards rendering | P2 - Medium | UI / Functional | On homepage | 1. Scroll to "Ініціативи громади".<br>2. Inspect each initiative card and links. | All cards have valid titles, descriptions, icons, and working outbound links. | ✅ Automated (`home.spec.ts`) |
| **TC-HOME-006** | Verify Ukrainian School Preview Card | P2 - Medium | Functional | On homepage | 1. Scroll to School section.<br>2. Click "Дізнатися більше про школу". | Navigates to `school.html` with full program information. | ✅ Automated (`home.spec.ts`) |
| **TC-HOME-007** | Verify Footer Social Media & External Links | P3 - Low | Functional | On homepage | 1. Scroll to footer.<br>2. Verify links to Facebook groups, Telegram channels, and copyright text. | All external links have `target="_blank"` and `rel="noopener noreferrer"`. | ✅ Automated (`home.spec.ts`) |

---

## Module 2: Specialists Catalog & Multi-filtering

| TC ID | Title | Priority | Type | Pre-conditions | Test Steps | Expected Result | Auto Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-CAT-001** | Verify initial catalog rendering with full list | P1 - Critical | Functional | On `catalog.html` | 1. Open catalog page.<br>2. Check count of rendered specialist cards. | Catalog renders all verified specialists from `specialists.json` + approved Firestore items (> 40 cards). | ✅ Automated (`site.spec.js`) |
| **TC-CAT-002** | Verify Instant Keyword Search by Name | P1 - High | Functional | On `catalog.html` | 1. Type specific specialist name into search input (e.g., "Олена" or "Ivan").<br>2. Check filtered results. | Cards update immediately; only matching specialists are displayed in the grid. | ✅ Automated (`site.spec.js`) |
| **TC-CAT-003** | Verify Instant Search by Specialty / Skill | P1 - High | Functional | On `catalog.html` | 1. Type profession or skill (e.g. "Масаж", "Юрист", "Будівництво", "IT"). | Matching cards matching keywords or description are shown; non-matching hidden. | ✅ Automated (`site.spec.js`) |
| **TC-CAT-004** | Verify Category Tab Selection Filtering | P1 - High | Functional | On `catalog.html` | 1. Click on category pill (e.g. "Краса та здоров'я", "Авто", "Послуги"). | Only cards belonging to the selected category are displayed. Active tab is highlighted. | ✅ Automated (`site.spec.js`) |
| **TC-CAT-005** | Verify City / Location Multi-filter | P2 - High | Functional | On `catalog.html` | 1. Select city "Kitchener".<br>2. Select city "Waterloo".<br>3. Toggle "Cambridge" or "Guelph". | Only specialists serving the selected municipalities are shown. | ✅ Automated (`site.spec.js`) |
| **TC-CAT-006** | Verify Combined Multi-faceted Filtering (Category + City + Search) | P1 - High | Functional | On `catalog.html` | 1. Select Category "Ремонт".<br>2. Select City "Waterloo".<br>3. Type "плитка" in search box. | Grid updates applying boolean AND logic across all three filter criteria. | ✅ Automated (`site.spec.js`) |
| **TC-CAT-007** | Verify "Clear All Filters" button behavior | P2 - Medium | Functional | Filters active | 1. Apply multiple filters.<br>2. Click "Очистити фільтри" (Reset). | All filters reset to initial default state; all specialist cards reappear. | ✅ Automated (`site.spec.js`) |
| **TC-CAT-008** | Verify Empty State Handling for non-existing query | P2 - Medium | Functional / UI | On `catalog.html` | 1. Type random string `xyz987nonexistent` in search box. | Friendly "Нічого не знайдено" (Nothing found) message is displayed with a suggestion to reset filters. | ✅ Automated (`site.spec.js`) |
| **TC-CAT-009** | Verify Specialist Card Contact Action Buttons | P1 - High | Functional | On `catalog.html` | 1. Inspect cards for Phone (`tel:`), Email (`mailto:`), Telegram (`https://t.me/`), Instagram (`https://instagram.com/`), and Website links. | Direct contact buttons open appropriate protocols and valid external URLs. | ✅ Automated (`site.spec.js`) |
| **TC-CAT-010** | Verify Verified Badge display on verified cards | P2 - Medium | UI | On `catalog.html` | 1. Inspect cards with `verified: true`. | "Перевірено" / "Verified" badge is properly rendered with blue/gold checkmark icon. | ✅ Automated (`site.spec.js`) |
| **TC-CAT-011** | Verify Image Fallback on broken specialist photo URL | P2 - High | UI / Resilience | Card with invalid image | 1. Simulate specialist card with broken photo link. | Card renders clean placeholder SVG avatar without broken browser image icon. | ✅ Automated (`site.spec.js`) |

---

## Module 3: Specialist Registration & Application

| TC ID | Title | Priority | Type | Pre-conditions | Test Steps | Expected Result | Auto Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-APPLY-001** | Verify required fields validation on empty submit | P1 - Critical | Validation | On `apply.html` | 1. Open `apply.html`.<br>2. Click "Надіслати заявку" without filling fields. | Form is not submitted. Red validation outlines and localized error messages appear on required inputs. | ✅ Automated (`form-validation.spec.ts`) |
| **TC-APPLY-002** | Verify Full Name validation (min length & format) | P2 - High | Validation | On `apply.html` | 1. Enter single character or numbers in Name field.<br>2. Trigger blur event. | Error message: "Введіть коректне ім'я та прізвище" (Min 3 characters). | ✅ Automated (`form-validation.spec.ts`) |
| **TC-APPLY-003** | Verify Phone Number international & local format validation | P1 - High | Validation | On `apply.html` | 1. Enter invalid text `abc1234` in phone.<br>2. Enter valid Canadian phone `519-555-0199` or `+15195550199`. | Invalid input rejected with error; valid phone accepted and formatted. | ✅ Automated (`form-validation.spec.ts`) |
| **TC-APPLY-004** | Verify Email format validation | P1 - High | Validation | On `apply.html` | 1. Enter `test@invalid` or missing `@`.<br>2. Enter `valid.email@example.com`. | Invalid email shows error; valid email passes validation. | ✅ Automated (`form-validation.spec.ts`) |
| **TC-APPLY-005** | Verify Category and City select dropdowns | P1 - High | Functional | On `apply.html` | 1. Select Category from dropdown.<br>2. Select Primary City (Kitchener/Waterloo/etc.). | Selected values correctly bind to form submission payload. | ✅ Automated (`form.spec.ts`) |
| **TC-APPLY-006** | Verify Description character counter and limits | P2 - Medium | UI / Validation | On `apply.html` | 1. Type text into Description textarea.<br>2. Exceed 1000 characters. | Dynamic character counter reflects remaining count; excess characters are trimmed/prevented. | ✅ Automated (`form.spec.ts`) |
| **TC-APPLY-007** | Verify Social Media links normalization (Telegram / Instagram) | P2 - High | Functional | On `apply.html` | 1. Enter handle `@mykola` or full URL `https://t.me/mykola`. | Script normalizes handle into valid standardized URL format before saving. | ✅ Automated (`form.spec.ts`) |
| **TC-APPLY-008** | Verify Successful Application Submission to Firestore | P1 - Critical | E2E Integration | On `apply.html` | 1. Fill all valid details.<br>2. Click "Надіслати заявку". | Spinner appears -> Document created in Firestore `pending_specialists` with `status: "pending"` -> Success modal displayed with instructions. | ✅ Automated (`form.spec.ts`) |
| **TC-APPLY-009** | Verify Duplicate Application Prevention | P2 - High | Security / Logic | Submitted email exists | 1. Submit application with same email within 5 minutes. | System informs user that an application is already under moderation review. | ✅ Automated (`form.spec.ts`) |
| **TC-APPLY-010** | Verify Form Behavior when Firebase is Offline | P2 - High | Resilience | Network offline | 1. Disconnect network / block Firebase URL.<br>2. Click submit. | User-friendly error message: "Не вдалося з'єднатися з сервером. Спробуйте пізніше" without crashing. | ✅ Automated (`form.spec.ts`) |

---

## Module 4: Moderator & Admin Portal

| TC ID | Title | Priority | Type | Pre-conditions | Test Steps | Expected Result | Auto Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-ADMIN-001** | Verify Admin Portal Authentication requirement | P1 - Critical | Security | Logged out | 1. Navigate to `admin.html`. | Content is hidden; Login modal is displayed requesting Email & Password. | ✅ Automated (`admin.spec.ts`) |
| **TC-ADMIN-002** | Verify Invalid Login Credentials handling | P1 - High | Security | On `admin.html` | 1. Enter non-existing email or wrong password.<br>2. Click "Увійти". | Authentication fails; displays error message "Невірний email або пароль". | ✅ Automated (`admin.spec.ts`) |
| **TC-ADMIN-003** | Verify Successful Admin Login with Firebase Auth | P1 - Critical | Functional | Valid admin creds | 1. Enter valid admin email & password.<br>2. Click "Увійти". | Authenticates with Firebase Auth; Admin Dashboard displays with queues and statistics. | ✅ Automated (`admin.spec.ts`) |
| **TC-ADMIN-004** | Verify Pending Queue rendering & count | P1 - High | Functional | Logged in as admin | 1. Check "Черга на розгляд" (Pending) tab. | Lists all documents from Firestore with `status: "pending"`; displays correct counter badge. | ✅ Automated (`admin.spec.ts`) |
| **TC-ADMIN-005** | Verify Application Details Review Modal | P1 - High | Functional | Logged in | 1. Click "Редагувати" (Edit) or "Деталі" on a pending card. | Modal opens populated with all submitted fields (Name, Category, City, Contacts, Description, Photo). | ✅ Automated (`admin.spec.ts`) |
| **TC-ADMIN-006** | Verify Specialist Details Edit & Save by Admin | P1 - High | Functional | Review modal open | 1. Edit Name, fix typos in Description or phone.<br>2. Click "Зберегти зміни". | Updates document in Firestore; card reflects updated values immediately. | ✅ Automated (`admin.spec.ts`) |
| **TC-ADMIN-007** | Verify "Approve" Action moves card to Approved status | P1 - Critical | E2E Functional | Pending card | 1. Click "Підтвердити" (Approve) button on a pending application. | Status in Firestore updates to `status: "approved"`; card moves from Pending to Approved tab; immediately appears in catalog preview. | ✅ Automated (`admin.spec.ts`) |
| **TC-ADMIN-008** | Verify "Reject" Action with Reason & EmailJS Notification | P1 - Critical | Integration / E2E | Pending card | 1. Click "Відхилити" (Reject).<br>2. Select rejection reason or type custom feedback.<br>3. Confirm rejection. | Status in Firestore updates to `status: "rejected"`; EmailJS triggers email to applicant explaining reason; card moves to Rejected tab. | ✅ Automated (`admin-email-features.spec.ts`) |
| **TC-ADMIN-009** | Verify Hard Delete Action with confirmation prompt | P2 - High | Functional / Security | Rejected card | 1. Click "Видалити назавжди" (Delete).<br>2. Cancel prompt.<br>3. Click again and confirm. | Cancelling preserves data; Confirming permanently deletes document from Firestore. | ✅ Automated (`admin.spec.ts`) |
| **TC-ADMIN-010** | Verify Admin Logout & Session Invalidation | P1 - High | Security | Logged in | 1. Click "Вийти" (Logout). | Firebase Auth session terminates; dashboard clears; login form displayed. | ✅ Automated (`admin.spec.ts`) |

---

## Module 5: Ukrainian School Portal

| TC ID | Title | Priority | Type | Pre-conditions | Test Steps | Expected Result | Auto Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-SCH-001** | Verify Ukrainian School page loads with all modules | P1 - High | Functional | Browser open | 1. Navigate to `https://ukrainianskw.ca/school.html`. | Page loads with 200 OK; hero section, mission, and program tabs render properly. | ✅ Automated (`school.spec.ts`) |
| **TC-SCH-002** | Verify Age Groups & Class Schedules rendering | P2 - Medium | UI / Functional | On `school.html` | 1. Inspect preschool, primary, and teen program sections. | Correct age brackets, subjects (Ukrainian language, history, culture, art), and hours are displayed. | ✅ Automated (`school.spec.ts`) |
| **TC-SCH-003** | Verify School Registration CTA button | P1 - High | Functional | On `school.html` | 1. Click "Зареєструвати дитину" (Register child). | Opens school registration Google Form / contact modal in new tab. | ✅ Automated (`school.spec.ts`) |
| **TC-SCH-004** | Verify Location Map & Address details | P2 - Medium | Functional | On `school.html` | 1. Inspect school location section and address text.<br>2. Click Google Maps direction link. | Opens valid Google Maps route to the KW Ukrainian School facility. | ✅ Automated (`school.spec.ts`) |

---

## Module 6: Feedback & Bug Reporting

| TC ID | Title | Priority | Type | Pre-conditions | Test Steps | Expected Result | Auto Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-FDB-001** | Verify Feedback page loads and form validation | P2 - High | Functional | Browser open | 1. Navigate to `https://ukrainianskw.ca/feedback.html`.<br>2. Attempt empty submit. | Required fields (Name, Email, Message, Type) highlighted with validation messages. | ✅ Automated (`error-reports.spec.ts`) |
| **TC-FDB-002** | Verify Feedback Category selection (Suggestion, Question, Bug) | P2 - Medium | Functional | On `feedback.html` | 1. Select "Повідомити про помилку" (Bug Report).<br>2. Fill message details and submit. | Feedback successfully written to Firestore `feedback` collection with timestamp and category tag. | ✅ Automated (`error-reports.spec.ts`) |
| **TC-FDB-003** | Verify Confirmation Toast / Modal on submission | P3 - Low | UI | On `feedback.html` | 1. Submit valid message. | Displays thank-you toast: "Дякуємо за ваше повідомлення!" and resets form fields. | ✅ Automated (`error-reports.spec.ts`) |

---

## Module 7: Multilingual Subsystem & i18n

| TC ID | Title | Priority | Type | Pre-conditions | Test Steps | Expected Result | Auto Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-I18N-001** | Verify Default Language is Ukrainian (UA) | P1 - High | Functional | Fresh browser / no storage | 1. Open site in private window.<br>2. Inspect navigation labels and headings. | Default language is Ukrainian (`lang="uk"`). | ✅ Automated (`i18n.spec.ts`) |
| **TC-I18N-002** | Verify Language Switching to English (EN) | P1 - High | Functional | On any page | 1. Click the Language Switcher toggle (EN). | All elements with `data-i18n` instantly translate to English without page reload. | ✅ Automated (`i18n.spec.ts`) |
| **TC-I18N-003** | Verify Language Selection Persistence in `localStorage` | P1 - High | Functional | Switched to EN | 1. Switch language to English.<br>2. Reload page or navigate to `catalog.html`. | Site remembers English preference; does not reset to Ukrainian. | ✅ Automated (`i18n.spec.ts`) |
| **TC-I18N-004** | Verify Flag Icons Rendering as Vector SVGs (Cross-OS) | P2 - Medium | UI / Compatibility | Windows / Linux / macOS | 1. Inspect UA and CA flag graphics in header. | Flags render cleanly as SVG images (`assets/flags/ua.svg`, `assets/flags/ca.svg`), avoiding emoji rendering bugs on Windows. | ✅ Automated (`i18n.spec.ts`) |
| **TC-I18N-005** | Verify Complete Dictionary Parity (0 Missing Keys) | P1 - High | Unit / Automated | Unit test suite | 1. Run `data.test.js` / `i18n` key parity check. | All translation keys in Ukrainian dictionary have valid, non-empty English translations. | ✅ Automated (`data.test.js`) |

---

## Module 8: Data Synchronization & CI/CD Pipeline

| TC ID | Title | Priority | Type | Pre-conditions | Test Steps | Expected Result | Auto Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-SYNC-001** | Verify `sync.yml` GitHub Actions Workflow syntax | P1 - Critical | DevOps / CI | GitHub repo | 1. Inspect `.github/workflows/sync.yml`.<br>2. Validate workflow schema. | Valid syntax, configured triggers (cron `0 0 * * *` + `workflow_dispatch`). | ✅ Automated (CI) |
| **TC-SYNC-002** | Verify Batch Merge of Approved Firestore Docs into `specialists.json` | P1 - Critical | Integration / Backend | Approved docs in Firestore | 1. Run sync script `scripts/sync.js`. | Reads all docs with `status: "approved"`; formats schema; merges uniquely into `data/specialists.json`. | ✅ Automated (`api.crud.test.js`) |
| **TC-SYNC-003** | Verify Firestore Cleanup after successful sync | P1 - High | Integration | Sync executed | 1. Inspect Firestore collection after sync run. | Approved docs are safely deleted or archived in Firestore to avoid duplicate re-processing. | ✅ Automated (`api.crud.test.js`) |
| **TC-SYNC-004** | Verify JSON Schema Integrity and Non-Destructive Protection | P1 - Critical | Data Integrity | Sync script | 1. Simulate sync with malformed payload. | Script rejects invalid payload; aborts without corrupting or deleting existing `specialists.json`. | ✅ Automated (`data.test.js`) |

---

## Module 9: Accessibility & WCAG 2.1 AA

| TC ID | Title | Priority | Type | Pre-conditions | Test Steps | Expected Result | Auto Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-A11Y-001** | Verify Full Keyboard Navigation (Tab Order & Focus States) | P1 - High | a11y | Homepage / Catalog | 1. Navigate entire site using only `Tab`, `Shift+Tab`, and `Enter`/`Space`. | Focus order is logical; focus indicators (visible outlines) are clearly visible on all interactive elements. | ✅ Automated / Manual |
| **TC-A11Y-002** | Verify Screen Reader ARIA Labels on Icon Buttons | P2 - High | a11y | Header / Catalog cards | 1. Inspect search button, language toggle, and social icons. | All icon-only buttons have meaningful `aria-label` or `title` attributes (e.g. `aria-label="Зателефонувати"`). | ✅ Automated |
| **TC-A11Y-003** | Verify Color Contrast Ratios (WCAG AA >= 4.5:1) | P2 - Medium | a11y | All pages | 1. Run axe-core / Lighthouse color contrast analyzer. | Text colors against background meet or exceed minimum contrast ratio of 4.5:1 (3:1 for large text). | ✅ Automated |
| **TC-A11Y-004** | Verify Automated axe-core Scan on Core Pages | P1 - High | a11y | All pages | 1. Run `@axe-core/playwright` audit on `index`, `catalog`, `apply`, `admin`, `school`. | 0 Critical or Serious accessibility violations detected. | ✅ Automated |

---

## Module 10: Security, Privacy & Performance

| TC ID | Title | Priority | Type | Pre-conditions | Test Steps | Expected Result | Auto Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-SEC-001** | Verify XSS Input Sanitization on Application Form | P1 - Critical | Security | On `apply.html` | 1. Enter `<script>alert('XSS')</script>` or `<img src=x onerror=alert(1)>` in Name, Description, and Contact fields.<br>2. Submit form and view in Admin/Catalog. | Script tags are escaped/sanitized into safe HTML entities; no script execution occurs. | ✅ Automated (`form.spec.ts`) |
| **TC-SEC-002** | Verify Firestore Security Rules restrict unauthorized writes | P1 - Critical | Security | Direct API client | 1. Attempt direct unauthorized write to `specialists` collection or read private admin notes without auth. | Firebase rejects operation with `PERMISSION_DENIED`. | ✅ Automated (`api.crud.test.js`) |
| **TC-SEC-003** | Verify HTTPS & SSL Certificate enforcement | P1 - Critical | Security | Browser | 1. Navigate to `http://ukrainianskw.ca/`. | Automatically redirects to secure `https://ukrainianskw.ca/` with HSTS headers. | ✅ Automated |
| **TC-SEC-004** | Verify Lighthouse Performance & Core Web Vitals | P2 - High | Performance | Production build | 1. Run Lighthouse audit on Desktop & Mobile. | Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95. | ✅ Automated |
