/* eslint-disable no-unused-vars */
'use strict';

/**
 * @classdesc [client-side] 'Abstract' class that expose needed methods for engines
 * @class
 */
export class GenericEngine {
    /**
     * Initialize the engine
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
    async getSlides() {}

    /**
     * Return slide notes
     */
    async getSlideNotes(slide) {}

    /**
     * Move slides
     *
     * @param {number} delta - number of movements to make from$ the current slide
     */
    changeSlide(delta) {}

    /**
     * Tell if the active element in DOM is an editable one
     */
    isActiveElementEditable() {}
}
