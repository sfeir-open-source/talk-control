import { LitElement, html, css, PropertyValues } from 'lit-element';
import { TouchPointerMaskTCComponent } from './touch-pointer-mask-tc-component';
import { bulmaStyles } from '@compat/lit-styles-compat';

class TouchPointerMaskComponent extends LitElement {
    // `declare` (not plain class fields) is required here: with this project's ES2022
    // target, useDefineForClassFields shadows Lit's reactive property accessors and
    // silently breaks rendering entirely (see slide-view.ts for the same pattern).
    declare pointer: { x: string | number; y: string | number; color: string };
    declare touchPointerMaskTCComponent: TouchPointerMaskTCComponent;

    constructor() {
        super();
        this.pointer = { x: 0, y: 0, color: '#FF00000' };
    }

    static get styles() {
        return [
            bulmaStyles,
            css`
                #touchMask {
                    width: 100%;
                    height: 100%;
                    border: 4px solid red;
                }
            `
        ];
    }

    static get properties() {
        return {
            pointer: { type: Object },
            touchPointerMaskTCComponent: { type: Object }
        };
    }

    override firstUpdated(_changedProperties: PropertyValues): void {
        super.firstUpdated(_changedProperties);
        this.touchPointerMaskTCComponent = new TouchPointerMaskTCComponent();
        this._initPointerDblClick();
        this._initPointerMove();
    }

    render() {
        return html` <div id="touchMask" /> `;
    }

    _initPointerDblClick(): void {
        this.shadowRoot!.getElementById('touchMask')!.addEventListener('click', () =>
            this.touchPointerMaskTCComponent.sendPointerEventToController({
                origin: 'touchPointer',
                type: 'pointerClick',
                payload: { x: this.pointer.x, y: this.pointer.y }
            })
        );
    }

    _initPointerMove(): void {
        const touchMask = this.shadowRoot!.getElementById('touchMask') as HTMLElement;
        const movePointer = (x: number, y: number) => {
            this.pointer.x = `${this._getPositionInPercent(x, touchMask.offsetWidth)}%`;
            this.pointer.y = `${this._getPositionInPercent(y, touchMask.offsetHeight)}%`;

            this.touchPointerMaskTCComponent.sendPointerEventToController({
                origin: 'touchPointer',
                type: 'pointerMove',
                payload: { x: this.pointer.x, y: this.pointer.y }
            });
        };

        touchMask.addEventListener('mousemove', (e: MouseEvent) => {
            movePointer(e.offsetX, e.offsetY);
        });
        touchMask.addEventListener('touchmove', (e: TouchEvent) => {
            const touch = e.changedTouches.length ? e.changedTouches[0] : null;
            if (touch) {
                const rect = (touch.target as Element).getBoundingClientRect();
                const x = touch.pageX - rect.left;
                const y = touch.pageY - rect.top;
                movePointer(x, y);
            }
        });
    }

    _getPositionInPercent(value: number, size: number): number {
        return Math.round((value * 100) / size);
    }
}

customElements.define('tc-touch-pointer-mask', TouchPointerMaskComponent);
