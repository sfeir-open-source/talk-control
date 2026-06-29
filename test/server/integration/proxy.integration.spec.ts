import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// We import forwardTraffic directly to test the uncovered branch (line 15: missing/invalid cookie)
import { forwardTraffic } from '@server/controllers/proxy.controller';
import proxyController from '@server/controllers/proxy.controller';

describe('Integration — /proxy', function () {
    let app: express.Application;

    beforeAll(function () {
        app = express();
        app.use(cors());
        app.use(cookieParser());
        app.use('/proxy', proxyController);
    });

    describe('GET /proxy/* — uncovered branch: missing or invalid presentation URL cookie', function () {
        it('should return error message when tc-presentation-url cookie is absent', async function () {
            // This covers the branch at line 19-24 of proxy.controller.js:
            // req.cookies['tc-presentation-url'] is undefined → new URL(undefined) throws
            const res = await request(app).get('/proxy/some/asset.js');
            expect(res.text).toContain('Invalid presentation URL');
        });

        it('should return error message when tc-presentation-url cookie is not a valid URL', async function () {
            const res = await request(app).get('/proxy/some/asset.js').set('Cookie', 'tc-presentation-url=not-a-url');
            expect(res.text).toContain('Invalid presentation URL');
        });
    });

    describe('forwardTraffic unit — valid cookie triggers proxy.web', function () {
        it('should call proxy.web with the correct target when cookie is a valid URL', function () {
            const req = {
                cookies: { 'tc-presentation-url': 'http://localhost:3002/presentation.html' },
                originalUrl: '/proxy/assets/main.js',
                url: '/proxy/assets/main.js'
            };
            const resMock = {
                send: vi.fn(),
                status: function () {
                    return resMock;
                }
            };
            const webSpy = vi.fn();
            const proxyMock = { web: webSpy };

            forwardTraffic(req as any, resMock as any, proxyMock as any);

            expect(resMock.send).not.toHaveBeenCalled();
            expect(webSpy).toHaveBeenCalledOnce();
            expect(webSpy.mock.calls[0][2].target).toBe('http://localhost:3002');
            expect(webSpy.mock.calls[0][0].url).toBe('/assets/main.js');
        });

        it('should strip /proxy prefix from request url', function () {
            const req = {
                cookies: { 'tc-presentation-url': 'http://example.com/deck.html' },
                originalUrl: '/proxy/images/logo.png',
                url: '/proxy/images/logo.png'
            };
            const resMock = {
                send: vi.fn()
            };
            const webSpy = vi.fn();
            const proxyMock = { web: webSpy };

            forwardTraffic(req as any, resMock as any, proxyMock as any);

            expect(resMock.send).not.toHaveBeenCalled();
            expect(webSpy).toHaveBeenCalledOnce();
            expect(webSpy.mock.calls[0][0].url).toBe('/images/logo.png');
        });
    });
});
