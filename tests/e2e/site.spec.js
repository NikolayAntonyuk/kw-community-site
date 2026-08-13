import { test, expect } from "@playwright/test";
import { GVIZ_RESPONSE_TEXT } from "../fixtures/gviz-fixture.js";

async function mockGviz(page) {
  await page.route("**/gviz/tq**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/plain;charset=utf-8",
      body: GVIZ_RESPONSE_TEXT,
    })
  );
}

test.beforeEach(async ({ page }) => {
  await mockGviz(page);
  await page.goto("/index.html");
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

  await page.locator(".pill", { hasText: "Краса" }).click();

  await expect(page.locator(".card")).toHaveCount(1);
  await expect(page.locator(".card-name")).toHaveText("Salon Kalyna");
  await expect(page.locator(".chip")).toHaveCount(1);
  await expect(page.locator(".chip")).toHaveText("Перукарі");

  // повторний клік по активній категорії скидає фільтр
  await page.locator(".pill", { hasText: "Краса" }).click();
  await expect(page.locator(".card")).toHaveCount(3);
  await expect(page.locator(".chip")).toHaveCount(0);
});

test("локація фільтрує за містом з адреси", async ({ page }) => {
  await page.selectOption("#location-select", "Waterloo");
  await expect(page.locator(".card")).toHaveCount(1);
  await expect(page.locator(".card-name")).toHaveText("Salon Kalyna");

  await page.selectOption("#location-select", "");
  await expect(page.locator(".card")).toHaveCount(3);
});
