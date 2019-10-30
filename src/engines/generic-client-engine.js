/* eslint-disable no-unused-vars */
'use strict';

/**
 * @classdesc [client-side] 'Abstract' class that expose needed methods for engines
 * @class
 */
export class GenericEngine {
    constructor() {
        // Listen from instruction comming from remote
        window.addEventListener('message', this.receiveMessageFromRemote.bind(this), false);
    }

    /**
     * Check the integrity of the message received from window listener; then forward it
     *
     * @param {MessageEvent} message - Message received
     */
    receiveMessageFromRemote(message) {
        if (message.data.charAt(0) === '{' && message.data.charAt(message.data.length - 1) === '}') {
            message = JSON.parse(message.data);
            this.forwardMessageFromRemote(message);
        }
    }

    /**
     * Handle the message received from the window listener
     *
     * @param {MessageEvent} message - Message to handle
     */
    forwardMessageFromRemote(message) {}

    /**
     * Switch to the given slide
     *
     * @param {*} params - Params indicating to which slide go to
     */
    goToSlide(params) {}

    /**
     * Add listeners on slideshow events
     *
     */
    initEngineListener() {}

    /**
     * Returns the number of slides in the slideshow
     */
    countNbSlides() {}

    /**
     * Returns the current position in the slideshow
     */
    getPosition() {}

    /**
     * Returns the index of the current slide
     */
    getSlideNumber() {}
}
