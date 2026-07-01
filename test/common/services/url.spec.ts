import { isValidUrl } from '@services/url';

describe('Url service', function () {
    describe('isUrlValid', function () {
        it('should return true', function () {
            expect(isValidUrl('http://example.com:8080')).toBeTruthy();
        });

        it('should not reject localhost', function () {
            expect(isValidUrl('http://localhost:3000')).toBeTruthy();
        });

        it('should return false because no url given', function () {
            expect(isValidUrl(undefined as unknown as string)).toBeFalsy();
        });

        it('should return false because url is bad formated', function () {
            expect(isValidUrl('this is a bad url')).toBeFalsy();
        });
    });
});
