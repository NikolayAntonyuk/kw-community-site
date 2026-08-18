// Зшиває докупи: завантажити дані → намалювати UI категорій/підкатегорій/
// пошуку/локації → підписати фільтри на render.

import { fetchSpecialists } from "./data.js";
import { filterSpecialists } from "./filters.js";
import { renderSpecialists, getIconClass } from "./render.js";

const ALL_LOCATIONS_VALUE = "";

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
  els.statusEl.textContent = `${window.t("cat_found")}${filtered.length}`;
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
    activePill.innerHTML = `<i class="fas ${getIconClass(null, state.category)}"></i> ${state.category}`;
    activePill.setAttribute("aria-pressed", "true");
    activePill.addEventListener("click", resetCategory);
    els.categoryPills.appendChild(activePill);

    const clearPill = document.createElement("button");
    clearPill.type = "button";
    clearPill.className = "pill pill-clear";
    clearPill.textContent = window.t("cat_filter_all");
    clearPill.addEventListener("click", resetCategory);
    els.categoryPills.appendChild(clearPill);
    return;
  }

  categories.forEach((category) => {
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "pill";
    pill.dataset.category = category;
    pill.innerHTML = `<i class="fas ${getIconClass(null, category)}"></i> ${category}`;
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
    chip.innerHTML = `<i class="fas ${getIconClass(subcategory, state.category)}"></i> ${subcategory}`;
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
  allOption.textContent = window.t("cat_all_locations");
  els.locationSelect.appendChild(allOption);

  allowedCities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    els.locationSelect.appendChild(option);
  });
  
  // Set the current selected location if any
  els.locationSelect.value = state.location;
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
  
  // Re-render strings when language changes
  window.addEventListener('languageChanged', () => {
    renderCategoryPills();
    renderSubcategoryChips();
    renderLocationOptions();
    applyFilters();
  });
}

async function init() {
  els.statusEl.textContent = window.t("cat_loading");
  try {
    allSpecialists = await fetchSpecialists();
  } catch (err) {
    els.statusEl.textContent = `${window.t("cat_error")}${err.message}`;
    return;
  }

  renderCategoryPills();
  renderSubcategoryChips();
  renderLocationOptions();
  bindControls();
  applyFilters();
}

init();
