import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['test/**/*.spec.js'],
        coverage: {
            provider: 'v8',
            all: true,
            include: ['src/**/*.js'],
            exclude: ['src/client/web-components/**', 'src/client/layouts/**', 'src/environment/**'],
            reporter: ['text', 'html', 'lcov'],
            thresholds: { lines: 70, statements: 70, branches: 90, functions: 60 }
        }
    }
});
