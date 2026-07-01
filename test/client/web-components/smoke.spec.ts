import '../../../src/client/web-components/clock/clock';
import '../../../src/client/web-components/loader/loader';
import '../../../src/client/web-components/magic-info-tutorial/magic-info-tutorial';
import '../../../src/client/web-components/menu-navigation/menu-navigation';
import '../../../src/client/web-components/menu-plugins/menu-plugins';
import '../../../src/client/web-components/notes/notes';
import '../../../src/client/web-components/remote-control/remote-control';
import '../../../src/client/web-components/slide-view/slide-view';
import '../../../src/client/web-components/timer/timer';
import '../../../src/client/web-components/url-form/url-form';
import '../../../src/client/web-components/view-selector/view-selector';

const COMPONENTS = [
    'tc-clock',
    'tc-loader',
    'tc-magic-info',
    'tc-menu-navigation',
    'tc-menu-plugins',
    'tc-notes',
    'tc-remote-control',
    'tc-slide',
    'tc-timer',
    'tc-url-form',
    'tc-view-selector'
];

describe('Smoke tests — web components LitElement', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    for (const tag of COMPONENTS) {
        it(`${tag} se rend sans crash et a un shadowRoot`, async () => {
            const el = document.createElement(tag);
            document.body.appendChild(el);
            await (el as any).updateComplete;
            expect(el.shadowRoot).not.toBeNull();
        });
    }
});
