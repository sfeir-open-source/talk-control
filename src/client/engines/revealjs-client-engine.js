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
     * @param {{h: number, v: number, f?: number}} indices - position of the slide to go to
     * @param {number} delta - delta
     */
    goToSlide(indices, delta = 0) {
        let slideDelta = { ...indices };
        const slides = this.getSlides();
        const currentIndex = slides.findIndex(slide => slide.h === indices.h && slide.v === indices.v);
        if (indices.f < slides[currentIndex].fMax) {
            slideDelta.f += delta;
        } else if (currentIndex + delta < slides.length - 1) {
            slideDelta = slides[currentIndex + delta];
        } else {
            slideDelta = slides[slides.length - 1];
        }
        this.Reveal.slide(slideDelta.h, slideDelta.v, slideDelta.f || 0);
    }

    /**
     * @returns {{h: number, v: number, f: number, fMax: number}[]} List on slides
     */
    getSlides() {
        const slides = [];
        const horizontalSlides = document.querySelectorAll('.slides>section');
        horizontalSlides.forEach((slideH, indexH) => {
            const fragmentsH = slideH.querySelectorAll('.fragment');
            const verticalSlides = slideH.querySelectorAll('section');
            if (verticalSlides.length) {
                verticalSlides.forEach((slideV, indexV) => {
                    const fragmentsV = slideV.querySelectorAll('.fragment');
                    slides.push({ h: indexH, v: indexV, f: 0, fMax: fragmentsV.length ? fragmentsV.length + 1 : 0 });
                });
            } else {
                slides.push({ h: indexH, v: 0, f: 0, fMax: fragmentsH.length ? fragmentsH.length + 1 : 0 });
            }
        });
        return slides;
    }
}
