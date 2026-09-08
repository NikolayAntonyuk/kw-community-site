# 📑 Black-Box Test Cases Suite: Ukrainians in KW
**Target:** [https://ukrainianskw.ca](https://ukrainianskw.ca)  
**Methodology:** 100% Black-Box Web Testing (End-User & Behavioral Perspective)  
**Total Test Cases:** 65  
**Standard:** IEEE 829 / ISTQB  

---

## 📑 Summary Matrix by Module

| Suite ID | Suite Name | Target Page / Feature | TC Count | Priority Breakdown |
| :--- | :--- | :--- | :--- | :--- |
| **BB-HOME** | **Homepage & Navigation** | `index.html` | 8 TCs | 3 Critical, 3 High, 2 Medium |
| **BB-CAT** | **Catalog, Search & Filtering** | `catalog.html` | 16 TCs | 6 Critical, 6 High, 4 Medium |
| **BB-APP** | **Specialist Application Form** | `apply.html` | 12 TCs | 5 Critical, 5 High, 2 Medium |
| **BB-ADM** | **Moderator Admin Portal** | `admin.html` | 12 TCs | 5 Critical, 5 High, 2 Medium |
| **BB-SCH** | **Ukrainian School Hub** | `school.html` | 5 TCs | 2 High, 3 Medium |
| **BB-FDB** | **Feedback & Error Reports** | `feedback.html` | 4 TCs | 1 High, 3 Medium |
| **BB-I18N** | **Multilingual (UA / EN)** | All Pages (`js/i18n.js`) | 5 TCs | 3 Critical, 2 High |
| **BB-A11Y** | **Accessibility & Usability** | All Pages | 4 TCs | 2 High, 2 Medium |
| **BB-SEC** | **Black-Box Input Security** | `apply.html`, `feedback.html` | 3 TCs | 3 Critical |
| **Total** | | | **65 TCs** | **24 Critical, 27 High, 14 Med** |

---

## 1. Suite BB-HOME: Homepage & Navigation (`index.html`)

| TC ID | Title | Persona | Priority | Technique | User Steps | Expected Observable Output |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BB-HOME-001** | Verify Homepage loads with 200 OK & Hero Banner | Visitor | Critical | Smoke | 1. Open `https://ukrainianskw.ca/` in browser.<br>2. Observe page loading and header. | Page loads in < 1.5s; header logo, title, and hero section "Українська громада Kitchener-Waterloo" are clearly displayed. |
| **BB-HOME-002** | Verify Primary Navigation Links in Header | Visitor | High | Use Case | 1. Click "Каталог"<br>2. Click "Школа"<br>3. Click "Подати заявку"<br>4. Click Logo | 1. Opens `/catalog.html`<br>2. Opens `/school.html`<br>3. Opens `/apply.html`<br>4. Returns to `/index.html` (0 broken links). |
| **BB-HOME-003** | Verify Hero Call-To-Action ("Знайти спеціаліста") | Seeker | Critical | Use Case | 1. Click primary hero button "Знайти спеціаліста". | Smoothly navigates directly to `/catalog.html` with search bar focused. |
| **BB-HOME-004** | Verify Mobile Hamburger Drawer (Open / Close / Navigate) | Mobile User | High | State Transition | 1. Resize viewport to 390px (Mobile).<br>2. Tap burger icon.<br>3. Tap "Каталог". | Drawer smoothly slides open; links are clearly tap-friendly (min 44px height); tapping navigates and closes menu. |
| **BB-HOME-005** | Verify Community Initiatives Cards rendering | Visitor | Medium | Visual | 1. Scroll down to "Ініціативи громади".<br>2. Inspect each card. | All cards display high-res icon, bold title, descriptive text, and working external action link. |
| **BB-HOME-006** | Verify Ukrainian School Preview Section & CTA | Parent | High | Use Case | 1. Scroll to School preview block.<br>2. Click "Дізнатися більше". | Directly opens `/school.html` with full program schedules. |
| **BB-HOME-007** | Verify Footer Social Media Links (Facebook, Telegram) | Visitor | Medium | Functional | 1. Scroll to footer.<br>2. Click Facebook link.<br>3. Click Telegram link. | Links open correct Ukrainian community groups in new browser tabs (`target="_blank"`). |
| **BB-HOME-008** | Verify Sticky Header on Scroll | Desktop/Mobile | Medium | UI/UX | 1. Scroll down 1000px.<br>2. Scroll back up. | Header remains fixed at the top with slight drop shadow, providing quick navigation access. |

---

## 2. Suite BB-CAT: Specialists Catalog & Multi-filtering (`catalog.html`)

| TC ID | Title | Persona | Priority | Technique | User Steps | Expected Observable Output |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BB-CAT-001** | Verify initial catalog load & card grid display | Seeker | Critical | Smoke | 1. Navigate to `/catalog.html`.<br>2. Count rendered specialist cards. | Grid renders all verified specialists (> 40 cards) with photos, titles, categories, and cities. |
| **BB-CAT-002** | Verify Instant Search by First Name / Last Name | Seeker | Critical | Equivalence Part. | 1. Type "Олена" or "Ivan" into search input. | Cards update in real-time (< 50ms); only cards matching name are visible. Counter updates. |
| **BB-CAT-003** | Verify Search by Profession / Keyword | Seeker | High | Equivalence Part. | 1. Type "юрист" or "масаж" or "авто" or "IT". | Grid filters to show only specialists matching that profession in title or description. |
| **BB-CAT-004** | Verify Case-Insensitive and Cyrillic/Latin Search | Seeker | High | Equivalence Part. | 1. Type "РЕМОНТ" (uppercase).<br>2. Type "remont" (latin translit if supported). | Case-insensitive matching works properly; returns identical results for upper/lower case. |
| **BB-CAT-005** | Verify Category Pills Single-Selection | Seeker | High | Decision Table | 1. Click "Краса та здоров'я" pill.<br>2. Click "Ремонт та будівництво". | Selected pill becomes active (highlighted); only specialists in selected category are displayed. |
| **BB-CAT-006** | Verify City Filter: Kitchener | Seeker | High | Decision Table | 1. Select city dropdown / checkbox "Kitchener". | Grid updates to show specialists servicing Kitchener. |
| **BB-CAT-007** | Verify City Filter: Waterloo | Seeker | High | Decision Table | 1. Select city "Waterloo". | Grid updates to show specialists servicing Waterloo. |
| **BB-CAT-008** | Verify Multi-City Filter (Kitchener + Waterloo + Cambridge) | Seeker | High | Decision Table | 1. Select both "Kitchener" and "Cambridge". | Grid shows specialists that serve either or both selected municipalities. |
| **BB-CAT-009** | Verify Combined Multi-Filtering (Category + City + Search) | Seeker | Critical | Decision Table | 1. Select Category "Послуги".<br>2. Select City "Waterloo".<br>3. Type "переклад" in search box. | Grid applies AND condition; shows only translators in Waterloo matching the keyword. |
| **BB-CAT-010** | Verify "Clear All Filters" (Reset) Button | Seeker | High | State Transition | 1. Apply category, city, and search query.<br>2. Click "Скинути фільтри" (Reset). | All filter inputs clear; full catalog list is restored instantly. |
| **BB-CAT-011** | Verify Empty State message for non-matching search | Seeker | Medium | Boundary Value | 1. Type `qwerty999xyz` in search box. | Friendly "Нічого не знайдено" (Nothing found) message appears with a reset button. |
| **BB-CAT-012** | Verify Direct Phone Call Button (`tel:`) | Seeker | High | Functional | 1. Click "Зателефонувати" / Phone icon on a specialist card. | Browser triggers default phone dialer with specialist's exact number (e.g. `tel:+1519...`). |
| **BB-CAT-013** | Verify Direct Telegram / Instagram Social Links | Seeker | High | Functional | 1. Click Telegram icon.<br>2. Click Instagram icon. | Opens specialist's official Telegram profile / Instagram page in new tab. |
| **BB-CAT-014** | Verify Direct Email Action Button (`mailto:`) | Seeker | Medium | Functional | 1. Click Email icon on card. | Opens default email client with pre-filled `To: specialist@domain.com`. |
| **BB-CAT-015** | Verify Verified Specialist Checkmark Badge | Seeker | Medium | Visual | 1. Look for blue checkmark badge on card. | Cards with verified status display "Перевірено" badge; unverified cards do not. |
| **BB-CAT-016** | Verify Specialist Avatar Image Fallback on 404 | Seeker | High | Resilience | 1. Inspect cards where image fails to load. | Fallback SVG illustration appears gracefully without broken image frame. |

---

## 3. Suite BB-APP: Specialist Registration Form (`apply.html`)

| TC ID | Title | Persona | Priority | Technique | User Steps | Expected Observable Output |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BB-APP-001** | Verify Application Form initial load & field layout | Specialist | Critical | Smoke | 1. Open `/apply.html`. | Form renders with all required labels, inputs, dropdowns, and submit button. |
| **BB-APP-002** | Verify Empty Form Submission validation | Specialist | Critical | Boundary Value | 1. Leave all fields empty.<br>2. Click "Надіслати заявку". | Form is blocked from sending; required fields (Name, Category, City, Phone/Email) highlight in red with helper messages. |
| **BB-APP-003** | Verify Name field min/max length validation | Specialist | High | Boundary Value | 1. Enter "A" (1 char).<br>2. Enter "Олександр Шевченко" (valid). | 1 char shows error "Мінімум 2 символи"; valid name clears error outline. |
| **BB-APP-004** | Verify Canadian Phone Number format validation | Specialist | High | Equivalence Part. | 1. Enter `12345` (invalid).<br>2. Enter `519-555-0199` or `(519) 555-0199`. | Invalid phone shows "Введіть коректний номер"; valid format accepted. |
| **BB-APP-005** | Verify Email format validation | Specialist | High | Equivalence Part. | 1. Enter `invalid-email`.<br>2. Enter `specialist@ukr.net`. | Invalid email shows "Некоректний email"; valid email accepted. |
| **BB-APP-006** | Verify Category & Subcategory selection | Specialist | High | Use Case | 1. Select "Автопослуги" from Category dropdown.<br>2. Select "СТО / Діагностика". | Subcategory updates dynamically to match selected parent category. |
| **BB-APP-007** | Verify City / Service Area selection | Specialist | High | Use Case | 1. Select "Kitchener" + "Waterloo". | Multi-select allows picking multiple service locations. |
| **BB-APP-008** | Verify Description field character counter (Max 1000) | Specialist | Medium | Boundary Value | 1. Type 50 characters.<br>2. Paste 1050 characters. | Counter shows "50 / 1000"; excess text over 1000 chars is blocked or trimmed. |
| **BB-APP-009** | Verify Social Handle Normalization (Telegram / Instagram) | Specialist | High | Equivalence Part. | 1. Type `@mykolasdet` in Telegram field.<br>2. Type `instagram.com/mykolasdet`. | System accepts both `@handle` and full URL, normalizing into valid web link. |
| **BB-APP-010** | Verify Successful Application Submission & Confirmation | Specialist | Critical | State Transition | 1. Fill all valid details.<br>2. Click "Надіслати заявку". | Loading spinner appears -> Success modal appears: "Дякуємо! Ваша заявка відправлена на модерацію." Form fields reset. |
| **BB-APP-011** | Verify Double-Click / Spam Submit Prevention | Specialist | High | State Transition | 1. Rapidly double-click "Надіслати заявку" button. | Button disables immediately upon first click (`disabled="true"`); only 1 submission is created. |
| **BB-APP-012** | Verify Form Behavior during Network Disconnection | Specialist | Medium | Resilience | 1. Fill form -> Disable Wi-Fi/data -> Click Submit. | Friendly error banner appears: "Помилка мережі. Перевірте з'єднання та спробуйте знову." No crash. |

---

## 4. Suite BB-ADM: Moderator & Admin Portal (`admin.html`)

| TC ID | Title | Persona | Priority | Technique | User Steps | Expected Observable Output |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BB-ADM-001** | Verify Admin Portal Authentication Gate | Moderator | Critical | Security | 1. Navigate directly to `/admin.html`. | Content is protected; Login modal is displayed requesting Email & Password. |
| **BB-ADM-002** | Verify Invalid Admin Password rejection | Moderator | High | Security | 1. Enter admin email + incorrect password.<br>2. Click "Увійти". | Login rejected; error alert "Невірний пароль або email" is shown. Dashboard remains locked. |
| **BB-ADM-003** | Verify Successful Admin Login | Moderator | Critical | Use Case | 1. Enter valid admin email + correct password.<br>2. Click "Увійти". | Login succeeds; Admin dashboard displays with submission counters and moderation tabs. |
| **BB-ADM-004** | Verify Pending Applications Queue rendering | Moderator | Critical | Use Case | 1. Click "Черга (Pending)" tab. | Displays list of all unmoderated submissions with timestamp, applicant name, and category. |
| **BB-ADM-005** | Verify Application Details Review Modal | Moderator | High | Use Case | 1. Click "Редагувати / Деталі" on a pending card. | Modal opens showing all submitted applicant information in editable fields. |
| **BB-ADM-006** | Verify Moderator Edit & Save Changes | Moderator | High | State Transition | 1. Fix a typo in applicant's description.<br>2. Click "Зберегти зміни". | Toast shows "Зміни збережено"; card updates immediately with edited text. |
| **BB-ADM-007** | Verify "Approve" Application Flow | Moderator | Critical | State Transition | 1. On a pending card, click "Підтвердити" (Approve). | Confirmation toast appears; card moves from "Pending" tab to "Approved" tab. |
| **BB-ADM-008** | Verify "Reject" Application with Feedback Reason | Moderator | Critical | State Transition | 1. Click "Відхилити" (Reject).<br>2. Select reason "Неповні контактні дані".<br>3. Confirm rejection. | Status updates to Rejected; card moves to "Rejected" tab; rejection notification triggered. |
| **BB-ADM-009** | Verify Approved Specialist visibility in Live Catalog | Moderator / Seeker | Critical | End-to-End | 1. Approve a specialist named "Тестовий Майстер".<br>2. Open `/catalog.html` in new tab. | "Тестовий Майстер" immediately appears in the live catalog search results. |
| **BB-ADM-010** | Verify Hard Delete Application with confirmation | Moderator | High | Security / Logic | 1. In "Rejected" tab, click "Видалити".<br>2. Click "Скасувати" on prompt.<br>3. Click "Видалити" -> "Підтвердити". | Cancel keeps the record; Confirm permanently deletes it from the moderation list. |
| **BB-ADM-011** | Verify Search within Admin Dashboard | Moderator | Medium | Functional | 1. Type applicant name in Admin search bar. | Filter queue to display only matching application cards. |
| **BB-ADM-012** | Verify Admin Logout & Session Termination | Moderator | High | Security | 1. Click "Вийти" (Logout). | Session ends; user is logged out; login modal re-appears. Back button cannot access dashboard. |

---

## 5. Suite BB-SCH: Ukrainian School Portal (`school.html`)

| TC ID | Title | Persona | Priority | Technique | User Steps | Expected Observable Output |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BB-SCH-001** | Verify Ukrainian School Page Content & Hero | Parent | High | Smoke | 1. Navigate to `/school.html`. | Page loads with 200 OK; school banner, mission statement, and schedule overview render cleanly. |
| **BB-SCH-002** | Verify Age Group Cards (Preschool / Primary / Youth) | Parent | Medium | Visual | 1. Scroll to Age Groups section. | Each age group card displays target ages (3-5, 6-10, 11-15), subjects, and hours. |
| **BB-SCH-003** | Verify School Registration CTA Button | Parent | High | Use Case | 1. Click "Зареєструвати дитину на навчання". | Opens official registration form / modal in new tab. |
| **BB-SCH-004** | Verify School Location & Google Maps Link | Parent | Medium | Functional | 1. Scroll to address section.<br>2. Click Google Maps link. | Opens Google Maps with exact pin on school facility in Kitchener-Waterloo. |
| **BB-SCH-005** | Verify School FAQ Accordion / Questions | Parent | Medium | UI/UX | 1. Click on FAQ question "Які предмети викладаються?". | Accordion expands smoothly revealing answer; clicking again collapses it. |

---

## 6. Suite BB-FDB: Feedback & Community Inquiries (`feedback.html`)

| TC ID | Title | Persona | Priority | Technique | User Steps | Expected Observable Output |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BB-FDB-001** | Verify Feedback Page layout & Form fields | Member | High | Smoke | 1. Navigate to `/feedback.html`. | Form renders with Name, Email, Category select, Message textarea, and Submit button. |
| **BB-FDB-002** | Verify Feedback Form Validation | Member | Medium | Boundary Value | 1. Submit empty feedback form. | Required fields are highlighted in red; form submission blocked. |
| **BB-FDB-003** | Verify Feedback Category Select (Bug / Suggestion / General) | Member | Medium | Use Case | 1. Select "Повідомити про помилку на сайті".<br>2. Enter message.<br>3. Submit. | Category correctly tags submission; thank-you confirmation toast appears. |
| **BB-FDB-004** | Verify Feedback Form Reset after successful submission | Member | Medium | State Transition | 1. Submit valid feedback. | Form inputs are cleared; confirmation message displayed. |

---

## 7. Suite BB-I18N: Multilingual Subsystem (UA / EN)

| TC ID | Title | Persona | Priority | Technique | User Steps | Expected Observable Output |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BB-I18N-001** | Verify Ukrainian is Default Language | Visitor | Critical | State Transition | 1. Open site in fresh incognito window. | All navigation, hero headings, catalog filters, and buttons are in Ukrainian (`uk`). |
| **BB-I18N-002** | Verify Language Switcher Toggle to English (EN) | Visitor | Critical | State Transition | 1. Click Language Toggle "EN" in header. | Page instantly translates to English without full page reload. Hero, menus, and buttons update. |
| **BB-I18N-003** | Verify Language Switcher Toggle back to Ukrainian (UA) | Visitor | Critical | State Transition | 1. On English view, click "UA" toggle. | Page instantly returns to Ukrainian. |
| **BB-I18N-004** | Verify Language Preference Persistence | Visitor | High | State Transition | 1. Switch language to English on Homepage.<br>2. Navigate to `/catalog.html`.<br>3. Reload browser. | Catalog page opens in English; language preference is remembered via `localStorage`. |
| **BB-I18N-005** | Verify Vector SVG Flags Rendering across all OSes | Visitor | High | Compatibility | 1. Inspect UA and CA flags on Windows, macOS, Linux, iOS, and Android. | Flags render as clean SVG vector graphics (`assets/flags/ua.svg`, `ca.svg`) without broken emojis. |

---

## 8. Suite BB-A11Y: Accessibility & Usability (WCAG 2.1 AA)

| TC ID | Title | Persona | Priority | Technique | User Steps | Expected Observable Output |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BB-A11Y-001** | Verify Full Keyboard Navigation via `Tab` Key | A11y User | High | Accessibility | 1. Open `/` and `/catalog.html`.<br>2. Press `Tab` repeatedly to cycle through interactive elements. | Logical tab sequence; every link, button, and input receives a clear visible focus outline. |
| **BB-A11Y-002** | Verify Keyboard Activation via `Enter` / `Space` | A11y User | High | Accessibility | 1. Tab to "Знайти спеціаліста" -> Press `Enter`.<br>2. Tab to category pill -> Press `Space`. | `Enter` activates links/buttons; `Space` toggles buttons/checkboxes. |
| **BB-A11Y-003** | Verify Screen Reader ARIA Labels on Icon Buttons | A11y User | Medium | Accessibility | 1. Inspect phone, email, Telegram, Instagram, and search icon buttons. | All icon buttons have descriptive `aria-label` or `title` attributes (e.g. `aria-label="Зателефонувати"`). |
| **BB-A11Y-004** | Verify Text Color Contrast (WCAG AA >= 4.5:1) | A11y User | Medium | Accessibility | 1. Check text color on buttons, cards, and backgrounds. | Text contrast meets or exceeds minimum 4.5:1 ratio for standard text and 3:1 for large headers. |

---

## 9. Suite BB-SEC: Black-Box Input Security & Resilience

| TC ID | Title | Persona | Priority | Technique | User Steps | Expected Observable Output |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BB-SEC-001** | Verify XSS Injection Sanitization in Name field | Attacker / QA | Critical | Security | 1. On `apply.html`, enter `<script>alert('XSS')</script>` in Name.<br>2. Submit and view in Admin and Catalog. | Script is safely escaped as plain text `&lt;script&gt;...`; no alert popup or script execution occurs. |
| **BB-SEC-002** | Verify XSS Injection Sanitization in Description | Attacker / QA | Critical | Security | 1. On `apply.html`, enter `<img src=x onerror=alert(document.cookie)>` in Description.<br>2. Submit and inspect card. | HTML tag is sanitized/escaped; no script executes. |
| **BB-SEC-003** | Verify Form Input Tampering & Length Flooding | Attacker / QA | Critical | Security | 1. Attempt pasting 50,000 characters into input fields.<br>2. Submit. | Browser truncates or rejects oversized payload with friendly error; page does not freeze or crash. |
