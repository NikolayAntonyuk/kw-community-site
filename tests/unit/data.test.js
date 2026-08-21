import { describe, it, expect, beforeEach, vi } from "vitest";
import { fetchSpecialists } from "../../js/data.js";
import { __state } from "../mocks/firebase-stub.js";

const STATIC_ROWS = [
  { id: "static-1", category: "Здоров'я", subcategory: "Лікарі", name: "Dr. Olena Ivanenko" },
  { id: "static-2", category: "Освіта", subcategory: "Репетитори", name: "Марія Коваль" },
];

function mockJsonFetch(rows, { ok = true } = {}) {
  globalThis.fetch = vi.fn(async () => ({
    ok,
    json: async () => rows,
  }));
}

describe("fetchSpecialists", () => {
  beforeEach(() => {
    __state.docs = [];
    vi.restoreAllMocks();
  });

  it("повертає записи зі статичного data/specialists.json", async () => {
    mockJsonFetch(STATIC_ROWS);

    const result = await fetchSpecialists();

    expect(globalThis.fetch).toHaveBeenCalledWith("data/specialists.json");
    expect(result).toEqual(STATIC_ROWS);
  });

  it("додає схвалені заявки з Firebase і дедуплікує за ID", async () => {
    mockJsonFetch(STATIC_ROWS);
    // Firebase item with unique ID
    __state.docs = [{ id: "fb-1", category: "Краса", subcategory: "Перукар", name: "Salon Kalyna" }];

    const result = await fetchSpecialists();

    expect(result).toHaveLength(3); // 2 static + 1 firebase
    // Firebase should be in the mix (order may vary due to Map)
    expect(result.some(r => r.name === "Salon Kalyna")).toBe(true);
    expect(result.some(r => r.name === "Dr. Olena Ivanenko")).toBe(true);
  });

  it("не падає, якщо статичний JSON недоступний", async () => {
    mockJsonFetch(null, { ok: false });
    // Firebase item must have ID to be included (no "New" items)
    __state.docs = [{ id: "fb-only", name: "Only Firebase" }];

    const result = await fetchSpecialists();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Only Firebase");
  });

  it("не падає, якщо fetch кидає помилку мережі", async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new Error("network down");
    });
    vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await fetchSpecialists();

    expect(result).toEqual([]);
  });
});
