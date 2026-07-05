import { instance } from '@plugins/input/touch/index.js';

const PRESENTATION_HREF = 'http://localhost:3002/index.html';
const CONTROLLER_HREF = 'http://localhost:3000/index.html';

function touchEvent(type: 'touchstart' | 'touchend', href: string, touch?: { clientX: number; clientY: number }): TouchEvent {
    return {
        type,
        view: { location: { href } },
        changedTouches: touch ? [touch] : []
    } as unknown as TouchEvent;
}

describe('TouchInput', function () {
    beforeEach(function () {
        instance.touchPosition = {
            touchstart: { clientX: 0, clientY: 0 },
            touchend: { clientX: 0, clientY: 0 }
        };
        instance.callbacks = [];
    });

    describe('constructor()', function () {
        it('should set type to "inputEvent"', function () {
            expect(instance.type).toBe('inputEvent');
        });
    });

    describe('init()', function () {
        it('should register touchstart and touchend listeners and mark itself initialized', function () {
            // Given
            const addEventListenerSpy = vi.spyOn(globalThis, 'addEventListener');

            // When
            instance.init();

            // Then
            expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), false);
            expect(addEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function), false);
            expect(instance.initialized).toBe(true);
        });
    });

    describe('_captureTouchEvent()', function () {
        it('should do nothing when the event has no view', function () {
            // Given
            const event = { type: 'touchstart', view: null, changedTouches: [] } as unknown as TouchEvent;

            // When / Then
            expect(() => instance._captureTouchEvent(event)).not.toThrow();
        });

        it('should ignore events coming from outside the presentation iframe', function () {
            // Given
            const callback = vi.fn();
            instance.onEvent(callback);
            const event = touchEvent('touchstart', CONTROLLER_HREF, { clientX: 10, clientY: 10 });

            // When
            instance._captureTouchEvent(event, true);

            // Then
            expect(callback).not.toHaveBeenCalled();
        });

        it('should do nothing when there is no changed touch', function () {
            // Given
            const event = touchEvent('touchstart', PRESENTATION_HREF);

            // When / Then
            expect(() => instance._captureTouchEvent(event)).not.toThrow();
        });

        it('should record the touch position without forwarding when forward is false', function () {
            // Given
            const callback = vi.fn();
            instance.onEvent(callback);
            const event = touchEvent('touchstart', PRESENTATION_HREF, { clientX: 5, clientY: 7 });

            // When
            instance._captureTouchEvent(event);

            // Then
            expect(instance.touchPosition.touchstart).toEqual({ clientX: 5, clientY: 7 });
            expect(callback).not.toHaveBeenCalled();
        });

        it('should forward "space" when the swipe distance is within the 20px threshold', function () {
            // Given
            const callback = vi.fn();
            instance.onEvent(callback);
            instance._captureTouchEvent(touchEvent('touchstart', PRESENTATION_HREF, { clientX: 100, clientY: 100 }));

            // When
            instance._captureTouchEvent(touchEvent('touchend', PRESENTATION_HREF, { clientX: 105, clientY: 95 }), true);

            // Then
            expect(callback).toHaveBeenCalledWith(instance.type, { key: 'space' });
        });

        it('should forward "arrowLeft" for a horizontal swipe to the right beyond the threshold', function () {
            // Given
            const callback = vi.fn();
            instance.onEvent(callback);
            instance._captureTouchEvent(touchEvent('touchstart', PRESENTATION_HREF, { clientX: 0, clientY: 0 }));

            // When - touchstart.x(0) - touchend.x(100) = -100 => xDiff negative => arrowLeft
            instance._captureTouchEvent(touchEvent('touchend', PRESENTATION_HREF, { clientX: 100, clientY: 0 }), true);

            // Then
            expect(callback).toHaveBeenCalledWith(instance.type, { key: 'arrowLeft' });
        });

        it('should forward "arrowRight" for a horizontal swipe to the left beyond the threshold', function () {
            // Given
            const callback = vi.fn();
            instance.onEvent(callback);
            instance._captureTouchEvent(touchEvent('touchstart', PRESENTATION_HREF, { clientX: 100, clientY: 0 }));

            // When - touchstart.x(100) - touchend.x(0) = 100 => xDiff positive => arrowRight
            instance._captureTouchEvent(touchEvent('touchend', PRESENTATION_HREF, { clientX: 0, clientY: 0 }), true);

            // Then
            expect(callback).toHaveBeenCalledWith(instance.type, { key: 'arrowRight' });
        });

        it('should forward "arrowUp" for a vertical swipe down beyond the threshold', function () {
            // Given
            const callback = vi.fn();
            instance.onEvent(callback);
            instance._captureTouchEvent(touchEvent('touchstart', PRESENTATION_HREF, { clientX: 0, clientY: 0 }));

            // When - touchstart.y(0) - touchend.y(100) = -100 => yDiff negative => arrowUp
            instance._captureTouchEvent(touchEvent('touchend', PRESENTATION_HREF, { clientX: 0, clientY: 100 }), true);

            // Then
            expect(callback).toHaveBeenCalledWith(instance.type, { key: 'arrowUp' });
        });

        it('should forward "arrowDown" for a vertical swipe up beyond the threshold', function () {
            // Given
            const callback = vi.fn();
            instance.onEvent(callback);
            instance._captureTouchEvent(touchEvent('touchstart', PRESENTATION_HREF, { clientX: 0, clientY: 100 }));

            // When - touchstart.y(100) - touchend.y(0) = 100 => yDiff positive => arrowDown
            instance._captureTouchEvent(touchEvent('touchend', PRESENTATION_HREF, { clientX: 0, clientY: 0 }), true);

            // Then
            expect(callback).toHaveBeenCalledWith(instance.type, { key: 'arrowDown' });
        });
    });
});
