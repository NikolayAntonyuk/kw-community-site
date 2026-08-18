import re

with open('js/render.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_functions = """
const ICON_MAP = {
  "Перукар/Барбер": "fa-scissors",
  "Манікюр/Педикюр": "fa-hand-sparkles",
  "Вії/Брови/Макіяж": "fa-eye",
  "Косметологія": "fa-spa",
  "Масаж": "fa-hands",
  "Епіляція": "fa-leaf",
  "Тату": "fa-pen-nib",
  "Дантист": "fa-tooth",
  "Психолог": "fa-brain",
  "Сімейний лікар": "fa-stethoscope",
  "Ремонт": "fa-hammer",
  "Авто/Інструктори": "fa-car",
  "Нерухомість": "fa-house",
  "Клінінг": "fa-broom",
  "Фото/Відео": "fa-camera",
  "Спорт/Йога": "fa-dumbbell",
  "Освіта/Репетитори": "fa-book",
  "Кондитери": "fa-cake-candles"
};

function getIconClass(subcategory, category) {
  if (ICON_MAP[subcategory]) return ICON_MAP[subcategory];
  if (category === "Beauty") return "fa-spa";
  if (category === "Medical") return "fa-user-nurse";
  if (category === "Освіта") return "fa-graduation-cap";
  if (category === "Послуги") return "fa-briefcase";
  return "fa-star";
}
"""

card_creation = """
function createCard(specialist) {
  const card = document.createElement("article");
  card.className = "card";
  card.style.position = "relative"; // for absolute id positioning

  const name = document.createElement("h3");
  name.className = "card-name";
  name.textContent = specialist.name;
  card.appendChild(name);

  if (specialist.id) {
    const idSpan = document.createElement("span");
    idSpan.className = "card-id";
    idSpan.style.position = "absolute";
    idSpan.style.top = "10px";
    idSpan.style.right = "10px";
    idSpan.style.fontSize = "0.75rem";
    idSpan.style.opacity = "0.5";
    idSpan.style.fontFamily = "monospace";
    idSpan.textContent = `#${specialist.id}`;
    card.appendChild(idSpan);
  }

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

  const hasDates = specialist.createdAt || specialist.updatedAt;
  if (hasDates) {
    const datesEl = document.createElement("p");
    datesEl.className = "card-dates";
    datesEl.style.fontSize = "0.8rem";
    datesEl.style.color = "#6c757d";
    datesEl.style.marginTop = "1rem";
    
    let parts = [];
    if (specialist.createdAt) {
      const createdStr = new Date(specialist.createdAt).toLocaleDateString("uk-UA");
      parts.push(`Додано: ${createdStr}`);
    }
    if (specialist.updatedAt) {
      const updatedStr = new Date(specialist.updatedAt).toLocaleDateString("uk-UA");
      parts.push(`Оновлено: ${updatedStr}`);
    }
    
    datesEl.textContent = parts.join(" | ");
    card.appendChild(datesEl);
  }

  if (specialist.id) {
    const feedbackWrap = document.createElement("div");
    feedbackWrap.style.marginTop = "1rem";
    feedbackWrap.style.textAlign = "center";
    
    const feedbackLink = document.createElement("a");
    feedbackLink.className = "card-feedback-link";
    feedbackLink.href = `feedback.html?id=${specialist.id}`;
    feedbackLink.textContent = "Повідомити про неточність";
    feedbackLink.style.fontSize = "0.85rem";
    feedbackLink.style.color = "#dc3545";
    feedbackLink.style.textDecoration = "underline";
    
    feedbackWrap.appendChild(feedbackLink);
    card.appendChild(feedbackWrap);
  }

  return card;
}
"""

# Replace createCard
content = re.sub(r'function createCard\(specialist\) \{.*?(?=export function renderSpecialists)', card_creation, content, flags=re.DOTALL)
# Insert ICON_MAP and getIconClass before createCard
content = content.replace("function createCard", new_functions + "\nfunction createCard")

with open('js/render.js', 'w', encoding='utf-8') as f:
    f.write(content)
