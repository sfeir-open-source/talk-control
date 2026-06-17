'use strict';

import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// We import forwardTraffic directly to test the uncovered branch (line 15: missing/invalid cookie)
import { forwardTraffic } from '@server/controllers/proxy.controller';
import proxyController from '@server/controllers/proxy.controller';

describe('Integration — /proxy', function() {
    let app;

    before(function() {
        app = express();
        app.use(cors());
        app.use(cookieParser());
        app.use('/proxy', proxyController);
    });

    describe('GET /proxy/* — uncovered branch: missing or invalid presentation URL cookie', function() {
        it('should return error message when tc-presentation-url cookie is absent', async function() {
            // This covers the branch at line 19-24 of proxy.controller.js:
            // req.cookies['tc-presentation-url'] is undefined → new URL(undefined) throws
            const res = await request(app).get('/proxy/some/asset.js');
            expect(res.text).to.include('Invalid presentation URL');
        });

        it('should return error message when tc-presentation-url cookie is not a valid URL', async function() {
            const res = await request(app)
                .get('/proxy/some/asset.js')
                .set('Cookie', 'tc-presentation-url=not-a-url');
            expect(res.text).to.include('Invalid presentation URL');
        });
    });

    describe('forwardTraffic unit — valid cookie triggers proxy.web', function() {
        it('should call proxy.web with the correct target when cookie is a valid URL', function(done) {
            const req = {
                cookies: { 'tc-presentation-url': 'http://localhost:3002/presentation.html' },
                originalUrl: '/proxy/assets/main.js',
                url: '/proxy/assets/main.js'
            };
            const res = {
                send: () => done(new Error('should not send error')),
                status: () => res
            };
            const proxyMock = {
                web(webReq, webRes, opts) {
                    void webRes;
                    expect(opts.target).to.equal('http://localhost:3002');
                    expect(webReq.url).to.equal('/assets/main.js');
                    done();
                }
            };

            forwardTraffic(req, res, proxyMock);
        });

        it('should strip /proxy prefix from request url', function(done) {
            const req = {
                cookies: { 'tc-presentation-url': 'http://example.com/deck.html' },
                originalUrl: '/proxy/images/logo.png',
                url: '/proxy/images/logo.png'
            };
            const res = {
                send: () => done(new Error('should not send error'))
            };
            const proxyMock = {
                web(webReq) {
                    expect(webReq.url).to.equal('/images/logo.png');
                    done();
                }
            };

            forwardTraffic(req, res, proxyMock);
        });
    });
});
