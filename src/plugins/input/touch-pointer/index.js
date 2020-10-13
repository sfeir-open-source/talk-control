'use strict';

import { Plugin } from '@plugins/plugin.js';

class TouchPointerInput extends Plugin {
    constructor() {
        super();
        this.type = 'touchPointerEvent';
        this.zooming = false;
        this.pointer = { x: 0, y: 0, color: '#FF0000' };
        this.interval;
        this.messageEventRegistered = false;
    }

    init() {
        this._addSettingsArea();
        this._addMaskArea();
        this._addPointer();

        if (!this.messageEventRegistered) {
            addEventListener('message', message => this._onMessageEvent(message));
            this.messageEventRegistered = true;
        }
        this.initialized = true;
    }

    unload() {
        this._removeSettingsArea();
        this._removeMaskArea();
        this._removePointer();
        this.initialized = false;
    }

    _addPointer() {
        // Identifying current slide component
        const currentSlide = document.getElementById('currentSlide');
        if (!currentSlide || !currentSlide.shadowRoot) {
            return;
        }

        // HTML
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
            divPointer.style.left = 0;
            divPointer.style.top = 0;
            divPointer.style.width = '12px';
            divPointer.style.height = '12px';
            divPointer.style.borderRadius = '6px';
            divPointer.style.backgroundColor = '#FF0000';
            divPointer.style.visibility = 'hidden';

            slideViewSection.append(divPointer);
        }
    }

    _removePointer() {
        // Identifying current slide component
        const currentSlide = document.getElementById('currentSlide');
        if (!currentSlide || !currentSlide.shadowRoot) {
            console.log('no current slide nor shadowroot');
            return;
        }

        // HTML
        const slideViewSection = currentSlide.shadowRoot.getElementById('slideViewSection');
        if (slideViewSection) {
            const pointer = currentSlide.shadowRoot.getElementById('pointer');
            if (pointer) {
                pointer.remove();
            }
        }
    }

    _addArea(tag, placeholderId) {
        const placeholder = document.getElementById(placeholderId);

        if (placeholder) {
            placeholder.innerHTML = tag;
            placeholder.style.display = 'block';
        }
    }

    _removeArea(placeholderId) {
        const placeholder = document.getElementById(placeholderId);

        if (placeholder) {
            placeholder.innerHTML = '';
            placeholder.style.display = 'none';
        }
    }

    _addSettingsArea() {
        this._addArea('<tc-touch-pointer-settings></tc-touch-pointer-settings>', 'placeholder1');
    }

    _removeSettingsArea() {
        this._removeArea('placeholder1');
    }

    _addMaskArea() {
        this._addArea('<tc-touch-pointer-mask></tc-touch-pointer-mask>', 'placeholder2');
    }

    _removeMaskArea() {
        this._removeArea('placeholder2');
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
}

export const instance = new TouchPointerInput();
