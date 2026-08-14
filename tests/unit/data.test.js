import { describe, it, expect, beforeEach, vi } from "vitest";
import { fetchSpecialists } from "../../js/data.js";
import { __state } from "../mocks/firebase-stub.js";

const STATIC_ROWS = [
  { category: "Здоров'я", subcategory: "Лікарі", name: "Dr. Olena Ivanenko" },
  { category: "Освіта", subcategory: "Репетитори", name: "Марія Коваль" },
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

  it("додає схвалені заявки з Firebase перед статичними", async () => {
    mockJsonFetch(STATIC_ROWS);
    __state.docs = [{ category: "Краса", subcategory: "Перукар", name: "Salon Kalyna" }];

    const result = await fetchSpecialists();

    expect(result).toHaveLength(3);
    expect(result[0].name).toBe("Salon Kalyna");
    expect(result.slice(1)).toEqual(STATIC_ROWS);
  });

  it("не падає, якщо статичний JSON недоступний", async () => {
    mockJsonFetch(null, { ok: false });
    __state.docs = [{ name: "Only Firebase" }];

    const result = await fetchSpecialists();

    expect(result).toEqual([{ name: "Only Firebase" }]);
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
