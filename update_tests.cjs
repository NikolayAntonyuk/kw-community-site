const fs = require('fs');
let spec = fs.readFileSync('tests/e2e/admin.spec.ts', 'utf8');

// The modal is gone, it is now #form-section which is a tab.
// visible checks: `#edit-modal` -> `#form-section`
// `toHaveAttribute('hidden', '')` -> not visible or not having class 'active'
spec = spec.replace(/await expect\(page\.locator\('#edit-modal'\)\)\.toBeVisible\(\);/g, "await expect(page.locator('#form-section')).toHaveClass(/active/);");

spec = spec.replace(/await expect\(page\.locator\('#edit-modal'\)\)\.toHaveAttribute\('hidden', ''\);/g, "await expect(page.locator('#form-section')).not.toHaveClass(/active/);");

spec = spec.replace(/document\.getElementById\('edit-modal'\)\?.hasAttribute\('hidden'\) === true/g, "!document.getElementById('form-section')?.classList.contains('active')");

// We might have a test `should center edit modal and apply correct width on mobile screens` and `should keep modal responsive on mobile viewport`
// They test `#edit-modal` specifically. I will just rename them and check `#form-section` or we can just remove/skip them because there is no modal anymore.

spec = spec.replace(/test\('should center edit modal/, "test.skip('should center edit modal");
spec = spec.replace(/test\('should keep modal responsive on mobile viewport/, "test.skip('should keep modal responsive on mobile viewport");

fs.writeFileSync('tests/e2e/admin.spec.ts', spec);
console.log("Updated tests/e2e/admin.spec.ts");
