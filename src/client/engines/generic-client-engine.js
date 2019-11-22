'use strict';

/**
 * @classdesc [client-side] 'Abstract' class that expose needed methods for engines
 * @class
 */
export class GenericEngine {
    /**
     * Switch to the given slide
     *
     * @param {*} params - Params indicating to which slide go to
     */
    // eslint-disable-next-line no-unused-vars
    goToSlide(params) {}

    /**
     * Return all the slides
     */
    getSlides() {}

    /**
     * Return current slide notes
     */
    getSlideNotes() {}
}
