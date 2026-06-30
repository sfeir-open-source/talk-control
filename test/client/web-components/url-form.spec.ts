import '../../../src/client/web-components/url-form/url-form';

vi.mock('@services/context', () => ({
    default: { isUsingRemoteUrl: vi.fn(() => false) }
}));

describe('tc-url-form', () => {
    let el: HTMLElement;

    beforeEach(async () => {
        el = document.createElement('tc-url-form');
        document.body.appendChild(el);
        await (el as any).updateComplete;
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('a un shadowRoot avec les éléments attendus', () => {
        const sr = el.shadowRoot!;
        expect(sr.getElementById('presentationUrl')).not.toBeNull();
        expect(sr.getElementById('validateButton')).not.toBeNull();
        expect(sr.getElementById('updateButton')).not.toBeNull();
        expect(sr.getElementById('urlError')).not.toBeNull();
    });

    it('URL valide → dispatche url-form-validated sur window, input disabled', () => {
        const sr = el.shadowRoot!;
        const input = sr.getElementById('presentationUrl') as HTMLInputElement;
        input.value = 'http://example.com/slides/reveal.html';

        let fired = false;
        window.addEventListener(
            'url-form-validated',
            () => {
                fired = true;
            },
            { once: true }
        );
        sr.getElementById('validateButton')!.click();

        expect(fired).toBe(true);
        expect(input.disabled).toBe(true);
    });

    it('URL invalide → affiche #urlError', () => {
        const sr = el.shadowRoot!;
        const input = sr.getElementById('presentationUrl') as HTMLInputElement;
        input.value = 'pas-une-url';

        sr.getElementById('validateButton')!.click();

        expect(sr.getElementById('urlError')!.classList.contains('is-hidden')).toBe(false);
    });

    it('clic Update → dispatche url-form-editing sur window, input enabled', () => {
        const sr = el.shadowRoot!;
        const input = sr.getElementById('presentationUrl') as HTMLInputElement;
        // passer en readonly d'abord
        input.value = 'http://example.com/slides/reveal.html';
        sr.getElementById('validateButton')!.click();

        let fired = false;
        window.addEventListener(
            'url-form-editing',
            () => {
                fired = true;
            },
            { once: true }
        );
        sr.getElementById('updateButton')!.click();

        expect(fired).toBe(true);
        expect(input.disabled).toBe(false);
    });
});
