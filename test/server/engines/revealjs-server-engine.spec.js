import { RevealEngine } from '@server/engines/revealjs-server-engine';
import { expect, assert } from 'chai';
import { stub } from 'sinon';

describe('RevealServerEngine', function() {
    const slides = [
        { h: 0, v: 0, f: -1, fMax: 3 },
        { h: 1, v: 0, f: -1, fMax: 2 },
        { h: 1, v: 1, f: -1, fMax: 2 }
    ];
    let engine, store;
    beforeEach(function() {
        engine = new RevealEngine();
        store = engine.store;
    });

    describe('constructor()', function() {
        it('should have instantiated TCServer', function() {
            expect(engine).to.be.ok;
        });
    });
    describe('init()', function() {
        it('should dispatch event', function() {
            // Given
            stub(store, 'dispatch');
            // When
            engine.init({ slides });
            // Then
            assert(store.dispatch.calledOnce);
            store.dispatch.restore();
        });
    });

    describe('handleInput()', function() {
        it('should do nothing', function() {
            // Given
            const currentSlide = { h: 0, v: 0, f: -1 };
            stub(store, 'dispatch');
            stub(store, 'getState').returns({ currentSlide, slides });
            // When
            engine.handleInput({});
            // Then
            assert(store.dispatch.notCalled);
            store.getState.restore();
            store.dispatch.restore();
        });

        it('should call _nextFragment() on "arrowRight"', function() {
            // Given
            const currentSlide = { h: 0, v: 0, f: -1 };
            stub(engine, '_nextFragment');
            stub(store, 'getState').returns({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'arrowRight' });
            // Then
            assert(engine._nextFragment.calledOnceWith());
            store.getState.restore();
            engine._nextFragment.restore(currentSlide);
        });

        it('should call _nextHorizontalSlide() on "arrowRight"', function() {
            // Given
            const currentSlide = { h: 0, v: 0, f: 2 };
            stub(engine, '_nextHorizontalSlide');
            stub(store, 'getState').returns({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'arrowRight' });
            // Then
            assert(engine._nextHorizontalSlide.calledOnceWith(currentSlide));
            store.getState.restore();
            engine._nextHorizontalSlide.restore();
        });

        it('should call _prevFragment() on "arrowLeft"', function() {
            // Given
            const currentSlide = { h: 0, v: 0, f: 2 };
            stub(engine, '_prevFragment');
            stub(store, 'getState').returns({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'arrowLeft' });
            // Then
            assert(engine._prevFragment.calledOnceWith(currentSlide));
            store.getState.restore();
            engine._prevFragment.restore();
        });

        it('should call _prevSlide() on "arrowLeft"', function() {
            // Given
            const currentSlide = { h: 1, v: 0, f: -1 };
            stub(engine, '_prevSlide');
            stub(store, 'getState').returns({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'arrowLeft' });
            // Then
            assert(engine._prevSlide.calledOnceWith({ h: 0, v: 0, f: -1, fMax: 3 }));
            store.getState.restore();
            engine._prevSlide.restore();
        });

        it('should call _prevFragment() on "arrowUp"', function() {
            // Given
            const currentSlide = { h: 1, v: 0, f: 3 };
            stub(engine, '_prevFragment');
            stub(store, 'getState').returns({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'arrowUp' });
            // Then
            assert(engine._prevFragment.calledOnceWith(currentSlide));
            store.getState.restore();
            engine._prevFragment.restore();
        });

        it('should call _prevSlide() on "arrowUp"', function() {
            // Given
            const currentSlide = { h: 1, v: 1, f: -1 };
            stub(engine, '_prevSlide');
            stub(store, 'getState').returns({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'arrowUp' });
            // Then
            assert(engine._prevSlide.calledOnceWith({ h: 1, v: 0, f: -1, fMax: 2 }));
            store.getState.restore();
            engine._prevSlide.restore();
        });

        it('should call _nextFragment() on "arrowDown"', function() {
            // Given
            const currentSlide = { h: 0, v: 0, f: -1 };
            stub(engine, '_nextFragment');
            stub(store, 'getState').returns({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'arrowDown' });
            // Then
            assert(engine._nextFragment.calledOnceWith(currentSlide));
            store.getState.restore();
            engine._nextFragment.restore();
        });

        it('should call _nextVerticalSlide() on "arrowDown"', function() {
            // Given
            const currentSlide = { h: 1, v: 0, f: 3 };
            stub(engine, '_nextVerticalSlide');
            stub(store, 'getState').returns({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'arrowDown' });
            // Then
            assert(engine._nextVerticalSlide.calledOnceWith(currentSlide));
            store.getState.restore();
            engine._nextVerticalSlide.restore();
        });

        it('should call _prevFragment() on "pageUp"', function() {
            // Given
            const currentSlide = { h: 1, v: 0, f: 3 };
            stub(engine, '_prevFragment');
            stub(store, 'getState').returns({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'pageUp' });
            // Then
            assert(engine._prevFragment.calledOnceWith(currentSlide));
            store.getState.restore();
            engine._prevFragment.restore();
        });

        it('should call _prevSlide(prevVerticalSlide) on "pageUp"', function() {
            // Given
            const currentSlide = { h: 1, v: 1, f: -1 };
            stub(engine, '_prevSlide');
            stub(store, 'getState').returns({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'pageUp' });
            // Then
            assert(engine._prevSlide.calledOnceWith({ h: 1, v: 0, f: -1, fMax: 2 }));
            store.getState.restore();
            engine._prevSlide.restore();
        });

        it('should call _prevSlide(prevHorizontalSlide) on "pageUp"', function() {
            // Given
            const currentSlide = { h: 1, v: 0, f: -1 };
            stub(engine, '_prevSlide');
            stub(store, 'getState').returns({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'pageUp' });
            // Then
            assert(engine._prevSlide.calledOnceWith({ h: 0, v: 0, f: -1, fMax: 3 }));
            store.getState.restore();
            engine._prevSlide.restore();
        });

        it('should call _nextFragment() on "pageDown"', function() {
            // Given
            const currentSlide = { h: 0, v: 0, f: -1 };
            stub(engine, '_nextFragment');
            stub(store, 'getState').returns({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'pageDown' });
            // Then
            assert(engine._nextFragment.calledOnceWith(currentSlide));
            store.getState.restore();
            engine._nextFragment.restore();
        });

        it('should call _nextVerticalSlide() on "pageDown"', function() {
            // Given
            const currentSlide = { h: 1, v: 0, f: 3 };
            stub(engine, '_nextVerticalSlide');
            stub(store, 'getState').returns({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'pageDown' });
            // Then
            assert(engine._nextVerticalSlide.calledOnceWith(currentSlide));
            store.getState.restore();
            engine._nextVerticalSlide.restore();
        });

        it('should call _nextHorizontalSlide() on "pageDown"', function() {
            // Given
            const currentSlide = { h: 0, v: 0, f: 4 };
            stub(engine, '_nextHorizontalSlide');
            stub(store, 'getState').returns({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'pageDown' });
            // Then
            assert(engine._nextHorizontalSlide.calledOnceWith(currentSlide));
            store.getState.restore();
            engine._nextHorizontalSlide.restore();
        });

        it('should call _nextFragment() on "space"', function() {
            // Given
            const currentSlide = { h: 0, v: 0, f: -1 };
            stub(engine, '_nextFragment');
            stub(store, 'getState').returns({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'space' });
            // Then
            assert(engine._nextFragment.calledOnceWith(currentSlide));
            store.getState.restore();
            engine._nextFragment.restore();
        });

        it('should call _nextVerticalSlide() on "space"', function() {
            // Given
            const currentSlide = { h: 1, v: 0, f: 3 };
            stub(engine, '_nextVerticalSlide');
            stub(store, 'getState').returns({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'space' });
            // Then
            assert(engine._nextVerticalSlide.calledOnceWith(currentSlide));
            store.getState.restore();
            engine._nextVerticalSlide.restore();
        });

        it('should call _nextHorizontalSlide() on "space"', function() {
            // Given
            const currentSlide = { h: 0, v: 0, f: 4 };
            stub(engine, '_nextHorizontalSlide');
            stub(store, 'getState').returns({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'space' });
            // Then
            assert(engine._nextHorizontalSlide.calledOnceWith(currentSlide));
            store.getState.restore();
            engine._nextHorizontalSlide.restore();
        });
    });

    describe('slideEquals()', function() {
        it('should be equals', function() {
            // Given
            const s1 = { h: 1, v: 3, f: 2 },
                s2 = s1;
            // Then
            assert(engine.slideEquals(s1, s2));
        });

        it('should be different', function() {
            // Given
            const s1 = { h: 1, v: 3, f: 2 },
                s2 = { ...s1, f: 3 };
            // Then
            assert(!engine.slideEquals(s1, s2));
        });

        it('should be equal without fragment check', function() {
            // Given
            const s1 = { h: 1, v: 3, f: 2 },
                s2 = { ...s1, f: 3 };
            // Then
            assert(engine.slideEquals(s1, s2, false));
        });
    });
});
