// Рендер карток спеціалістів у DOM (CSS Grid). Використовує DOM API
// (не innerHTML) для тексту з таблиці, щоб уникнути XSS.

function normalizeUrl(value) {
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function telegramUrl(value) {
  const handle = value.replace(/^@/, "").trim();
  if (/^https?:\/\//i.test(value)) return value;
  return `https://t.me/${handle}`;
}

function instagramUrl(value) {
  const handle = value.replace(/^@/, "").trim();
  if (/^https?:\/\//i.test(value)) return value;
  return `https://instagram.com/${handle}`;
}

function facebookUrl(value) {
  if (/^https?:\/\//i.test(value)) return value;
  return `https://facebook.com/${value}`;
}

const CONTACTS = [
  { field: "phone", label: "Телефон", href: (v) => `tel:${v.replace(/[^+\d]/g, "")}` },
  { field: "telegram", label: "Telegram", href: telegramUrl },
  { field: "instagram", label: "Instagram", href: instagramUrl },
  { field: "facebook", label: "Facebook", href: facebookUrl },
  { field: "website", label: "Вебсайт", href: normalizeUrl },
];



const ICON_MAP = {
  // Beauty
  "Перукар/Барбер": "fa-scissors",
  "Манікюр/Педикюр": "fa-hand-sparkles",
  "Брови та вії": "fa-eye",
  "Косички/Зачіски": "fa-pump-soap",
  "Косметологія/Епіляція": "fa-spa",
  "Масаж": "fa-hands-bubbles",
  "Остеопатія/Реабілітація": "fa-bone",
  "Тату/Перманентний макіяж": "fa-pen-nib",
  "Флорист": "fa-seedling",

  // Auto
  "Інструктор з водіння": "fa-car-side",
  "Автодилер/Купівля авто": "fa-car",
  "СТО/Механік": "fa-wrench",
  "Шини": "fa-compact-disc",

  // Food
  "Кондитер/Випічка": "fa-cake-candles",
  "Солодощі/Шоколад": "fa-cookie-bite",

  // IT
  "Веброзробка": "fa-code",
  "Інше": "fa-laptop",

  // Legal
  "Бухгалтер/Податки": "fa-calculator",
  "Юрист": "fa-scale-balanced",

  // Photo
  "Відеограф": "fa-video",
  "Фотограф": "fa-camera",

  // Житло
  "Прибирання": "fa-broom",
  "Ремонт/Будівництво": "fa-hammer",
  "Ріелтор": "fa-house",

  // Лікарі
  "Doula/Пологи": "fa-baby",
  "Ветеринар/Догляд за тваринами": "fa-paw",
  "Оптометрист/Окуліст": "fa-glasses",
  "Психотерапевт": "fa-brain",

  // Місця
  "Ферма/Збір ягід": "fa-tractor",

  // Освіта
  "Гуртки (мистецтво/спорт/танці)": "fa-palette",
  "Дитячий садочок/Няня": "fa-child-reaching",
  "Психолог/Логопед": "fa-brain",
  "Репетитор мов": "fa-language",
  
  // Перекладач
  "Викладання мов": "fa-chalkboard-user",
  "Усний переклад": "fa-ear-listen",

  // Швеї
  "Пошив одягу": "fa-shirt",
  "Ремонт/Підгонка одягу": "fa-scissors"
};

export function getIconClass(subcategory, category) {
  if (subcategory && ICON_MAP[subcategory]) return ICON_MAP[subcategory];
  
  // fallback based on category
  if (category === "Beauty") return "fa-spa";
  if (category === "Auto" || category === "Auto, insurance") return "fa-car";
  if (category === "Food") return "fa-utensils";
  if (category === "IT") return "fa-laptop-code";
  if (category === "Legal and bookkeeping") return "fa-file-signature";
  if (category === "Photo/Video") return "fa-camera-retro";
  if (category === "Житло (рієлтор, прибирання, ремонт)") return "fa-house-chimney-window";
  if (category === "Лікарі/ветеринари") return "fa-user-doctor";
  if (category === "Місця") return "fa-map-location-dot";
  if (category === "Освіта/Дитсадки/Гуртки") return "fa-graduation-cap";
  if (category === "Перекладач") return "fa-language";
  if (category === "Швеї") return "fa-scissors";
  
  return "fa-star";
}


function openModal(specialist) {
  const modal = document.getElementById("specialist-modal");
  if (!modal) return;
  
  // Name
  document.getElementById("modal-name").textContent = specialist.name;
  
  // Subcategory + Icon
  const subcategoryEl = document.getElementById("modal-subcategory");
  subcategoryEl.innerHTML = "";
  if (specialist.subcategory) {
    const icon = document.createElement("i");
    icon.className = `fas ${getIconClass(specialist.subcategory, specialist.category)} category-icon`;
    icon.style.marginRight = "8px";
    subcategoryEl.appendChild(icon);
    subcategoryEl.appendChild(document.createTextNode(specialist.subcategory));
  }
  
  // Location
  const locationEl = document.getElementById("modal-location");
  const location = [specialist.locationType, specialist.address].filter(Boolean).join(" · ");
  locationEl.textContent = location;
  
  // Description
  const descriptionEl = document.getElementById("modal-description");
  descriptionEl.textContent = specialist.description || "";
  
  // Price
  const priceEl = document.getElementById("modal-price");
  priceEl.textContent = specialist.price || "";
  
  // Contacts
  const contactsEl = document.getElementById("modal-contacts");
  contactsEl.innerHTML = "";
  const contactsFilled = CONTACTS.filter(({ field }) => specialist[field]);
  if (contactsFilled.length > 0) {
    contactsFilled.forEach(({ field, label, href }) => {
      const link = document.createElement("a");
      link.className = `card-contact card-contact-${field}`;
      link.href = href(specialist[field]);
      link.textContent = label;
      if (field !== "phone") {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      contactsEl.appendChild(link);
    });
  }
  
  // Notes
  const notesEl = document.getElementById("modal-notes");
  notesEl.textContent = specialist.notes || "";
  
  // Dates
  const datesEl = document.getElementById("modal-dates");
  const hasDates = specialist.createdAt || specialist.updatedAt;
  if (hasDates) {
    let parts = [];
    if (specialist.createdAt && !isNaN(new Date(specialist.createdAt).getTime())) {
      const createdStr = new Date(specialist.createdAt).toLocaleDateString("uk-UA");
      parts.push(`Додано: ${createdStr}`);
    }
    if (specialist.updatedAt && !isNaN(new Date(specialist.updatedAt).getTime())) {
      const updatedStr = new Date(specialist.updatedAt).toLocaleDateString("uk-UA");
      parts.push(`Оновлено: ${updatedStr}`);
    }
    datesEl.textContent = parts.join(" | ");
  } else {
    datesEl.textContent = "";
  }
  
  // Feedback Link
  const feedbackWrap = document.getElementById("modal-feedback-wrap");
  const feedbackLink = document.getElementById("modal-feedback-link");
  if (specialist.id) {
    feedbackWrap.style.display = "block";
    feedbackLink.href = `feedback.html?id=${specialist.id}`;
  } else {
    feedbackWrap.style.display = "none";
  }
  
  // Show modal
  modal.removeAttribute("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  const modal = document.getElementById("specialist-modal");
  if (modal) {
    modal.setAttribute("hidden", "");
    modal.setAttribute("aria-hidden", "true");
  }
}

// Attach event listeners for closing modal
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("specialist-modal");
  const closeBtn = document.getElementById("modal-close");
  if (modal && closeBtn) {
    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hasAttribute("hidden")) {
        closeModal();
      }
    });
  }
});

function createCard(specialist) {
  const card = document.createElement("article");
  card.className = "card";
  
  card.addEventListener("click", () => openModal(specialist));

  const name = document.createElement("h3");
  name.className = "card-name";
  name.textContent = specialist.name;
  card.appendChild(name);

  if (specialist.subcategory) {
    const subcategory = document.createElement("p");
    subcategory.className = "card-subcategory";
    
    const icon = document.createElement("i");
    icon.className = `fas ${getIconClass(specialist.subcategory, specialist.category)} category-icon`;
    icon.style.marginRight = "8px";
    
    subcategory.appendChild(icon);
    subcategory.appendChild(document.createTextNode(specialist.subcategory));
    card.appendChild(subcategory);
  }

  const location = [specialist.locationType, specialist.address]
    .filter(Boolean)
    .join(" · ");
  if (location) {
    const locationEl = document.createElement("p");
    locationEl.className = "card-location";
    locationEl.textContent = location;
    card.appendChild(locationEl);
  }

  return card;
}

export function renderSpecialists(container, specialists) {
  container.innerHTML = "";
  if (!specialists || specialists.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Нічого не знайдено. Спробуйте змінити фільтри.";
    container.appendChild(empty);
    return;
  }
  const fragment = document.createDocumentFragment();
  specialists.forEach((specialist) => fragment.appendChild(createCard(specialist)));
  container.appendChild(fragment);
}
