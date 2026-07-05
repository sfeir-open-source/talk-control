import { instance } from '@plugins/input/touch-pointer/index.js';

function buildCurrentSlide(): { host: HTMLElement; shadowRoot: ShadowRoot; frame: HTMLElement; section: HTMLElement } {
    const host = document.createElement('div');
    host.id = 'currentSlide';
    document.body.append(host);
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const frame = document.createElement('div');
    frame.id = 'slideViewFrame';
    const section = document.createElement('div');
    section.id = 'slideViewSection';
    shadowRoot.append(frame, section);
    return { host, shadowRoot, frame, section };
}

function messageEvent(data: unknown): MessageEvent {
    return { data } as MessageEvent;
}

describe('TouchPointerInput', function () {
    beforeEach(function () {
        instance.zooming = false;
        instance.pointer = { x: '0', y: '0', color: '#FF0000' };
        instance.interval = undefined;
        instance.messageEventRegistered = false;
        instance.initialized = false;
        document.body.innerHTML = '';
        document.body.append(
            Object.assign(document.createElement('div'), { id: 'placeholder1' }),
            Object.assign(document.createElement('div'), { id: 'placeholder2' })
        );
    });

    afterEach(function () {
        vi.restoreAllMocks();
    });

    describe('constructor()', function () {
        it('should set type to "touchPointerEvent"', function () {
            expect(instance.type).toBe('touchPointerEvent');
        });
    });

    describe('init() / unload()', function () {
        it('should register the message listener once and mark itself initialized', function () {
            // Given
            const addEventListenerSpy = vi.spyOn(globalThis, 'addEventListener');

            // When
            instance.init();

            // Then
            expect(addEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));
            expect(instance.initialized).toBe(true);
            expect(instance.messageEventRegistered).toBe(true);
        });

        it('should not register the message listener twice', function () {
            // Given
            instance.messageEventRegistered = true;
            const addEventListenerSpy = vi.spyOn(globalThis, 'addEventListener');

            // When
            instance.init();

            // Then
            expect(addEventListenerSpy).not.toHaveBeenCalled();
        });

        it('should fill the settings and mask placeholders on init', function () {
            // When
            instance.init();

            // Then
            expect(document.getElementById('placeholder1')?.innerHTML).toContain('tc-touch-pointer-settings');
            expect(document.getElementById('placeholder2')?.innerHTML).toContain('tc-touch-pointer-mask');
        });

        it('should clear the placeholders and mark itself uninitialized on unload', function () {
            // Given
            instance.init();

            // When
            instance.unload();

            // Then
            expect(document.getElementById('placeholder1')?.innerHTML).toBe('');
            expect(document.getElementById('placeholder2')?.innerHTML).toBe('');
            expect(instance.initialized).toBe(false);
        });
    });

    describe('_addArea() / _removeArea()', function () {
        it('should do nothing when the placeholder does not exist', function () {
            // Given
            document.getElementById('placeholder1')?.remove();

            // When / Then
            expect(() => instance._addSettingsArea()).not.toThrow();
            expect(() => instance._removeSettingsArea()).not.toThrow();
        });
    });

    describe('_addPointer() / _removePointer()', function () {
        it('should do nothing when there is no current slide', function () {
            // When / Then
            expect(() => instance._addPointer()).not.toThrow();
        });

        it('should log and do nothing on _removePointer when there is no current slide', function () {
            // Given
            const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

            // When
            instance._removePointer();

            // Then
            expect(consoleLogSpy).toHaveBeenCalledWith('no current slide nor shadowroot');
        });

        it('should do nothing when the current slide has no shadowRoot', function () {
            // Given
            const host = document.createElement('div');
            host.id = 'currentSlide';
            document.body.append(host);

            // When / Then
            expect(() => instance._addPointer()).not.toThrow();
            expect(() => instance._removePointer()).not.toThrow();
        });

        it('should style the slideViewFrame and append a pointer div when both exist', function () {
            // Given
            const { shadowRoot, frame } = buildCurrentSlide();

            // When
            instance._addPointer();

            // Then
            expect(frame.style.cursor).toBe('zoom-in');
            expect(shadowRoot.getElementById('pointer')).toBeTruthy();
        });

        it('should skip styling when slideViewFrame is missing', function () {
            // Given
            const host = document.createElement('div');
            host.id = 'currentSlide';
            document.body.append(host);
            const shadowRoot = host.attachShadow({ mode: 'open' });
            const section = document.createElement('div');
            section.id = 'slideViewSection';
            shadowRoot.append(section);

            // When / Then
            expect(() => instance._addPointer()).not.toThrow();
            expect(shadowRoot.getElementById('pointer')).toBeTruthy();
        });

        it('should skip appending a pointer when slideViewSection is missing', function () {
            // Given
            const host = document.createElement('div');
            host.id = 'currentSlide';
            document.body.append(host);
            const shadowRoot = host.attachShadow({ mode: 'open' });
            const frame = document.createElement('div');
            frame.id = 'slideViewFrame';
            shadowRoot.append(frame);

            // When
            instance._addPointer();

            // Then
            expect(shadowRoot.getElementById('pointer')).toBeNull();
        });

        it('should remove the pointer when it exists', function () {
            // Given
            const { shadowRoot } = buildCurrentSlide();
            instance._addPointer();
            expect(shadowRoot.getElementById('pointer')).toBeTruthy();

            // When
            instance._removePointer();

            // Then
            expect(shadowRoot.getElementById('pointer')).toBeNull();
        });

        it('should do nothing on remove when slideViewSection is missing', function () {
            // Given
            const host = document.createElement('div');
            host.id = 'currentSlide';
            document.body.append(host);
            host.attachShadow({ mode: 'open' });

            // When / Then
            expect(() => instance._removePointer()).not.toThrow();
        });

        it('should do nothing on remove when there is no pointer element', function () {
            // Given
            buildCurrentSlide();

            // When / Then
            expect(() => instance._removePointer()).not.toThrow();
        });
    });

    describe('_onMessageEvent()', function () {
        it('should ignore a message without data', function () {
            expect(() => instance._onMessageEvent(messageEvent(undefined))).not.toThrow();
        });

        it('should ignore a message whose data has no nested data object', function () {
            expect(() => instance._onMessageEvent(messageEvent({ type: 'pluginEventIn' }))).not.toThrow();
        });

        it('should ignore a message whose nested data is not an object', function () {
            expect(() => instance._onMessageEvent(messageEvent({ type: 'x', data: 'not-an-object' }))).not.toThrow();
        });

        it('should ignore messages of type "pluginEventIn"', function () {
            // Given
            const setPointerSpy = vi.spyOn(instance, '_setPointer');

            // When
            instance._onMessageEvent(messageEvent({ type: 'pluginEventIn', data: { type: 'pointerMove', payload: {} } }));

            // Then
            expect(setPointerSpy).not.toHaveBeenCalled();
        });

        it('should move the pointer with provided coordinates on "pointerMove"', function () {
            // Given
            const setPointerSpy = vi.spyOn(instance, '_setPointer');

            // When
            instance._onMessageEvent(messageEvent({ type: 'x', data: { type: 'pointerMove', payload: { x: '10%', y: '20%' } } }));

            // Then
            expect(setPointerSpy).toHaveBeenCalledWith('10%', '20%');
        });

        it('should default missing coordinates to "0" on "pointerMove"', function () {
            // Given
            const setPointerSpy = vi.spyOn(instance, '_setPointer');

            // When
            instance._onMessageEvent(messageEvent({ type: 'x', data: { type: 'pointerMove', payload: {} } }));

            // Then
            expect(setPointerSpy).toHaveBeenCalledWith('0', '0');
        });

        it('should change the pointer color on "pointerColor"', function () {
            // Given
            const setPointerColorSpy = vi.spyOn(instance, '_setPointerColor');

            // When
            instance._onMessageEvent(messageEvent({ type: 'x', data: { type: 'pointerColor', payload: { color: '#00FF00' } } }));

            // Then
            expect(setPointerColorSpy).toHaveBeenCalledWith('#00FF00');
        });

        it('should default a missing color to an empty string on "pointerColor"', function () {
            // Given
            const setPointerColorSpy = vi.spyOn(instance, '_setPointerColor');

            // When
            instance._onMessageEvent(messageEvent({ type: 'x', data: { type: 'pointerColor', payload: {} } }));

            // Then
            expect(setPointerColorSpy).toHaveBeenCalledWith('');
        });

        it('should toggle the zoom with converted coordinates on "pointerClick"', function () {
            // Given
            const toggleZoomSpy = vi.spyOn(instance, '_toggleZoom');
            vi.stubGlobal('innerWidth', 1000);
            vi.stubGlobal('innerHeight', 500);

            // When
            instance._onMessageEvent(messageEvent({ type: 'x', data: { type: 'pointerClick', payload: { x: '50%', y: '20%' } } }));

            // Then
            expect(toggleZoomSpy).toHaveBeenCalledWith(500, 100);
            vi.unstubAllGlobals();
        });

        it('should default missing coordinates to "0" on "pointerClick"', function () {
            // Given
            const toggleZoomSpy = vi.spyOn(instance, '_toggleZoom');

            // When
            instance._onMessageEvent(messageEvent({ type: 'x', data: { type: 'pointerClick', payload: {} } }));

            // Then
            expect(toggleZoomSpy).toHaveBeenCalledWith(0, 0);
        });
    });

    describe('_setPointer()', function () {
        it('should do nothing when there is no current slide', function () {
            expect(() => instance._setPointer('1', '2')).not.toThrow();
        });

        it('should do nothing when there is no pointer element', function () {
            // Given
            const host = document.createElement('div');
            host.id = 'currentSlide';
            document.body.append(host);
            host.attachShadow({ mode: 'open' });

            // When / Then
            expect(() => instance._setPointer('1', '2')).not.toThrow();
        });

        it('should move the pointer, make it visible and hide it again after a delay', function () {
            // Given
            vi.useFakeTimers();
            const { shadowRoot } = buildCurrentSlide();
            instance._addPointer();
            const pointer = shadowRoot.getElementById('pointer') as HTMLElement;

            // When
            instance._setPointer('42px', '84px');

            // Then
            expect(pointer.style.visibility).toBe('visible');
            expect(pointer.style.left).toBe('42px');
            expect(pointer.style.top).toBe('84px');
            expect(instance.pointer).toEqual({ x: '42px', y: '84px', color: '#FF0000' });

            // When time passes
            vi.advanceTimersByTime(2000);

            // Then
            expect(pointer.style.visibility).toBe('hidden');
            vi.useRealTimers();
        });

        it('should clear the previous hide-timer when moved again', function () {
            // Given
            vi.useFakeTimers();
            const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
            buildCurrentSlide();
            instance._addPointer();

            // When
            instance._setPointer('1px', '1px');
            instance._setPointer('2px', '2px');

            // Then
            expect(clearIntervalSpy).toHaveBeenCalled();
            vi.useRealTimers();
        });
    });

    describe('_setPointerColor()', function () {
        it('should do nothing when there is no current slide', function () {
            expect(() => instance._setPointerColor('#000000')).not.toThrow();
        });

        it('should do nothing when there is no pointer element', function () {
            // Given
            const host = document.createElement('div');
            host.id = 'currentSlide';
            document.body.append(host);
            host.attachShadow({ mode: 'open' });

            // When / Then
            expect(() => instance._setPointerColor('#000000')).not.toThrow();
        });

        it('should update the pointer background color', function () {
            // Given
            const { shadowRoot } = buildCurrentSlide();
            instance._addPointer();
            const pointer = shadowRoot.getElementById('pointer') as HTMLElement;

            // When
            instance._setPointerColor('rgb(1, 2, 3)');

            // Then
            expect(pointer.style.backgroundColor).toBe('rgb(1, 2, 3)');
            expect(instance.pointer.color).toBe('rgb(1, 2, 3)');
        });
    });

    describe('_toggleZoom()', function () {
        it('should do nothing when there is no current slide', function () {
            expect(() => instance._toggleZoom(1, 2)).not.toThrow();
        });

        it('should do nothing when slideViewFrame is missing', function () {
            // Given
            const host = document.createElement('div');
            host.id = 'currentSlide';
            document.body.append(host);
            host.attachShadow({ mode: 'open' });

            // When / Then
            expect(() => instance._toggleZoom(1, 2)).not.toThrow();
        });

        it('should zoom in and flip the zooming flag when not zoomed', function () {
            // Given
            const { frame } = buildCurrentSlide();
            vi.stubGlobal('innerWidth', 1000);
            vi.stubGlobal('innerHeight', 500);

            // When
            instance._toggleZoom(400, 200);

            // Then
            expect(frame.style.cursor).toBe('zoom-out');
            expect(frame.style.transform).toContain('translateX');
            expect(instance.zooming).toBe(true);
            vi.unstubAllGlobals();
        });

        it('should zoom out and flip the zooming flag when already zoomed', function () {
            // Given
            const { frame } = buildCurrentSlide();
            instance.zooming = true;

            // When
            instance._toggleZoom(0, 0);

            // Then
            expect(frame.style.cursor).toBe('zoom-in');
            expect(frame.style.transform).toBe('translate3D(0px, 0px, 0px)');
            expect(instance.zooming).toBe(false);
        });
    });

    describe('_convertPercentToCoordinates()', function () {
        it('should convert a percentage string into a pixel coordinate for the given size', function () {
            expect(instance._convertPercentToCoordinates('50%', 200)).toBe(100);
        });
    });
});
