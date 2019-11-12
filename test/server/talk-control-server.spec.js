import { expect, assert } from 'chai';
import { stub } from 'sinon';
import { TalkControlServer } from '@server/talk-control-server';
import store from '@server/store';

describe('should have instantiated', function() {
    let talkControlServer;
    let on;
    beforeEach(function() {
        talkControlServer = new TalkControlServer();
        on = stub();
        talkControlServer.eventBus = { socketBus: { on } };
    });

    describe('constructor()', function() {
        it('should have instantiated TalkControlServer', function() {
            expect(talkControlServer).to.be.ok;
        });
    });

    describe('init()', function() {
        it('should do the required subscriptions', function() {
            // When
            talkControlServer.init('revealjs');
            // Then
            assert(on.calledTwice);
            assert(on.calledWith('init'));
            assert(on.calledWith('keyPressed'));
        });
    });

    describe('emitStateChanges()', function() {
        let emit;
        beforeEach(function() {
            emit = stub();
            talkControlServer.eventBus = { socketBus: { emit, on } };
        });

        it('should emit noting', function() {
            // Given
            const state = { currentSlide: { h: 1, v: 0, f: 0 }, slides: [] };
            stub(store, 'getState').returns(state);

            talkControlServer.previousState = state;
            // When
            talkControlServer.init('revealjs');
            talkControlServer.emitStateChanges();
            // Then
            assert(emit.notCalled);
            store.getState.restore();
        });

        it('should fire "gotoSlide" event', function() {
            // Given
            const state = { currentSlide: { h: 1, v: 0, f: 0 }, slides: [{ h: 0, v: 0, f: 0, fMax: 0 }, { h: 1, v: 0, f: 0, fMax: 0 }] };
            stub(store, 'getState').returns(state);

            talkControlServer.previousState = { ...state, currentSlide: { h: 0, v: 0, f: 0 } };
            // When
            talkControlServer.init('revealjs');
            talkControlServer.emitStateChanges();
            // Then
            assert(emit.calledOnceWith('gotoSlide'));
            store.getState.restore();
        });

        it('should fire "initialized" event', function() {
            // Given
            const state = { currentSlide: { h: 0, v: 0, f: 0 }, slides: [{ h: 0, v: 0, f: 0, fMax: 0 }, { h: 1, v: 0, f: 0, fMax: 0 }] };
            stub(store, 'getState').returns(state);

            talkControlServer.previousState = { currentSlide: {}, slides: [] };
            // When
            talkControlServer.init('revealjs');
            talkControlServer.emitStateChanges();
            // Then
            assert(emit.calledOnceWith('initialized'));
            store.getState.restore();
        });
    });
});
