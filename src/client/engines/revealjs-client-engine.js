'use strict';

import { GenericEngine } from './generic-client-engine.js';

/*
 * **************************************
 * --------PRIVATE METHODS---------------
 * **************************************
 */

/**
 * Send speaker notes to the 'callbackEngine attribute'
 */
function _revealCallback() {
    // We get the curent slide
    let slideElement = this.Reveal.getCurrentSlide();

    // We get the notes and init the indexs
    let notes = slideElement.querySelector('aside.notes');

    // We prepare the message data to send through websocket
    const messageData = {
        notes: notes ? notes.innerHTML : '',
        markdown: notes ? typeof notes.getAttribute('data-markdown') === 'string' : false
    };

    this.callbackEngine({
        notes: notes,
        data: messageData
    });

    if (window.top != window.self) {
        _updateIndicesForRemote.apply(this);
    }
}

/**
 * Emit the current slide infos via postMessage
 */
function _updateIndicesForRemote() {
    window.parent.postMessage(
        JSON.stringify({
            type: 'changeSlides',
            indices: this.getPosition(),
            currentSlideNumber: this.getSlideNumber()
        }),
        '*'
    );
}

/**
 * @classdesc
 * @class
 * @augments GenericEngine
 */
export class RevealEngine extends GenericEngine {
    constructor() {
        super();
        this.callbackEngine = null;
        this.nbSlides = 0;
        this.mapPosition = {};
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
            case 'instruction':
                switch (message.data) {
                    case 'next':
                        this.Reveal.next();
                        break;
                    case 'up':
                        this.Reveal.up();
                        break;
                    case 'left':
                        this.Reveal.left();
                        break;
                    case 'down':
                        this.Reveal.down();
                        break;
                    case 'right':
                        this.Reveal.right();
                        break;
                    case 'first':
                        this.Reveal.slide(0, 0, 0);
                        break;
                }
                break;
        }
    }

    /**
     * @returns {{h: number, v: number, f: number}} Indices of the current slide
     */
    getPosition() {
        return this.Reveal.getIndices();
    }

    /**
     * @returns {number} Current slide index
     */
    getSlideNumber() {
        const indices = this.getPosition();
        return this.mapPosition[`${indices.h}-${indices.v}`];
    }

    /**
     *
     * @param {{h: number, v: number, f?: number}} index - position of the slide to go to
     */
    goToSlide(index) {
        this.Reveal.slide(index.h, index.v, index.f || 0);
    }

    /**
     *
     * @param {*} callback - Function to be called each time the current slide changed
     */
    initEngineListener(callback) {
        this.callbackEngine = callback;
        this.Reveal.addEventListener('slidechanged', _revealCallback.bind(this));
        if (window.top != window.self) {
            this.Reveal.addEventListener('fragmentshown', _updateIndicesForRemote.bind(this));
            this.Reveal.addEventListener('fragmenthidden', _updateIndicesForRemote.bind(this));
        }
    }

    /**
     * @returns {{nbSlides: number, map: {}}} Total number of slides and a map representation of the slideshow
     */
    countNbSlides() {
        this.nbSlides = 0;
        this.mapPosition = {};

        // Method take from revealJS lib and rearange

        const HORIZONTAL_SLIDES_SELECTOR = '.reveal .slides>section';

        const horizontalSlides = Array.prototype.slice.call(document.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR));

        // Step through all slides and count the past ones
        for (let i = 0; i < horizontalSlides.length; i++) {
            const horizontalSlide = horizontalSlides[i];
            const verticalSlides = Array.prototype.slice.call(horizontalSlide.querySelectorAll('section'));
            if (verticalSlides.length > 0) {
                for (let j = 0; j < verticalSlides.length; j++) {
                    this.mapPosition[i + '-' + j] = this.nbSlides + j + 1;
                }
            } else {
                this.mapPosition[i + '-0'] = this.nbSlides + 1;
            }
            this.nbSlides += verticalSlides.length > 0 ? verticalSlides.length : 1;
        }

        return {
            nbSlides: this.nbSlides,
            map: this.mapPosition
        };
    }
}
