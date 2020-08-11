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
        console.log('Listen to message in touch pointer plugin', shadowRoot);
        addEventListener('message', message => {
            if (!message || !message.data) {
                return;
            }

            if (typeof message.data !== 'object' || !message.data.data || typeof message.data.data !== 'object') {
                return;
            }

            if (message.data.type === 'pluginEventIn') {
                return;
            }

            const messageData = message.data.data;

            switch (messageData.type) {
                case 'pointerMove':
                    this._setPointer(messageData.payload.x, messageData.payload.y);
                    break;
                case 'pointerColor':
                    console.log("TouchPointerInput -> init -> pointerColor", message.data)
                    this._setPointerColor(messageData.payload.color);
                    break;
                case 'pointerClick':
                    console.log("TouchPointerInput -> init -> pointerClick", message.data)
                    this._toggleZoom(
                        this._convertPercentToCoordinates(messageData.payload.x, window.innerWidth),
                        this._convertPercentToCoordinates(messageData.payload.y, window.innerHeight)
                    );
                    break;
            }
        });
    }

    _setPointer(x, y) {
        this.shadowRoot.getElementById('pointer').style.left = this.pointer.x = x;
        this.shadowRoot.getElementById('pointer').style.top = this.pointer.y = y;
    }

    _setPointerColor(color) {
        this.shadowRoot.getElementById('pointer').style.backgroundColor = this.pointer.color = color;
    }

    _toggleZoom(mouseX, mouseY) {
        const element = this.shadowRoot.getElementById('zoomableElement');


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
