// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const FIXTURE_URL = 'file://' + path.resolve(__dirname, 'fixtures/index.html');

test.describe('Smoke tests — TalkControl controller fixture', () => {
    test('page loads without crash', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        // Page loaded if we reach here without error
        await expect(page).not.toBeNull();
    });

    test('page title is present', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title).toContain('TalkControl');
    });

    test('main heading is visible', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        const heading = page.locator('h1');
        await expect(heading).toBeVisible();
        await expect(heading).toContainText('TalkControl');
    });

    test('slide display area is present', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        const slideDisplay = page.locator('#slide-display');
        await expect(slideDisplay).toBeVisible();
    });

    test('navigation buttons are present', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        const prevBtn = page.locator('#btn-prev');
        const nextBtn = page.locator('#btn-next');
        await expect(prevBtn).toBeVisible();
        await expect(nextBtn).toBeVisible();
    });
});
