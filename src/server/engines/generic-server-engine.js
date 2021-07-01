import { createTcStore } from '@server/store';
/* eslint-disable no-unused-vars */

/**
 * @classdesc [server-side] 'Abstract' class that expose needed methods for engines
 * @class GenericEngine
 */
export class GenericEngine {
    constructor() {
        this.store = createTcStore();
    }

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
     * Dispatch correct actions depending on the touch direction
     *
     * @param {{direction: string}} event - Touch direction
     */
    handleTouch({ direction }) {}

    /**
     * Tell if two slides are equal
     */
    slideEquals() {}
}
