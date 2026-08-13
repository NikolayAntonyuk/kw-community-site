import { describe, it, expect } from "vitest";
import { parseGvizResponse, normalizeRow } from "../../js/data.js";
import { GVIZ_RESPONSE_TEXT, GVIZ_TABLE } from "../fixtures/gviz-fixture.js";

describe("parseGvizResponse", () => {
  it("strips the JS wrapper and returns the parsed table object", () => {
    const table = parseGvizResponse(GVIZ_RESPONSE_TEXT);
    expect(table).toEqual(GVIZ_TABLE.table);
  });

  it("returns cols and rows", () => {
    const table = parseGvizResponse(GVIZ_RESPONSE_TEXT);
    expect(table.cols).toHaveLength(13);
    expect(table.rows).toHaveLength(3);
  });

  it("throws a descriptive error on malformed input", () => {
    expect(() => parseGvizResponse("<html>not gviz</html>")).toThrow();
  });
});

describe("normalizeRow", () => {
  const rows = GVIZ_TABLE.table.rows;

  it("maps a full 13-column gviz row to a specialist object", () => {
    const specialist = normalizeRow(rows[0]);
    expect(specialist).toEqual({
      category: "Здоров'я",
      subcategory: "Лікарі",
      name: "Dr. Olena Ivanenko",
      description: "Сімейний лікар, прийом дорослих та дітей",
      locationType: "Офіс",
      address: "123 King St W, Kitchener",
      phone: "+1 519-555-0101",
      telegram: "",
      instagram: "@dr_ivanenko",
      facebook: "",
      website: "https://ivanenko-clinic.ca",
      price: "$$",
      notes: "Приймає нових пацієнтів",
    });
  });

  it("fills missing/null cells with empty strings instead of throwing", () => {
    const specialist = normalizeRow(rows[1]);
    expect(specialist).toEqual({
      category: "Освіта",
      subcategory: "Репетитори",
      name: "Марія Коваль",
      description: "Репетитор з математики, підготовка до SAT",
      locationType: "Онлайн",
      address: "",
      phone: "",
      telegram: "@maria_tutor",
      instagram: "",
      facebook: "",
      website: "",
      price: "$",
      notes: "",
    });
  });

  it("normalizes the third fixture row (facebook filled, telegram/instagram empty)", () => {
    const specialist = normalizeRow(rows[2]);
    expect(specialist.name).toBe("Salon Kalyna");
    expect(specialist.facebook).toBe("https://facebook.com/salonkalyna");
    expect(specialist.telegram).toBe("");
    expect(specialist.instagram).toBe("");
  });
});
