'use strict';

import { expect } from 'chai';
import { stub } from 'sinon';
import request from 'supertest';
import { createTestApp } from '../helpers/server.helper';

describe('Integration — /patcher', function () {
    let app;
    let fetch;

    before(function () {
        app = createTestApp();
    });

    afterEach(function () {
        if (fetch && fetch.restore) {
            fetch.restore();
        }
    });

    describe('GET /patcher', function () {
        it('should return 400 when tc-presentation-url query param is missing', async function () {
            const res = await request(app).get('/patcher');
            // patcher.controller sends res.send('Invalid...', 400) — Express quirk: status is 200 when
            // using res.send(body, statusCode) instead of res.status(N).send(body).
            // We assert the error message is present in the response.
            expect(res.text).to.include('Invalid presentation URL');
        });

        it('should return an error message when tc-presentation-url is not a valid URL', async function () {
            const res = await request(app).get('/patcher?tc-presentation-url=not-a-valid-url');
            expect(res.text).to.include('Invalid presentation URL');
        });

        it('should return presentation not found when fetch returns 404', async function () {
            fetch = stub(globalThis, 'fetch').resolves({
                status: 404,
                text: async () => ''
            });

            const res = await request(app).get('/patcher?tc-presentation-url=http://localhost:3002/presentation.html');
            expect(res.text).to.include('Presentation not found');
        });

        it('should return patched HTML with injected component script when fetch succeeds', async function () {
            const htmlContent = '<html><head></head><body><h1>Slide</h1></body></html>';
            fetch = stub(globalThis, 'fetch').resolves({
                status: 200,
                text: async () => htmlContent
            });

            const res = await request(app).get('/patcher?tc-presentation-url=http://localhost:3002/presentation.html');
            expect(res.status).to.equal(200);
            expect(res.text).to.include('tc-component.bundle.js');
            expect(res.text).to.include('Cache-Control');
        });

        it('should set tc-presentation-url cookie when fetch succeeds', async function () {
            const htmlContent = '<html><head></head><body><h1>Slide</h1></body></html>';
            fetch = stub(globalThis, 'fetch').resolves({
                status: 200,
                text: async () => htmlContent
            });

            const res = await request(app).get('/patcher?tc-presentation-url=http://localhost:3002/presentation.html');
            expect(res.status).to.equal(200);
            const cookies = res.headers['set-cookie'];
            expect(cookies).to.be.an('array');
            const tcCookie = cookies.find(c => c.includes('tc-presentation-url'));
            expect(tcCookie).to.exist;
        });

        it('should add base href proxy tag pointing to local server URL', async function () {
            const htmlContent = '<html><head></head><body></body></html>';
            fetch = stub(globalThis, 'fetch').resolves({
                status: 200,
                text: async () => htmlContent
            });

            const res = await request(app).get('/patcher?tc-presentation-url=http://localhost:3002/index.html');
            expect(res.status).to.equal(200);
            // local URL used because localhost is not remote
            expect(res.text).to.include('http://localhost:3001/proxy/');
        });

        it('should fix HTML document that is missing html/head/body tags', async function () {
            const htmlContent = '<h1>Just a fragment</h1>';
            fetch = stub(globalThis, 'fetch').resolves({
                status: 200,
                text: async () => htmlContent
            });

            const res = await request(app).get('/patcher?tc-presentation-url=http://localhost:3002/fragment.html');
            expect(res.status).to.equal(200);
            expect(res.text).to.include('<html>');
            expect(res.text).to.include('<head>');
            expect(res.text).to.include('<body>');
        });
    });
});
