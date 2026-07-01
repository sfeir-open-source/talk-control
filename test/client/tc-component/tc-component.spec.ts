import { TCComponent } from '@client/tc-component/tc-component';

describe('TCComponent', function () {
    let tcComponent!: TCComponent;
    let on: ReturnType<typeof vi.fn>, broadcast: ReturnType<typeof vi.fn>;

    beforeEach(function () {
        tcComponent = new TCComponent({ engineName: 'revealjs' });
        vi.spyOn(tcComponent.engine, 'init').mockImplementation(() => {});
        vi.spyOn(tcComponent.engine, 'getSlides').mockReturnValue([]);
        on = vi.spyOn(tcComponent.controllerComponentChannel, 'on').mockImplementation(() => {});
        broadcast = vi.spyOn(tcComponent.controllerComponentChannel, 'broadcast').mockImplementation(() => {});
    });

    describe('constructor()', function () {
        it('should have instantiated TCServer', function () {
            expect(tcComponent).toBeTruthy();
        });
    });

    describe('init()', function () {
        it('should do the required subscriptions', function () {
            // When
            tcComponent.init();
            // Then
            expect(on).toHaveBeenCalledWith('gotoSlide', expect.any(Function));
            expect(broadcast).toHaveBeenCalledWith('initialized', expect.any(Object));
        });

        it('should NOT broadcast "initialized" when delta is set', function () {
            // Given
            const tcComponentWithDelta = new TCComponent({ engineName: 'revealjs', delta: 1 });
            vi.spyOn(tcComponentWithDelta.engine, 'init').mockImplementation(() => {});
            vi.spyOn(tcComponentWithDelta.engine, 'getSlides').mockReturnValue([]);
            const broadcastWithDelta = vi.spyOn(tcComponentWithDelta.controllerComponentChannel, 'broadcast').mockImplementation(() => {});
            vi.spyOn(tcComponentWithDelta.controllerComponentChannel, 'on').mockImplementation(() => {});
            // When
            tcComponentWithDelta.init();
            // Then
            expect(broadcastWithDelta).not.toHaveBeenCalled();
        });

        it('should broadcast "sendNotesToController" when delta is 0 and gotoSlide is called', function () {
            // Given
            let gotoSlideCallback: ((...args: unknown[]) => void) | undefined;
            on.mockImplementation((event: string, cb: (...args: unknown[]) => void) => {
                if (event === 'gotoSlide') gotoSlideCallback = cb;
            });
            // When
            tcComponent.init();
            // Then gotoSlide callback should trigger sendNotesToController
            expect(gotoSlideCallback).toBeTypeOf('function');
            // Simulate calling the gotoSlide handler
            const getSlideNotesSpy = vi.spyOn(tcComponent.engine, 'getSlideNotes').mockReturnValue('some notes');
            const goToSlideSpy = vi.spyOn(tcComponent.engine, 'goToSlide').mockImplementation(() => {});
            gotoSlideCallback!({ slide: { h: 0, v: 0, f: -1 } });
            expect(broadcast).toHaveBeenCalledWith('sendNotesToController', 'some notes');
            getSlideNotesSpy.mockRestore();
            goToSlideSpy.mockRestore();
        });
    });
});
