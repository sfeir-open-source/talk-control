import { expect, assert } from 'chai';
import { stub } from 'sinon';
import { TalkControlServer } from '@server/talk-control-server';
import store from '@server/store';

describe('should have instantiated', function() {
    let talkControlServer;
    beforeEach(function() {
        talkControlServer = new TalkControlServer();
    });

    describe('constructor()', function() {
        it('should have instantiated TalkControlServer', function() {
            expect(talkControlServer).to.be.ok;
        });
    });

    describe('init()', function() {
        it('should do the required subscriptions', function() {
            // Given
            const on = stub();
            talkControlServer.eventBus = { socketBus: { on } };
            // When
            talkControlServer.init();
            // Then
            assert(on.calledTwice);
            assert(on.calledWith('init'));
            assert(on.calledWith('movement'));
        });
    });

    describe('emitStateChanges()', function() {
        let emit;
        beforeEach(function() {
            emit = stub();
            talkControlServer.eventBus = { socketBus: { emit } };
        });

        it('should emit noting', function() {
            // Given
            const state = { currentSlide: 1, slideNumber: 15 };
            stub(store, 'getState').returns(state);

            talkControlServer.previousState = state;
            // When
            talkControlServer.emitStateChanges();
            // Then
            assert(emit.notCalled);
            store.getState.restore();
        });

        it('should fire "currentSlide" event', function() {
            // Given
            const state = { currentSlide: 2, slideNumber: 15 };
            stub(store, 'getState').returns(state);

            talkControlServer.previousState = { ...state, currentSlide: 1 };
            // When
            talkControlServer.emitStateChanges();
            // Then
            assert(emit.calledOnceWith('currentSlide'));
            store.getState.restore();
        });

        it('should fire "slideNumber" event', function() {
            // Given
            const state = { currentSlide: 0, slideNumber: 15 };
            stub(store, 'getState').returns(state);

            talkControlServer.previousState = { ...state, slideNumber: 0 };
            // When
            talkControlServer.emitStateChanges();
            // Then
            assert(emit.calledOnceWith('slideNumber'));
            store.getState.restore();
        });
    });
});
