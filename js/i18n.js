const dictionary = {
  ua: {
    "nav_brand": "Разом KW",
    "nav_catalog": "Каталог спеціалістів",
    "nav_home": "← Головна",
    "hero_eyebrow": "Kitchener · Waterloo · Cambridge",
    "hero_title": "Українська громада Waterloo Region",
    "hero_lede": "Ми — українці, що знайшли дім у Kitchener–Waterloo. Тримаємось разом: святкуємо, вчимо дітей мови, підтримуємо ЗСУ й одне одного.",
    "hero_btn": "Знайти спеціаліста громади →",
    "about_title": "Про нас",
    "about_text": "Ми — українська громада регіону Ватерлу—Велінтон. Об'єднуємо родини, які переїхали до Кітченера, Ватерлу, Кембриджа та околиць, підтримуємо культурні традиції, проводимо суботню українську школу, організовуємо свята (День Вишиванки, Фестиваль Борщу) та щомісяця збираємо кошти на потреби ЗСУ. Наш каталог спеціалістів — ще один спосіб підтримувати одне одного тут, у Канаді.",
    "school_title": "🇺🇦 Українська школа вихідного дня",
    "school_text": "В регіоні Ватерлу діє суботня українська школа для дітей різного віку. Тут діти вивчають українську мову, літературу, історію та традиції в дружньому середовищі.",
    "school_soon": "[Детальна інформація про розклад, адресу та контакти буде додана незабаром]",
    "activity_title": "Що відбувається у громаді",
    "footer_tagline": "Разом сильніші. Разом — громада.",
    "cat_title": "Каталог спеціалістів",
    "cat_add_btn": "+ Додати спеціаліста",
    "cat_filter_all": "Усі категорії",
    "cat_search": "Пошук спеціалістів...",
    "apply_title": "Додати спеціаліста",
    "apply_desc": "Заповніть форму нижче, щоб додати свої послуги до каталогу. Після перевірки адміністратором ваша картка з'явиться на сайті.",
    "apply_name": "Ім'я або назва компанії",
    "apply_email": "Ваш Email (для зв'язку з адміністрацією)",
    "apply_phone": "Телефон (необов'язково)",
    "apply_web": "Вебсайт (необов'язково)",
    "apply_cat": "Головна категорія",
    "apply_subcat": "Підкатегорія",
    "apply_loc": "Локація (Місто)",
    "apply_info": "Опис послуг",
    "apply_submit": "Надіслати заявку",
    "lang_toggle": "🇺🇸"
  },
  en: {
    "nav_brand": "Razom KW",
    "nav_catalog": "Specialists Directory",
    "nav_home": "← Home",
    "hero_eyebrow": "Kitchener · Waterloo · Cambridge",
    "hero_title": "Ukrainian Community of Waterloo Region",
    "hero_lede": "We are Ukrainians who found a home in Kitchener-Waterloo. We stick together: celebrating, teaching our children the language, supporting the Armed Forces, and each other.",
    "hero_btn": "Find a community specialist →",
    "about_title": "About Us",
    "about_text": "We are the Ukrainian community of Waterloo-Wellington Region. We unite families who moved to Kitchener, Waterloo, Cambridge and surroundings, preserve cultural traditions, run a Saturday Ukrainian school, organize holidays (Vyshyvanka Day, Borscht Festival) and raise funds for the Armed Forces of Ukraine every month. Our specialists directory is another way to support each other here in Canada.",
    "school_title": "🇺🇦 Saturday Ukrainian School",
    "school_text": "There is a Saturday Ukrainian school in the Waterloo region for children of all ages. Here children study Ukrainian language, literature, history, and traditions in a friendly environment.",
    "school_soon": "[Detailed information on schedule, address, and contacts will be added soon]",
    "activity_title": "Community Events",
    "footer_tagline": "Stronger together. Together — community.",
    "cat_title": "Specialists Directory",
    "cat_add_btn": "+ Add Specialist",
    "cat_filter_all": "All categories",
    "cat_search": "Search specialists...",
    "apply_title": "Add Specialist",
    "apply_desc": "Fill out the form below to add your services to the directory. After review by the administrator, your card will appear on the site.",
    "apply_name": "Name or Company Name",
    "apply_email": "Your Email (for admin contact)",
    "apply_phone": "Phone (optional)",
    "apply_web": "Website (optional)",
    "apply_cat": "Main Category",
    "apply_subcat": "Subcategory",
    "apply_loc": "Location (City)",
    "apply_info": "Service Description",
    "apply_submit": "Submit Application",
    "lang_toggle": "🇺🇦"
  }
};

let currentLang = localStorage.getItem('lang') || 'ua';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dictionary[lang] && dictionary[lang][key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = dictionary[lang][key];
      } else {
        el.innerHTML = dictionary[lang][key];
      }
    }
  });

  const toggleBtn = document.getElementById('lang-toggle');
  if (toggleBtn) {
    toggleBtn.innerHTML = dictionary[lang]['lang_toggle'];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Inject language toggle button in top-nav if exists
  const nav = document.querySelector('.top-nav');
  if (nav && !document.getElementById('lang-toggle')) {
    const btn = document.createElement('button');
    btn.id = 'lang-toggle';
    btn.className = 'nav-cta';
    btn.style.marginLeft = '10px';
    btn.style.background = 'transparent';
    btn.style.color = 'inherit';
    btn.style.border = '1px solid currentColor';
    btn.style.cursor = 'pointer';
    btn.onclick = () => {
      applyLanguage(currentLang === 'ua' ? 'en' : 'ua');
    };
    nav.appendChild(btn);
  }
  
  applyLanguage(currentLang);
});
