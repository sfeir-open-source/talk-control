import { RevealEngine } from '@server/engines/revealjs-server-engine';

describe('RevealServerEngine', function () {
    const slides = [
        { h: 0, v: 0, f: -1, fMax: 3 },
        { h: 1, v: 0, f: -1, fMax: 2 },
        { h: 1, v: 1, f: -1, fMax: 2 }
    ];
    let engine, store;

    beforeEach(function () {
        engine = new RevealEngine();
        store = engine.store;
    });

    describe('constructor()', function () {
        it('should have instantiated TCServer', function () {
            expect(engine).toBeTruthy();
        });
    });

    describe('init()', function () {
        it('should dispatch event', function () {
            // Given
            vi.spyOn(store, 'dispatch').mockImplementation(() => {});
            // When
            engine.init({ slides });
            // Then
            expect(store.dispatch).toHaveBeenCalledOnce();
            store.dispatch.mockRestore();
        });
    });

    describe('handleInput()', function () {
        it('should do nothing', function () {
            // Given
            const currentSlide = { h: 0, v: 0, f: -1 };
            vi.spyOn(store, 'dispatch').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleInput({});
            // Then
            expect(store.dispatch).not.toHaveBeenCalled();
            store.getState.mockRestore();
            store.dispatch.mockRestore();
        });

        it('should call _nextFragment() on "arrowRight"', function () {
            // Given
            const currentSlide = { h: 0, v: 0, f: -1 };
            vi.spyOn(engine, '_nextFragment').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'arrowRight' });
            // Then
            expect(engine._nextFragment).toHaveBeenCalledOnce();
            store.getState.mockRestore();
            engine._nextFragment.mockRestore();
        });

        it('should call _nextHorizontalSlide() on "arrowRight"', function () {
            // Given
            const currentSlide = { h: 0, v: 0, f: 2 };
            vi.spyOn(engine, '_nextHorizontalSlide').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'arrowRight' });
            // Then
            expect(engine._nextHorizontalSlide).toHaveBeenCalledExactlyOnceWith(currentSlide);
            store.getState.mockRestore();
            engine._nextHorizontalSlide.mockRestore();
        });

        it('should call _prevFragment() on "arrowLeft"', function () {
            // Given
            const currentSlide = { h: 0, v: 0, f: 2 };
            vi.spyOn(engine, '_prevFragment').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'arrowLeft' });
            // Then
            expect(engine._prevFragment).toHaveBeenCalledExactlyOnceWith(currentSlide);
            store.getState.mockRestore();
            engine._prevFragment.mockRestore();
        });

        it('should call _prevSlide() on "arrowLeft"', function () {
            // Given
            const currentSlide = { h: 1, v: 0, f: -1 };
            vi.spyOn(engine, '_prevSlide').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'arrowLeft' });
            // Then
            expect(engine._prevSlide).toHaveBeenCalledExactlyOnceWith({ h: 0, v: 0, f: -1, fMax: 3 });
            store.getState.mockRestore();
            engine._prevSlide.mockRestore();
        });

        it('should call _prevFragment() on "arrowUp"', function () {
            // Given
            const currentSlide = { h: 1, v: 0, f: 3 };
            vi.spyOn(engine, '_prevFragment').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'arrowUp' });
            // Then
            expect(engine._prevFragment).toHaveBeenCalledExactlyOnceWith(currentSlide);
            store.getState.mockRestore();
            engine._prevFragment.mockRestore();
        });

        it('should call _prevSlide() on "arrowUp"', function () {
            // Given
            const currentSlide = { h: 1, v: 1, f: -1 };
            vi.spyOn(engine, '_prevSlide').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'arrowUp' });
            // Then
            expect(engine._prevSlide).toHaveBeenCalledExactlyOnceWith({ h: 1, v: 0, f: -1, fMax: 2 });
            store.getState.mockRestore();
            engine._prevSlide.mockRestore();
        });

        it('should call _nextFragment() on "arrowDown"', function () {
            // Given
            const currentSlide = { h: 0, v: 0, f: -1 };
            vi.spyOn(engine, '_nextFragment').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'arrowDown' });
            // Then
            expect(engine._nextFragment).toHaveBeenCalledExactlyOnceWith(currentSlide);
            store.getState.mockRestore();
            engine._nextFragment.mockRestore();
        });

        it('should call _nextVerticalSlide() on "arrowDown"', function () {
            // Given
            const currentSlide = { h: 1, v: 0, f: 3 };
            vi.spyOn(engine, '_nextVerticalSlide').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'arrowDown' });
            // Then
            expect(engine._nextVerticalSlide).toHaveBeenCalledExactlyOnceWith(currentSlide);
            store.getState.mockRestore();
            engine._nextVerticalSlide.mockRestore();
        });

        it('should call _prevFragment() on "pageUp"', function () {
            // Given
            const currentSlide = { h: 1, v: 0, f: 3 };
            vi.spyOn(engine, '_prevFragment').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'pageUp' });
            // Then
            expect(engine._prevFragment).toHaveBeenCalledExactlyOnceWith(currentSlide);
            store.getState.mockRestore();
            engine._prevFragment.mockRestore();
        });

        it('should call _prevSlide(prevVerticalSlide) on "pageUp"', function () {
            // Given
            const currentSlide = { h: 1, v: 1, f: -1 };
            vi.spyOn(engine, '_prevSlide').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'pageUp' });
            // Then
            expect(engine._prevSlide).toHaveBeenCalledExactlyOnceWith({ h: 1, v: 0, f: -1, fMax: 2 });
            store.getState.mockRestore();
            engine._prevSlide.mockRestore();
        });

        it('should call _prevSlide(prevHorizontalSlide) on "pageUp"', function () {
            // Given
            const currentSlide = { h: 1, v: 0, f: -1 };
            vi.spyOn(engine, '_prevSlide').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'pageUp' });
            // Then
            expect(engine._prevSlide).toHaveBeenCalledExactlyOnceWith({ h: 0, v: 0, f: -1, fMax: 3 });
            store.getState.mockRestore();
            engine._prevSlide.mockRestore();
        });

        it('should call _nextFragment() on "pageDown"', function () {
            // Given
            const currentSlide = { h: 0, v: 0, f: -1 };
            vi.spyOn(engine, '_nextFragment').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'pageDown' });
            // Then
            expect(engine._nextFragment).toHaveBeenCalledExactlyOnceWith(currentSlide);
            store.getState.mockRestore();
            engine._nextFragment.mockRestore();
        });

        it('should call _nextVerticalSlide() on "pageDown"', function () {
            // Given
            const currentSlide = { h: 1, v: 0, f: 3 };
            vi.spyOn(engine, '_nextVerticalSlide').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'pageDown' });
            // Then
            expect(engine._nextVerticalSlide).toHaveBeenCalledExactlyOnceWith(currentSlide);
            store.getState.mockRestore();
            engine._nextVerticalSlide.mockRestore();
        });

        it('should call _nextHorizontalSlide() on "pageDown"', function () {
            // Given
            const currentSlide = { h: 0, v: 0, f: 4 };
            vi.spyOn(engine, '_nextHorizontalSlide').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'pageDown' });
            // Then
            expect(engine._nextHorizontalSlide).toHaveBeenCalledExactlyOnceWith(currentSlide);
            store.getState.mockRestore();
            engine._nextHorizontalSlide.mockRestore();
        });

        it('should call _nextFragment() on "space"', function () {
            // Given
            const currentSlide = { h: 0, v: 0, f: -1 };
            vi.spyOn(engine, '_nextFragment').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'space' });
            // Then
            expect(engine._nextFragment).toHaveBeenCalledExactlyOnceWith(currentSlide);
            store.getState.mockRestore();
            engine._nextFragment.mockRestore();
        });

        it('should call _nextVerticalSlide() on "space"', function () {
            // Given
            const currentSlide = { h: 1, v: 0, f: 3 };
            vi.spyOn(engine, '_nextVerticalSlide').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'space' });
            // Then
            expect(engine._nextVerticalSlide).toHaveBeenCalledExactlyOnceWith(currentSlide);
            store.getState.mockRestore();
            engine._nextVerticalSlide.mockRestore();
        });

        it('should call _nextHorizontalSlide() on "space"', function () {
            // Given
            const currentSlide = { h: 0, v: 0, f: 4 };
            vi.spyOn(engine, '_nextHorizontalSlide').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleInput({ key: 'space' });
            // Then
            expect(engine._nextHorizontalSlide).toHaveBeenCalledExactlyOnceWith(currentSlide);
            store.getState.mockRestore();
            engine._nextHorizontalSlide.mockRestore();
        });
    });

    describe('handleTouch()', function () {
        it('should do nothing for unknown direction', function () {
            // Given
            const currentSlide = { h: 0, v: 0, f: -1 };
            vi.spyOn(store, 'dispatch').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleTouch({});
            // Then
            expect(store.dispatch).not.toHaveBeenCalled();
            store.getState.mockRestore();
            store.dispatch.mockRestore();
        });

        it('should call _nextFragment() on "left" when fragment available', function () {
            // Given
            const currentSlide = { h: 0, v: 0, f: -1 };
            vi.spyOn(engine, '_nextFragment').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleTouch({ direction: 'left' });
            // Then
            expect(engine._nextFragment).toHaveBeenCalledExactlyOnceWith(currentSlide);
            store.getState.mockRestore();
            engine._nextFragment.mockRestore();
        });

        it('should call _nextHorizontalSlide() on "left" when no fragment', function () {
            // Given
            const currentSlide = { h: 0, v: 0, f: 2 };
            vi.spyOn(engine, '_nextHorizontalSlide').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleTouch({ direction: 'left' });
            // Then
            expect(engine._nextHorizontalSlide).toHaveBeenCalledExactlyOnceWith(currentSlide);
            store.getState.mockRestore();
            engine._nextHorizontalSlide.mockRestore();
        });

        it('should call _prevFragment() on "right" when fragment available', function () {
            // Given
            const currentSlide = { h: 0, v: 0, f: 2 };
            vi.spyOn(engine, '_prevFragment').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleTouch({ direction: 'right' });
            // Then
            expect(engine._prevFragment).toHaveBeenCalledExactlyOnceWith(currentSlide);
            store.getState.mockRestore();
            engine._prevFragment.mockRestore();
        });

        it('should call _prevSlide() on "right" when no fragment', function () {
            // Given
            const currentSlide = { h: 1, v: 0, f: -1 };
            vi.spyOn(engine, '_prevSlide').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleTouch({ direction: 'right' });
            // Then
            expect(engine._prevSlide).toHaveBeenCalledExactlyOnceWith({ h: 0, v: 0, f: -1, fMax: 3 });
            store.getState.mockRestore();
            engine._prevSlide.mockRestore();
        });

        it('should call _nextFragment() on "up" when fragment available', function () {
            // Given
            const currentSlide = { h: 0, v: 0, f: -1 };
            vi.spyOn(engine, '_nextFragment').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleTouch({ direction: 'up' });
            // Then
            expect(engine._nextFragment).toHaveBeenCalledExactlyOnceWith(currentSlide);
            store.getState.mockRestore();
            engine._nextFragment.mockRestore();
        });

        it('should call _nextVerticalSlide() on "up" when no fragment', function () {
            // Given
            const currentSlide = { h: 1, v: 0, f: 3 };
            vi.spyOn(engine, '_nextVerticalSlide').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleTouch({ direction: 'up' });
            // Then
            expect(engine._nextVerticalSlide).toHaveBeenCalledExactlyOnceWith(currentSlide);
            store.getState.mockRestore();
            engine._nextVerticalSlide.mockRestore();
        });

        it('should call _prevFragment() on "down" when fragment available', function () {
            // Given
            const currentSlide = { h: 0, v: 0, f: 2 };
            vi.spyOn(engine, '_prevFragment').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleTouch({ direction: 'down' });
            // Then
            expect(engine._prevFragment).toHaveBeenCalledExactlyOnceWith(currentSlide);
            store.getState.mockRestore();
            engine._prevFragment.mockRestore();
        });

        it('should call _prevSlide() on "down" when no fragment', function () {
            // Given
            const currentSlide = { h: 1, v: 1, f: -1 };
            vi.spyOn(engine, '_prevSlide').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleTouch({ direction: 'down' });
            // Then
            expect(engine._prevSlide).toHaveBeenCalledExactlyOnceWith({ h: 1, v: 0, f: -1, fMax: 2 });
            store.getState.mockRestore();
            engine._prevSlide.mockRestore();
        });

        it('should call _nextFragment() on "none" when fragment available', function () {
            // Given
            const currentSlide = { h: 0, v: 0, f: -1 };
            vi.spyOn(engine, '_nextFragment').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleTouch({ direction: 'none' });
            // Then
            expect(engine._nextFragment).toHaveBeenCalledExactlyOnceWith(currentSlide);
            store.getState.mockRestore();
            engine._nextFragment.mockRestore();
        });

        it('should call _nextVerticalSlide() on "none" when no fragment but vertical slide', function () {
            // Given
            const currentSlide = { h: 1, v: 0, f: 3 };
            vi.spyOn(engine, '_nextVerticalSlide').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleTouch({ direction: 'none' });
            // Then
            expect(engine._nextVerticalSlide).toHaveBeenCalledExactlyOnceWith(currentSlide);
            store.getState.mockRestore();
            engine._nextVerticalSlide.mockRestore();
        });

        it('should call _nextHorizontalSlide() on "none" when no fragment, no vertical, but horizontal slide', function () {
            // Given
            const currentSlide = { h: 0, v: 0, f: 4 };
            vi.spyOn(engine, '_nextHorizontalSlide').mockImplementation(() => {});
            vi.spyOn(store, 'getState').mockReturnValue({ currentSlide, slides });
            // When
            engine.handleTouch({ direction: 'none' });
            // Then
            expect(engine._nextHorizontalSlide).toHaveBeenCalledExactlyOnceWith(currentSlide);
            store.getState.mockRestore();
            engine._nextHorizontalSlide.mockRestore();
        });
    });

    describe('slideEquals()', function () {
        it('should be equals', function () {
            // Given
            const s1 = { h: 1, v: 3, f: 2 },
                s2 = s1;
            // Then
            expect(engine.slideEquals(s1, s2)).toBeTruthy();
        });

        it('should be different', function () {
            // Given
            const s1 = { h: 1, v: 3, f: 2 },
                s2 = { ...s1, f: 3 };
            // Then
            expect(engine.slideEquals(s1, s2)).toBeFalsy();
        });

        it('should be equal without fragment check', function () {
            // Given
            const s1 = { h: 1, v: 3, f: 2 },
                s2 = { ...s1, f: 3 };
            // Then
            expect(engine.slideEquals(s1, s2, false)).toBeTruthy();
        });
    });
});
