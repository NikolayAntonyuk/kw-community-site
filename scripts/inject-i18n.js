import fs from 'fs';

const indexFile = 'index.html';
const catalogFile = 'catalog.html';
const applyFile = 'apply.html';

function injectI18n(file, replacements, scriptTag) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('i18n.js')) {
    content = content.replace('</body>', scriptTag + '\n</body>');
  }

  for (const [search, replace] of Object.entries(replacements)) {
    content = content.replace(search, replace);
  }

  fs.writeFileSync(file, content);
}

const indexReplacements = {
  '<span class="brand-mark" aria-hidden="true"></span>\n      Разом KW': '<span class="brand-mark" aria-hidden="true"></span>\n      <span data-i18n="nav_brand">Разом KW</span>',
  '<a href="catalog.html" class="nav-cta">Каталог спеціалістів</a>': '<a href="catalog.html" class="nav-cta" data-i18n="nav_catalog">Каталог спеціалістів</a>',
  '<p class="hero-eyebrow">Kitchener · Waterloo · Cambridge</p>': '<p class="hero-eyebrow" data-i18n="hero_eyebrow">Kitchener · Waterloo · Cambridge</p>',
  '<h1>Українська громада Waterloo Region</h1>': '<h1 data-i18n="hero_title">Українська громада Waterloo Region</h1>',
  '<p class="hero-lede">\n        Ми — українці, що знайшли дім у Kitchener–Waterloo. Тримаємось разом:\n        святкуємо, вчимо дітей мови, підтримуємо ЗСУ й одне одного.\n      </p>': '<p class="hero-lede" data-i18n="hero_lede">\n        Ми — українці, що знайшли дім у Kitchener–Waterloo. Тримаємось разом:\n        святкуємо, вчимо дітей мови, підтримуємо ЗСУ й одне одного.\n      </p>',
  '<a href="catalog.html" class="hero-button">Знайти спеціаліста громади →</a>': '<a href="catalog.html" class="hero-button" data-i18n="hero_btn">Знайти спеціаліста громади →</a>',
  '<h2 id="about-heading">Про нас</h2>': '<h2 id="about-heading" data-i18n="about_title">Про нас</h2>',
  '<p>\n        Ми — українська громада регіону Ватерлу—Велінтон. Об\'єднуємо родини,\n        які переїхали до Кітченера, Ватерлу, Кембриджа та околиць,\n        підтримуємо культурні традиції, проводимо суботню українську школу,\n        організовуємо свята (День Вишиванки, Фестиваль Борщу) та щомісяця\n        збираємо кошти на потреби ЗСУ. Наш каталог спеціалістів — ще один\n        спосіб підтримувати одне одного тут, у Канаді.\n      </p>': '<p data-i18n="about_text">\n        Ми — українська громада регіону Ватерлу—Велінтон. Об\'єднуємо родини,\n        які переїхали до Кітченера, Ватерлу, Кембриджа та околиць,\n        підтримуємо культурні традиції, проводимо суботню українську школу,\n        організовуємо свята (День Вишиванки, Фестиваль Борщу) та щомісяця\n        збираємо кошти на потреби ЗСУ. Наш каталог спеціалістів — ще один\n        спосіб підтримувати одне одного тут, у Канаді.\n      </p>',
  '<h2 id="school-heading">🇺🇦 Українська школа вихідного дня</h2>': '<h2 id="school-heading" data-i18n="school_title">🇺🇦 Українська школа вихідного дня</h2>',
  'Тут діти вивчають українську мову, літературу, історію та традиції в дружньому середовищі.': '<span data-i18n="school_text">Тут діти вивчають українську мову, літературу, історію та традиції в дружньому середовищі.</span>',
  '<em>[Детальна інформація про розклад, адресу та контакти буде додана незабаром]</em>': '<em data-i18n="school_soon">[Детальна інформація про розклад, адресу та контакти буде додана незабаром]</em>',
  '<h2 id="activity-heading">Що відбувається у громаді</h2>': '<h2 id="activity-heading" data-i18n="activity_title">Що відбувається у громаді</h2>',
  '<p class="footer-tagline">Разом сильніші. Разом — громада.</p>': '<p class="footer-tagline" data-i18n="footer_tagline">Разом сильніші. Разом — громада.</p>'
};

