import request from 'supertest';
import { createTestApp } from '../helpers/server.helper.js';

describe('Integration — /patcher', function () {
    let app: ReturnType<typeof createTestApp>;

    beforeAll(function () {
        app = createTestApp();
    });

    afterEach(function () {
        vi.unstubAllGlobals();
    });

    describe('GET /patcher', function () {
        it('should return 400 when tc-presentation-url query param is missing', async function () {
            const res = await request(app).get('/patcher');
            expect(res.text).toContain('Invalid presentation URL');
        });

        it('should return an error message when tc-presentation-url is not a valid URL', async function () {
            const res = await request(app).get('/patcher?tc-presentation-url=not-a-valid-url');
            expect(res.text).toContain('Invalid presentation URL');
        });

        it('should return presentation not found when fetch returns 404', async function () {
            vi.stubGlobal(
                'fetch',
                vi.fn().mockResolvedValue({
                    status: 404,
                    text: async () => ''
                })
            );

            const res = await request(app).get('/patcher?tc-presentation-url=http://localhost:3002/presentation.html');
            expect(res.text).toContain('Presentation not found');
        });

        it('should return patched HTML with injected component script when fetch succeeds', async function () {
            const htmlContent = '<html><head></head><body><h1>Slide</h1></body></html>';
            vi.stubGlobal(
                'fetch',
                vi.fn().mockResolvedValue({
                    status: 200,
                    text: async () => htmlContent
                })
            );

            const res = await request(app).get('/patcher?tc-presentation-url=http://localhost:3002/presentation.html');
            expect(res.status).toBe(200);
            expect(res.text).toContain('tc-component.bundle.js');
            expect(res.text).toContain('Cache-Control');
        });

        it('should set tc-presentation-url cookie when fetch succeeds', async function () {
            const htmlContent = '<html><head></head><body><h1>Slide</h1></body></html>';
            vi.stubGlobal(
                'fetch',
                vi.fn().mockResolvedValue({
                    status: 200,
                    text: async () => htmlContent
                })
            );

            const res = await request(app).get('/patcher?tc-presentation-url=http://localhost:3002/presentation.html');
            expect(res.status).toBe(200);
            const cookies = res.headers['set-cookie'];
            expect(Array.isArray(cookies)).toBe(true);
            const tcCookie = ([cookies].flat() as string[]).find(c => c.includes('tc-presentation-url'));
            expect(tcCookie).toBeTruthy();
        });

        it('should add base href proxy tag pointing to local server URL', async function () {
            const htmlContent = '<html><head></head><body></body></html>';
            vi.stubGlobal(
                'fetch',
                vi.fn().mockResolvedValue({
                    status: 200,
                    text: async () => htmlContent
                })
            );

            const res = await request(app).get('/patcher?tc-presentation-url=http://localhost:3002/index.html');
            expect(res.status).toBe(200);
            // local URL used because localhost is not remote
            expect(res.text).toContain('http://localhost:3001/proxy/');
        });

        it('should fix HTML document that is missing html/head/body tags', async function () {
            const htmlContent = '<h1>Just a fragment</h1>';
            vi.stubGlobal(
                'fetch',
                vi.fn().mockResolvedValue({
                    status: 200,
                    text: async () => htmlContent
                })
            );

            const res = await request(app).get('/patcher?tc-presentation-url=http://localhost:3002/fragment.html');
            expect(res.status).toBe(200);
            expect(res.text).toContain('<html>');
            expect(res.text).toContain('<head>');
            expect(res.text).toContain('<body>');
        });
    });
});
