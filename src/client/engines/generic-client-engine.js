/* eslint-disable no-unused-vars */
'use strict';

/**
 * @classdesc [client-side] 'Abstract' class that expose needed methods for engines
 * @class
 */
export class GenericEngine {
    /**
     * Init engine
     */
    init() {}

    /**
     * Switch to the given slide
     *
     * @param {*} params - Params indicating to which slide go to
     */
    goToSlide(params) {}

    /**
     * Return all the slides
     */
    getSlides() {}

    /**
     * Return current slide notes
     */
    getSlideNotes() {}

    /**
     * Move slides
     *
     * @param {number} delta - number of movements to make from$ the current slide
     */
    changeSlide(delta) {}
}
