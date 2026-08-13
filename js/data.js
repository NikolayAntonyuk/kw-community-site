// Завантаження та нормалізація даних каталогу спеціалістів
// з опублікованого Google Sheet через gviz/tq JSON-endpoint.

export const GVIZ_URL =
  "https://docs.google.com/spreadsheets/d/1suR8-8uDklE0gckJFWMaNoUxyhaGypPrxxMnbDlJGjg/gviz/tq?tqx=out:json&sheet=Approved";

const CACHE_KEY = "kw-community-specialists";
const CACHE_TTL_MS = 5 * 60 * 1000;

// Порядок 13 колонок в аркуші "Approved" — визначає, як позиційні
// значення gviz-рядка мапляться на поля обʼєкта спеціаліста.
const FIELD_ORDER = [
  "category",
  "subcategory",
  "name",
  "description",
  "locationType",
  "address",
  "phone",
  "telegram",
  "instagram",
  "facebook",
  "website",
  "price",
  "notes",
];

// Відповідь gviz — це не JSON, а виклик JS-функції:
// google.visualization.Query.setResponse({...});
// іноді з коментарем-префіксом на кшталт /*O_o*/ перед ним.
export function parseGvizResponse(text) {
  const match = text.match(
    /google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/
  );
  if (!match) {
    throw new Error(
      "Не вдалося розпізнати відповідь Google Visualization API. " +
        "Перевірте, чи опубліковано аркуш Approved через File → Share → Publish to web."
    );
  }
  let payload;
  try {
    payload = JSON.parse(match[1]);
  } catch (err) {
    throw new Error(`Не вдалося розпарсити JSON з відповіді gviz: ${err.message}`);
  }
  if (!payload || !payload.table) {
    throw new Error("Відповідь gviz не містить очікуваного поля table.");
  }
  return payload.table;
}

// Перетворює один рядок gviz-таблиці (row.c — масив клітинок, де
// порожні клітинки представлені як null) в обʼєкт спеціаліста.
export function normalizeRow(row) {
  const cells = (row && row.c) || [];
  const specialist = {};
  FIELD_ORDER.forEach((field, index) => {
    const cell = cells[index];
    specialist[field] = cell && cell.v != null ? String(cell.v).trim() : "";
  });
  return specialist;
}

export function parseSpecialists(text) {
  const table = parseGvizResponse(text);
  return (table.rows || []).map(normalizeRow);
}

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { timestamp, data } = JSON.parse(raw);
    if (typeof timestamp !== "number" || Date.now() - timestamp > CACHE_TTL_MS) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
  } catch {
    // sessionStorage може бути недоступний (приватний режим тощо) —
    // кешування best-effort, не критичне для роботи сайту.
  }
}

export async function fetchSpecialists({ force = false } = {}) {
  if (!force) {
    const cached = readCache();
    if (cached) return cached;
  }
  const response = await fetch(GVIZ_URL);
  if (!response.ok) {
    throw new Error(`Не вдалося завантажити дані каталогу (HTTP ${response.status}).`);
  }
  const text = await response.text();
  const specialists = parseSpecialists(text);
  writeCache(specialists);
  return specialists;
}
