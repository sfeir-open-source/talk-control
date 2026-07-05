import { SlideViewTCComponent } from './slide-view-tc-component';
import { bulmaStyles } from '@compat/lit-styles-compat';
import { LitElement, html, css } from 'lit-element';

class SlideViewComponent extends LitElement {
    declare url: string;
    declare delta: string;
    declare fullscreen: boolean;
    declare _focus: boolean;
    slideViewTcComponent!: SlideViewTCComponent;
    frame!: HTMLIFrameElement;

    constructor() {
        super();
        this.delta = '0';
    }

    static get properties() {
        return {
            url: { type: String, reflect: true, attribute: true },
            delta: { type: String, reflect: true, attribute: true },
            _focus: { type: Boolean, attribute: 'focus' },
            fullscreen: { type: Boolean, reflect: true, attribute: true }
        };
    }

    static get styles() {
        return [
            bulmaStyles,
            css`
                iframe,
                section {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
                section.fullscreen {
                    width: 100vw;
                    height: 100vh;
                }
            `
        ];
    }

    firstUpdated(): void {
        this.slideViewTcComponent = new SlideViewTCComponent(this);
        this.frame = this.shadowRoot!.querySelector('iframe')!;
        if (this._focus) {
            this._bindFocus();
        }
    }

    override attributeChangedCallback(name: string, oldval: string | null, newval: string | null): void {
        super.attributeChangedCallback(name, oldval, newval);

        if (newval && (name === 'url' || (this.url && name === 'delta'))) {
            this._loadFrame();
        }
    }

    _loadFrame(): void {
        // Uses a query param rather than a hash fragment: Reveal's own hash-based
        // slide routing reads and rewrites location.hash on load, which would wipe
        // out a `#delta=` value before tc-component.bundle.js gets to read it.
        const separator = this.url.includes('?') ? '&' : '?';
        let src = `${this.url}${separator}delta=${this.delta}`;
        if (this._focus) {
            src += '&focus';
        }
        this.frame.src = src;
        this.frame.classList.remove('is-hidden');
        this.frame.onload = () => this.slideViewTcComponent.setLoaded();
    }

    _bindFocus(): void {
        this.frame.focus();
        document.addEventListener('click', () => this.frame.focus());
    }

    render() {
        return html`
            <section id="slideViewSection" class="${this.fullscreen ? 'fullscreen' : ''}">
                <iframe id="slideViewFrame">Current slide</iframe>
            </section>
        `;
    }
}

customElements.define('tc-slide', SlideViewComponent);
