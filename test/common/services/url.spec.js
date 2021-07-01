'use strict';

import 'module-alias/register';
import { assert } from 'chai';
import { isValidUrl } from '@services/url';

describe('Url service', function() {
    describe('isUrlValid', function() {
        it('should return true', function() {
            assert(isValidUrl('http://example.com:8080'));
        });

        it('should not reject localhost', function() {
            assert(isValidUrl('http://localhost:3000'));
        });

        it('should return false because no url given', function() {
            assert(!isValidUrl());
        });

        it('should return false because url is bad formated', function() {
            assert(!isValidUrl('this is a bad url'));
        });
    });
});
