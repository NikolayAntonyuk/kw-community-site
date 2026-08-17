import { test, expect } from "@playwright/test";

const mockData = [
  {
    "category": "Beauty",
    "subcategory": "Перукар",
    "name": "Salon Kalyna",
    "description": "Перукар",
    "locationType": "Waterloo",
    "address": "Street, Waterloo",
    "phone": "+15195550101",
    "instagram": "https://instagram.com/salonkalyna"
  },
  {
    "category": "Medical",
    "subcategory": "Дантист",
    "name": "Dr. Olena Ivanenko",
    "description": "Стоматологія",
    "locationType": "Kitchener",
    "address": "Random Street",
    "phone": "+15195550101",
    "instagram": "https://instagram.com/dr_ivanenko"
  },
  {
    "category": "Освіта",
    "subcategory": "Репетитори",
    "name": "Марія Коваль",
    "description": "Репетитор англійської мови",
    "locationType": "Guelph",
    "address": "Main St, Guelph",
    "phone": ""
  }
];

async function mockDataFetch(page) {
  await page.route("**/data/specialists.json", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockData),
    })
  );
  // Block Firebase requests to avoid fetching real pending specialists
  await page.route("https://firestore.googleapis.com/**", (route) => route.fulfill({
    status: 400,
    body: 'mocked'
  }));
}

test.beforeEach(async ({ page }) => {
  await mockDataFetch(page);
  await page.goto("/catalog.html");
  await expect(page.locator(".card")).toHaveCount(3);
});

test("завантажує дані та показує картки спеціалістів", async ({ page }) => {
  await expect(page.locator("#status")).toHaveText("Знайдено: 3");

  const names = await page.locator(".card-name").allTextContents();
  expect(names.sort()).toEqual(
    ["Dr. Olena Ivanenko", "Salon Kalyna", "Марія Коваль"].sort()
  );

  const first = page.locator(".card", { hasText: "Dr. Olena Ivanenko" });
  await expect(first.locator(".card-contact-phone")).toHaveAttribute(
    "href",
    "tel:+15195550101"
  );
  await expect(first.locator(".card-contact-instagram")).toHaveAttribute(
    "href",
    "https://instagram.com/dr_ivanenko"
  );
  // Telegram і Facebook порожні для цього спеціаліста — не мають рендеритись.
  await expect(first.locator(".card-contact-telegram")).toHaveCount(0);
  await expect(first.locator(".card-contact-facebook")).toHaveCount(0);
});

test("пошук фільтрує картки за іменем/описом/підкатегорією", async ({ page }) => {
  await page.locator("#search-input").fill("Salon");
  await expect(page.locator(".card")).toHaveCount(1);
  await expect(page.locator(".card-name")).toHaveText("Salon Kalyna");
  await expect(page.locator("#status")).toHaveText("Знайдено: 1");

  await page.locator("#search-input").fill("");
  await expect(page.locator(".card")).toHaveCount(3);
});

test("перемикання категорії оновлює набір підкатегорій і карток", async ({ page }) => {
  await page.locator(".pill", { hasText: "Освіта" }).click();

  await expect(page.locator(".card")).toHaveCount(1);
  await expect(page.locator(".card-name")).toHaveText("Марія Коваль");
  await expect(page.locator(".chip")).toHaveCount(1);
  await expect(page.locator(".chip")).toHaveText("Репетитори");

  await expect(page.locator(".pill")).toHaveCount(2);
  await expect(page.locator(".pill.active")).toHaveText("Освіта");
  await expect(page.locator(".pill-clear")).toBeVisible();

  await page.locator(".pill-clear").click();
  await expect(page.locator(".card")).toHaveCount(3);
  await expect(page.locator(".chip")).toHaveCount(0);

  await page.locator(".pill", { hasText: "Beauty" }).click();

  await expect(page.locator(".card")).toHaveCount(1);
  await expect(page.locator(".card-name")).toHaveText("Salon Kalyna");
  await expect(page.locator(".chip")).toHaveCount(1);
  await expect(page.locator(".chip")).toHaveText("Перукар");

  await page.locator(".pill.active", { hasText: "Beauty" }).click();
  await expect(page.locator(".card")).toHaveCount(3);
  await expect(page.locator(".chip")).toHaveCount(0);
});

test("локація фільтрує за містом з адреси або типу локації", async ({ page }) => {
  await page.selectOption("#location-select", "Kitchener");
  await expect(page.locator(".card")).toHaveCount(1);
  await expect(page.locator(".card-name")).toHaveText("Dr. Olena Ivanenko");

  await page.selectOption("#location-select", "Waterloo");
  await expect(page.locator(".card")).toHaveCount(1);
  await expect(page.locator(".card-name")).toHaveText("Salon Kalyna");
  
  await page.selectOption("#location-select", "Guelph");
  await expect(page.locator(".card")).toHaveCount(1);
  await expect(page.locator(".card-name")).toHaveText("Марія Коваль");

  await page.selectOption("#location-select", "");
  await expect(page.locator(".card")).toHaveCount(3);
});

test("каталог має загальну шапку з кнопкою 'Додати спеціаліста'", async ({ page }) => {
  const header = page.locator("nav.top-nav");
  await expect(header).toBeVisible();
  
  const addBtn = header.locator("a", { hasText: "Додати спеціаліста" });
  await expect(addBtn).toBeVisible();
  await expect(addBtn).toHaveAttribute("href", "apply.html");
});
