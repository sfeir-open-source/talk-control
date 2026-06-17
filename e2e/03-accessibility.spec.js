// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const FIXTURE_URL = 'file://' + path.resolve(__dirname, 'fixtures/index.html');

test.describe('Accessibility — TalkControl controller fixture', () => {
    test('html element has lang attribute set to fr', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        const lang = await page.locator('html').getAttribute('lang');
        expect(lang).toBe('fr');
    });

    test('page has an h1 heading', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        const h1 = page.locator('h1');
        await expect(h1).toBeVisible();
    });

    test('page has a heading (h1 or h2)', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        const headings = page.locator('h1, h2');
        const count = await headings.count();
        expect(count).toBeGreaterThan(0);
    });

    test('prev button has an accessible aria-label', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        const label = await page.locator('#btn-prev').getAttribute('aria-label');
        expect(label).toBeTruthy();
    });

    test('next button has an accessible aria-label', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        const label = await page.locator('#btn-next').getAttribute('aria-label');
        expect(label).toBeTruthy();
    });

    test('slide display has an aria-label', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        const label = await page.locator('#slide-display').getAttribute('aria-label');
        expect(label).toBeTruthy();
    });

    test('navigation region has an aria-label', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        const nav = page.locator('[role="navigation"]');
        await expect(nav).toBeVisible();
        const label = await nav.getAttribute('aria-label');
        expect(label).toBeTruthy();
    });
});
