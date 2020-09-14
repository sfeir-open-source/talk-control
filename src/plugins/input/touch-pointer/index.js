class TouchPointerInput {
    constructor() {
        this.usedByAComponent = true;
        this.type = 'touchPointerEvent';
        this.callbacks = [];
        this.zooming = false;
        this.pointer = { x: 0, y: 0, color: '#FF0000' };
        this.interval;
    }

    onEvent(callback) {
        this.callbacks.push(callback);
    }

    init() {
        this._addSettingsArea();
        this._addMaskArea();
        this._addPointer();

        addEventListener('message', message => this._onMessageEvent(message));
    }

    _addPointer() {
        // Identifying current slide component
        const currentSlide = document.getElementById('currentSlide');
        if (!currentSlide || !currentSlide.shadowRoot) {
            return;
        }

        // CSS
        const style = document.createElement('style');
        style.innerHTML = `
            #pointer {
                position: absolute;
                left: 0px;
                top: 0px;
                width: 12px;
                height: 12px;
                border-radius: 6px;
                background-color: #FF0000;
                visibility: hidden;
            }
            .zoomable {
                width: 100%;
                height: 100%;
                transition-duration: 0.8s;
                cursor: zoom-in;
            }`;

        currentSlide.shadowRoot.appendChild(style);

        // HTML
        const slideViewFrame = currentSlide.shadowRoot.getElementById('slideViewFrame');
        if (slideViewFrame) {
            slideViewFrame.classList.add('zoomable');
        }

        const slideViewSection = currentSlide.shadowRoot.getElementById('slideViewSection');
        if (slideViewSection) {
            const divPointer = document.createElement('div');
            divPointer.id = 'pointer';
            slideViewSection.append(divPointer);
        }
    }

    _addArea(tag, placeholderId) {
        const placeholder = document.getElementById(placeholderId);

        if (placeholder) {
            placeholder.innerHTML = tag;
        }
    }

    _addSettingsArea() {
        this._addArea('<tc-touch-pointer-settings></tc-touch-pointer-settings>', 'placeholder1');
    }

    _addMaskArea() {
        this._addArea('<tc-touch-pointer-mask></tc-touch-pointer-mask>', 'placeholder2');
    }

    _onMessageEvent(message) {
        if (!message || !message.data) {
            return;
        }

        if (!message.data || !message.data.data || typeof message.data.data !== 'object') {
            return;
        }

        if (message.data.type === 'pluginEventIn') {
            return;
        }

        const messageData = message.data.data;

        if (messageData.type === 'pointerMove') {
            this._setPointer(messageData.payload.x, messageData.payload.y);
            return;
        }
        
        if (messageData.type === 'pointerColor') {
            this._setPointerColor(messageData.payload.color);
            return;
        }

        if (messageData.type === 'pointerClick') {
            this._toggleZoom(
                this._convertPercentToCoordinates(messageData.payload.x, window.innerWidth),
                this._convertPercentToCoordinates(messageData.payload.y, window.innerHeight)
            );
        }
    }

    _setPointer(x, y) {
        // Identifying current slide component
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

    _setPointerColor(color) {
        const currentSlide = document.getElementById('currentSlide');
        if (!currentSlide || !currentSlide.shadowRoot) {
            return;
        }

        currentSlide.shadowRoot.getElementById('pointer').style.backgroundColor = this.pointer.color = color;
    }

    _toggleZoom(mouseX, mouseY) {
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

    _convertPercentToCoordinates(percentValue, size) {
        return (percentValue.replace('%', '') * size) / 100;
    }
};

export const instance = new TouchPointerInput();
