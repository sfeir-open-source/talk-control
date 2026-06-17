// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const FIXTURE_URL = 'file://' + path.resolve(__dirname, 'fixtures/index.html');

test.describe('Navigation — TalkControl controller fixture', () => {
    test('prev and next buttons are present', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await expect(page.locator('#btn-prev')).toBeVisible();
        await expect(page.locator('#btn-next')).toBeVisible();
    });

    test('prev button is disabled on first slide', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        const prevBtn = page.locator('#btn-prev');
        await expect(prevBtn).toBeDisabled();
    });

    test('next button is enabled on first slide', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        const nextBtn = page.locator('#btn-next');
        await expect(nextBtn).toBeEnabled();
    });

    test('clicking next advances the slide counter', async ({ page }) => {
        await page.goto(FIXTURE_URL);

        const currentSlideBefore = await page.locator('#current-slide').textContent();
        expect(currentSlideBefore).toBe('1');

        await page.locator('#btn-next').click();

        const currentSlideAfter = await page.locator('#current-slide').textContent();
        expect(currentSlideAfter).toBe('2');
    });

    test('clicking next then prev returns to initial slide', async ({ page }) => {
        await page.goto(FIXTURE_URL);

        await page.locator('#btn-next').click();
        await page.locator('#btn-prev').click();

        const currentSlide = await page.locator('#current-slide').textContent();
        expect(currentSlide).toBe('1');
    });

    test('prev button becomes enabled after advancing', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await page.locator('#btn-next').click();
        await expect(page.locator('#btn-prev')).toBeEnabled();
    });
});
