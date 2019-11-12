'use strict';

import { GenericEngine } from './generic-client-engine.js';

/**
 * @classdesc
 * @class
 * @augments GenericEngine
 */
export class RevealEngine extends GenericEngine {
    constructor() {
        super();
        this.callbackEngine = null;
        this.Reveal = window.Reveal;
    }

    /*
     * **************************************
     * --------EXPOSED METHODS----------------
     * **************************************
     */

    /**
     * Handle the message received from the window listener
     *
     * @param {{type: string, data: string}} message - Message to handle
     */
    forwardMessageFromRemote(message) {
        switch (message.type) {
            case 'init':
                this.Reveal.configure({
                    controls: false,
                    transition: 'default',
                    transitionSpeed: 'fast',
                    history: false,
                    slideNumber: false,
                    keyboard: false,
                    touch: false,
                    embedded: true
                });
                break;
            case 'changeSlide':
                this.goToSlide(message.data);
                break;
        }
    }

    /**
     *
     * @param {{h: number, v: number, f?: number}} index - position of the slide to go to
     */
    goToSlide(index) {
        this.Reveal.slide(index.h, index.v, index.f || 0);
    }

    /**
     * @returns {{h: number, v: number, f: number, fMax: number}[]} List on slides
     */
    getSlides() {
        return this.Reveal.getSlides().map(slide => {
            const fragments = slide.querySelectorAll('.fragment');
            return { h: slide.dataset.indexH, v: slide.dataset.indexV, f: 0, fMax: fragments.length ? fragments.length + 1 : 0 };
        });
    }
}
