import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
    resolve: {
        tsconfigPaths: true
    },
    test: {
        browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }]
        },
        globals: true,
        include: ['test/client/web-components/**/*.spec.ts'],
        setupFiles: ['./test/client/web-components/setup.ts']
    }
});
