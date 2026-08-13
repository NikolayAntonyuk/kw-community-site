// Реалістична фікстура відповіді Google Visualization API (gviz/tq).
// Структура відповідає документованому форматові:
// google.visualization.Query.setResponse({"table":{"cols":[...],"rows":[...]}})
// Порожні клітинки в рядку gviz представлені як `null`.

export const GVIZ_TABLE = {
  version: "0.6",
  reqId: "0",
  status: "ok",
  sig: "1234567890",
  table: {
    cols: [
      { id: "A", label: "Головна категорія", type: "string" },
      { id: "B", label: "Підкатегорія", type: "string" },
      { id: "C", label: "Ім'я/Назва", type: "string" },
      { id: "D", label: "Опис", type: "string" },
      { id: "E", label: "Тип локації", type: "string" },
      { id: "F", label: "Адреса", type: "string" },
      { id: "G", label: "Телефон", type: "string" },
      { id: "H", label: "Telegram", type: "string" },
      { id: "I", label: "Instagram", type: "string" },
      { id: "J", label: "Facebook", type: "string" },
      { id: "K", label: "Вебсайт", type: "string" },
      { id: "L", label: "Ціна", type: "string" },
      { id: "M", label: "Примітки", type: "string" },
    ],
    rows: [
      {
        c: [
          { v: "Здоров'я" },
          { v: "Лікарі" },
          { v: "Dr. Olena Ivanenko" },
          { v: "Сімейний лікар, прийом дорослих та дітей" },
          { v: "Офіс" },
          { v: "123 King St W, Kitchener" },
          { v: "+1 519-555-0101" },
          null,
          { v: "@dr_ivanenko" },
          null,
          { v: "https://ivanenko-clinic.ca" },
          { v: "$$" },
          { v: "Приймає нових пацієнтів" },
        ],
      },
      {
        c: [
          { v: "Освіта" },
          { v: "Репетитори" },
          { v: "Марія Коваль" },
          { v: "Репетитор з математики, підготовка до SAT" },
          { v: "Онлайн" },
          null,
          null,
          { v: "@maria_tutor" },
          null,
          null,
          null,
          { v: "$" },
          null,
        ],
      },
      {
        c: [
          { v: "Краса" },
          { v: "Перукарі" },
          { v: "Salon Kalyna" },
          { v: "Стрижки, фарбування, укладки" },
          { v: "Салон" },
          { v: "45 Erb St, Waterloo" },
          { v: "+1 519-555-0199" },
          null,
          null,
          { v: "https://facebook.com/salonkalyna" },
          null,
          { v: "$$$" },
          { v: "Знижка для нових клієнтів 10%" },
        ],
      },
    ],
  },
};

export const GVIZ_RESPONSE_TEXT = `/*O_o*/\ngoogle.visualization.Query.setResponse(${JSON.stringify(
  GVIZ_TABLE
)});`;
