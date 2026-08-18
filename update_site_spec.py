import re

with open('tests/e2e/site.spec.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add ID to mockData
content = content.replace('"name": "Salon Kalyna",', '"id": 1,\n    "name": "Salon Kalyna",')
content = content.replace('"name": "Dr. Olena Ivanenko",', '"id": 2,\n    "name": "Dr. Olena Ivanenko",')
content = content.replace('"name": "Марія Коваль",', '"id": 3,\n    "name": "Марія Коваль",')

# Add test case
test_case = """
test("показує ID, іконку категорії та посилання на форму зворотного зв'язку", async ({ page }) => {
  const card = page.locator(".card", { hasText: "Salon Kalyna" });

  // ID
  await expect(card.locator(".card-id")).toHaveText("#1");

  // Icon
  await expect(card.locator(".category-icon")).toHaveClass(/fa-spa/); // Beauty defaults to fa-spa if not matching exactly

  // Feedback link
  const feedbackLink = card.locator(".card-feedback-link");
  await expect(feedbackLink).toBeVisible();
  await expect(feedbackLink).toHaveAttribute("href", "feedback.html?id=1");
});
"""

content += "\n" + test_case

# fix text match
content = content.replace('["Dr. Olena Ivanenko", "Salon Kalyna", "Марія Коваль"].sort()', '["#2Dr. Olena Ivanenko", "#1Salon Kalyna", "#3Марія Коваль"].sort()')

with open('tests/e2e/site.spec.js', 'w', encoding='utf-8') as f:
    f.write(content)

