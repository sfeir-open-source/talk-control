import 'module-alias/register';
import { assert } from 'chai';
import { isUrlValid } from '@helpers/helpers';

describe('Helpers', function() {
    describe('isUrlValid', function() {
        it('should return true', function() {
            assert(isUrlValid('http://example.com:8080'));
        });

        it('should return false because no url given', function() {
            assert(!isUrlValid());
        });

        it('should return false because url is bad formated', function() {
            assert(!isUrlValid('this is a bad url'));
        });
    });
});
