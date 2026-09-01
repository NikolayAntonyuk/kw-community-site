# Інтеграція TestoMat з KW Community

## Крок 1: Налаштування проекту у TestoMat

Проект створений: https://app.testomat.io/projects/kw-community

### Оглядова інформація
- **Назва:** KW Community
- **Опис:** Test Management для сайту KW Community Waterloo Region
- **Тип:** Exploratory Testing + Regression Testing
- **Статус:** Активний

---

## Крок 2: Завантаження тестових сюїтів

### Suite 1: Homepage (`docs/testing/checklist-homepage.md`)
**У TestoMat створи:**
- Назва сюїту: **Homepage**
- Описання: Тестування головної сторінки
- Модулі (Test Groups):
  1. **Hero Section** — видео, текст-оверлей, мобільність
  2. **Catalog Display** — завантаження списку, рендеринг карток
  3. **Search & Filter** — пошук/фільтрація спеціалістів
  4. **Navigation** — sticky menu, мобільний гамбургер
  5. **Performance** — час завантаження, CLS, frame rate
  6. **Accessibility** — контраст, focus states, aria-labels

**Значимість:** High 🔴

---

### Suite 2: Catalog (`docs/testing/checklist-catalog.md`)
**У TestoMat створи:**
- Назва сюїту: **Catalog**
- Описання: Тестування каталогу спеціалістів
- Модулі (Test Groups):
  1. **Display** — точність даних, завантаження фото
  2. **Filters** — мультивибір категорії/локації
  3. **Sorting** — сортування по ціні/імені
  4. **Mobile Responsiveness** — 1/2/3+ колони
  5. **Pagination** — "Далі/Назад"/infinite scroll
  6. **Edge Cases** — відсутні дані, довгі імена
  7. **Contact Features** — Instagram, Telegram, Phone
  8. **Accessibility** — клавіатурна навігація

**Значимість:** High 🔴

---

### Suite 3: Admin Panel (`docs/testing/checklist-admin.md`)
**У TestoMat створи:**
- Назва сюїту: **Admin Panel**
- Описання: Тестування адмін-панелі
- Модулі (Test Groups):
  1. **Authentication** — вхід/вихід, сеанс
  2. **List Management** — завантаження, сортування, пошук
  3. **Create Specialist** — форма, валідація, збереження
  4. **Edit Specialist** — редагування полів, оновлення
  5. **Delete Specialist** — модаль підтвердження
  6. **Validation & Errors** — помилки, сервер 500
  7. **Performance** — 100+ записів, сортування
  8. **Google Sheets Sync** — синхронізація двостороння
  9. **Accessibility** — клавіатура, labels, reader
  10. **Security** — пароль, XSS, SQL injection

**Значимість:** High 🔴

---

## Крок 3: Налаштування середовищ (Environments)

Додай у TestoMat:

| Назва | URL | Тип |
|-------|-----|-----|
| **Development** | `http://localhost:8000` | Local |
| **Staging (Cloudflare)** | `https://hiking-stock-continually-southwest.trycloudflare.com` | Remote |

### Інструкція:
1. Settings → Environments
2. Додай обидва URL
3. Кожен test case можна позначити якому環境 відповідає

---

## Крок 4: Налаштування браузерів для testing

У TestoMat додай під "Browsers":
- Chrome (Desktop) — основний
- Safari (macOS) — тестування 
- Firefox (Desktop)
- Chrome Mobile (Android) — мобільне
- Safari Mobile (iOS) — мобільне

---

## Крок 5: GitHub Issues Інтеграція

### 5a: Налаштування labels у GitHub

Запусти скрипт для створення labels:

```bash
cd /home/mykola/kw-community-site
bash docs/testing/GITHUB_LABELS_SETUP.sh
```

Це створить 24 labels:
- **Severity:** critical, high, medium, low
- **Type:** bug, feature-request, enhancement, documentation, testing
- **Component:** admin, catalog, homepage, api, frontend
- **Platform:** mobile, desktop, performance, security, accessibility
- **Status:** verified, in-progress, blocked, wontfix

