'use strict';

import 'module-alias/register';
import { expect, assert } from 'chai';
import { spy, stub } from 'sinon';
import { RevealEngine } from '@client/engines/revealjs-client-engine';

describe('RevealEngine', function() {
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
            addEventListener: spy()
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

    describe('forwardMessageFromRemote()', function() {
        it('should initialise Reveal', function() {
            // Given
            const message = {
                type: 'init',
                data: null
            };
            // When
            engine.forwardMessageFromRemote(message);
            // Then
            expect(window.Reveal.configure.calledOnce);
        });

        it('should call Reveal.next()', function() {
            // Given
            const message = {
                type: 'instruction',
                data: 'next'
            };
            // When
            engine.forwardMessageFromRemote(message);
            // Then
            expect(window.Reveal.next.calledOnce);
        });

        it('should call Reveal.up()', function() {
            // Given
            const message = {
                type: 'instruction',
                data: 'up'
            };
            // When
            engine.forwardMessageFromRemote(message);
            // Then
            expect(window.Reveal.up.calledOnce);
        });

        it('should call Reveal.left()', function() {
            // Given
            const message = {
                type: 'instruction',
                data: 'left'
            };
            // When
            engine.forwardMessageFromRemote(message);
            // Then
            expect(window.Reveal.left.calledOnce);
        });

        it('should call Reveal.down()', function() {
            // Given
            const message = {
                type: 'instruction',
                data: 'down'
            };
            // When
            engine.forwardMessageFromRemote(message);
            // Then
            expect(window.Reveal.down.calledOnce);
        });

        it('should call Reveal.right()', function() {
            // Given
            const message = {
                type: 'instruction',
                data: 'right'
            };
            // When
            engine.forwardMessageFromRemote(message);
            // Then
            expect(window.Reveal.right.calledOnce);
        });

        it('should call Reveal.slide()', function() {
            // Given
            const message = {
                type: 'instruction',
                data: 'first'
            };
            // When
            engine.forwardMessageFromRemote(message);
            // Then
            expect(window.Reveal.slide.calledOnceWith(0, 0, 0));
        });
    });

    describe('getPosition()', function() {
        it('should return {h: 4, v: 6, f: 0}', function() {
            // Given
            const indices = { h: 4, v: 6, f: 0 };
            window.Reveal.getIndices.returns(indices);
            // Then
            expect(engine.getPosition()).to.be.equals(indices);
        });
    });

    describe('getSlideNumber()', function() {
        it('should return the correct number', function() {
            // Given
            stub(engine, 'getPosition').returns({ h: 1, v: 4, f: 0 });
            engine.mapPosition = {
                '1-4': 6
            };
            // Then
            expect(engine.getSlideNumber()).to.be.equals(6);
        });
    });

    describe('goToSlide()', function() {
        it('should call Reveal.slide() with the given params', function() {
            // When
            engine.goToSlide({ h: 1, v: 2, f: 3 });
            // Then
            assert(window.Reveal.slide.calledOnceWith(1, 2, 3));
        });
    });

    describe('initEngineListener()', function() {
        it('should have set listeners on Reveal', function() {
            // Given
            const callback = spy();
            stub(window, 'top').get(() => 15);
            stub(window, 'self').get(() => 10);
            // When
            engine.initEngineListener(callback);
            // Then
            assert(window.Reveal.addEventListener.calledWith('slidechanged'));
            assert(window.Reveal.addEventListener.calledWith('fragmentshown'));
            assert(window.Reveal.addEventListener.calledWith('fragmenthidden'));
            assert(engine.callbackEngine === callback);
        });
    });

    describe('countNbSlides', function() {
        it('should have the correct nubmer of slides', function() {
            // Given
            stub(document, 'querySelectorAll').returns([
                { querySelectorAll: stub().returns([null, null, null, null]) },
                { querySelectorAll: stub().returns([null, null, null, null]) },
                { querySelectorAll: stub().returns([null, null, null, null]) },
                { querySelectorAll: stub().returns([null, null, null, null]) },
                { querySelectorAll: stub().returns([]) }
            ]);
            // When
            engine.countNbSlides();
            // Then
            expect(engine.nbSlides).to.be.equals(17);
            expect(engine.mapPosition).to.be.an('object');
            expect(engine.mapPosition['0-0']).to.be.equals(1);
            expect(engine.mapPosition['4-1']).to.be.undefined;

            document.querySelectorAll.restore();
        });
    });
});
