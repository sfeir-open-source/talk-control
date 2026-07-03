import '../../../src/client/web-components/menu-plugins/menu-plugins';

describe('tc-menu-plugins', () => {
    let el: HTMLElement;

    beforeEach(async () => {
        el = document.createElement('tc-menu-plugins');
        document.body.appendChild(el);
        await (el as any).updateComplete;
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('addItemToMenu ajoute un item dans la liste', () => {
        (el as any).addItemToMenu('touchPointerInput');
        const items = el.shadowRoot!.getElementById('pluginsList')!.children;
        expect(items.length).toBe(1);
        expect(items[0].innerHTML).toBe('touchPointerInput');
    });

    it("addItemToMenu appelé deux fois pour le même plugin n'ajoute qu'un seul item", () => {
        // Le serveur rediffuse pluginsList à chaque client qui s'initialise
        // (ex: presenter + on-stage) : addItemToMenu peut donc être appelé
        // plusieurs fois pour le même plugin.
        (el as any).addItemToMenu('touchPointerInput');
        (el as any).addItemToMenu('touchPointerInput');
        const items = el.shadowRoot!.getElementById('pluginsList')!.children;
        expect(items.length).toBe(1);
    });

    it('deux plugins différents sont tous les deux ajoutés', () => {
        (el as any).addItemToMenu('touchPointerInput');
        (el as any).addItemToMenu('otherPlugin');
        const items = el.shadowRoot!.getElementById('pluginsList')!.children;
        expect(items.length).toBe(2);
    });
});
