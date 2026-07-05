import '../../../src/client/web-components/slide-view/slide-view';

describe('tc-slide', () => {
    let el: HTMLElement;

    beforeEach(async () => {
        el = document.createElement('tc-slide');
        document.body.appendChild(el);
        await (el as any).updateComplete;
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('a un shadowRoot avec <section> et <iframe>', () => {
        expect(el.shadowRoot!.querySelector('section')).not.toBeNull();
        expect(el.shadowRoot!.querySelector('iframe')).not.toBeNull();
    });

    it("prop url → iframe src contient l'URL et ?delta=0", () => {
        el.setAttribute('url', 'http://example.com/slides');
        const src = el.shadowRoot!.querySelector('iframe')!.getAttribute('src');
        expect(src).toContain('http://example.com/slides');
        expect(src).toContain('?delta=0');
    });

    it('prop delta → iframe src contient delta=<valeur> en query param', () => {
        el.setAttribute('url', 'http://example.com/slides');
        el.setAttribute('delta', '2');
        const src = el.shadowRoot!.querySelector('iframe')!.getAttribute('src');
        expect(src).toContain('?delta=2');
    });

    it('url contenant déjà une query string → delta est ajouté avec &', () => {
        el.setAttribute('url', 'http://example.com/patcher?tc-presentation-url=http://slides.example');
        el.setAttribute('delta', '1');
        const src = el.shadowRoot!.querySelector('iframe')!.getAttribute('src');
        expect(src).toContain('tc-presentation-url=http://slides.example&delta=1');
    });

    it('prop fullscreen → section a la classe fullscreen', async () => {
        (el as any).fullscreen = true;
        await (el as any).updateComplete;
        expect(el.shadowRoot!.querySelector('section')!.classList.contains('fullscreen')).toBe(true);
    });
});
