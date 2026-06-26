'use strict';

import request from 'supertest';
import { createTestApp } from '../helpers/server.helper';

describe('Integration — Router', function () {
    let app;

    beforeAll(function () {
        app = createTestApp();
    });

    afterEach(function () {
        vi.unstubAllGlobals();
    });

    describe('CORS headers', function () {
        it('should include Access-Control-Allow-Origin header in responses', async function () {
            vi.stubGlobal(
                'fetch',
                vi.fn().mockResolvedValue({
                    status: 200,
                    text: async () => '<html><head></head><body></body></html>'
                })
            );

            const res = await request(app).get('/patcher?tc-presentation-url=http://localhost:3002/index.html').set('Origin', 'http://localhost:3000');

            expect(res.headers).toHaveProperty('access-control-allow-origin');
        });

        it('should respond to OPTIONS preflight on /patcher', async function () {
            const res = await request(app).options('/patcher').set('Origin', 'http://localhost:3000').set('Access-Control-Request-Method', 'GET');

            expect([200, 204]).toContain(res.status);
        });
    });

    describe('Route mounting', function () {
        it('should mount /patcher route', async function () {
            const res = await request(app).get('/patcher');
            expect(res.status).not.toBe(404);
        });

        it('should mount /proxy route', async function () {
            const res = await request(app).get('/proxy/anything');
            expect(res.status).not.toBe(404);
        });

        it('should return 404 for unknown routes', async function () {
            const res = await request(app).get('/unknown-route');
            expect(res.status).toBe(404);
        });

        it('should return 404 for /api route (not mounted)', async function () {
            const res = await request(app).get('/api/something');
            expect(res.status).toBe(404);
        });
    });
});
