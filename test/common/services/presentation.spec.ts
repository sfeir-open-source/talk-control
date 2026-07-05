import presentationService from '@services/presentation';

describe('presentationService', function () {
    afterEach(function () {
        sessionStorage.clear();
    });

    describe('resolveUrl()', function () {
        it('should return an empty string when nothing was saved yet', function () {
            expect(presentationService.resolveUrl('http://patcher')).toBe('');
        });

        it('should return the saved url as-is when it has no tc-presentation-url marker', function () {
            // Given
            sessionStorage.setItem('presentationUrl', 'http://raw-url');

            // When / Then
            expect(presentationService.resolveUrl('http://patcher')).toBe('http://raw-url');
        });

        it('should build a patcher url when the saved url has a tc-presentation-url marker', function () {
            // Given
            sessionStorage.setItem('presentationUrl', 'tc-presentation-url=http://original-url');

            // When / Then
            expect(presentationService.resolveUrl('http://patcher')).toBe('http://patcher/patcher?tc-presentation-url=http://original-url');
        });
    });

    describe('saveUrlForPatching()', function () {
        it('should prefix the url with the tc-presentation-url marker when missing', function () {
            // When
            presentationService.saveUrlForPatching('http://raw-url');

            // Then
            expect(sessionStorage.getItem('presentationUrl')).toBe('tc-presentation-url=http://raw-url');
        });

        it('should save the url as-is when it already has the tc-presentation-url marker', function () {
            // When
            presentationService.saveUrlForPatching('tc-presentation-url=http://raw-url');

            // Then
            expect(sessionStorage.getItem('presentationUrl')).toBe('tc-presentation-url=http://raw-url');
        });
    });
});
