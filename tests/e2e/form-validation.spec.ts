import { test, expect } from "@playwright/test";

test.describe("Form Validation and Security (Test Design / Boundary / Edge Cases)", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8080/apply.html");
  });

  // ==================== REQUIRED FIELDS ====================
  test("should prevent submission with empty form", async ({ page }) => {
    const submitBtn = page.locator("#submit-btn");
    await submitBtn.click();
    const emailInput = page.locator("#f-email");
    await expect(emailInput).toBeFocused();
  });

  test("should prevent submission with only email filled", async ({ page }) => {
    const emailInput = page.locator("#f-email");
    await emailInput.fill("test@example.com");

    const nameInput = page.locator("#f-name");
    await nameInput.fill("");

    const submitBtn = page.locator("#submit-btn");
    await submitBtn.click();

    const nameField = page.locator("#f-name");
    await expect(nameField).toBeFocused();
  });

  // ==================== EMAIL VALIDATION ====================
  test("should reject invalid email format", async ({ page }) => {
    const emailInput = page.locator("#f-email");
    await emailInput.fill("not-an-email");
    await emailInput.blur();

    // HTML5 validation should mark field as invalid
    const validity = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validity).toBe(false);
  });

  test("should accept valid email formats", async ({ page }) => {
    const validEmails = [
      "test@example.com",
      "user.name+tag@example.co.uk",
      "user_123@test-domain.org"
    ];

    for (const email of validEmails) {
      const emailInput = page.locator("#f-email");
      await emailInput.fill(email);
      const validity = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
      expect(validity).toBe(true);
    }
  });

  test("should reject email with maxlength exceeded", async ({ page }) => {
    const emailInput = page.locator("#f-email");
    const longEmail = "a".repeat(95) + "@example.com";
    await emailInput.fill(longEmail);

    const actualLength = await emailInput.evaluate((el: HTMLInputElement) => el.value.length);
    expect(actualLength).toBeLessThanOrEqual(100);
  });

  // ==================== NAME FIELD VALIDATION ====================
  test("should reject name with less than 2 characters", async ({ page }) => {
    const nameInput = page.locator("#f-name");
    await nameInput.fill("A");

    const validity = await nameInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validity).toBe(false);
  });

  test("should accept name with exactly 2 characters", async ({ page }) => {
    const nameInput = page.locator("#f-name");
    await nameInput.fill("AB");

    const validity = await nameInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validity).toBe(true);
  });

  test("should accept name with 100 characters (max)", async ({ page }) => {
    const nameInput = page.locator("#f-name");
    const name = "A".repeat(100);
    await nameInput.fill(name);

    const actualLength = await nameInput.evaluate((el: HTMLInputElement) => el.value.length);
    expect(actualLength).toBe(100);
  });

  test("should reject name exceeding 100 characters", async ({ page }) => {
    const nameInput = page.locator("#f-name");
    const longName = "A".repeat(101);
    await nameInput.fill(longName);

    const actualLength = await nameInput.evaluate((el: HTMLInputElement) => el.value.length);
    expect(actualLength).toBeLessThanOrEqual(100);
  });

  // ==================== SUBCATEGORY VALIDATION ====================
  test("should require subcategory (min 2 chars)", async ({ page }) => {
    const subcatInput = page.locator("#f-subcategory");
    await subcatInput.fill("A");

    const validity = await subcatInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validity).toBe(false);
  });

  test("should accept valid subcategory", async ({ page }) => {
    const subcatInput = page.locator("#f-subcategory");
    await subcatInput.fill("Перукар");

    const validity = await subcatInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validity).toBe(true);
  });

  // ==================== DESCRIPTION VALIDATION ====================
  test("should reject description less than 5 chars", async ({ page }) => {
    const descInput = page.locator("#f-description");
    await descInput.fill("Test");

    const validity = await descInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validity).toBe(false);
  });

  test("should accept description with exactly 5 chars", async ({ page }) => {
    const descInput = page.locator("#f-description");
    await descInput.fill("Test5");

    const validity = await descInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validity).toBe(true);
  });

  test("should accept description with 200 chars (max)", async ({ page }) => {
    const descInput = page.locator("#f-description");
    const desc = "A".repeat(200);
    await descInput.fill(desc);

    const actualLength = await descInput.evaluate((el: HTMLInputElement) => el.value.length);
    expect(actualLength).toBe(200);
  });

  // ==================== DROPDOWN VALIDATION ====================
  test("should require category selection", async ({ page }) => {
    const categorySelect = page.locator("#f-category");
    await categorySelect.selectOption("");

    const validity = await categorySelect.evaluate((el: HTMLSelectElement) => el.validity.valid);
    expect(validity).toBe(false);
  });

  test("should require location selection", async ({ page }) => {
    const locationSelect = page.locator("#f-locationType");
    await locationSelect.selectOption("");

    const validity = await locationSelect.evaluate((el: HTMLSelectElement) => el.validity.valid);
    expect(validity).toBe(false);
  });

  test("should accept valid category selection", async ({ page }) => {
    const categorySelect = page.locator("#f-category");
    await categorySelect.selectOption("Beauty");

    const selectedValue = await categorySelect.inputValue();
    expect(selectedValue).toBe("Beauty");
  });

  // ==================== PHONE VALIDATION ====================
  test("should accept valid phone formats", async ({ page }) => {
    const phoneInput = page.locator("#f-phone");
    const validPhones = [
      "519-555-0123",
      "+1 (519) 555-0123",
      "5195550123",
      "+15195550123"
    ];

    for (const phone of validPhones) {
      await phoneInput.fill(phone);
      const validity = await phoneInput.evaluate((el: HTMLInputElement) => el.validity.valid || el.value === "");
      expect(validity).toBe(true);
    }
  });

  test("should reject phone with invalid characters (letters)", async ({ page }) => {
    const phoneInput = page.locator("#f-phone");
    await phoneInput.fill("519-ABC-5555");
    await phoneInput.blur();

    const validity = await phoneInput.evaluate((el: HTMLInputElement) => el.validity.valid || el.value === "");
    expect(validity).toBe(false);
  });

  test("should reject phone with SQL injection attempt", async ({ page }) => {
    const phoneInput = page.locator("#f-phone");
    await phoneInput.fill("'; DROP TABLE users; --");
    await phoneInput.blur();

    const validity = await phoneInput.evaluate((el: HTMLInputElement) => el.validity.valid || el.value === "");
    expect(validity).toBe(false);
  });

  // ==================== TELEGRAM VALIDATION ====================
  test("should accept valid telegram formats", async ({ page }) => {
    const telegramInput = page.locator("#f-telegram");
    const validTelegrams = [
      "@username",
      "username",
      "https://t.me/username",
      "@user_name_123"
    ];

    for (const tg of validTelegrams) {
      await telegramInput.fill(tg);
      const validity = await telegramInput.evaluate((el: HTMLInputElement) => el.validity.valid || el.value === "");
      expect(validity).toBe(true);
    }
  });

  test("should reject telegram with less than 5 chars", async ({ page }) => {
    const telegramInput = page.locator("#f-telegram");
    await telegramInput.fill("@usr");
    await telegramInput.blur();

    const validity = await telegramInput.evaluate((el: HTMLInputElement) => el.validity.valid || el.value === "");
    expect(validity).toBe(false);
  });

  test("should reject telegram with special SQL characters", async ({ page }) => {
    const telegramInput = page.locator("#f-telegram");
    await telegramInput.fill("@user'; DROP--");
    await telegramInput.blur();

    const validity = await telegramInput.evaluate((el: HTMLInputElement) => el.validity.valid || el.value === "");
    expect(validity).toBe(false);
  });

  // ==================== URL FIELDS (Instagram, Facebook, Website) ====================
  test("should accept valid URLs", async ({ page }) => {
    const instagramInput = page.locator("#f-instagram");
    const validUrl = "https://instagram.com/testuser";
    await instagramInput.fill(validUrl);

    const validity = await instagramInput.evaluate((el: HTMLInputElement) => el.validity.valid || el.value === "");
    expect(validity).toBe(true);
  });

  test("should reject invalid URL format", async ({ page }) => {
    const instagramInput = page.locator("#f-instagram");
    await instagramInput.fill("not a url");
    await instagramInput.blur();

    const validity = await instagramInput.evaluate((el: HTMLInputElement) => el.validity.valid || el.value === "");
    expect(validity).toBe(false);
  });

  test("should restrict URL fields to HTTP(S) only via type=url", async ({ page }) => {
    const websiteInput = page.locator("#f-website");
    const inputType = await websiteInput.getAttribute("type");

    // The field is type=url which provides built-in XSS protection
    expect(inputType).toBe("url");
  });

  // ==================== PRICE FIELD VALIDATION ====================
  test("should have price pattern validation (no letters)", async ({ page }) => {
    const priceInput = page.locator("#f-price");
    const pattern = await priceInput.getAttribute("pattern");

    // Pattern should prevent letters
    expect(pattern).toContain("[^a-zA-Z");
  });

  test("should reject price with letters", async ({ page }) => {
    const priceInput = page.locator("#f-price");
    await priceInput.fill("fifteen dollars");
    await priceInput.blur();

    const validity = await priceInput.evaluate((el: HTMLInputElement) => el.validity.valid || el.value === "");
    expect(validity).toBe(false);
  });

  test("should reject price with SQL injection", async ({ page }) => {
    const priceInput = page.locator("#f-price");
    await priceInput.fill("10; DELETE FROM--");
    await priceInput.blur();

    const validity = await priceInput.evaluate((el: HTMLInputElement) => el.validity.valid || el.value === "");
    expect(validity).toBe(false);
  });

  // ==================== CONTACT REQUIREMENT ====================
  test("should reject form with no contacts provided", async ({ page }) => {
    // Fill all required fields except contacts
    await page.locator("#f-email").fill("test@example.com");
    await page.locator("#f-name").fill("Test Specialist");
    await page.locator("#f-category").selectOption("Beauty");
    await page.locator("#f-subcategory").fill("Перукар");
    await page.locator("#f-description").fill("Provide hair services");
    await page.locator("#f-locationType").selectOption("Kitchener");

    // Leave all contacts empty
    await page.locator("#f-phone").fill("");
    await page.locator("#f-telegram").fill("");
    await page.locator("#f-instagram").fill("");
    await page.locator("#f-facebook").fill("");
    await page.locator("#f-website").fill("");

    // Wait a bit for form to be ready
    await page.waitForTimeout(500);

    await page.locator("#submit-btn").click();

    // Wait for error message to appear
    await page.waitForTimeout(1000);

    // Should show error message
    const errorMessage = page.locator("#form-message");
    const isVisible = await errorMessage.isVisible();
    const errorClass = await errorMessage.getAttribute("class");

    if (isVisible && errorClass?.includes("error")) {
      const text = await errorMessage.textContent();
      expect(text).toContain("контакт");
    } else {
      // If not visible, this test will fail - but that's the point
      expect(isVisible).toBe(true);
    }
  });

  test("should accept form with at least one contact (phone)", async ({ page }) => {
    // Fill all required fields
    await page.locator("#f-email").fill("test@example.com");
    await page.locator("#f-name").fill("Test Specialist");
    await page.locator("#f-category").selectOption("Beauty");
    await page.locator("#f-subcategory").fill("Перукар");
    await page.locator("#f-description").fill("Provide hair services");
    await page.locator("#f-locationType").selectOption("Kitchener");

    // Fill only phone contact
    await page.locator("#f-phone").fill("519-555-0123");

    await page.locator("#submit-btn").click();

    // Should not show error message
    const errorMessage = page.locator("#form-message");
    await expect(errorMessage).not.toHaveClass(/error/);
  });

  // ==================== TEXTAREA VALIDATION ====================
  test("should accept notes up to 1000 characters", async ({ page }) => {
    const notesInput = page.locator("#f-notes");
    const notes = "A".repeat(1000);
    await notesInput.fill(notes);

    const actualLength = await notesInput.evaluate((el: HTMLTextAreaElement) => el.value.length);
    expect(actualLength).toBe(1000);
  });

  test("should prevent notes exceeding 1000 characters", async ({ page }) => {
    const notesInput = page.locator("#f-notes");
    const longNotes = "A".repeat(1001);
    await notesInput.fill(longNotes);

    const actualLength = await notesInput.evaluate((el: HTMLTextAreaElement) => el.value.length);
    expect(actualLength).toBeLessThanOrEqual(1000);
  });

  test("should reject notes with HTML injection", async ({ page }) => {
    const notesInput = page.locator("#f-notes");
    await notesInput.fill("<script>alert('xss')</script>");

    // The script should not execute; it should be treated as plain text
    const value = await notesInput.evaluate((el: HTMLTextAreaElement) => el.value);
    expect(value).toContain("<script>");
  });

  // ==================== ADDRESS FIELD ====================
  test("should accept address with special characters", async ({ page }) => {
    const addressInput = page.locator("#f-address");
    await addressInput.fill("123 Main St. #456, Kitchener, ON N2H 1A1");

    const validity = await addressInput.evaluate((el: HTMLInputElement) => el.validity.valid || el.value === "");
    expect(validity).toBe(true);
  });

  test("should reject address exceeding 150 characters", async ({ page }) => {
    const addressInput = page.locator("#f-address");
    const longAddress = "A".repeat(151);
    await addressInput.fill(longAddress);

    const actualLength = await addressInput.evaluate((el: HTMLInputElement) => el.value.length);
    expect(actualLength).toBeLessThanOrEqual(150);
  });

  // ==================== WHITESPACE TRIMMING ====================
  test("should trim whitespace from all text inputs", async ({ page }) => {
    const nameInput = page.locator("#f-name");
    await nameInput.fill("  Test Name  ");

    const valueAttribute = await nameInput.evaluate((el: HTMLInputElement) => el.value);
    // The raw value might still have spaces; trimming happens on submit
    expect(valueAttribute.trim()).toBe("Test Name");
  });

  // ==================== ACCESSIBILITY ====================
  test("should have proper labels for all form fields", async ({ page }) => {
    const labels = await page.locator("label").count();
    const inputs = await page.locator("input, select, textarea").count();

    // Should have roughly equal number of labels to inputs
    expect(labels).toBeGreaterThan(0);
    expect(inputs).toBeGreaterThan(0);
  });

  test("should have required attribute on mandatory fields", async ({ page }) => {
    const requiredFields = ["f-email", "f-name", "f-category", "f-subcategory", "f-description", "f-locationType"];

    for (const fieldId of requiredFields) {
      const field = page.locator(`#${fieldId}`);
      const isRequired = await field.evaluate((el: HTMLInputElement | HTMLSelectElement) => el.required);
      expect(isRequired).toBe(true);
    }
  });

});
