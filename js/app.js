// Зшиває докупи: завантажити дані → намалювати UI категорій/підкатегорій/
// пошуку/локації → підписати фільтри на render.

import { fetchSpecialists } from "./data.js";
import { filterSpecialists } from "./filters.js";
import { renderSpecialists } from "./render.js";

const ALL_LOCATIONS_VALUE = "";
const ALL_LOCATIONS_LABEL = "По всьому Waterloo регіону";

const state = {
  category: "",
  subcategory: "",
  search: "",
  location: "",
};

let allSpecialists = [];

const els = {
  statusEl: document.getElementById("status"),
  cardsGrid: document.getElementById("cards-grid"),
  categoryPills: document.getElementById("category-pills"),
  subcategoryChips: document.getElementById("subcategory-chips"),
  searchInput: document.getElementById("search-input"),
  locationSelect: document.getElementById("location-select"),
};

function uniqueInOrder(values) {
  return [...new Set(values.filter(Boolean))];
}

function extractCity(address) {
  if (!address) return "";
  const parts = address.split(",");
  return parts[parts.length - 1].trim();
}

function applyFilters() {
  const filtered = filterSpecialists(allSpecialists, state);
  renderSpecialists(els.cardsGrid, filtered);
  els.statusEl.textContent = `Знайдено: ${filtered.length}`;
}

function resetCategory() {
  state.category = "";
  state.subcategory = "";
  renderCategoryPills();
  renderSubcategoryChips();
  applyFilters();
}

function renderCategoryPills() {
  const categories = uniqueInOrder(allSpecialists.map((s) => s.category));
  els.categoryPills.innerHTML = "";

  if (state.category) {
    const activePill = document.createElement("button");
    activePill.type = "button";
    activePill.className = "pill active";
    activePill.dataset.category = state.category;
    activePill.textContent = state.category;
    activePill.setAttribute("aria-pressed", "true");
    activePill.addEventListener("click", resetCategory);
    els.categoryPills.appendChild(activePill);

    const clearPill = document.createElement("button");
    clearPill.type = "button";
    clearPill.className = "pill pill-clear";
    clearPill.textContent = "✕ Усі категорії";
    clearPill.addEventListener("click", resetCategory);
    els.categoryPills.appendChild(clearPill);
    return;
  }

  categories.forEach((category) => {
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "pill";
    pill.dataset.category = category;
    pill.textContent = category;
    pill.setAttribute("aria-pressed", "false");
    pill.addEventListener("click", () => {
      state.category = category;
      state.subcategory = "";
      renderCategoryPills();
      renderSubcategoryChips();
      applyFilters();
    });
    els.categoryPills.appendChild(pill);
  });
}

function renderSubcategoryChips() {
  els.subcategoryChips.innerHTML = "";
  if (!state.category) return;

  const subcategories = uniqueInOrder(
    allSpecialists
      .filter((s) => s.category === state.category)
      .map((s) => s.subcategory)
  );

  subcategories.forEach((subcategory) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.dataset.subcategory = subcategory;
    chip.textContent = subcategory;
    chip.setAttribute("aria-pressed", String(state.subcategory === subcategory));
    if (state.subcategory === subcategory) chip.classList.add("active");
    chip.addEventListener("click", () => {
      state.subcategory = state.subcategory === subcategory ? "" : subcategory;
      renderSubcategoryChips();
      applyFilters();
    });
    els.subcategoryChips.appendChild(chip);
  });
}

function renderLocationOptions() {
  const allowedCities = ["Kitchener", "Waterloo", "Guelph", "Cambridge", "Elmira", "St. Jacobs"];

  els.locationSelect.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = ALL_LOCATIONS_VALUE;
  allOption.textContent = ALL_LOCATIONS_LABEL;
  els.locationSelect.appendChild(allOption);

  allowedCities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    els.locationSelect.appendChild(option);
  });
}

function bindControls() {
  els.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    applyFilters();
  });

  els.locationSelect.addEventListener("change", (event) => {
    state.location = event.target.value;
    applyFilters();
  });
}

async function init() {
  els.statusEl.textContent = "Завантаження…";
  try {
    allSpecialists = await fetchSpecialists();
  } catch (err) {
    els.statusEl.textContent = `Помилка завантаження даних: ${err.message}`;
    return;
  }

  renderCategoryPills();
  renderSubcategoryChips();
  renderLocationOptions();
  bindControls();
  applyFilters();
}

init();
