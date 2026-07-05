import { TCComponent } from '@client/tc-component/tc-component';

vi.mock('@client/tc-component/tc-component');

describe('tc-component bootstrap', function () {
    beforeEach(async function () {
        vi.mocked(TCComponent).mockClear();
        await import('@client/tc-component/index');
    });

    it('should default to delta=0 when there is no query string', function () {
        // Given
        window.history.pushState(null, '', '/');

        // When
        window.dispatchEvent(new Event('DOMContentLoaded'));

        // Then
        expect(TCComponent).toHaveBeenCalledWith({ engineName: 'revealjs', delta: 0 });
    });

    it('should parse boolean flags, numeric values and raw strings from the query string', function () {
        // Given
        window.history.pushState(null, '', '/?focus&delta=5&name=abc');

        // When
        window.dispatchEvent(new Event('DOMContentLoaded'));

        // Then
        expect(TCComponent).toHaveBeenCalledWith({ engineName: 'revealjs', focus: true, delta: 5, name: 'abc' });
    });
});
