# 🛡️ Quality Assurance & Test Engineering: Ukrainians in KW
**Target Platform:** [ukrainianskw.ca](https://ukrainianskw.ca)  
**Main Repository:** `/home/mykola/kw-community-site`  
**QA Workspace:** `/home/mykola/kw-community-site/qa` (and `/home/mykola/.gemini/antigravity-cli/scratch/ukrainianskw-qa`)  

---

## 📂 Project Structure & Artifacts

| Document / Asset | Path | Description |
| :--- | :--- | :--- |
| **🎯 Test Strategy** | [`TEST_STRATEGY.md`](file:///home/mykola/kw-community-site/qa/TEST_STRATEGY.md) | High-level vision, scope, test levels, browser/device matrix, tools, entry/exit criteria, and defect governance. |
| **📋 Master Test Plan** | [`TEST_PLAN.md`](file:///home/mykola/kw-community-site/qa/TEST_PLAN.md) | Operational plan, 8 core modules breakdown, schedule, roles, risk mitigation matrix, and deliverables. |
| **📑 Test Cases Suite** | [`TEST_CASES.md`](file:///home/mykola/kw-community-site/qa/TEST_CASES.md) | 60+ detailed test cases across all modules (Homepage, Catalog, Application, Admin, School, Feedback, i18n, Sync, a11y, Security). |
| **🤖 Automated E2E Suite** | [`/tests/e2e/`](file:///home/mykola/kw-community-site/tests/e2e) | Playwright tests for all critical user paths, form validations, admin moderation, and i18n switching. |
| **⚡ Automated Unit Suite** | [`/tests/unit/`](file:///home/mykola/kw-community-site/tests/unit) | Vitest tests for data parsers, filters, and dictionary parity. |

---

## 🚀 Quick Execution Commands

```bash
# 1. Run full test suite (Unit + E2E)
npm test

# 2. Run only Playwright E2E tests
npm run test:e2e

# 3. Run only Unit tests
npm run test:unit

# 4. View interactive HTML Playwright Report
npx playwright show-report
```
