# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin Panel E2E >> should switch between tabs (new apps, live catalog, rejected apps)
- Location: tests/e2e/admin.spec.ts:833:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForSelector: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.admin-tab') to be visible
    63 × locator resolved to 5 elements. Proceeding with the first one: <div id="tab-new-apps" class="admin-tab active" onclick="window.goToPage(this, 'new-apps')">Нові заявки</div>

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
      - button "✉️ 0" [ref=e7] [cursor=pointer]:
        - text: ✉️
        - generic [ref=e8]: "0"
      - link "Головна" [ref=e9] [cursor=pointer]:
        - /url: index.html
      - link "Каталог" [ref=e10] [cursor=pointer]:
        - /url: catalog.html
      - link "Школа" [ref=e11] [cursor=pointer]:
        - /url: school.html
  - main [ref=e12]:
    - heading "Адмін-панель" [level=1] [ref=e13]
    - generic [ref=e14]:
      - heading "Вхід для адміністраторів" [level=2] [ref=e15]
      - generic [ref=e16]:
        - textbox "Email" [ref=e18]
        - textbox "Пароль" [ref=e20]
        - button "Увійти" [ref=e21] [cursor=pointer]
    - generic [ref=e23]:
      - heading "Нові заявки" [level=2] [ref=e25]
      - generic [ref=e26]: Завантаження...
