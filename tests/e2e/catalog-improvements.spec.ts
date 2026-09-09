import { test, expect } from "@playwright/test";

test.describe("Catalog Improvements", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/catalog.html");
    await page.waitForLoadState("networkidle");
  });

  test("1. Phone display: Shows only number without 'Телефон:' label", async ({
    page,
  }) => {
    // Click first specialist card to open modal
    const firstCard = page.locator(".cards-grid button").first();
    await firstCard.click();

    // Get modal contacts
    const contactsDiv = page.locator("#modal-contacts");
    const contactsText = await contactsDiv.textContent();

    // Verify phone is shown without "Телефон:" prefix
    expect(contactsText).not.toContain("Телефон:");

    // Verify phone number is present (should be digits)
    const phoneLink = contactsDiv.locator("a[href^='tel:']");
    const phoneText = await phoneLink.textContent();
    expect(phoneText).toMatch(/^\d+$/); // Only digits
  });

  test("2. Categories sync: All catalog categories exist in apply form", async ({
    page,
  }) => {
    // Get categories from catalog
    const categoryPills = page.locator("#category-pills .pill");
    const catalogCategories: string[] = [];

    for (let i = 0; i < (await categoryPills.count()); i++) {
      const pill = categoryPills.nth(i);
      const text = await pill.textContent();
      // Extract category name (after icon)
      const categoryName = text?.replace(/[^\w\s]/g, "").trim() || "";
      if (categoryName && !categoryName.includes("Усі")) {
        catalogCategories.push(categoryName);
      }
    }

    // Navigate to apply form
    await page.goto("http://localhost:3000/apply.html");

    // Get categories from form select
    const formSelect = page.locator("#f-category");
    const formOptions = formSelect.locator("option");

    const formCategories: string[] = [];
    for (let i = 0; i < (await formOptions.count()); i++) {
      const option = formOptions.nth(i);
      const value = await option.getAttribute("value");
      const text = await option.textContent();

      // Skip empty option
      if (value && text && text.trim()) {
        formCategories.push(text.trim());
      }
    }

    // Verify all catalog categories are in form
    for (const catFromCatalog of catalogCategories) {
      const found = formCategories.some((formCat) =>
        formCat.toLowerCase().includes(catFromCatalog.toLowerCase())
      );
      expect(found).toBeTruthy(
        `Category "${catFromCatalog}" from catalog not found in form`
      );
    }
  });

  test("3. Ukrainian translations: All categories show Ukrainian names in catalog", async ({
    page,
  }) => {
    // Expected Ukrainian category translations
    const expectedTranslations: Record<string, boolean> = {
      "Краса та догляд": false,
      "Здоров'я та Медицина": false,
      "Освіта / Дитсадки / Гуртки": false,
      "Побутові та інші послуги": false,
      "Інші послуги": false,
      Авто: false,
      "Юридичні послуги": false,
      Нерухомість: false,
      "Їжа та Кондитери": false,
      "Фото/Відео": false,
    };

    // Get all category pills text
    const categoryPills = page.locator("#category-pills .pill");

    for (let i = 0; i < (await categoryPills.count()); i++) {
      const pill = categoryPills.nth(i);
      const text = await pill.textContent();

      // Check if any expected Ukrainian translation is present
      for (const ukrCategory of Object.keys(expectedTranslations)) {
        if (text?.includes(ukrCategory)) {
          expectedTranslations[ukrCategory] = true;
        }
      }
    }

    // Verify no English category names are shown
    const allPillsText = await page.locator("#category-pills").textContent();
    expect(allPillsText).not.toContain("Beauty");
    expect(allPillsText).not.toContain("Health");
    expect(allPillsText).not.toContain("Education");
    expect(allPillsText).not.toContain("Services");
    expect(allPillsText).not.toContain("Service");
    expect(allPillsText).not.toContain("Auto");
    expect(allPillsText).not.toContain("Legal");
    expect(allPillsText).not.toContain("Real Estate");
    expect(allPillsText).not.toContain("Food");
    expect(allPillsText).not.toContain("Photo/Video");

    // At least some Ukrainian categories should be present
    const foundCount = Object.values(expectedTranslations).filter((v) => v)
      .length;
    expect(foundCount).toBeGreaterThan(0);
  });

  test("4. No duplicate categories in apply form", async ({ page }) => {
    await page.goto("http://localhost:3000/apply.html");

    const formSelect = page.locator("#f-category");
    const formOptions = formSelect.locator("option");

    const formCategories: string[] = [];
    for (let i = 0; i < (await formOptions.count()); i++) {
      const option = formOptions.nth(i);
      const value = await option.getAttribute("value");

      if (value && value.trim()) {
        formCategories.push(value);
      }
    }

    // Check for duplicates
    const uniqueCategories = new Set(formCategories);
    expect(formCategories.length).toBe(
      uniqueCategories.size,
      "Form has duplicate categories"
    );

    // Verify no "Legal and bookkeeping" duplicate
    expect(formCategories).not.toContain("Legal and bookkeeping");
  });

  test("5. Category sync: Same categories in admin edit form", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/admin.html");
    await page.waitForLoadState("networkidle");

    // Get categories from apply form first
    const applyPage = await page.context().newPage();
    await applyPage.goto("http://localhost:3000/apply.html");

    const applySelect = applyPage.locator("#f-category");
    const applyOptions = applySelect.locator("option");
    const applyCategories: string[] = [];

    for (let i = 0; i < (await applyOptions.count()); i++) {
      const option = applyOptions.nth(i);
      const value = await option.getAttribute("value");
      if (value && value.trim()) {
        applyCategories.push(value);
      }
    }

    // Get categories from admin form
    const adminSelect = page.locator("select[name='category']");
    const adminOptions = adminSelect.locator("option");
    const adminCategories: string[] = [];

    for (let i = 0; i < (await adminOptions.count()); i++) {
      const option = adminOptions.nth(i);
      const value = await option.getAttribute("value");
      if (value && value.trim()) {
        adminCategories.push(value);
      }
    }

    // Verify same categories in both forms
    expect(adminCategories.sort()).toEqual(applyCategories.sort());

    await applyPage.close();
  });
});
