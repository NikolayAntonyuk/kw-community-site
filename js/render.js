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

function createCard(specialist) {
  const card = document.createElement("article");
  card.className = "card";

  const name = document.createElement("h3");
  name.className = "card-name";
  name.textContent = specialist.name;
  card.appendChild(name);

  if (specialist.subcategory) {
    const subcategory = document.createElement("p");
    subcategory.className = "card-subcategory";
    subcategory.textContent = specialist.subcategory;
    card.appendChild(subcategory);
  }

  if (specialist.description) {
    const description = document.createElement("p");
    description.className = "card-description";
    description.textContent = specialist.description;
    card.appendChild(description);
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

  if (specialist.price) {
    const price = document.createElement("p");
    price.className = "card-price";
    price.textContent = specialist.price;
    card.appendChild(price);
  }

  const contactsFilled = CONTACTS.filter(({ field }) => specialist[field]);
  if (contactsFilled.length > 0) {
    const contacts = document.createElement("div");
    contacts.className = "card-contacts";
    contactsFilled.forEach(({ field, label, href }) => {
      const link = document.createElement("a");
      link.className = `card-contact card-contact-${field}`;
      link.href = href(specialist[field]);
      link.textContent = label;
      if (field !== "phone") {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      contacts.appendChild(link);
    });
    card.appendChild(contacts);
  }

  if (specialist.notes) {
    const notes = document.createElement("p");
    notes.className = "card-notes";
    notes.textContent = specialist.notes;
    card.appendChild(notes);
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
