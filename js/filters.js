// Комбінований фільтр списку спеціалістів за категорією, підкатегорією,
// текстовим пошуком і локацією.

function matchesCategory(specialist, category) {
  return !category || specialist.category === category;
}

function matchesSubcategory(specialist, subcategory) {
  return !subcategory || specialist.subcategory === subcategory;
}

function matchesSearch(specialist, search) {
  if (!search) return true;
  const needle = search.toLowerCase();
  return [specialist.name, specialist.description, specialist.subcategory].some(
    (field) => (field || "").toLowerCase().includes(needle)
  );
}

function matchesLocation(specialist, location) {
  if (!location) return true;
  return (specialist.address || "").toLowerCase().includes(location.toLowerCase());
}

export function filterSpecialists(list, { category, subcategory, search, location } = {}) {
  return list.filter(
    (specialist) =>
      matchesCategory(specialist, category) &&
      matchesSubcategory(specialist, subcategory) &&
      matchesSearch(specialist, search) &&
      matchesLocation(specialist, location)
  );
}
