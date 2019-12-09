import store from '../store';
import { init, gotoSlide } from '../store/actions';
import { GenericEngine } from './generic-server-engine';

/**
 * @classdesc
 * @class
 * @augments GenericEngine
 */
export class SpectacleEngine extends GenericEngine {
    constructor() {
        super();
        // Binding this because they might be given as callback for some events
        this.handleInput = this.handleInput.bind(this);
        this.init = this.init.bind(this);
    }

    /**
     * Initialize the engine
     *
     * @param {*} params - Needed params to initialize the engine
     */
    init(params) {
        console.log('init', params);
        store.dispatch(init({ ...params, currentSlide: 0 }));
    }

    /**
     * @param {{key: string}} event - Key pressed
     */
    handleInput({ key }) {
        const { currentSlide, slideNumber } = store.getState();
        console.log('handle', key, currentSlide, slideNumber);
        switch (key) {
            case 'arrowRight':
                if (currentSlide < slideNumber) this._nextSlide(currentSlide);
                break;
            case 'arrowLeft':
                if (currentSlide > 0) this._prevSlide(currentSlide);
                break;
            case 'space':
                if (currentSlide < slideNumber) this._nextSlide(currentSlide);
                break;
        }
    }

    /**
     * Tell if two slides are equal
     *
     * @param {number} slide1 -
     * @param {number} slide2 -
     * @returns {boolean} True if the slides are equal
     */
    slideEquals(slide1, slide2) {
        return slide1 === slide2;
    }

    /*
     * **************************************
     * ------- DISPATCHING METHODS ----------
     * **************************************
     */

    _nextSlide(current) {
        store.dispatch(gotoSlide(current + 1));
    }

    _prevSlide(current) {
        store.dispatch(gotoSlide(current - 1));
    }
}
