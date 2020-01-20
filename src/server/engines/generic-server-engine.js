/* eslint-disable no-unused-vars */

/**
 * @classdesc [server-side] 'Abstract' class that expose needed methods for engines
 * @class GenericEngine
 */
export class GenericEngine {
    /**
     * Initialize the engine
     *
     * @param {*} params - Needed params to initialize the engine
     */
    init(params) {}

    /**
     * Dispatch correct actions depending on the key pressed
     *
     * @param {{key: string}} event - Key pressed
     */
    handleInput({ key }) {}

    /**
     * Tell if two slides are equal
     */
    slideEquals() {}
}
