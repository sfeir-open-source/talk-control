'use strict';

import 'module-alias/register';
import { expect } from 'chai';
import { isPresentationIframe, isUsingRemoteUrl } from '@services/context';
import config from '@config/config.json';

describe('Context service', function() {
    describe('isPresentationIframe', function() {
        it('should return false if window.location.href object is falsy', function() {
            expect(isPresentationIframe()).to.be.false;
        });

        it('should return false if window.location.href contains TC Controller port', function() {
            expect(isPresentationIframe(`http://localhost:${config.tcController.port}/index.html`)).to.be.false;
        });

        it('should return true if window.location.href does not contain TC Controller port', function() {
            expect(isPresentationIframe('http://www.google.com')).to.be.true;
        });
    });

    describe('isUsingRemoteUrl', function() {
        it('should return true if url is remote', function() {
            expect(isUsingRemoteUrl('http://www.google.com')).to.be.true;
        });

        it('should return false otherwise', function() {
            expect(isUsingRemoteUrl()).to.be.false;
            expect(isUsingRemoteUrl('http://localhost:3000/index.html')).to.be.false;
        });
    });
});
