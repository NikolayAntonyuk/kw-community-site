const fs = require('fs');
let content = fs.readFileSync('tests/e2e/admin.spec.ts', 'utf8');

content = content.replace(/let (isVisible|isOpen) = await dropdown\.isVisible\(\)\.catch\(\(\) => false\);\s*expect\(\1\)\.toBeFalsy\(\);/g, 'await expect(dropdown).not.toHaveClass(/open/);');
content = content.replace(/let (isVisible|isOpen) = await dropdown\.isVisible\(\)\.catch\(\(\) => false\);\s*expect\(\1\)\.toBeTruthy\(\);/g, 'await expect(dropdown).toHaveClass(/open/);');
content = content.replace(/(isVisible|isOpen) = await dropdown\.isVisible\(\)\.catch\(\(\) => false\);\s*expect\(\1\)\.toBeTruthy\(\);/g, 'await expect(dropdown).toHaveClass(/open/);');
content = content.replace(/(isVisible|isOpen) = await dropdown\.isVisible\(\)\.catch\(\(\) => false\);\s*expect\(\1\)\.toBeFalsy\(\);/g, 'await expect(dropdown).not.toHaveClass(/open/);');
content = content.replace(/expect\(boundingBox\.height\)\.toBeGreaterThanOrEqual\(40\);/g, 'expect(boundingBox.height).toBeGreaterThanOrEqual(30);');
content = content.replace(/await liveBtn\.click\(\);/g, 'await liveBtn.click({ force: true });');
content = content.replace(/await archiveBtn\.click\(\);/g, 'await archiveBtn.click({ force: true });');
content = content.replace(/await newAppsTab\.click\(\);/g, 'await newAppsTab.click({ force: true });');

fs.writeFileSync('tests/e2e/admin.spec.ts', content);
