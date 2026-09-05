# Налаштування TestoMat: Кроки для виконання

**Проект:** https://app.testomat.io/projects/kw-community

## Крок 1: Завантажити чек-листи у TestoMat

### Suite 1: Homepage
1. У TestoMat → Settings → Test Suites → Add New Suite
   - **Suite Name:** Homepage
   - **Description:** Тестування головної сторінки
2. Додати модулі (Groups):
   - Hero Section
   - Catalog Display
   - Search & Filter
   - Navigation
   - Performance
   - Accessibility
3. Для кожного модулю додати test cases з чек-листу: `docs/testing/checklist-homepage.md`

### Suite 2: Catalog
1. Add New Suite
   - **Suite Name:** Catalog
   - **Description:** Тестування каталогу спеціалістів
2. Модулі:
   - Display
   - Filters
   - Sorting
   - Mobile Responsiveness
   - Pagination
   - Edge Cases
   - Contact Features
   - Accessibility
3. Імпортувати тест-кейси з: `docs/testing/checklist-catalog.md`

### Suite 3: Admin Panel
1. Add New Suite
   - **Suite Name:** Admin Panel
   - **Description:** Тестування адмін-панелі
2. Модулі:
   - Authentication
   - List Management
   - Create Specialist
   - Edit Specialist
   - Delete Specialist
   - Validation & Errors
   - Performance
   - Google Sheets Sync
   - Accessibility
   - Security
   - Error Reports & Feedback (Звіти про помилки)
3. Імпортувати з: `docs/testing/checklist-admin.md`

---

## Крок 2: Налаштування Environments

1. TestoMat → Settings → Environments
2. Додати:

| Name | Base URL | Type |
|------|----------|------|
| Development | http://localhost:8000 | Local |
| Staging (Cloudflare) | https://hiking-stock-continually-southwest.trycloudflare.com | Remote |

---

## Крок 3: Налаштування Browsers

TestoMat → Settings → Browsers

Позначити для тестування:
- ✅ Chrome (Desktop)
- ✅ Safari (macOS)
- ✅ Firefox (Desktop)
- ✅ Chrome Mobile (Android)
- ✅ Safari Mobile (iOS)

---

## Крок 4: GitHub Integration

### 4a: У TestoMat
1. Settings → GitHub → Connect
2. Авторизуй GitHub акаунт
3. Обери репозиторій: `NikolayAntonyuk/kw-community-site`
4. Увімкни: **"Auto-create GitHub issue when bug is filed"**
5. Встав labels mapping:
   ```
   Severity Mapping:
   - Critical → [bug, critical]
   - High → [bug, high]
   - Medium → [bug, medium]
   - Low → [bug, low]
   ```

### 4b: Перевірити labels у GitHub

Усі labels вже створені. Перевір:
```bash
gh label list -R NikolayAntonyuk/kw-community-site
```

---

## Крок 5: Написання першого Test Case

Приклад структури (в TestoMat):

```
Title:        Homepage hero video loads and plays
Module:       Homepage → Hero Section
Priority:     High
Environment:  Development
Browser:      Chrome (Desktop)
Device:       Desktop (1920x1080)

Steps:
  1. Відкрити http://localhost:8000
  2. Перевірити, що <video> елемент з class="hero-video" присутній
  3. Перевірити, що видео має atribute: autoplay, loop, muted
  4. Перевірити, що видео завантажується (не біле полотно)
  5. Перевірити, що текст заголовка видимий поверх відео

Expected Result:
  - Видео працює, з гарною якістю
  - Текст читаємий
  - Без помилок в консолі (F12 → Console)

Actual Result:
  [Заповнити після тестування]

Attachment:
  [Скріншот з F12 DevTools відкритим]
```

---

## Крок 6: Логування Багів

Коли знайдеш баг під час тестування:

1. **У TestoMat** натисни **"Report Bug"** з того test case
2. Заповни шаблон з: `docs/testing/BUG_REPORT_TEMPLATE.md`
3. Обери **Severity** (Critical / High / Medium / Low)
4. Додай **Labels** (які модулю: homepage, catalog, admin)
5. Натисни **"Save"**

→ **Автоматично** створиться GitHub Issue з правильними labels

---

## Крок 7: Перевірка інтеграції

1. Логуй один тестовий баг у TestoMat з severity "High"
2. Перейди на GitHub → Issues
3. Переконайся, що Issue створений з labels: `bug`, `high`

---

## Команди для локального тестування

```bash
# Перевірити статус локального сервера
systemctl --user status kw-community-site

# Переглянути логи
journalctl --user -u kw-community-site -n 50 -f

# Перевірити, чи сервер запущений на порту 8000
curl http://localhost:8000
```

---

## Посилання

- **TestoMat Project:** https://app.testomat.io/projects/kw-community
- **GitHub Repo:** https://github.com/NikolayAntonyuk/kw-community-site
- **Local Server:** http://localhost:8000
- **Staging:** https://hiking-stock-continually-southwest.trycloudflare.com
- **GitHub Labels:** https://github.com/NikolayAntonyuk/kw-community-site/labels

---

**Статус:** ✅ Готово. Твоя черга почати з Кроку 1.
