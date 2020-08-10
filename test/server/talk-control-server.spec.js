import { expect, assert } from 'chai';
import { stub } from 'sinon';
import { TalkControlServer } from '@server/talk-control-server';
import { MASTER_SERVER_CHANNEL } from '@event-bus/event-bus-resolver';
import store from '@server/store';

describe('TalkControlServer', function() {
    let talkControlServer;
    let onMultiple;
    beforeEach(function() {
        talkControlServer = new TalkControlServer();
        onMultiple = stub(talkControlServer.eventBusServer, 'onMultiple');
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
            assert(onMultiple.calledWith(MASTER_SERVER_CHANNEL, 'init'), 'not called with init');
            assert(onMultiple.calledWith(MASTER_SERVER_CHANNEL, 'inputEvent'), 'not called with inputEvent');
            assert(onMultiple.calledWith(MASTER_SERVER_CHANNEL, 'pluginEventIn'), 'not called with pluginEventIn');
        });
    });

    describe('broadcastStateChanges()', function() {
        it('should fire "gotoSlide" event', function() {
            const broadcast = stub(talkControlServer.eventBusServer, 'broadcast');
            // Given
            const state = { currentSlide: { h: 1, v: 0, f: 0 }, slides: [{ h: 0, v: 0, f: 0, fMax: 0 }, { h: 1, v: 0, f: 0, fMax: 0 }] };
            stub(store, 'getState').returns(state);
            // When
            talkControlServer.init('revealjs');
            talkControlServer.broadcastStateChanges();
            // Then
            assert(broadcast.calledOnceWith(MASTER_SERVER_CHANNEL, 'gotoSlide'));
            store.getState.restore();
        });
    });
});