const catalogReplacements = {
  '<span class="brand-mark" aria-hidden="true"></span>\n      Разом KW': '<span class="brand-mark" aria-hidden="true"></span>\n      <span data-i18n="nav_brand">Разом KW</span>',
  '<a href="index.html" class="nav-cta">← Головна</a>': '<a href="index.html" class="nav-cta" data-i18n="nav_home">← Головна</a>',
  '<h1 id="catalog-heading">Каталог спеціалістів громади</h1>': '<h1 id="catalog-heading" data-i18n="cat_title">Каталог спеціалістів громади</h1>',
  '<a href="apply.html" class="btn btn-add">+ Додати спеціаліста</a>': '<a href="apply.html" class="btn btn-add" data-i18n="cat_add_btn">+ Додати спеціаліста</a>',
  '<option value="">Усі категорії</option>': '<option value="" data-i18n="cat_filter_all">Усі категорії</option>',
  '<input type="text" id="search-input" placeholder="Пошук (ім\'я, опис, місто)..." aria-label="Пошук спеціалістів" />': '<input type="text" id="search-input" data-i18n="cat_search" placeholder="Пошук (ім\'я, опис, місто)..." aria-label="Пошук спеціалістів" />'
};

const applyReplacements = {
  '<a href="index.html" class="nav-cta">← Головна</a>': '<a href="index.html" class="nav-cta" data-i18n="nav_home">← Головна</a>',
  '<h2>Додати спеціаліста</h2>': '<h2 data-i18n="apply_title">Додати спеціаліста</h2>',
  '<p style="margin-bottom:2rem;">\n        Заповніть форму нижче, щоб додати свої послуги до каталогу. \n        Після перевірки адміністратором ваша картка з\'явиться на сайті.\n      </p>': '<p style="margin-bottom:2rem;" data-i18n="apply_desc">\n        Заповніть форму нижче, щоб додати свої послуги до каталогу. \n        Після перевірки адміністратором ваша картка з\'явиться на сайті.\n      </p>',
  '<input type="text" id="name" placeholder="Ім\'я або назва компанії" required />': '<input type="text" id="name" data-i18n="apply_name" placeholder="Ім\'я або назва компанії" required />',
  '<input type="email" id="email" placeholder="Ваш Email (для зв\'язку з адміністрацією)" required />': '<input type="email" id="email" data-i18n="apply_email" placeholder="Ваш Email (для зв\'язку з адміністрацією)" required />',
  '<input type="text" id="phone" placeholder="Телефон (необов\'язково)" />': '<input type="text" id="phone" data-i18n="apply_phone" placeholder="Телефон (необов\'язково)" />',
  '<input type="url" id="website" placeholder="Вебсайт (необов\'язково)" />': '<input type="url" id="website" data-i18n="apply_web" placeholder="Вебсайт (необов\'язково)" />',
  '<input type="text" id="category" placeholder="Головна категорія (напр. Краса та Здоров\'я)" required />': '<input type="text" id="category" data-i18n="apply_cat" placeholder="Головна категорія (напр. Краса та Здоров\'я)" required />',
  '<input type="text" id="subcategory" placeholder="Підкатегорія (напр. Перукар)" required />': '<input type="text" id="subcategory" data-i18n="apply_subcat" placeholder="Підкатегорія (напр. Перукар)" required />',
  '<input type="text" id="locationType" placeholder="Локація (Місто або Онлайн)" required />': '<input type="text" id="locationType" data-i18n="apply_loc" placeholder="Локація (Місто або Онлайн)" required />',
  '<textarea id="description" rows="4" placeholder="Опис послуг" required></textarea>': '<textarea id="description" rows="4" data-i18n="apply_info" placeholder="Опис послуг" required></textarea>',
  '<button type="submit" class="btn" id="submit-btn">Надіслати заявку</button>': '<button type="submit" class="btn" id="submit-btn" data-i18n="apply_submit">Надіслати заявку</button>'
};

injectI18n(indexFile, indexReplacements, '<script src="js/i18n.js"></script>');
injectI18n(catalogFile, catalogReplacements, '<script src="js/i18n.js"></script>');
injectI18n(applyFile, applyReplacements, '<script src="js/i18n.js"></script>');

console.log('i18n injected!');
