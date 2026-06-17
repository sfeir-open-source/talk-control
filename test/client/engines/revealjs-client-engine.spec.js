'use strict';

import 'module-alias/register';
import { expect, assert } from 'chai';
import { spy, stub } from 'sinon';
import { RevealEngine } from '@client/engines/revealjs-client-engine';

describe('RevealEngineClient', function () {
    let engine;

    beforeEach(function () {
        window.Reveal = {
            getCurrentSlide: stub(),
            configure: spy(),
            next: spy(),
            up: spy(),
            down: spy(),
            left: spy(),
            right: spy(),
            slide: spy(),
            getIndices: stub(),
            addEventListener: spy(),
            getSlides: stub()
        };
        stub(window, 'addEventListener');
        stub(window.parent, 'postMessage');

        engine = new RevealEngine();
    });

    afterEach(function () {
        window.addEventListener.restore();
        window.parent.postMessage.restore();
    });

    describe('constructor()', function () {
        it('should have instantiated RevealEngine', function () {
            expect(engine).to.be.ok;
        });
    });

    describe('goToSlide()', function () {
        it('should call Reveal.slide() with the given params', function () {
            // Given
            stub(engine, 'getSlides').returns([
                { h: 1, v: 1, f: -1, fMax: -1 },
                { h: 1, v: 2, f: -1, fMax: 4 }
            ]);
            // When
            engine.goToSlide({ h: 1, v: 2, f: 3 });
            // Then
            assert(window.Reveal.slide.calledOnceWith(1, 2, 3));
        });

        it('should go to next slide when fragment index exceeds fMax and next slide exists', function () {
            // Given
            const slides = [
                { h: 0, v: 0, f: -1, fMax: 1 },
                { h: 1, v: 0, f: -1, fMax: 2 },
                { h: 2, v: 0, f: -1, fMax: 0 }
            ];
            stub(engine, 'getSlides').returns(slides);
            // When - currentIndex=0, delta=1, f+delta=0 which is not < fMax=1, currentIndex+delta=1 < 2 (slides.length-1)
            engine.goToSlide({ h: 0, v: 0, f: 0 }, 1);
            // Then - should move to slides[1]
            assert(window.Reveal.slide.calledOnceWith(1, 0, -1));
        });

        it('should go to last slide when at end and fragment exceeds fMax', function () {
            // Given
            const slides = [
                { h: 0, v: 0, f: -1, fMax: 1 },
                { h: 1, v: 0, f: -1, fMax: 1 }
            ];
            stub(engine, 'getSlides').returns(slides);
            // When - currentIndex=1 (last), delta=1, f+delta=1 >= fMax=1, currentIndex+delta=2 is NOT < slides.length-1=1
            engine.goToSlide({ h: 1, v: 0, f: 0 }, 1);
            // Then - should use last slide
            assert(window.Reveal.slide.calledOnceWith(1, 0, -1));
        });
    });

    describe('getSlides()', function () {
        it('should return an array of slides', function () {
            // Given
            const querySelectorAll = stub().returns([]);
            stub(document, 'querySelectorAll').returns([{ querySelectorAll }, { querySelectorAll }, { querySelectorAll }]);
            // When
            const slides = engine.getSlides();
            // Then
            expect(slides.length).to.equals(3);
            expect(slides[0]).to.eqls({ h: 0, v: 0, f: -1, fMax: -1 });
            document.querySelectorAll.restore();
        });

        it('should handle vertical slides', function () {
            // Given
            const fragmentsForVertical = stub().returns([{}, {}]); // 2 fragments in vertical slide
            const verticalSlide1 = { querySelectorAll: fragmentsForVertical };
            const verticalSlide2 = { querySelectorAll: stub().returns([]) };
            const verticalSlides = [verticalSlide1, verticalSlide2];
            const horizontalSlideWithVerticals = {
                querySelectorAll: event => {
                    if (event === 'section') return verticalSlides;
                    return []; // fragments on the h slide itself
                }
            };
            const horizontalSlideWithoutVerticals = {
                querySelectorAll: event => {
                    if (event === 'section') return [];
                    return [{}, {}]; // 2 fragments at h level
                }
            };
            stub(document, 'querySelectorAll').returns([horizontalSlideWithVerticals, horizontalSlideWithoutVerticals]);
            // When
            const slides = engine.getSlides();
            // Then
            expect(slides.length).to.equals(3); // 2 vertical + 1 horizontal
            expect(slides[0]).to.eqls({ h: 0, v: 0, f: -1, fMax: 2 }); // vertical with 2 fragments
            expect(slides[1]).to.eqls({ h: 0, v: 1, f: -1, fMax: -1 }); // vertical with 0 fragments -> -1
            expect(slides[2]).to.eqls({ h: 1, v: 0, f: -1, fMax: 2 }); // horizontal with 2 fragments
            document.querySelectorAll.restore();
        });
    });
});
