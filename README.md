# KW Community — каталог спеціалістів

Статичний сайт-каталог спеціалістів та сервісів української громади Kitchener–Waterloo–Cambridge–Guelph.
Хостинг — GitHub Pages, бекенду немає: дані лежать у репозиторії, а нові заявки й модерація йдуть через Firebase.

🔗 Сайт: https://nikolayantonyuk.github.io/kw-community-site/

## Архітектура

| Шар | Реалізація |
| --- | --- |
| Каталог (основна база) | `data/specialists.json` у репозиторії |
| Нові заявки | Firebase Firestore, колекція `pending_specialists` |
| Авторизація адмінів | Firebase Authentication (Email/Password) |
| Листи про відхилення | EmailJS |
| Перенесення схвалених заявок у JSON | GitHub Actions `.github/workflows/sync.yml` (щодня опівночі + вручну) |

Сторінки:

- `index.html` — головна (про громаду, школа, активність)
- `catalog.html` — каталог з пошуком і фільтрами
- `apply.html` — форма подачі заявки (пише в Firestore, `status: pending`)
- `admin.html` — панель модерації (потрібен логін)

## Воркфлоу заявки

1. Спеціаліст заповнює форму на `apply.html` → документ у Firestore зі `status: "pending"`.
2. Адмін заходить на `admin.html`, бачить чергу, може **Редагувати**, **Підтвердити** (`status: approved`) або **Відхилити** (`status: rejected` + лист через EmailJS).
3. Схвалені картки одразу видно на сайті — `js/data.js` мерджить статичний JSON із Firestore.
4. Раз на добу GitHub Action `sync.yml` переносить схвалені записи в `data/specialists.json` і чистить Firestore.

## ⚠️ Що треба увімкнути у Firebase (без цього адмінка й форма не працюють)

У проєкті `kw-community` мають бути активовані два сервіси:

1. **Authentication** — Firebase Console → Build/Authentication → *Get started* → вкладка *Sign-in method* → **Email/Password** → *Enable*.
   Поки не увімкнено, будь-який вхід повертає `auth/configuration-not-found`, і адмінка каже «невірний пароль» незалежно від пароля.
2. **Cloud Firestore** — Firebase Console → Firestore Database → *Create database* (режим *Test mode* на старті).
   Поки не створено, форма заявки не зберігає дані (`PERMISSION_DENIED: Cloud Firestore API has not been used`).

Перевірити стан можна з консолі:

```bash
# має повернути помилку про невірні креденшели, а НЕ CONFIGURATION_NOT_FOUND
curl -s -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=<API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"email":"probe@example.com","password":"whatever12345","returnSecureToken":true}'
```

### Як додати адміністратора

Firebase Console → Authentication → вкладка **Users** → *Add user* → email + пароль. Ці ж дані використовуються для входу в `admin.html`.

### Секрет для синхронізації

GitHub → Settings → Secrets and variables → Actions → `FIREBASE_SERVICE_ACCOUNT` (весь JSON сервісного акаунта з Firebase → Project settings → Service accounts → *Generate new private key*).

## Локальна розробка

```bash
npm install
npm run serve   # сайт на http://localhost:8080
```

## Тести

```bash
npm test          # юніт (vitest) + e2e (Playwright)
npm run test:unit # vitest, tests/unit
npm run test:e2e  # playwright, tests/e2e
```

Покриття e2e: головна й навігація (`home.spec.ts`), каталог/пошук/фільтри (`site.spec.js`),
форма заявки (`form.spec.ts`), логін і помилки адмінки (`admin.spec.ts`), перемикач мов UA/EN (`i18n.spec.ts`).

Юніт-тести імпортують `js/data.js`, який тягне Firebase SDK з CDN по `https://`. Node такі імпорти не резолвить,
тому `vitest.config.js` підміняє їх на заглушку `tests/mocks/firebase-stub.js`.

### Звіти

- **GitHub Actions** → останній запуск *Playwright Tests* → секція **Artifacts** → архів `playwright-report` (розпакувати, відкрити `index.html`).
- Локально: `npx playwright show-report`.

## Багатомовність

`js/i18n.js` тримає словник UA/EN і підміняє вміст елементів з атрибутом `data-i18n`.
Мова за замовчуванням — українська, вибір зберігається в `localStorage`.

Прапори — **SVG-файли** (`assets/flags/ua.svg`, `assets/flags/ca.svg`), а не емоджі:
емоджі-прапори (🇺🇦/🇨🇦) не рендеряться на Windows і показуються як літери «UA»/«CA».

## Деплой на GitHub Pages

1. Settings → Pages → Source → Deploy from a branch.
2. Гілка `master`, папка `/ (root)`.
3. Після пуша сайт оновлюється за 1–2 хвилини.

Свій домен — файл `CNAME` у корені репо (або Settings → Pages → Custom domain), код міняти не треба.
