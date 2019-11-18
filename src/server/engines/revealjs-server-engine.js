import store from '../store';
import { init, gotoSlide } from '../store/actions';
import { GenericEngine } from './generic-server-engine';

/**
 * @classdesc
 * @class
 * @augments GenericEngine
 */
export class RevealEngine extends GenericEngine {
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
        store.dispatch(init({ ...params, currentSlide: { h: 0, v: 0, f: 0 } }));
    }

    /**
     * @param {{key: string}} event - Key pressed
     */
    handleInput({ key }) {
        const { currentSlide, slides } = store.getState();
        const currentSlideIndex = slides.findIndex(s => this.slideEquals(s, currentSlide, false));
        const { fMax } = slides[currentSlideIndex];
        const nextVerticalSlide = slides.find(slide => currentSlide.h === slide.h && slide.v === currentSlide.v + 1);
        const nextHorizontalSlide = slides.find(slide => currentSlide.h + 1 === slide.h);
        switch (key) {
            case 'arrowRight':
                if (currentSlide.f < fMax) this._nextFragment(currentSlide);
                else if (nextHorizontalSlide) this._nextHorizontalSlide(currentSlide);
                break;
            case 'arrowLeft':
                if (currentSlide.f > 0) this._prevFragment(currentSlide);
                else if (currentSlideIndex) this._prevHorizontalSlide(currentSlide);
                break;
            case 'arrowUp':
                if (currentSlide.f > 0) this._prevFragment(currentSlide);
                else if (currentSlide.v > 0) this._prevVerticalSlide(currentSlide);
                break;
            case 'arrowDown':
                if (currentSlide.f < fMax) this._nextFragment(currentSlide);
                else if (nextVerticalSlide) this._nextVerticalSlide(currentSlide);
                break;
            case 'space':
                if (currentSlide.f < fMax) this._nextFragment(currentSlide);
                else if (nextVerticalSlide) this._nextVerticalSlide(currentSlide);
                else this._nextHorizontalSlide(currentSlide);
                break;
        }
    }

    /**
     * Tell if two slides are equal
     *
     * @param {{h: number, v: number, f: number}} slide1 -
     * @param {{h: number, v: number, f: number}} slide2 -
     * @param {boolean} includeFragment - Include fragments in the equality test
     * @returns {boolean} True if the slides are equal
     */
    slideEquals(slide1, slide2, includeFragment = true) {
        return slide1.h === slide2.h && slide1.v === slide2.v && (!includeFragment || slide1.f === slide2.f);
    }

    /*
     * **************************************
     * ------- DISPATCHING METHODS ----------
     * **************************************
     */

    _nextHorizontalSlide({ h, v }) {
        store.dispatch(gotoSlide({ h: h + 1, v }));
    }

    _nextVerticalSlide({ h, v }) {
        store.dispatch(gotoSlide({ h, v: v + 1 }));
    }

    _prevHorizontalSlide({ h, v }) {
        store.dispatch(gotoSlide({ h: h - 1, v }));
    }

    _prevVerticalSlide({ h, v }) {
        store.dispatch(gotoSlide({ h, v: v - 1 }));
    }

    _nextFragment({ h, v, f }) {
        store.dispatch(gotoSlide({ h, v, f: f + 1 }));
    }

    _prevFragment({ h, v, f }) {
        store.dispatch(gotoSlide({ h, v, f: f - 1 }));
    }
}
