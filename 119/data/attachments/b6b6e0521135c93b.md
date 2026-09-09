# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: site.spec.js >> перемикання категорії оновлює набір підкатегорій і карток
- Location: tests/e2e/site.spec.js:92:5

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.card')
Expected: 3
Received: 87
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('.card')
    14 × locator resolved to 87 elements
       - unexpected value "87"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - link "KW Ukrainians Разом KW" [ref=e3] [cursor=pointer]:
      - /url: index.html
      - img "KW Ukrainians" [ref=e4]
      - generic [ref=e5]: Разом KW
    - generic [ref=e6]:
      - link "Головна" [ref=e7] [cursor=pointer]:
        - /url: index.html
      - link "Каталог спеціалістів" [ref=e8] [cursor=pointer]:
        - /url: catalog.html
      - link "Школа" [ref=e9] [cursor=pointer]:
        - /url: school.html
      - link "+ Додати спеціаліста" [ref=e10] [cursor=pointer]:
        - /url: apply.html
      - button "Змінити мову / Change language" [ref=e11] [cursor=pointer]:
        - img "English" [ref=e12]
  - main [ref=e13]:
    - region "Фільтри каталогу" [ref=e14]:
      - generic [ref=e15]:
        - searchbox "Пошук" [ref=e16]
        - combobox "Локація" [ref=e17]:
          - option "По всьому Waterloo регіону" [selected]
          - option "Kitchener"
          - option "Waterloo"
          - option "Guelph"
          - option "Cambridge"
          - option "Elmira"
          - option "St. Jacobs"
      - group "Головні категорії" [ref=e18]:
        - button " Краса та догляд" [ref=e19] [cursor=pointer]:
          - generic [ref=e20]: 
          - text: Краса та догляд
        - button " Освіта/Дитсадки/Гуртки" [ref=e21] [cursor=pointer]:
          - generic [ref=e22]: 
          - text: Освіта/Дитсадки/Гуртки
        - button " Авто" [ref=e23] [cursor=pointer]:
          - generic [ref=e24]: 
          - text: Авто
        - button " Фото/Відео" [ref=e25] [cursor=pointer]:
          - generic [ref=e26]: 
          - text: Фото/Відео
        - button " Житло (рієлтор, прибирання, ремонт)" [ref=e27] [cursor=pointer]:
          - generic [ref=e28]: 
          - text: Житло (рієлтор, прибирання, ремонт)
        - button " Їжа та Кондитери" [ref=e29] [cursor=pointer]:
          - generic [ref=e30]: 
          - text: Їжа та Кондитери
        - button " Лікарі/ветеринари" [ref=e31] [cursor=pointer]:
          - generic [ref=e32]: 
          - text: Лікарі/ветеринари
        - button " Швеї" [ref=e33] [cursor=pointer]:
          - generic [ref=e34]: 
          - text: Швеї
        - button " Перекладач" [ref=e35] [cursor=pointer]:
          - generic [ref=e36]: 
          - text: Перекладач
        - button " Юридичні послуги" [ref=e37] [cursor=pointer]:
          - generic [ref=e38]: 
          - text: Юридичні послуги
        - button " IT" [ref=e39] [cursor=pointer]:
          - generic [ref=e40]: 
          - text: IT
        - button " Побутові та інші послуги" [ref=e41] [cursor=pointer]:
          - generic [ref=e42]: 
          - text: Побутові та інші послуги
      - group "Підкатегорії"
    - paragraph [ref=e43]: "Знайдено: 87"
    - region "Спеціалісти" [ref=e44]:
      - article [ref=e45] [cursor=pointer]:
        - heading "Tanya" [level=3] [ref=e46]
        - paragraph [ref=e47]:
          - generic [ref=e48]: 
          - text: Перукар/Барбер
        - paragraph [ref=e49]: Kitchener · Kitchener, 90 Spadina road East
      - article [ref=e50] [cursor=pointer]:
        - heading "Olha Ohman" [level=3] [ref=e51]
        - paragraph [ref=e52]:
          - generic [ref=e53]: 
          - text: Перукар/Барбер
        - paragraph [ref=e54]: Waterloo
      - article [ref=e55] [cursor=pointer]:
        - heading "Anastasiia Shkolna" [level=3] [ref=e56]
        - paragraph [ref=e57]:
          - generic [ref=e58]: 
          - text: Манікюр/Педикюр
        - paragraph [ref=e59]: Cambridge · 48 queen st east, Cambridge
      - article [ref=e60] [cursor=pointer]:
        - heading "Olha Hrytsenko" [level=3] [ref=e61]
        - paragraph [ref=e62]:
          - generic [ref=e63]: 
          - text: Манікюр/Педикюр
        - paragraph [ref=e64]: Kitchener
      - article [ref=e65] [cursor=pointer]:
        - heading "Вадим" [level=3] [ref=e66]
        - paragraph [ref=e67]:
          - generic [ref=e68]: 
          - text: Масаж
        - paragraph [ref=e69]: По всьому Waterloo регіону
      - article [ref=e70] [cursor=pointer]:
        - heading "Олена Крутенко" [level=3] [ref=e71]
        - paragraph [ref=e72]:
          - generic [ref=e73]: 
          - text: Манікюр/Педикюр
        - paragraph [ref=e74]: По всьому Waterloo регіону (не вказано)
      - article [ref=e75] [cursor=pointer]:
        - heading "Iryna Nails Lashlift Cambridge" [level=3] [ref=e76]
        - paragraph [ref=e77]:
          - generic [ref=e78]: 
          - text: Брови та вії
        - paragraph [ref=e79]: Cambridge
      - article [ref=e80] [cursor=pointer]:
        - heading "Ilona Hrytsenko" [level=3] [ref=e81]
        - paragraph [ref=e82]:
          - generic [ref=e83]: 
          - text: Тату/Перманентний макіяж
        - paragraph [ref=e84]: Kitchener
      - article [ref=e85] [cursor=pointer]:
        - heading "NK Fedorchenko" [level=3] [ref=e86]
        - paragraph [ref=e87]:
          - generic [ref=e88]: 
          - text: Тату/Перманентний макіяж
        - paragraph [ref=e89]: Kitchener
      - article [ref=e90] [cursor=pointer]:
        - heading "Шевченко Вікторія" [level=3] [ref=e91]
        - paragraph [ref=e92]:
          - generic [ref=e93]: 
          - text: Тату/Перманентний макіяж
        - paragraph [ref=e94]: Cambridge
      - article [ref=e95] [cursor=pointer]:
        - heading "@cosmetolognataliy" [level=3] [ref=e96]
        - paragraph [ref=e97]:
          - generic [ref=e98]: 
          - text: Косметологія/Епіляція
        - paragraph [ref=e99]: По всьому Waterloo регіону · Тільки виїзд додому клієнтів
      - article [ref=e100] [cursor=pointer]:
        - heading "Iryna Maksymova Ірина Максимова" [level=3] [ref=e101]
        - paragraph [ref=e102]:
          - generic [ref=e103]: 
          - text: Косметологія/Епіляція
        - paragraph [ref=e104]: По всьому Waterloo регіону
      - article [ref=e105] [cursor=pointer]:
        - heading "Olha Boiko" [level=3] [ref=e106]
        - paragraph [ref=e107]:
          - generic [ref=e108]: 
          - text: Перукар/Барбер
        - paragraph [ref=e109]: Waterloo
      - article [ref=e110] [cursor=pointer]:
        - heading "Орест Марунін" [level=3] [ref=e111]
        - paragraph [ref=e112]:
          - generic [ref=e113]: 
          - text: Масаж
        - paragraph [ref=e114]: Kitchener · 230 East Avenue, Kitchener
      - article [ref=e115] [cursor=pointer]:
        - heading "Gentle line tattoo" [level=3] [ref=e116]
        - paragraph [ref=e117]:
          - generic [ref=e118]: 
          - text: Тату/Перманентний макіяж
        - paragraph [ref=e119]: По всьому Waterloo регіону
      - article [ref=e120] [cursor=pointer]:
        - heading "oh.my.good.nails" [level=3] [ref=e121]
        - paragraph [ref=e122]:
          - generic [ref=e123]: 
          - text: Манікюр/Педикюр
        - paragraph [ref=e124]: Kitchener
      - article [ref=e125] [cursor=pointer]:
        - heading "@pronych_iryna_nails" [level=3] [ref=e126]
        - paragraph [ref=e127]:
          - generic [ref=e128]: 
          - text: Манікюр/Педикюр
        - paragraph [ref=e129]: Cambridge
      - article [ref=e130] [cursor=pointer]:
        - heading "Наталія" [level=3] [ref=e131]
        - paragraph [ref=e132]:
          - generic [ref=e133]: 
          - text: Брови та вії
        - paragraph [ref=e134]: По всьому Waterloo регіону
      - article [ref=e135] [cursor=pointer]:
        - heading "Олена" [level=3] [ref=e136]
        - paragraph [ref=e137]:
          - generic [ref=e138]: 
          - text: Манікюр/Педикюр
        - paragraph [ref=e139]: По всьому Waterloo регіону
      - article [ref=e140] [cursor=pointer]:
        - heading "@korchevskamasha" [level=3] [ref=e141]
        - paragraph [ref=e142]:
          - generic [ref=e143]: 
          - text: Перукар/Барбер
        - paragraph [ref=e144]: Kitchener
      - article [ref=e145] [cursor=pointer]:
        - heading "Ania_makeover" [level=3] [ref=e146]
        - paragraph [ref=e147]:
          - generic [ref=e148]: 
          - text: Брови та вії
        - paragraph [ref=e149]: По всьому Waterloo регіону
      - article [ref=e150] [cursor=pointer]:
        - heading "Graff.ink" [level=3] [ref=e151]
        - paragraph [ref=e152]:
          - generic [ref=e153]: 
          - text: Тату/Перманентний макіяж
        - paragraph [ref=e154]: По всьому Waterloo регіону
      - article [ref=e155] [cursor=pointer]:
        - heading "Chorna Vika" [level=3] [ref=e156]
        - paragraph [ref=e157]:
          - generic [ref=e158]: 
          - text: Манікюр/Педикюр
        - paragraph [ref=e159]: "По всьому Waterloo регіону · Адреса: Kitchener, Patricia Avenue 115"
      - article [ref=e160] [cursor=pointer]:
        - heading "Маргарита Мала" [level=3] [ref=e161]
        - paragraph [ref=e162]:
          - generic [ref=e163]: 
          - text: Косички/Зачіски
        - paragraph [ref=e164]: По всьому Waterloo регіону
      - article [ref=e165] [cursor=pointer]:
        - heading "@hairdresser.kitchener" [level=3] [ref=e166]
        - paragraph [ref=e167]:
          - generic [ref=e168]: 
          - text: Перукар/Барбер
        - paragraph [ref=e169]: Kitchener
      - article [ref=e170] [cursor=pointer]:
        - heading "@volosova_nails" [level=3] [ref=e171]
        - paragraph [ref=e172]:
          - generic [ref=e173]: 
          - text: Брови та вії
        - paragraph [ref=e174]: По всьому Waterloo регіону
      - article [ref=e175] [cursor=pointer]:
        - heading "Люба (Nails Details)" [level=3] [ref=e176]
        - paragraph [ref=e177]:
          - generic [ref=e178]: 
          - text: Манікюр/Педикюр
        - paragraph [ref=e179]: Cambridge · Downtown Galt, Cambridge.
      - article [ref=e180] [cursor=pointer]:
        - heading "depilation master" [level=3] [ref=e181]
        - paragraph [ref=e182]:
          - generic [ref=e183]: 
          - text: Косметологія/Епіляція
        - paragraph [ref=e184]: По всьому Waterloo регіону
      - article [ref=e185] [cursor=pointer]:
        - heading "Svita_Nails" [level=3] [ref=e186]
        - paragraph [ref=e187]:
          - generic [ref=e188]: 
          - text: Манікюр/Педикюр
        - paragraph [ref=e189]: Kitchener
      - article [ref=e190] [cursor=pointer]:
        - heading "@krava.a.permanent" [level=3] [ref=e191]
        - paragraph [ref=e192]:
          - generic [ref=e193]: 
          - text: Манікюр/Педикюр
        - paragraph [ref=e194]: Cambridge · Christopher Dr, Cambridge
      - article [ref=e195] [cursor=pointer]:
        - heading "Влад" [level=3] [ref=e196]
        - paragraph [ref=e197]:
          - generic [ref=e198]: 
          - text: Перукар/Барбер
        - paragraph [ref=e199]: Kitchener
      - article [ref=e200] [cursor=pointer]:
        - heading "Nataliia" [level=3] [ref=e201]
        - paragraph [ref=e202]:
          - generic [ref=e203]: 
          - text: Перукар/Барбер
        - paragraph [ref=e204]: Cambridge
      - article [ref=e205] [cursor=pointer]:
        - heading "(без імені в анкеті)" [level=3] [ref=e206]
        - paragraph [ref=e207]:
          - generic [ref=e208]: 
          - text: Манікюр/Педикюр
        - paragraph [ref=e209]: Cambridge
      - article [ref=e210] [cursor=pointer]:
        - heading "Flower Your Soul" [level=3] [ref=e211]
        - paragraph [ref=e212]:
          - generic [ref=e213]: 
          - text: Флорист
        - paragraph [ref=e214]: По всьому Waterloo регіону
      - article [ref=e215] [cursor=pointer]:
        - heading "Шевченко Вікторія" [level=3] [ref=e216]
        - paragraph [ref=e217]:
          - generic [ref=e218]: 
          - text: Перукар/Барбер
        - paragraph [ref=e219]: Waterloo
      - article [ref=e220] [cursor=pointer]:
        - heading "Вікторія" [level=3] [ref=e221]
        - paragraph [ref=e222]:
          - generic [ref=e223]: 
          - text: Косметологія/Епіляція
        - paragraph [ref=e224]: По всьому Waterloo регіону
      - article [ref=e225] [cursor=pointer]:
        - heading "Anna Bukhtiiarova" [level=3] [ref=e226]
        - paragraph [ref=e227]:
          - generic [ref=e228]: 
          - text: Манікюр/Педикюр
        - paragraph [ref=e229]: Kitchener
      - article [ref=e230] [cursor=pointer]:
        - heading "Валерія Колесніцька (Valeriia Kolesnitska)" [level=3] [ref=e231]
        - paragraph [ref=e232]:
          - generic [ref=e233]: 
          - text: Репетитор мов
        - paragraph [ref=e234]: Cambridge
      - article [ref=e235] [cursor=pointer]:
        - heading "Арт класи по вівторках" [level=3] [ref=e236]
        - paragraph [ref=e237]:
          - generic [ref=e238]: 
          - text: Гуртки (мистецтво/спорт/танці)
        - paragraph [ref=e239]: Kitchener · 119 Golden Meadow Cres., Kitchener
      - article [ref=e240] [cursor=pointer]:
        - heading "Dmitry Lytov" [level=3] [ref=e241]
        - paragraph [ref=e242]:
          - generic [ref=e243]: 
          - text: Репетитор мов
        - paragraph [ref=e244]: По всьому Waterloo регіону
      - article [ref=e245] [cursor=pointer]:
        - heading "Маргарита Мала" [level=3] [ref=e246]
        - paragraph [ref=e247]:
          - generic [ref=e248]: 
          - text: Дитячий садочок/Няня
        - paragraph [ref=e249]: По всьому Waterloo регіону
      - article [ref=e250] [cursor=pointer]:
        - heading "Olga’s art Малювання для дітей" [level=3] [ref=e251]
        - paragraph [ref=e252]:
          - generic [ref=e253]: 
          - text: Гуртки (мистецтво/спорт/танці)
        - paragraph [ref=e254]: Kitchener
      - article [ref=e255] [cursor=pointer]:
        - heading "Няня" [level=3] [ref=e256]
        - paragraph [ref=e257]:
          - generic [ref=e258]: 
          - text: Дитячий садочок/Няня
        - paragraph [ref=e259]: По всьому Waterloo регіону (не вказано)
      - article [ref=e260] [cursor=pointer]:
        - heading "Хореограф" [level=3] [ref=e261]
        - paragraph [ref=e262]:
          - generic [ref=e263]: 
          - text: Гуртки (мистецтво/спорт/танці)
        - paragraph [ref=e264]: Kitchener
      - article [ref=e265] [cursor=pointer]:
        - heading "Аліна Маркова" [level=3] [ref=e266]
        - paragraph [ref=e267]:
          - generic [ref=e268]: 
          - text: Психолог/Логопед
        - paragraph [ref=e269]: По всьому Waterloo регіону
      - article [ref=e270] [cursor=pointer]:
        - heading "Марта Шмигельська" [level=3] [ref=e271]
        - paragraph [ref=e272]:
          - generic [ref=e273]: 
          - text: Перекладач
        - paragraph [ref=e274]: По всьому Waterloo регіону
      - article [ref=e275] [cursor=pointer]:
        - heading "Art Teacher (індивідуальні заняття для дорослих і дітей з 17 років)" [level=3] [ref=e276]
        - paragraph [ref=e277]:
          - generic [ref=e278]: 
          - text: Гуртки (мистецтво/спорт/танці)
        - paragraph [ref=e279]: Kitchener
      - article [ref=e280] [cursor=pointer]:
        - heading "Universe in the Pocket Montessori School" [level=3] [ref=e281]
        - paragraph [ref=e282]:
          - generic [ref=e283]: 
          - text: Дитячий садочок/Няня
        - paragraph [ref=e284]: Kitchener
      - article [ref=e285] [cursor=pointer]:
        - heading "Soccer club Obolon" [level=3] [ref=e286]
        - paragraph [ref=e287]:
          - generic [ref=e288]: 
          - text: Гуртки (мистецтво/спорт/танці)
        - paragraph [ref=e289]: По всьому Waterloo регіону
      - article [ref=e290] [cursor=pointer]:
        - heading "Blackcircles" [level=3] [ref=e291]
        - paragraph [ref=e292]:
          - generic [ref=e293]: 
          - text: Шини
        - paragraph [ref=e294]: По всьому Waterloo регіону (не вказано)
      - article [ref=e295] [cursor=pointer]:
        - heading "Антон" [level=3] [ref=e296]
        - paragraph [ref=e297]:
          - generic [ref=e298]: 
          - text: Інструктор з водіння
        - paragraph [ref=e299]: По всьому Waterloo регіону (не вказано)
      - article [ref=e300] [cursor=pointer]:
        - heading "Mohammed" [level=3] [ref=e301]
        - paragraph [ref=e302]:
          - generic [ref=e303]: 
          - text: Інструктор з водіння
        - paragraph [ref=e304]: По всьому Waterloo регіону
      - article [ref=e305] [cursor=pointer]:
        - heading "Євген Захарчук" [level=3] [ref=e306]
        - paragraph [ref=e307]:
          - generic [ref=e308]: 
          - text: СТО/Механік
        - paragraph [ref=e309]: Maryhill
      - article [ref=e310] [cursor=pointer]:
        - heading "Reech Motors" [level=3] [ref=e311]
        - paragraph [ref=e312]:
          - generic [ref=e313]: 
          - text: Автодилер/Купівля авто
        - paragraph [ref=e314]: Kitchener
      - article [ref=e315] [cursor=pointer]:
        - heading "сервіс з закупівлі запчастин" [level=3] [ref=e316]
        - paragraph [ref=e317]:
          - generic [ref=e318]: 
          - text: СТО/Механік
        - paragraph [ref=e319]: По всьому Waterloo регіону
      - article [ref=e320] [cursor=pointer]:
        - heading "Martin Moroz" [level=3] [ref=e321]
        - paragraph [ref=e322]:
          - generic [ref=e323]: 
          - text: СТО/Механік
        - paragraph [ref=e324]: По всьому Waterloo регіону
      - article [ref=e325] [cursor=pointer]:
        - heading "Анна Сальва" [level=3] [ref=e326]
        - paragraph [ref=e327]:
          - generic [ref=e328]: 
          - text: Фотограф
        - paragraph [ref=e329]: По всьому Waterloo регіону (не вказано)
      - article [ref=e330] [cursor=pointer]:
        - heading "Павло Сальва" [level=3] [ref=e331]
        - paragraph [ref=e332]:
          - generic [ref=e333]: 
          - text: Відеограф
        - paragraph [ref=e334]: По всьому Waterloo регіону (не вказано)
      - article [ref=e335] [cursor=pointer]:
        - heading "Olena Kharlova, @olena_kharlova" [level=3] [ref=e336]
        - paragraph [ref=e337]:
          - generic [ref=e338]: 
          - text: Фотограф
        - paragraph [ref=e339]: По всьому Waterloo регіону
      - article [ref=e340] [cursor=pointer]:
        - heading "Olha Romanova" [level=3] [ref=e341]
        - paragraph [ref=e342]:
          - generic [ref=e343]: 
          - text: Фотограф
        - paragraph [ref=e344]: По всьому Waterloo регіону
      - article [ref=e345] [cursor=pointer]:
        - heading "Alina Vladyka @alina_vladyka" [level=3] [ref=e346]
        - paragraph [ref=e347]:
          - generic [ref=e348]: 
          - text: Фотограф
        - paragraph [ref=e349]: По всьому Waterloo регіону
      - article [ref=e350] [cursor=pointer]:
        - heading "Yana Beliaieva" [level=3] [ref=e351]
        - paragraph [ref=e352]:
          - generic [ref=e353]: 
          - text: Фотограф
        - paragraph [ref=e354]: По всьому Waterloo регіону
      - article [ref=e355] [cursor=pointer]:
        - heading "Ilya Leontiev" [level=3] [ref=e356]
        - paragraph [ref=e357]:
          - generic [ref=e358]: 
          - text: Фотограф
        - paragraph [ref=e359]: По всьому Waterloo регіону
      - article [ref=e360] [cursor=pointer]:
        - heading "Слава Клейман" [level=3] [ref=e361]
        - paragraph [ref=e362]:
          - generic [ref=e363]: 
          - text: Ріелтор
        - paragraph [ref=e364]: По всьому Waterloo регіону (не вказано)
      - article [ref=e365] [cursor=pointer]:
        - heading "Наталія Подолін" [level=3] [ref=e366]
        - paragraph [ref=e367]:
          - generic [ref=e368]: 
          - text: Ріелтор
        - paragraph [ref=e369]: По всьому Waterloo регіону (не вказано)
      - article [ref=e370] [cursor=pointer]:
        - heading "Shiny Solution" [level=3] [ref=e371]
        - paragraph [ref=e372]:
          - generic [ref=e373]: 
          - text: Прибирання
        - paragraph [ref=e374]: По всьому Waterloo регіону
      - article [ref=e375] [cursor=pointer]:
        - heading "Будівельник" [level=3] [ref=e376]
        - paragraph [ref=e377]:
          - generic [ref=e378]: 
          - text: Ремонт/Будівництво
        - paragraph [ref=e379]: Woodstock
      - article [ref=e380] [cursor=pointer]:
        - heading "cabinet installer" [level=3] [ref=e381]
        - paragraph [ref=e382]:
          - generic [ref=e383]: 
          - text: Ремонт/Будівництво
        - paragraph [ref=e384]: Kitchener
      - article [ref=e385] [cursor=pointer]:
        - heading "Masonry Hub" [level=3] [ref=e386]
        - paragraph [ref=e387]:
          - generic [ref=e388]: 
          - text: Ремонт/Будівництво
        - paragraph [ref=e389]: По всьому Waterloo регіону (не вказано)
      - article [ref=e390] [cursor=pointer]:
        - heading "Ірина Чадюк" [level=3] [ref=e391]
        - paragraph [ref=e392]:
          - generic [ref=e393]: 
          - text: Ріелтор
        - paragraph [ref=e394]: По всьому Waterloo регіону
      - article [ref=e395] [cursor=pointer]:
        - heading "Діана Іващенко" [level=3] [ref=e396]
        - paragraph [ref=e397]:
          - generic [ref=e398]: 
          - text: Кондитер/Випічка
        - paragraph [ref=e399]: Kitchener
      - article [ref=e400] [cursor=pointer]:
        - heading "Pastry cook" [level=3] [ref=e401]
        - paragraph [ref=e402]:
          - generic [ref=e403]: 
          - text: Кондитер/Випічка
        - paragraph [ref=e404]: Kitchener
      - article [ref=e405] [cursor=pointer]:
        - heading "Bellissima Cakes And Pastries" [level=3] [ref=e406]
        - paragraph [ref=e407]:
          - generic [ref=e408]: 
          - text: Кондитер/Випічка
        - paragraph [ref=e409]: Waterloo
      - article [ref=e410] [cursor=pointer]:
        - heading "Бельгійський шоколад та шоколадні цукерки. Арт колекції. Гарний та смачний подарунок для будь-якого приводу." [level=3] [ref=e411]
        - paragraph [ref=e412]:
          - generic [ref=e413]: 
          - text: Солодощі/Шоколад
        - paragraph [ref=e414]: Kitchener
      - article [ref=e415] [cursor=pointer]:
        - heading "Stepan Jaworsky" [level=3] [ref=e416]
        - paragraph [ref=e417]:
          - generic [ref=e418]: 
          - text: Оптометрист/Окуліст
        - paragraph [ref=e419]: По всьому Waterloo регіону
      - article [ref=e420] [cursor=pointer]:
        - heading "Doula" [level=3] [ref=e421]
        - paragraph [ref=e422]:
          - generic [ref=e423]: 
          - text: Doula/Пологи
        - paragraph [ref=e424]: По всьому Waterloo регіону
      - article [ref=e425] [cursor=pointer]:
        - heading "Ілона" [level=3] [ref=e426]
        - paragraph [ref=e427]:
          - generic [ref=e428]: 
          - text: Ветеринар/Догляд за тваринами
        - paragraph [ref=e429]: Waterloo
      - article [ref=e430] [cursor=pointer]:
        - heading "Катерина Мойсеєнко" [level=3] [ref=e431]
        - paragraph [ref=e432]:
          - generic [ref=e433]: 
          - text: Психотерапевт
        - paragraph [ref=e434]: Cambridge
      - article [ref=e435] [cursor=pointer]:
        - heading "Massage therapist" [level=3] [ref=e436]
        - paragraph [ref=e437]:
          - generic [ref=e438]: 
          - text: Масаж
        - paragraph [ref=e439]: Kitchener
      - article [ref=e440] [cursor=pointer]:
        - heading "Діана Іващенко" [level=3] [ref=e441]
        - paragraph [ref=e442]:
          - generic [ref=e443]: 
          - text: Ремонт/Підгонка одягу
        - paragraph [ref=e444]: Kitchener
      - article [ref=e445] [cursor=pointer]:
        - heading "Dmitry Lytov" [level=3] [ref=e446]
        - paragraph [ref=e447]:
          - generic [ref=e448]: 
          - text: Усний переклад
        - paragraph [ref=e449]: По всьому Waterloo регіону
      - article [ref=e450] [cursor=pointer]:
        - heading "Марта Шмигельська" [level=3] [ref=e451]
        - paragraph [ref=e452]:
          - generic [ref=e453]: 
          - text: Викладання мов
        - paragraph [ref=e454]: По всьому Waterloo регіону
      - article [ref=e455] [cursor=pointer]:
        - heading "Сагач Марина Віталіївна" [level=3] [ref=e456]
        - paragraph [ref=e457]:
          - generic [ref=e458]: 
          - text: Юрист
        - paragraph [ref=e459]: По всьому Waterloo регіону
      - article [ref=e460] [cursor=pointer]:
        - heading "Валерій" [level=3] [ref=e461]
        - paragraph [ref=e462]:
          - generic [ref=e463]: 
          - text: Інше
        - paragraph [ref=e464]: По всьому Waterloo регіону
      - article [ref=e465] [cursor=pointer]:
        - heading "TOPVIZIO Розробка сайтів та просування в соц.мережах" [level=3] [ref=e466]
        - paragraph [ref=e467]:
          - generic [ref=e468]: 
          - text: Веброзробка
        - paragraph [ref=e469]: По всьому Waterloo регіону
      - article [ref=e470] [cursor=pointer]:
        - heading "Анна Педченко" [level=3] [ref=e471]
        - paragraph [ref=e472]:
          - generic [ref=e473]: 
          - text: Бухгалтер/Податки
        - paragraph [ref=e474]: По всьому Waterloo регіону
      - article [ref=e475] [cursor=pointer]:
        - heading "Victoria Usik" [level=3] [ref=e476]
        - paragraph [ref=e477]:
          - generic [ref=e478]: 
          - text: Фотограф
        - paragraph [ref=e479]: Kitchener
  - contentinfo [ref=e480]:
    - paragraph [ref=e481]: Дані каталогу оновлюються через громадську модерацію. Побачили помилку чи хочете додати спеціаліста? Зверніться до модераторів громади KW.
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | const mockData = [
  4   |   {
  5   |     "category": "Beauty",
  6   |     "subcategory": "Перукар",
  7   |     "id": 1,
  8   |     "name": "Salon Kalyna",
  9   |     "description": "Перукар",
  10  |     "locationType": "Waterloo",
  11  |     "address": "Street, Waterloo",
  12  |     "phone": "+15195550101",
  13  |     "instagram": "https://instagram.com/salonkalyna"
  14  |   },
  15  |   {
  16  |     "category": "Medical",
  17  |     "subcategory": "Дантист",
  18  |     "id": 2,
  19  |     "name": "Dr. Olena Ivanenko",
  20  |     "description": "Стоматологія",
  21  |     "locationType": "Kitchener",
  22  |     "address": "Random Street",
  23  |     "phone": "+15195550101",
  24  |     "instagram": "https://instagram.com/dr_ivanenko"
  25  |   },
  26  |   {
  27  |     "category": "Освіта",
  28  |     "subcategory": "Репетитори",
  29  |     "id": 3,
  30  |     "name": "Марія Коваль",
  31  |     "description": "Репетитор англійської мови",
  32  |     "locationType": "Guelph",
  33  |     "address": "Main St, Guelph",
  34  |     "phone": ""
  35  |   }
  36  | ];
  37  | 
  38  | async function mockDataFetch(page) {
  39  |   await page.route("**/data/specialists.json", (route) =>
  40  |     route.fulfill({
  41  |       status: 200,
  42  |       contentType: "application/json",
  43  |       body: JSON.stringify(mockData),
  44  |     })
  45  |   );
  46  |   // Block Firebase requests to avoid fetching real pending specialists
  47  |   await page.route("https://firestore.googleapis.com/**", (route) => route.fulfill({
  48  |     status: 400,
  49  |     body: 'mocked'
  50  |   }));
  51  | }
  52  | 
  53  | test.beforeEach(async ({ page }) => {
  54  |   await mockDataFetch(page);
  55  |   await page.goto("/catalog.html");
> 56  |   await expect(page.locator(".card")).toHaveCount(3);
      |                                       ^ Error: expect(locator).toHaveCount(expected) failed
  57  | });
  58  | 
  59  | test("завантажує дані та показує картки спеціалістів", async ({ page }) => {
  60  |   await expect(page.locator("#status")).toHaveText("Знайдено: 3");
  61  | 
  62  |   const names = await page.locator(".card-name").allTextContents();
  63  |   expect(names.sort()).toEqual(
  64  |     ["Dr. Olena Ivanenko", "Salon Kalyna", "Марія Коваль"].sort()
  65  |   );
  66  | 
  67  |   const first = page.locator(".card", { hasText: "Dr. Olena Ivanenko" });
  68  |   await first.click();
  69  |   await expect(page.locator("#modal-contacts .card-contact-phone")).toHaveAttribute(
  70  |     "href",
  71  |     "tel:+15195550101"
  72  |   );
  73  |   await expect(page.locator("#modal-contacts .card-contact-instagram")).toHaveAttribute(
  74  |     "href",
  75  |     "https://instagram.com/dr_ivanenko"
  76  |   );
  77  |   // Telegram і Facebook порожні для цього спеціаліста — не мають рендеритись.
  78  |   await expect(page.locator("#modal-contacts .card-contact-telegram")).toHaveCount(0);
  79  |   await expect(page.locator("#modal-contacts .card-contact-facebook")).toHaveCount(0);
  80  | });
  81  | 
  82  | test("пошук фільтрує картки за іменем/описом/підкатегорією", async ({ page }) => {
  83  |   await page.locator("#search-input").fill("Salon");
  84  |   await expect(page.locator(".card")).toHaveCount(1);
  85  |   await expect(page.locator(".card-name")).toHaveText("Salon Kalyna");
  86  |   await expect(page.locator("#status")).toHaveText("Знайдено: 1");
  87  | 
  88  |   await page.locator("#search-input").fill("");
  89  |   await expect(page.locator(".card")).toHaveCount(3);
  90  | });
  91  | 
  92  | test("перемикання категорії оновлює набір підкатегорій і карток", async ({ page }) => {
  93  |   await page.locator(".pill", { hasText: "Освіта" }).click();
  94  | 
  95  |   await expect(page.locator(".card")).toHaveCount(1);
  96  |   await expect(page.locator(".card-name")).toHaveText("Марія Коваль");
  97  |   await expect(page.locator(".chip")).toHaveCount(1);
  98  |   await expect(page.locator(".chip")).toHaveText("Репетитори");
  99  | 
  100 |   await expect(page.locator(".pill")).toHaveCount(2);
  101 |   await expect(page.locator(".pill.active")).toHaveText("Освіта");
  102 |   await expect(page.locator(".pill-clear")).toBeVisible();
  103 | 
  104 |   await page.locator(".pill-clear").click();
  105 |   await expect(page.locator(".card")).toHaveCount(3);
  106 |   await expect(page.locator(".chip")).toHaveCount(0);
  107 | 
  108 |   await page.locator(".pill", { hasText: "Beauty" }).click();
  109 | 
  110 |   await expect(page.locator(".card")).toHaveCount(1);
  111 |   await expect(page.locator(".card-name")).toHaveText("Salon Kalyna");
  112 |   await expect(page.locator(".chip")).toHaveCount(1);
  113 |   await expect(page.locator(".chip")).toHaveText("Перукар");
  114 | 
  115 |   await page.locator(".pill.active", { hasText: "Beauty" }).click();
  116 |   await expect(page.locator(".card")).toHaveCount(3);
  117 |   await expect(page.locator(".chip")).toHaveCount(0);
  118 | });
  119 | 
  120 | test("локація фільтрує за містом з адреси або типу локації", async ({ page }) => {
  121 |   await page.selectOption("#location-select", "Kitchener");
  122 |   await expect(page.locator(".card")).toHaveCount(1);
  123 |   await expect(page.locator(".card-name")).toHaveText("Dr. Olena Ivanenko");
  124 | 
  125 |   await page.selectOption("#location-select", "Waterloo");
  126 |   await expect(page.locator(".card")).toHaveCount(1);
  127 |   await expect(page.locator(".card-name")).toHaveText("Salon Kalyna");
  128 |   
  129 |   await page.selectOption("#location-select", "Guelph");
  130 |   await expect(page.locator(".card")).toHaveCount(1);
  131 |   await expect(page.locator(".card-name")).toHaveText("Марія Коваль");
  132 | 
  133 |   await page.selectOption("#location-select", "");
  134 |   await expect(page.locator(".card")).toHaveCount(3);
  135 | });
  136 | 
  137 | test("каталог має загальну шапку з кнопкою 'Додати спеціаліста'", async ({ page }) => {
  138 |   const header = page.locator("nav.top-nav");
  139 |   await expect(header).toBeVisible();
  140 |   
  141 |   const addBtn = header.locator("a", { hasText: "Додати спеціаліста" });
  142 |   await expect(addBtn).toBeVisible();
  143 |   await expect(addBtn).toHaveAttribute("href", "apply.html");
  144 | });
  145 | 
  146 | 
  147 | test("показує іконку категорії та посилання на форму зворотного зв'язку в модалці", async ({ page }) => {
  148 |   const card = page.locator(".card", { hasText: "Salon Kalyna" });
  149 | 
  150 |   // Icon
  151 |   await expect(card.locator(".category-icon")).toHaveClass(/fa-spa/);
  152 | 
  153 |   // Click to open modal
  154 |   await card.click();
  155 | 
  156 |   // Feedback link in modal
```