```

# Test source

```ts
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
  824 |     await expect(modalInner).toHaveCSS('box-sizing', 'border-box');
  825 |     
  826 |     // Playwright converts styles to computed values (px)
  827 |     const box = await modalInner.boundingBox();
  828 |     // In a 375px viewport with padding, it should be well within bounds
  829 |     expect(box?.width).toBeLessThanOrEqual(375);
  830 |     expect(box?.x).toBeGreaterThanOrEqual(0);
  831 |   });
  832 | 
  833 |   test('should switch between tabs (new apps, live catalog, rejected apps)', async ({ page }) => {
  834 |     await page.goto('/admin.html');
  835 | 
  836 |     // Wait for admin.js to load and initialize goToPage
  837 |     await page.waitForFunction(() => typeof window.goToPage === 'function');
  838 | 
  839 |     // Show dashboard
  840 |     await page.evaluate(() => {
  841 |       document.getElementById('dashboard-section')!.style.display = 'block'; const style = document.createElement('style'); style.innerHTML = '#dashboard-section { display: block !important; }'; document.head.appendChild(style);
  842 |     });
  843 | 
  844 |     // Wait a moment for tabs to render
> 845 |     await page.waitForSelector('.admin-tab');
      |                ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
  846 | 
  847 |     // Tab 1: Нові заявки should be active by default
  848 |     const newAppsTab = page.locator('.admin-tab').nth(0);
  849 |     const newAppsContent = page.locator('#new-apps');
  850 | 
  851 |     await expect(newAppsTab).toHaveClass(/active/);
  852 |     await expect(newAppsContent).toHaveClass(/active/);
  853 | 
  854 |     // Click "Живий каталог" tab (second tab, index 1)
  855 |     const liveTab = page.locator('.admin-tab').nth(1);
  856 |     await liveTab.click();
  857 | 
  858 |     // Live catalog should become active
  859 |     await expect(liveTab).toHaveClass(/active/);
  860 |     await expect(page.locator('#live-catalog')).toHaveClass(/active/);
  861 | 
  862 |     // New apps should not be active anymore
  863 |     await expect(newAppsTab).not.toHaveClass(/active/);
  864 |     await expect(newAppsContent).not.toHaveClass(/active/);
  865 | 
  866 |     // Click "Архів" tab (third tab, index 2)
  867 |     const archiveTab = page.locator('.admin-tab').nth(3); // Changed from 2 to 3
  868 |     await archiveTab.click();
  869 | 
  870 |     // Wait a moment for rendering
  871 |     await page.waitForTimeout(300);
  872 | 
  873 |     // Archive should become active
  874 |     await expect(archiveTab).toHaveClass(/active/);
  875 |     await expect(page.locator('#rejected-apps')).toHaveClass(/active/);
  876 | 
  877 |     // Live catalog should not be active anymore
  878 |     await expect(liveTab).not.toHaveClass(/active/);
  879 |     await expect(page.locator('#live-catalog')).not.toHaveClass(/active/);
  880 | 
  881 |     // Switch back to new apps (first tab)
  882 |     await newAppsTab.click();
  883 |     await expect(newAppsTab).toHaveClass(/active/);
  884 |     await expect(newAppsContent).toHaveClass(/active/);
  885 |   });
  886 | 
  887 |   // -------------------------------------------------------------
  888 |   // Verify UI Layout
  889 |   // -------------------------------------------------------------
  890 |   test('should display separate content areas for new applications, archive, feedback, and live catalog', async ({ page }) => {
  891 |     await page.goto('/admin.html');
  892 | 
  893 |     // Wait for admin.js to load
  894 |     await page.waitForFunction(() => typeof window.goToPage === 'function');
  895 |     
  896 |     // Show dashboard
  897 |     await page.evaluate(() => {
  898 |       document.getElementById('dashboard-section')!.style.display = 'block'; const style = document.createElement('style'); style.innerHTML = '#dashboard-section { display: block !important; }'; document.head.appendChild(style);
  899 |     });
  900 | 
  901 |     await page.waitForSelector('.admin-tab');
  902 | 
  903 |     // Verify tabs exist
  904 |     const tabs = page.locator('.admin-tab');
  905 |     const tabCount = await tabs.count();
  906 |     expect(tabCount).toBe(5);
  907 | 
  908 |     // Verify tab labels
  909 |     await expect(tabs.nth(0)).toContainText('Нові заявки');
  910 |     await expect(tabs.nth(1)).toContainText('Живий каталог');
  911 |     await expect(tabs.nth(2)).toContainText('Звіти про помилки');
  912 |     await expect(tabs.nth(3)).toContainText('Архів заявок');
  913 |     await expect(tabs.nth(4)).toContainText('Архів каталогу');
  914 | 
  915 |     // Verify content sections exist
  916 |     const contentSections = page.locator('.tab-content');
  917 |     const sectionCount = await contentSections.count();
  918 |     expect(sectionCount).toBe(6); // new-apps, live-catalog, feedback-section, rejected-apps, archived-catalog, form-section
  919 |   });
  920 | 
  921 |   test.skip('should keep modal responsive on mobile viewport', async ({ page }) => {
  922 |     await page.setViewportSize({ width: 375, height: 812 }); // iPhone SE
  923 | 
  924 |     await page.goto('/admin.html');
  925 | 
  926 |     // Wait for admin.js to load
  927 |     await page.waitForFunction(() => typeof window.editApp === 'function' && typeof window.goToPage === 'function');
  928 | 
  929 |     // Inject test data and trigger modal
  930 |     await page.evaluate(() => {
  931 |       document.getElementById('dashboard-section')!.style.display = 'block'; const style = document.createElement('style'); style.innerHTML = '#dashboard-section { display: block !important; }'; document.head.appendChild(style);
  932 |       // Switch to live-catalog tab
  933 |       window.goToPage(document.querySelectorAll('.admin-tab')[1], 'live-catalog');
  934 | 
  935 |       const liveList = document.getElementById('live-catalog-list');
  936 |       if (liveList) {
  937 |         liveList.innerHTML = `
  938 |           <div class="application-card" id="live-card-mobile-test">
  939 |             <h3><span id="live-display-name-mobile-test">Mobile Test Specialist</span></h3>
  940 |             <p><span id="live-display-cat-mobile-test">Test > Mobile</span></p>
  941 |             <p><span id="live-display-desc-mobile-test">Test description</span></p>
  942 |             <p><span id="live-display-loc-mobile-test">City</span></p>
  943 |             <p><span id="live-display-address-mobile-test">123 Main St</span></p>
  944 |             <p><span id="live-display-phone-mobile-test">555-1234</span></p>
  945 |             <p><span id="live-display-tg-mobile-test">@test</span></p>
```