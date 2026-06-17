import { assert, expect } from 'chai';
import { stub, spy } from 'sinon';
import { TCComponent } from '@client/tc-component/tc-component';

describe('TCComponent', function() {
    let tcComponent;
    let on, broadcast;
    beforeEach(function() {
        tcComponent = new TCComponent({ engineName: 'revealjs' });
        on = stub(tcComponent.controllerComponentChannel, 'on');
        broadcast = stub(tcComponent.controllerComponentChannel, 'broadcast');
    });

    describe('constructor()', function() {
        it('should have instantiated TCServer', function() {
            expect(tcComponent).to.be.ok;
        });
    });

    describe('init()', function() {
        it('should do the required subscriptions', function() {
            // When
            tcComponent.init();
            // Then
            assert(on.calledWith('gotoSlide'), '"on" not called with gotoSlide');
            assert(broadcast.calledWith('initialized'), '"broadcast" not called with initialized');
        });

        it('should NOT broadcast "initialized" when delta is set', function() {
            // Given
            const tcComponentWithDelta = new TCComponent({ engineName: 'revealjs', delta: 1 });
            const broadcastWithDelta = stub(tcComponentWithDelta.controllerComponentChannel, 'broadcast');
            stub(tcComponentWithDelta.controllerComponentChannel, 'on');
            // When
            tcComponentWithDelta.init();
            // Then
            assert(broadcastWithDelta.neverCalledWith('initialized'), '"broadcast" should NOT be called with initialized when delta is set');
        });

        it('should broadcast "sendNotesToController" when delta is 0 and gotoSlide is called', function() {
            // Given
            let gotoSlideCallback;
            on.callsFake((event, cb) => {
                if (event === 'gotoSlide') gotoSlideCallback = cb;
            });
            // When
            tcComponent.init();
            // Then gotoSlide callback should trigger sendNotesToController
            assert.isFunction(gotoSlideCallback, 'gotoSlide callback should be registered');
            // Simulate calling the gotoSlide handler
            const getSlideNotesSpy = stub(tcComponent.engine, 'getSlideNotes').returns('some notes');
            stub(tcComponent.engine, 'goToSlide');
            gotoSlideCallback({ slide: { h: 0, v: 0, f: -1 } });
            assert(broadcast.calledWith('sendNotesToController', 'some notes'), 'should broadcast sendNotesToController');
            tcComponent.engine.getSlideNotes.restore();
            tcComponent.engine.goToSlide.restore();
        });
    });
});
