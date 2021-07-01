import { init, gotoSlide } from '../store/actions';
import { GenericEngine } from './generic-server-engine';

/**
 * @classdesc
 * @class RevealEngine
 * @augments GenericEngine
 */
export class RevealEngine extends GenericEngine {
    /**
     * Initialize the engine
     *
     * @param {*} params - Needed params to initialize the engine
     */
    init(params) {
        this.store.dispatch(init({ ...params, currentSlide: { h: 0, v: 0, f: -1 } }));
    }

    /**
     * @param {{key: string}} event - Key pressed
     */
    handleInput({ key }) {
        const { currentSlide, slides } = this.store.getState();
        const currentSlideIndex = slides.findIndex(s => this.slideEquals(s, currentSlide, false));
        const { fMax } = slides[currentSlideIndex];
        const nextVerticalSlide = slides.find(slide => currentSlide.h === slide.h && slide.v === currentSlide.v + 1);
        const nextHorizontalSlide = slides.find(slide => currentSlide.h + 1 === slide.h);
        const prevVerticalSlide = slides.find(slide => currentSlide.h === slide.h && slide.v === currentSlide.v - 1);
        const prevHorizontalSlide = slides.find(slide => currentSlide.h - 1 === slide.h);

        switch (key) {
            case 'arrowRight':
                if (currentSlide.f < fMax - 1) this._nextFragment(currentSlide);
                else if (nextHorizontalSlide) this._nextHorizontalSlide(currentSlide);
                break;
            case 'arrowLeft':
                if (currentSlide.f > -1) this._prevFragment(currentSlide);
                else if (prevHorizontalSlide) this._prevSlide(prevHorizontalSlide);
                break;
            case 'arrowUp':
                if (currentSlide.f > -1) this._prevFragment(currentSlide);
                else if (prevVerticalSlide) this._prevSlide(prevVerticalSlide);
                break;
            case 'arrowDown':
                if (currentSlide.f < fMax - 1) this._nextFragment(currentSlide);
                else if (nextVerticalSlide) this._nextVerticalSlide(currentSlide);
                break;
            case 'pageUp':
                if (currentSlide.f > -1) this._prevFragment(currentSlide);
                else if (prevVerticalSlide) this._prevSlide(prevVerticalSlide);
                else if (prevHorizontalSlide) this._prevSlide(prevHorizontalSlide);
                break;
            case 'pageDown':
            case 'space':
                if (currentSlide.f < fMax - 1) this._nextFragment(currentSlide);
                else if (nextVerticalSlide) this._nextVerticalSlide(currentSlide);
                else if (nextHorizontalSlide) this._nextHorizontalSlide(currentSlide);
                break;
        }
    }

    /**
     * @param {{direction: string}} event - Touch direction
     */
    handleTouch({ direction }) {
        const { currentSlide, slides } = this.store.getState();
        const currentSlideIndex = slides.findIndex(s => this.slideEquals(s, currentSlide, false));
        const { fMax } = slides[currentSlideIndex];
        const nextVerticalSlide = slides.find(slide => currentSlide.h === slide.h && slide.v === currentSlide.v + 1);
        const nextHorizontalSlide = slides.find(slide => currentSlide.h + 1 === slide.h);
        const prevVerticalSlide = slides.find(slide => currentSlide.h === slide.h && slide.v === currentSlide.v - 1);
        const prevHorizontalSlide = slides.find(slide => currentSlide.h - 1 === slide.h);

        switch (direction) {
            case 'left':
                if (currentSlide.f < fMax - 1) this._nextFragment(currentSlide);
                else if (nextHorizontalSlide) this._nextHorizontalSlide(currentSlide);
                break;
            case 'right':
                if (currentSlide.f > -1) this._prevFragment(currentSlide);
                else if (prevHorizontalSlide) this._prevSlide(prevHorizontalSlide);
                break;
            case 'up':
                if (currentSlide.f < fMax - 1) this._nextFragment(currentSlide);
                else if (nextVerticalSlide) this._nextVerticalSlide(currentSlide);
                break;
            case 'down':
                if (currentSlide.f > -1) this._prevFragment(currentSlide);
                else if (prevVerticalSlide) this._prevSlide(prevVerticalSlide);
                break;
            case 'none':
                if (currentSlide.f < fMax - 1) this._nextFragment(currentSlide);
                else if (nextVerticalSlide) this._nextVerticalSlide(currentSlide);
                else if (nextHorizontalSlide) this._nextHorizontalSlide(currentSlide);
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

    _nextHorizontalSlide({ h }) {
        this._gotoSlide({ h: h + 1, v: 0, f: -1 });
    }

    _nextVerticalSlide({ h, v }) {
        this._gotoSlide({ h, v: v + 1, f: -1 });
    }

    _prevSlide({ h, v, fMax }) {
        this._gotoSlide({ h, v, f: fMax > 0 ? fMax - 1 : fMax });
    }

    _nextFragment({ h, v, f }) {
        this._gotoSlide({ h, v, f: f + 1 });
    }

    _prevFragment({ h, v, f }) {
        this._gotoSlide({ h, v, f: f - 1 });
    }

    _gotoSlide(slide) {
        this.store.dispatch(gotoSlide(slide));
    }
}
