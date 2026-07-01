import { Plugin } from '@plugins/plugin.js';

interface PointerState {
    x: string;
    y: string;
    color: string;
}

interface MessageEventData {
    type: string;
    data?: {
        type: string;
        payload: {
            x?: string;
            y?: string;
            color?: string;
        };
    };
}

class TouchPointerInput extends Plugin {
    zooming = false;
    pointer: PointerState = { x: '0', y: '0', color: '#FF0000' };
    interval: ReturnType<typeof setInterval> | undefined;
    messageEventRegistered = false;

    constructor() {
        super();
        this.type = 'touchPointerEvent';
    }

    override init(): void {
        this._addSettingsArea();
        this._addMaskArea();
        this._addPointer();

        if (!this.messageEventRegistered) {
            addEventListener('message', message => this._onMessageEvent(message));
            this.messageEventRegistered = true;
        }
        this.initialized = true;
    }

    override unload(): void {
        this._removeSettingsArea();
        this._removeMaskArea();
        this._removePointer();
        this.initialized = false;
    }

    _addPointer(): void {
        const currentSlide = document.getElementById('currentSlide');
        if (!currentSlide || !currentSlide.shadowRoot) {
            return;
        }

        const slideViewFrame = currentSlide.shadowRoot.getElementById('slideViewFrame');
        if (slideViewFrame) {
            slideViewFrame.style.width = '100%';
            slideViewFrame.style.height = '100%';
            slideViewFrame.style.transitionDuration = '0.8s';
            slideViewFrame.style.cursor = 'zoom-in';
        }

        const slideViewSection = currentSlide.shadowRoot.getElementById('slideViewSection');
        if (slideViewSection) {
            const divPointer = document.createElement('div');
            divPointer.id = 'pointer';
            divPointer.style.position = 'absolute';
            divPointer.style.left = '0';
            divPointer.style.top = '0';
            divPointer.style.width = '12px';
            divPointer.style.height = '12px';
            divPointer.style.borderRadius = '6px';
            divPointer.style.backgroundColor = '#FF0000';
            divPointer.style.visibility = 'hidden';
            slideViewSection.append(divPointer);
        }
    }

    _removePointer(): void {
        const currentSlide = document.getElementById('currentSlide');
        if (!currentSlide || !currentSlide.shadowRoot) {
            console.log('no current slide nor shadowroot');
            return;
        }

        const slideViewSection = currentSlide.shadowRoot.getElementById('slideViewSection');
        if (slideViewSection) {
            const pointer = currentSlide.shadowRoot.getElementById('pointer');
            if (pointer) {
                pointer.remove();
            }
        }
    }

    _addArea(tag: string, placeholderId: string): void {
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            placeholder.innerHTML = tag;
            placeholder.style.display = 'block';
        }
    }

    _removeArea(placeholderId: string): void {
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            placeholder.innerHTML = '';
            placeholder.style.display = 'none';
        }
    }

    _addSettingsArea(): void {
        this._addArea('<tc-touch-pointer-settings></tc-touch-pointer-settings>', 'placeholder1');
    }

    _removeSettingsArea(): void {
        this._removeArea('placeholder1');
    }

    _addMaskArea(): void {
        this._addArea('<tc-touch-pointer-mask></tc-touch-pointer-mask>', 'placeholder2');
    }

    _removeMaskArea(): void {
        this._removeArea('placeholder2');
    }

    _onMessageEvent(message: MessageEvent): void {
        if (!message || !message.data) {
            return;
        }

        const msgData = message.data as MessageEventData;

        if (!msgData.data || typeof msgData.data !== 'object') {
            return;
        }

        if (msgData.type === 'pluginEventIn') {
            return;
        }

        const messageData = msgData.data;

        if (messageData.type === 'pointerMove') {
            this._setPointer(messageData.payload.x ?? '0', messageData.payload.y ?? '0');
            return;
        }

        if (messageData.type === 'pointerColor') {
            this._setPointerColor(messageData.payload.color ?? '');
            return;
        }

        if (messageData.type === 'pointerClick') {
            this._toggleZoom(
                this._convertPercentToCoordinates(messageData.payload.x ?? '0', window.innerWidth),
                this._convertPercentToCoordinates(messageData.payload.y ?? '0', window.innerHeight)
            );
        }
    }

    _setPointer(x: string, y: string): void {
        const currentSlide = document.getElementById('currentSlide');
        if (!currentSlide || !currentSlide.shadowRoot) {
            return;
        }

        const pointer = currentSlide.shadowRoot.getElementById('pointer');
        if (pointer) {
            clearInterval(this.interval);
            pointer.style.visibility = 'visible';
            pointer.style.left = this.pointer.x = x;
            pointer.style.top = this.pointer.y = y;
            this.interval = setInterval(() => {
                pointer.style.visibility = 'hidden';
            }, 2000);
        }
    }

    _setPointerColor(color: string): void {
        const currentSlide = document.getElementById('currentSlide');
        if (!currentSlide || !currentSlide.shadowRoot) {
            return;
        }

        const pointer = currentSlide.shadowRoot.getElementById('pointer');
        if (pointer) {
            pointer.style.backgroundColor = this.pointer.color = color;
        }
    }

    _toggleZoom(mouseX: number, mouseY: number): void {
        const currentSlide = document.getElementById('currentSlide');
        if (!currentSlide || !currentSlide.shadowRoot) {
            return;
        }

        const element = currentSlide.shadowRoot.getElementById('slideViewFrame');
        if (!element) {
            return;
        }

        if (this.zooming) {
            element.style.transform = 'translate3D(0px, 0px, 0px)';
            element.style.cursor = 'zoom-in';
            this.zooming = !this.zooming;
            return;
        }

        const scaleValue = 2;
        const windowCenterX = window.innerWidth / 2;
        const windowCenterY = window.innerHeight / 2;
        const targetX = Math.round((windowCenterX - mouseX) * scaleValue);
        const targetY = Math.round((windowCenterY - mouseY) * scaleValue);

        if (!this.zooming) {
            element.style.transform = `translateX(${targetX}px) translateY(${targetY}px) scale(${scaleValue})`;
            element.style.cursor = 'zoom-out';
            this.zooming = !this.zooming;
        }
    }

    _convertPercentToCoordinates(percentValue: string, size: number): number {
        return (Number(percentValue.replace('%', '')) * size) / 100;
    }
}

export const instance = new TouchPointerInput();
