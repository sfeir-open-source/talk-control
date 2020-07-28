'use strict';

import { GenericEngine } from './generic-client-engine.js';

/**
 * @class RevealEngine
 * @classdesc Revealjs engine implementation
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

    init() {
        this.Reveal.configure({
            controls: false,
            transition: 'default',
            transitionSpeed: 'fast',
            history: false,
            slideNumber: false,
            keyboard: true,
            touch: false,
            embedded: true
        });
    }

    /**
     *
     * @param {{h: number, v: number, f: number}} indices - position of the slide to go to
     * @param {number} delta - delta
     */
    goToSlide(indices, delta = 0) {
        let slideDelta = { ...indices };
        const slides = this.getSlides();
        const currentIndex = slides.findIndex(slide => slide.h === indices.h && slide.v === indices.v);
        if (indices.f + delta < slides[currentIndex].fMax) {
            slideDelta.f += delta;
        } else if (currentIndex + delta < slides.length - 1) {
            slideDelta = slides[currentIndex + delta];
        } else {
            slideDelta = slides[slides.length - 1];
        }
        this.Reveal.slide(slideDelta.h, slideDelta.v, slideDelta.f);
    }

    /**
     * @returns {Array<{h: number, v: number, f: number, fMax: number}>} List on slides
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
                    slides.push({ h: indexH, v: indexV, f: -1, fMax: fragmentsV.length || -1 });
                });
            } else {
                slides.push({ h: indexH, v: 0, f: -1, fMax: fragmentsH.length || -1 });
            }
        });
        return slides;
    }

    getSlideNotes() {
        return this.Reveal.getSlideNotes();
    }
}
