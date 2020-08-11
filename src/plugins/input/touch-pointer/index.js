class TouchPointerInput {
    constructor() {
        this.usedByAComponent = true;
        this.type = 'touchPointerEvent';
        this.callbacks = [];
        this.shadowRoot;
        this.zooming = false;
        this.pointer = { x: 0, y: 0, color: '#FF0000' };
    }

    onEvent(callback) {
        this.callbacks.push(callback);
    }

    init(shadowRoot) {
        if (!shadowRoot) {
            return;
        }

        this.shadowRoot = shadowRoot;
        this._addCSS();
        this._addHTML();

        addEventListener('message', message => this._onMessageEvent(message));
    }

    _addCSS() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            #pointer {
                position: absolute;
                left: 0px;
                top: 0px;
                width: 12px;
                height: 12px;
                border-radius: 6px;
                background-color: #FF0000
            }
            .zoomable {
                width: 100%;
                height: 100%;
                transition-duration: 0.8s;
                cursor: zoom-in;
            }`;

        this.shadowRoot.appendChild(style);
    }

    _addHTML() {
        if (this.shadowRoot.getElementById('slideViewFrame')) {
            this.shadowRoot.getElementById('slideViewFrame').classList.add('zoomable');
        }

        if (this.shadowRoot.getElementById('slideViewSection')) {
            const divPointer = document.createElement('div');
            divPointer.id = 'pointer';
            this.shadowRoot.getElementById('slideViewSection').append(divPointer);
        }
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
        this.shadowRoot.getElementById('pointer').style.left = this.pointer.x = x;
        this.shadowRoot.getElementById('pointer').style.top = this.pointer.y = y;
    }

    _setPointerColor(color) {
        this.shadowRoot.getElementById('pointer').style.backgroundColor = this.pointer.color = color;
    }

    _toggleZoom(mouseX, mouseY) {
        const element = this.shadowRoot.getElementById('slideViewFrame');

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
