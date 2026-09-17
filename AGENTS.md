# AI Agent Guidelines for KW Community Site

Welcome, Agent! This file (`AGENTS.md`) contains the core rules, architectural context, and user preferences for working on the KW Community Site repository. You MUST adhere to these rules during all interactions.

## 1. CRITICAL: Link Formatting
The user strictly prefers plain-text links for the core project resources.
**NEVER** use standard Markdown formatting for these project links (e.g., no `[Text](url)`).
**NEVER** put them in blockquotes (`>`) or code blocks.
Always append this exact block to the end of your replies whenever the user asks for links or at the end of task completions:

🔗 Ресурси проекту:
🌐 Прод: https://ukrainianskw.ca
⚙️ Адмінка: https://ukrainianskw.ca/admin.html
💻 Гіт: https://github.com/nikolayantonyuk/kw-community-site
🧪 Тестомат: https://app.testomat.io/projects/kw-community/

## 2. Testing & Testomat Integration
- All tests (both **Playwright** E2E and **Vitest** unit tests) must be synced to **Testomat**.
- When configuring or adding new test runners, ensure `@testomatio/reporter` is hooked up.
- Ensure GitHub Actions (`.github/workflows/*.yml`) explicitly pass the `TESTOMATIO: ${{ secrets.TESTOMATIO }}` environment variable to the test execution steps.

## 3. QA Documentation Sync
- If you modify background jobs, sync scripts, scrapers, or core logic, you **MUST** update the master test plan in `qa/TEST_CASES.md`.
- Keep checklists in `docs/testing/` up to date with the implemented functionality.

## 4. Architectural Context
- **Stack:** Static HTML/JS/CSS (No heavy framework).
- **Primary Data:** `data/specialists.json` (Catalog), `data/events.json` (Scraped events).
- **Backend / Moderation:** Firebase Firestore (for `pending_specialists`) and Firebase Authentication (Email/Password for `admin.html`).
- **Automation:** 
  - GitHub Actions (`sync.yml`) merge approved Firebase docs into the static JSON.
  - Node.js scrapers (`scripts/scrape_fb_events.js`) run via cron, protecting against zero-event overwrites.
- **Hosting:** GitHub Pages.
