import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
    resolve: {
        // @ts-expect-error: Vite 8 native tsconfig paths (bundled in vitest 4.x)
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
