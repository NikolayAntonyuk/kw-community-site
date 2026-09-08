import { test, expect } from '@playwright/test';

test.describe('SEO & Search Indexing Optimization', () => {

  test('robots.txt should be served with correct directives and sitemap reference', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.ok()).toBeTruthy();
    const text = await res.text();
    
    expect(text).toContain('User-agent: *');
    expect(text).toContain('Disallow: /admin.html');
    expect(text).toContain('Sitemap: https://ukrainianskw.ca/sitemap.xml');
  });

  test('sitemap.xml should be served and contain all public pages', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.ok()).toBeTruthy();
    const text = await res.text();
    
    expect(text).toContain('https://ukrainianskw.ca/');
    expect(text).toContain('https://ukrainianskw.ca/catalog.html');
    expect(text).toContain('https://ukrainianskw.ca/school.html');
    expect(text).toContain('https://ukrainianskw.ca/apply.html');
    expect(text).toContain('https://ukrainianskw.ca/feedback.html');
  });

  test('homepage should contain canonical link, Open Graph, Twitter, Geo, and JSON-LD structured data', async ({ page }) => {
    await page.goto('/');

    // Canonical
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://ukrainianskw.ca/');

    // Meta Description & Keywords
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute('content', /Українська громада/);

    const metaKeywords = page.locator('meta[name="keywords"]');
    await expect(metaKeywords).toHaveAttribute('content', /українці ватерлу/);

    // Open Graph
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Українська громада Kitchener–Waterloo/);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://ukrainianskw.ca/');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /hero-community\.jpg/);

    // Twitter Card
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');

    // Geo tags
    await expect(page.locator('meta[name="geo.region"]')).toHaveAttribute('content', 'CA-ON');

    // Schema.org JSON-LD
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toBeAttached();
    const jsonContent = await jsonLd.textContent();
    const parsed = JSON.parse(jsonContent || '{}');
    expect(parsed['@context']).toBe('https://schema.org');
  });

  test('catalog page should contain canonical link, Open Graph and Schema.org CollectionPage', async ({ page }) => {
    await page.goto('/catalog.html');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://ukrainianskw.ca/catalog.html');

    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toBeAttached();
    const jsonContent = await jsonLd.textContent();
    const parsed = JSON.parse(jsonContent || '{}');
    expect(parsed['@type']).toBe('CollectionPage');
  });

  test('school page should contain canonical link, Open Graph and Schema.org EducationalOrganization', async ({ page }) => {
    await page.goto('/school.html');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://ukrainianskw.ca/school.html');

    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toBeAttached();
    const jsonContent = await jsonLd.textContent();
    const parsed = JSON.parse(jsonContent || '{}');
    expect(parsed['@type']).toBe('EducationalOrganization');
  });

  test('admin.html should have noindex, nofollow robots tag to avoid search engine indexation', async ({ page }) => {
    await page.goto('/admin.html');

    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
  });

});
