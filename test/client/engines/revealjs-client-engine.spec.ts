import { RevealEngine } from '@client/engines/revealjs-client-engine';

describe('RevealEngineClient', function () {
    let engine!: RevealEngine;

    beforeEach(function () {
        window.Reveal = {
            getCurrentSlide: vi.fn(),
            configure: vi.fn(),
            next: vi.fn(),
            up: vi.fn(),
            down: vi.fn(),
            left: vi.fn(),
            right: vi.fn(),
            slide: vi.fn(),
            getIndices: vi.fn(),
            addEventListener: vi.fn(),
            getSlides: vi.fn()
        };
        vi.spyOn(window, 'addEventListener').mockImplementation(() => {});
        vi.spyOn(window.parent, 'postMessage').mockImplementation(() => {});

        engine = new RevealEngine();
    });

    afterEach(function () {
        (window.addEventListener as ReturnType<typeof vi.fn>).mockRestore();
        (window.parent.postMessage as ReturnType<typeof vi.fn>).mockRestore();
    });

    describe('constructor()', function () {
        it('should have instantiated RevealEngine', function () {
            expect(engine).toBeTruthy();
        });
    });

    describe('goToSlide()', function () {
        it('should call Reveal.slide() with the given params', function () {
            // Given
            vi.spyOn(engine, 'getSlides').mockReturnValue([
                { h: 1, v: 1, f: -1, fMax: -1 },
                { h: 1, v: 2, f: -1, fMax: 4 }
            ]);
            // When
            engine.goToSlide({ h: 1, v: 2, f: 3, fMax: 4 });
            // Then
            expect(window.Reveal.slide).toHaveBeenCalledExactlyOnceWith(1, 2, 3);
        });

        it('should go to next slide when fragment index exceeds fMax and next slide exists', function () {
            // Given
            const slides = [
                { h: 0, v: 0, f: -1, fMax: 1 },
                { h: 1, v: 0, f: -1, fMax: 2 },
                { h: 2, v: 0, f: -1, fMax: 0 }
            ];
            vi.spyOn(engine, 'getSlides').mockReturnValue(slides);
            // When - currentIndex=0, delta=1, f+delta=0 which is not < fMax=1, currentIndex+delta=1 < 2 (slides.length-1)
            engine.goToSlide({ h: 0, v: 0, f: 0, fMax: 1 }, 1);
            // Then - should move to slides[1]
            expect(window.Reveal.slide).toHaveBeenCalledExactlyOnceWith(1, 0, -1);
        });

        it('should go to last slide when at end and fragment exceeds fMax', function () {
            // Given
            const slides = [
                { h: 0, v: 0, f: -1, fMax: 1 },
                { h: 1, v: 0, f: -1, fMax: 1 }
            ];
            vi.spyOn(engine, 'getSlides').mockReturnValue(slides);
            // When - currentIndex=1 (last), delta=1, f+delta=1 >= fMax=1, currentIndex+delta=2 is NOT < slides.length-1=1
            engine.goToSlide({ h: 1, v: 0, f: 0, fMax: 1 }, 1);
            // Then - should use last slide
            expect(window.Reveal.slide).toHaveBeenCalledExactlyOnceWith(1, 0, -1);
        });

        it('should ignore the command instead of throwing when called before any slide exists in the DOM', function () {
            // Given
            vi.spyOn(engine, 'getSlides').mockReturnValue([]);
            // When
            expect(() => engine.goToSlide({ h: 0, v: 0, f: -1, fMax: -1 })).not.toThrow();
            // Then
            expect(window.Reveal.slide).not.toHaveBeenCalled();
        });

        it('should ignore the command instead of throwing when the target slide is not found', function () {
            // Given
            vi.spyOn(engine, 'getSlides').mockReturnValue([{ h: 0, v: 0, f: -1, fMax: -1 }]);
            // When
            expect(() => engine.goToSlide({ h: 5, v: 5, f: -1, fMax: -1 })).not.toThrow();
            // Then
            expect(window.Reveal.slide).not.toHaveBeenCalled();
        });
    });

    describe('getSlides()', function () {
        it('should return an array of slides', function () {
            // Given
            const querySelectorAll = vi.fn().mockReturnValue([]);
            vi.spyOn(document, 'querySelectorAll').mockReturnValue([{ querySelectorAll }, { querySelectorAll }, { querySelectorAll }] as any);
            // When
            const slides = engine.getSlides();
            // Then
            expect(slides.length).toBe(3);
            expect(slides[0]).toEqual({ h: 0, v: 0, f: -1, fMax: -1 });
            (document.querySelectorAll as ReturnType<typeof vi.fn>).mockRestore();
        });

        it('should handle vertical slides', function () {
            // Given
            const fragmentsForVertical = vi.fn().mockReturnValue([{}, {}]); // 2 fragments in vertical slide
            const verticalSlide1 = { querySelectorAll: fragmentsForVertical };
            const verticalSlide2 = { querySelectorAll: vi.fn().mockReturnValue([]) };
            const verticalSlides = [verticalSlide1, verticalSlide2];
            const horizontalSlideWithVerticals = {
                querySelectorAll: (event: string) => {
                    if (event === 'section') return verticalSlides;
                    return []; // fragments on the h slide itself
                }
            };
            const horizontalSlideWithoutVerticals = {
                querySelectorAll: (event: string) => {
                    if (event === 'section') return [];
                    return [{}, {}]; // 2 fragments at h level
                }
            };
            vi.spyOn(document, 'querySelectorAll').mockReturnValue([horizontalSlideWithVerticals, horizontalSlideWithoutVerticals] as any);
            // When
            const slides = engine.getSlides();
            // Then
            expect(slides.length).toBe(3); // 2 vertical + 1 horizontal
            expect(slides[0]).toEqual({ h: 0, v: 0, f: -1, fMax: 2 }); // vertical with 2 fragments
            expect(slides[1]).toEqual({ h: 0, v: 1, f: -1, fMax: -1 }); // vertical with 0 fragments -> -1
            expect(slides[2]).toEqual({ h: 1, v: 0, f: -1, fMax: 2 }); // horizontal with 2 fragments
            (document.querySelectorAll as ReturnType<typeof vi.fn>).mockRestore();
        });
    });
});
