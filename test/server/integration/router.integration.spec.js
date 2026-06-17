'use strict';

import { expect } from 'chai';
import { stub } from 'sinon';
import request from 'supertest';
import { createTestApp } from '../helpers/server.helper';
import * as nodeFetch from 'node-fetch';

describe('Integration — Router', function() {
    let app;
    let fetchStub;

    before(function() {
        app = createTestApp();
    });

    afterEach(function() {
        if (fetchStub && fetchStub.restore) {
            fetchStub.restore();
        }
    });

    describe('CORS headers', function() {
        it('should include Access-Control-Allow-Origin header in responses', async function() {
            // Stub fetch to avoid real network call
            fetchStub = stub(nodeFetch, 'default').resolves({
                status: 200,
                text: async () => '<html><head></head><body></body></html>'
            });

            const res = await request(app)
                .get('/patcher?tc-presentation-url=http://localhost:3002/index.html')
                .set('Origin', 'http://localhost:3000');

            expect(res.headers).to.have.property('access-control-allow-origin');
        });

        it('should respond to OPTIONS preflight on /patcher', async function() {
            const res = await request(app)
                .options('/patcher')
                .set('Origin', 'http://localhost:3000')
                .set('Access-Control-Request-Method', 'GET');

            // CORS middleware responds with 204 or 200 for preflight
            expect([200, 204]).to.include(res.status);
        });
    });

    describe('Route mounting', function() {
        it('should mount /patcher route', async function() {
            // Even without a valid URL, the route is mounted and responds (not 404)
            const res = await request(app).get('/patcher');
            expect(res.status).not.to.equal(404);
        });

        it('should mount /proxy route', async function() {
            // Even without a cookie, the route is mounted and responds (not 404)
            const res = await request(app).get('/proxy/anything');
            expect(res.status).not.to.equal(404);
        });

        it('should return 404 for unknown routes', async function() {
            const res = await request(app).get('/unknown-route');
            expect(res.status).to.equal(404);
        });

        it('should return 404 for /api route (not mounted)', async function() {
            const res = await request(app).get('/api/something');
            expect(res.status).to.equal(404);
        });
    });
});
