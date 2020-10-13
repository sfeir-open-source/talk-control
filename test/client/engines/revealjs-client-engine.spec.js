'use strict';

import 'module-alias/register';
import { expect, assert } from 'chai';
import { spy, stub } from 'sinon';
import { RevealEngine } from '@client/engines/revealjs-client-engine';

describe('RevealEngineClient', function() {
    let engine;
    beforeEach(function() {
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

    afterEach(function() {
        window.addEventListener.restore();
        window.parent.postMessage.restore();
    });

    describe('constructor()', function() {
        it('should have instantiated RevealEngine', function() {
            expect(engine).to.be.ok;
        });
    });

    describe('goToSlide()', function() {
        it('should call Reveal.slide() with the given params', function() {
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
    });

    describe('getSlides()', function() {
        it('should return an array of slides', function() {
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
    });
});
