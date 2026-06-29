import { init, gotoSlide } from '../store/actions';
import { Slide } from '../store/index';
import { GenericEngine } from './generic-server-engine';

export class RevealEngine extends GenericEngine {
    override init(params: unknown): void {
        this.store.dispatch(init({ ...(params as object), currentSlide: { h: 0, v: 0, f: -1 } }));
    }

    override handleInput({ key }: { key: string }): void {
        const { slides } = this.store.getState();
        const currentSlide = this.store.getState().currentSlide as Slide;
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

    override handleTouch({ direction }: { direction: string }): void {
        const { slides } = this.store.getState();
        const currentSlide = this.store.getState().currentSlide as Slide;
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

    override slideEquals(slide1: Slide, slide2: Slide, includeFragment = true): boolean {
        return slide1.h === slide2.h && slide1.v === slide2.v && (!includeFragment || slide1.f === slide2.f);
    }

    _nextHorizontalSlide({ h }: Slide): void {
        this._gotoSlide({ h: h + 1, v: 0, f: -1 });
    }

    _nextVerticalSlide({ h, v }: Slide): void {
        this._gotoSlide({ h, v: v + 1, f: -1 });
    }

    _prevSlide({ h, v, fMax }: Slide): void {
        this._gotoSlide({ h, v, f: fMax > 0 ? fMax - 1 : fMax });
    }

    _nextFragment({ h, v, f }: Slide): void {
        this._gotoSlide({ h, v, f: f + 1 });
    }

    _prevFragment({ h, v, f }: Slide): void {
        this._gotoSlide({ h, v, f: f - 1 });
    }

    _gotoSlide(slide: Partial<Slide>): void {
        this.store.dispatch(gotoSlide(slide));
    }
}
