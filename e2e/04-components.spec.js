// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const FIXTURE_URL = 'file://' + path.resolve(__dirname, 'fixtures/index.html');

test.describe('Components — TalkControl controller fixture', () => {
    test('main layout container exists', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        const container = page.locator('.container');
        await expect(container).toBeVisible();
    });

    test('slide display area exists', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        const slideDisplay = page.locator('#slide-display');
        await expect(slideDisplay).toBeVisible();
    });

    test('slide counter is present', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        const counter = page.locator('#slide-counter');
        await expect(counter).toBeVisible();
    });

    test('current slide indicator is present', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        const current = page.locator('#current-slide');
        await expect(current).toBeVisible();
        const text = await current.textContent();
        expect(text).toBeTruthy();
    });

    test('total slides indicator is present', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        const total = page.locator('#total-slides');
        await expect(total).toBeVisible();
        const text = await total.textContent();
        expect(text).toBeTruthy();
    });

    test('navigation component contains two buttons', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        const nav = page.locator('.navigation');
        await expect(nav).toBeVisible();
        const buttons = nav.locator('button');
        const count = await buttons.count();
        expect(count).toBe(2);
    });
});
