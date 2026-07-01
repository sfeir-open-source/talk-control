import { forwardTraffic } from '@server/controllers/proxy.controller';
import { Request, Response } from 'express';

describe('ProxyController', function () {
    let req: Partial<Request>, res: Partial<Response>, proxy: { web: ReturnType<typeof vi.fn> };

    beforeEach(function () {
        proxy = { web: vi.fn() };
        req = { cookies: {} };
        res = { send: vi.fn(), status: vi.fn().mockReturnThis() };
    });

    describe('forwardTraffic', function () {
        it('should error if requested presentation url is invalid', function () {
            // Given
            req.cookies!['tc-presentation-url'] = 'INVALID_URL';
            // When
            forwardTraffic(req as Request, res as Response, proxy as any);
            // Then
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Invalid presentation URL');
        });

        it('should error when req.cookies is undefined', function () {
            // Given - no cookies at all
            req.cookies = undefined;
            // When - presentationUrl will be undefined, new URL(undefined) throws
            forwardTraffic(req as Request, res as Response, proxy as any);
            // Then
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Invalid presentation URL');
        });

        it('should error when req.cookies is null', function () {
            // Given
            req.cookies = null as any;
            // When
            forwardTraffic(req as Request, res as Response, proxy as any);
            // Then
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Invalid presentation URL');
        });

        it('should forward request for resource to presentation server (target)', function () {
            // Given
            req.cookies!['tc-presentation-url'] = 'http://test.domain.com/presentation/';
            req.originalUrl = '/proxy/resource/1';
            // When
            forwardTraffic(req as Request, res as Response, proxy as any);
            // then
            expect(proxy.web.mock.calls[0][0]).toBe(req);
            expect(proxy.web.mock.calls[0][0]).toHaveProperty('url', '/resource/1');
            expect(proxy.web.mock.calls[0][1]).toBe(res);
            expect(proxy.web.mock.calls[0][2]).toHaveProperty('target', 'http://test.domain.com');
            expect(proxy.web.mock.calls[0][2]).toHaveProperty('secure', false);
        });
    });
});
