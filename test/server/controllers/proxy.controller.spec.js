import { expect } from 'chai';
import { assert, stub } from 'sinon';
import { forwardTraffic } from '@server/controllers/proxy.controller';

describe('ProxyController', function() {
    let req, res, proxy;

    beforeEach(function() {
        proxy = { web: stub() };
        req = { cookies: {} };
        res = { send: stub() };
    });

    describe('forwardTraffic', function() {
        it('should error if requested presentation url is invalid', function() {
            // Given
            req.cookies['tc-presentation-url'] = 'INVALID_URL';
            // When
            forwardTraffic(req, res, proxy);
            // Then
            assert.calledWithExactly(res.send, 'Invalid presentation URL', 400);
        });

        it('should forward request for resource to presentation server (target)', function() {
            // Given
            req.cookies['tc-presentation-url'] = 'http://test.domain.com/presentation/';
            req.originalUrl = '/proxy/resource/1';
            // When
            forwardTraffic(req, res, proxy);
            // then
            expect(proxy.web.args[0][0]).to.be.equal(req);
            expect(proxy.web.args[0][0]).to.have.property('url', '/resource/1');
            expect(proxy.web.args[0][1]).to.be.equal(res);
            expect(proxy.web.args[0][2]).to.have.property('target', 'http://test.domain.com');
            expect(proxy.web.args[0][2]).to.have.property('secure', false);
        });
    });
});
