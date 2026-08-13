import { describe, it, expect } from "vitest";
import { filterSpecialists } from "../../js/filters.js";
import { SPECIALISTS } from "../fixtures/specialists-fixture.js";

describe("filterSpecialists", () => {
  it("returns the full list when no filters are given", () => {
    expect(filterSpecialists(SPECIALISTS, {})).toHaveLength(SPECIALISTS.length);
  });

  it("returns the full list when called with no options argument", () => {
    expect(filterSpecialists(SPECIALISTS)).toHaveLength(SPECIALISTS.length);
  });

  it("filters by category", () => {
    const result = filterSpecialists(SPECIALISTS, { category: "Освіта" });
    expect(result).toHaveLength(2);
    expect(result.every((s) => s.category === "Освіта")).toBe(true);
  });

  it("filters by category + subcategory", () => {
    const result = filterSpecialists(SPECIALISTS, {
      category: "Краса",
      subcategory: "Перукарі",
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Salon Kalyna");
  });

  it("filters by search matching the name (case-insensitive)", () => {
    const result = filterSpecialists(SPECIALISTS, { search: "salon kalyna" });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Salon Kalyna");
  });

  it("filters by search matching the description (Ukrainian, substring)", () => {
    const result = filterSpecialists(SPECIALISTS, { search: "манікюр" });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Nail Studio Kitchener");
  });

  it("filters by search matching the subcategory", () => {
    const result = filterSpecialists(SPECIALISTS, { search: "репетитор" });
    expect(result).toHaveLength(2);
  });

  it("filters by location matching the address (case-insensitive substring)", () => {
    const result = filterSpecialists(SPECIALISTS, { location: "Kitchener" });
    expect(result).toHaveLength(2);
    expect(result.map((s) => s.name).sort()).toEqual([
      "Dr. Olena Ivanenko",
      "Nail Studio Kitchener",
    ]);
  });

  it("treats an empty-string location as 'everywhere' (no filtering)", () => {
    const result = filterSpecialists(SPECIALISTS, { location: "" });
    expect(result).toHaveLength(SPECIALISTS.length);
  });

  it("combines category, search and location filters together", () => {
    const result = filterSpecialists(SPECIALISTS, {
      category: "Здоров'я",
      search: "лікар",
      location: "Kitchener",
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Dr. Olena Ivanenko");
  });

  it("returns an empty array when nothing matches", () => {
    const result = filterSpecialists(SPECIALISTS, { category: "Юриспруденція" });
    expect(result).toEqual([]);
  });

  it("does not mutate the original list", () => {
    const copy = [...SPECIALISTS];
    filterSpecialists(SPECIALISTS, { category: "Освіта" });
    expect(SPECIALISTS).toEqual(copy);
  });
});
