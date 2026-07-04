import { instance } from '@plugins/input/keyboard/index.js';

function keyEvent(code: string, key: string): KeyboardEvent {
    return { code, key, stopPropagation: vi.fn() } as unknown as KeyboardEvent;
}

describe('KeyboardInput', function () {
    beforeEach(function () {
        // jsdom does not implement the spec default of "inherit" for contentEditable, so force it
        // to match real browser behavior for a non-editable <body>.
        document.body.contentEditable = 'inherit';
    });

    afterEach(function () {
        vi.restoreAllMocks();
        instance.callbacks = [];
    });

    describe('constructor()', function () {
        it('should set type to "inputEvent"', function () {
            expect(instance.type).toBe('inputEvent');
        });
    });

    describe('init()', function () {
        it('should register keyup, keypressed and keydown listeners and mark itself initialized', function () {
            // Given
            const addEventListenerSpy = vi.spyOn(globalThis, 'addEventListener');

            // When
            instance.init();

            // Then
            expect(addEventListenerSpy).toHaveBeenCalledWith('keyup', expect.any(Function), true);
            expect(addEventListenerSpy).toHaveBeenCalledWith('keypressed', expect.any(Function), true);
            expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function), true);
            expect(instance.initialized).toBe(true);
        });
    });

    describe('_captureKeyboardEvent()', function () {
        it('should ignore the event when the active element is an <input>', function () {
            // Given
            const input = document.createElement('input');
            document.body.append(input);
            input.focus();
            const event = keyEvent('ArrowDown', 'ArrowDown');

            // When
            instance._captureKeyboardEvent(event, true);

            // Then
            expect(event.stopPropagation).not.toHaveBeenCalled();
            input.remove();
        });

        it('should ignore the event when the active element is a <textarea>', function () {
            // Given
            const textarea = document.createElement('textarea');
            document.body.append(textarea);
            textarea.focus();
            const event = keyEvent('ArrowDown', 'ArrowDown');

            // When
            instance._captureKeyboardEvent(event, true);

            // Then
            expect(event.stopPropagation).not.toHaveBeenCalled();
            textarea.remove();
        });

        it('should ignore the event when the active element is contentEditable', function () {
            // Given
            const div = document.createElement('div');
            div.contentEditable = 'true';
            div.tabIndex = 0;
            document.body.append(div);
            div.focus();
            const event = keyEvent('ArrowDown', 'ArrowDown');

            // When
            instance._captureKeyboardEvent(event, true);

            // Then
            expect(event.stopPropagation).not.toHaveBeenCalled();
            div.remove();
        });

        it('should not forward the key when it is not in the blocked keys list', function () {
            // Given
            const callback = vi.fn();
            instance.onEvent(callback);
            const event = keyEvent('KeyA', 'a');

            // When
            instance._captureKeyboardEvent(event, true);

            // Then
            expect(event.stopPropagation).not.toHaveBeenCalled();
            expect(callback).not.toHaveBeenCalled();
        });

        it('should stopPropagation but NOT forward when forward is false (e.g. keydown)', function () {
            // Given
            const callback = vi.fn();
            instance.onEvent(callback);
            const event = keyEvent('ArrowDown', 'ArrowDown');

            // When
            instance._captureKeyboardEvent(event);

            // Then
            expect(event.stopPropagation).toHaveBeenCalled();
            expect(callback).not.toHaveBeenCalled();
        });

        it.each([
            ['ArrowDown', 'Down', 'arrowDown'],
            ['ArrowDown', 'ArrowDown', 'arrowDown'],
            ['ArrowUp', 'Up', 'arrowUp'],
            ['ArrowUp', 'ArrowUp', 'arrowUp'],
            ['ArrowLeft', 'Left', 'arrowLeft'],
            ['ArrowLeft', 'ArrowLeft', 'arrowLeft'],
            ['ArrowRight', 'Right', 'arrowRight'],
            ['ArrowRight', 'ArrowRight', 'arrowRight'],
            ['PageUp', 'PageUp', 'pageUp'],
            ['PageDown', 'PageDown', 'pageDown'],
            ['Space', ' ', 'space']
        ])('should forward code=%s key=%s as action "%s" when forward is true', function (code, key, action) {
            // Given
            const callback = vi.fn();
            instance.onEvent(callback);
            const event = keyEvent(code, key);

            // When
            instance._captureKeyboardEvent(event, true);

            // Then
            expect(event.stopPropagation).toHaveBeenCalled();
            expect(callback).toHaveBeenCalledWith(instance.type, { key: action });
        });

        it('should forward an empty action when the blocked key has no matching switch case', function () {
            // Given
            const callback = vi.fn();
            instance.onEvent(callback);
            const event = keyEvent('ArrowDown', 'SomeUnmappedKey');

            // When
            instance._captureKeyboardEvent(event, true);

            // Then
            expect(callback).toHaveBeenCalledWith(instance.type, { key: '' });
        });
    });
});
