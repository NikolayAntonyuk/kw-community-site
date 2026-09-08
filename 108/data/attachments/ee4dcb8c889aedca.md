# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin Panel E2E >> should paginate live catalog 50 per page with working prev/next buttons
- Location: tests/e2e/admin.spec.ts:687:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#live-pagination')
Timeout: 5000ms
- Expected substring  - 1
+ Received string     + 7

- Всього: 60
+
+       
+         ← Назад
+         Сторінка 1 з 2 (Всього: 64)
+         Далі →
+       
+     

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#live-pagination')
    14 × locator resolved to <div id="live-pagination">…</div>
       - unexpected value "
      
        ← Назад
        Сторінка 1 з 2 (Всього: 64)
        Далі →
      
    "

```

```yaml
- button "← Назад" [disabled]
- strong: "Сторінка 1 з 2 (Всього: 64)"
- button "Далі →"
```

# Test source

```ts
  623 |           export const getDocs = async () => ({ empty: true });
  624 |           export const updateDoc = async () => {};
  625 |           export const doc = () => {};
  626 |           export const addDoc = async () => {};
  627 |           export const getFirestore = () => ({});
  628 |           export const serverTimestamp = () => ({});
  629 |         `
  630 |       });
  631 |     });
  632 | 
  633 |     await page.route('**/api/specialists', route => route.fulfill({ status: 200, body: '{}' }));
  634 |     await page.route('**/api/sync', route => route.fulfill({ status: 200, body: '{}' }));
  635 |     await page.goto('/admin.html');
  636 |     await page.waitForFunction(() => typeof window.saveEdit === 'function');
  637 | 
  638 |     let dialogAppeared = false;
  639 |     page.on('dialog', async dialog => {
  640 |       dialogAppeared = true;
  641 |       await dialog.accept();
  642 |     });
  643 | 
  644 |     await page.evaluate(() => {
  645 |       document.body.innerHTML += `
  646 |         <div id="display-name-edit-accept"></div>
  647 |         <div id="display-cat-edit-accept"></div>
  648 |         <div id="display-desc-edit-accept"></div>
  649 |         <div id="display-loc-edit-accept"></div>
  650 |         <div id="display-address-edit-accept"></div>
  651 |         <div id="display-phone-edit-accept"></div>
  652 |         <div id="display-tg-edit-accept"></div>
  653 |         <div id="display-inst-edit-accept"></div>
  654 |         <div id="display-fb-edit-accept"></div>
  655 |         <div id="display-web-edit-accept"></div>
  656 |         <div id="display-price-edit-accept"></div>
  657 |         <div id="display-notes-edit-accept"></div>
  658 |       `;
  659 |       document.getElementById('edit-id').value = 'edit-accept';
  660 |       document.getElementById('edit-islive').value = 'false';
  661 |       document.getElementById('edit-name').value = 'New Name';
  662 |       document.getElementById('edit-desc').value = 'New Desc';
  663 |       document.getElementById('edit-phone').value = 'New Phone';
  664 |       document.getElementById('edit-tg').value = 'New Tg';
  665 |       document.getElementById('edit-inst').value = 'New Inst';
  666 |       document.getElementById('edit-fb').value = 'New Fb';
  667 |       document.getElementById('edit-web').value = 'New Web';
  668 |       document.getElementById('edit-category').value = 'New Cat';
  669 |       document.getElementById('edit-subcategory').value = 'New Subcat';
  670 |       document.getElementById('edit-loc').value = 'New Loc';
  671 |       document.getElementById('edit-address').value = 'New Addr';
  672 |       document.getElementById('edit-price').value = 'New Price';
  673 |       document.getElementById('edit-notes').value = 'New Notes';
  674 |       document.getElementById('form-section').classList.add('active');
  675 |       return window.saveEdit();
  676 |     });
  677 | 
  678 |     expect(dialogAppeared).toBeTruthy();
  679 |     
  680 |     const modalHidden = await page.evaluate(() => !document.getElementById('form-section')?.classList.contains('active'));
  681 |     expect(modalHidden).toBeTruthy();
  682 |     
  683 |     const updatedName = await page.evaluate(() => document.getElementById('display-name-edit-accept')?.textContent);
  684 |     expect(updatedName).toBe('New Name');
  685 |   });
  686 | 
  687 |   test('should paginate live catalog 50 per page with working prev/next buttons', async ({ page }) => {
  688 |     // Generate 60 mock specialists
  689 |     const mockData = Array.from({ length: 60 }, (_, i) => ({
  690 |       id: `mock-id-${i}`,
  691 |       name: `Specialist ${i}`,
  692 |       category: 'Test',
  693 |       subcategory: 'Test',
  694 |       description: 'Desc',
  695 |       locationType: 'Waterloo',
  696 |       phone: '123-456',
  697 |       website: 'example.com',
  698 |       createdAt: '2023-01-01T00:00:00Z',
  699 |       updatedAt: '2023-01-01T00:00:00Z'
  700 |     }));
  701 | 
  702 |     await page.route('**/data/specialists.json*', async route => {
  703 |       await route.fulfill({
  704 |         contentType: 'application/json',
  705 |         body: JSON.stringify(mockData)
  706 |       });
  707 |     });
  708 | 
  709 |     await page.goto('/admin.html');
  710 |     await page.waitForFunction(() => typeof window.loadLiveCatalog === 'function');
  711 | 
  712 |     await page.evaluate(() => {
  713 |       document.getElementById('dashboard-section')!.style.display = 'block'; const style = document.createElement('style'); style.innerHTML = '#dashboard-section { display: block !important; }'; document.head.appendChild(style); window.switchTab&&window.switchTab('live-catalog');
  714 |       return window.loadLiveCatalog();
  715 |     });
  716 | 
  717 |     // Wait for the live catalog to load
  718 |     await page.waitForSelector('#live-catalog-list .application-card', { state: 'attached', timeout: 5000 });
  719 | 
  720 |     // Page 1: 50 cards out of 60, "Назад" disabled
  721 |     expect(await page.locator('#live-catalog-list .application-card').count()).toBe(50);
  722 |     await expect(page.locator('#live-pagination')).toContainText('Сторінка 1 з 2');
> 723 |     await expect(page.locator('#live-pagination')).toContainText('Всього: 60');
      |                                                    ^ Error: expect(locator).toContainText(expected) failed
  724 |     await expect(page.locator('#live-pagination button:has-text("← Назад")')).toBeDisabled();
  725 | 
  726 |     // Page 2: remaining 10 cards, "Далі" disabled
  727 |     await page.locator('#live-pagination button:has-text("Далі →")').click();
  728 |     expect(await page.locator('#live-catalog-list .application-card').count()).toBe(10);
  729 |     await expect(page.locator('#live-pagination')).toContainText('Сторінка 2 з 2');
  730 |     await expect(page.locator('#live-pagination button:has-text("Далі →")')).toBeDisabled();
  731 | 
  732 |     // Back to page 1
  733 |     await page.locator('#live-pagination button:has-text("← Назад")').click();
  734 |     expect(await page.locator('#live-catalog-list .application-card').count()).toBe(50);
  735 |     await expect(page.locator('#live-pagination')).toContainText('Сторінка 1 з 2');
  736 |   });
  737 | 
  738 |   test('should show card IDs and keep search input usable while filtering', async ({ page }) => {
  739 |     const mockData = Array.from({ length: 60 }, (_, i) => ({
  740 |       id: `mock-id-${i}`,
  741 |       name: `Specialist ${i}`,
  742 |       category: 'Test',
  743 |       subcategory: 'Test',
  744 |       description: 'Desc',
  745 |       locationType: 'Waterloo',
  746 |       phone: '123-456',
  747 |       website: 'example.com',
  748 |       createdAt: '2023-01-01T00:00:00Z',
  749 |       updatedAt: '2023-01-01T00:00:00Z'
  750 |     }));
  751 | 
  752 |     await page.route('**/data/specialists.json*', async route => {
  753 |       await route.fulfill({
  754 |         contentType: 'application/json',
  755 |         body: JSON.stringify(mockData)
  756 |       });
  757 |     });
  758 | 
  759 |     await page.goto('/admin.html');
  760 |     await page.waitForFunction(() => typeof window.loadLiveCatalog === 'function');
  761 | 
  762 |     await page.evaluate(() => {
  763 |       document.getElementById('dashboard-section')!.style.display = 'block'; const style = document.createElement('style'); style.innerHTML = '#dashboard-section { display: block !important; }'; document.head.appendChild(style); window.switchTab&&window.switchTab('live-catalog');
  764 |       return window.loadLiveCatalog();
  765 |     });
  766 | 
  767 |     await page.waitForSelector('#live-catalog-list .application-card', { state: 'attached', timeout: 5000 });
  768 | 
  769 |     // Every card shows its ID (data is reversed, so newest first)
  770 |     await expect(page.locator('#live-card-mock-id-59')).toContainText('#mock-id-59');
  771 |     await expect(page.locator('#live-card-mock-id-59')).toContainText('ID: mock-id-59');
  772 | 
  773 |     // Typing several characters must keep focus and the full query in the field
  774 |     const search = page.locator('#live-search');
  775 |     await search.click();
  776 |     await page.keyboard.type('mock-id-42');
  777 |     await expect(search).toHaveValue('mock-id-42');
  778 |     await expect(search).toBeFocused();
  779 | 
  780 |     expect(await page.locator('#live-catalog-list .application-card').count()).toBe(1);
  781 |     await expect(page.locator('#live-catalog-list .application-card')).toContainText('Specialist 42');
  782 |     await expect(page.locator('#live-pagination')).toContainText('Всього: 1');
  783 |   });
  784 | 
  785 | 
  786 |   test.skip('should center edit modal and apply correct width on mobile screens', async ({ page }) => {
  787 |     // Set viewport to mobile size
  788 |     await page.setViewportSize({ width: 375, height: 667 });
  789 |     await page.goto('/admin.html');
  790 |     
  791 |     // Wait for the admin.js module to finish loading
  792 |     await page.waitForFunction(() => typeof window.editApp === 'function');
  793 | 
  794 |     // Trigger modal
  795 |     await page.evaluate(() => {
  796 |       document.getElementById('dashboard-section')!.style.display = 'block'; const style = document.createElement('style'); style.innerHTML = '#dashboard-section { display: block !important; }'; document.head.appendChild(style);
  797 |       document.body.innerHTML += `
  798 |         <div id="display-name-test_mob">TestName</div>
  799 |         <div id="display-cat-test_mob">Cat</div>
  800 |         <div id="display-desc-test_mob">Desc</div>
  801 |         <div id="display-loc-test_mob">Loc</div>
  802 |         <div id="display-address-test_mob">Addr</div>
  803 |         <div id="display-phone-test_mob">Phone</div>
  804 |         <div id="display-tg-test_mob">Tg</div>
  805 |         <div id="display-inst-test_mob">Inst</div>
  806 |         <div id="display-fb-test_mob">Fb</div>
  807 |         <div id="display-web-test_mob">Web</div>
  808 |         <div id="display-price-test_mob">Price</div>
  809 |         <div id="display-notes-test_mob">Notes</div>
  810 |       `;
  811 |       window.editApp('test_mob', false);
  812 |     });
  813 | 
  814 |     const modal = page.locator('#form-section');
  815 |     await expect(modal).toBeVisible();
  816 | 
  817 |     // The modal container
  818 |     await expect(modal).toHaveCSS('display', 'flex');
  819 |     await expect(modal).toHaveCSS('justify-content', 'center');
  820 |     await expect(modal).toHaveCSS('align-items', 'center');
  821 |     
  822 |     // The inner content block of the modal
  823 |     const modalInner = modal.locator('> div');
```