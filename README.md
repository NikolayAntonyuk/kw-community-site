# KW Community — каталог спеціалістів

Статичний сайт-каталог спеціалістів та сервісів української громади Kitchener-Waterloo-Cambridge-Guelph. Дані читаються живцем з Google Sheets, картки рендеряться на клієнті — жодного бекенду.

## Як це працює

- Джерело даних — вкладка `Approved` таблиці [NEW Waterloo region specialists](https://docs.google.com/spreadsheets/d/1suR8-8uDklE0gckJFWMaNoUxyhaGypPrxxMnbDlJGjg/edit#gid=675317647).
- Нові заявки потрапляють у вкладку `Pending`, окремий Apps Script модерує їх у `Approved`.
- Сайт при кожному відкритті тягне `Approved` через публічний `gviz/tq` JSON-endpoint (без API-ключа) і кешує результат у `sessionStorage` на ~5 хв.

**⚠️ Щоб сайт побачив дані:** вкладка `Approved` має бути опублікована через **File → Share → Publish to web** (обрати саме цю вкладку, не весь файл) — інакше `gviz/tq`-endpoint віддає сторінку логіну Google замість JSON.

## Локальна розробка

```bash
npm install
npm run serve   # піднімає сайт на http://localhost:8080
```

## Тести

```bash
npm test          # юніт (vitest) + e2e (Playwright), послідовно
npm run test:unit
npm run test:e2e
```

## Деплой на GitHub Pages

1. Settings → Pages → Source → Deploy from a branch.
2. Обрати гілку `master` (або `main`), папку `/ (root)`.
3. Дочекатись білда — сайт зʼявиться на `https://<user>.github.io/kw-community-site/`.

Коли зʼявиться свій домен — достатньо додати файл `CNAME` з доменом у корінь репо (або в Settings → Pages → Custom domain), без переробки коду.