### 5b: Налаштування в TestoMat

1. Settings → GitHub Integration
2. Авторизуй акаунт (якщо не авторизований)
3. Обери репозиторій: `kw-community-site`
4. Увімкни: "Auto-create GitHub issue when bug is filed"
5. Відповідність labels:
   - TestoMat "Critical" → GitHub labels: `bug`, `critical`
   - TestoMat "High" → GitHub labels: `bug`, `high`
   - TestoMat "Medium" → GitHub labels: `bug`, `medium`
   - TestoMat "Low" → GitHub labels: `bug`, `low`

### 5c: Картування меток

Коли закриєш баг у TestoMat як "won't fix":
```
GitHub Issue отримає labels: [bug, wontfix]
```

---

## Крок 6: Як писати тести у TestoMat

### Шаблон Test Case:

```
Title:        [Коротко, англійською чи українською]
Module:       [Suite → Module, e.g., Homepage → Hero Section]
Priority:     [Critical / High / Medium / Low]
Steps:
  1. Відкрити http://localhost:8000
  2. Прокрутити вниз на 50vh
  3. Перевірити видео лоадинг
Expected:     Видео заповнює весь контейнер, без затримок
Actual:       [Заповни після тестування]
Environment:  Development / Staging
Browser:      Chrome 120 / Safari 17
Device:       Desktop / iPhone 14
Attachment:   [Скріншот/відео з F12 DevTools]
```

---

## Крок 7: GitHub Issues Link

Коли закриєш баг у TestoMat з severity "Critical" або "High":
- Будеться створений GitHub Issue
- Автоматично додадуться labels: `bug`, `critical` / `high`
- Посилання на GitHub Issue буде у TestoMat

### Посилання на репозиторій:
https://github.com/your-username/kw-community-site

---

## Крок 8: Cadence (Розклад тестування)

### Щоденно (Daily):
- Проходь **Homepage** Suite → Hero Section + Navigation
- Проходь **Catalog** Suite → Display + Filters

### 2 рази на тиждень (Twice Weekly):
- Повна **Homepage** Suite
- Повна **Catalog** Suite

### Щотижня (Weekly):
- Повна **Admin Panel** Suite
- Google Sheets Sync перевірка

### Перед релізом (Pre-Release):
- Всі 3 Suite на всіх браузерах/пристроях
- Performance тестування (load time, CLS, frame rate)
- Security перевірка (XSS, SQL injection, password masking)

---

## Крок 9: Баги та Tracking

### Коли знайдеш баг:
1. Подай у TestoMat з template-ом: `/docs/testing/BUG_REPORT_TEMPLATE.md`
2. Додай severity (Critical/High/Medium/Low)
3. Додай labels (що модулю)
4. Якщо severity >= High: GitHub Issue буде створений автоматично

### Приклад:
```
Title:        Homepage hero video not loading on mobile Safari
Module:       Homepage → Hero Section
Severity:     High
Steps:
  1. Відкрити на iPhone: https://..../
  2. Очікується: видео грає з музикою
  3. Фактично: чорний екран, немає помилки
Browser:      Safari Mobile (iOS 17)
Device:       iPhone 14 Pro
Attachment:   [скрін]
Labels:       bug, high, mobile, homepage
```

→ **Результат:** GitHub Issue створений автоматично, залаблений

---

## Посилання

- **TestoMat Project:** https://app.testomat.io/projects/kw-community
- **GitHub Repo:** https://github.com/your-username/kw-community-site
- **Чек-листи:** 
  - https://github.com/your-username/kw-community-site/blob/master/docs/testing/checklist-homepage.md
  - https://github.com/your-username/kw-community-site/blob/master/docs/testing/checklist-catalog.md
  - https://github.com/your-username/kw-community-site/blob/master/docs/testing/checklist-admin.md
- **Шаблон баг-репорту:** https://github.com/your-username/kw-community-site/blob/master/docs/testing/BUG_REPORT_TEMPLATE.md

---

**Статус:** ✅ Готово до використання.  
**Дата налаштування:** 2026-09-01
