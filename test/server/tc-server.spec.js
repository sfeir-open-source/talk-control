import { expect, assert } from 'chai';
import { stub } from 'sinon';
import { TCServer } from '@server/tc-server';
import { CONTROLLER_SERVER_CHANNEL } from '@event-bus/event-bus-resolver';
import store from '@server/store';

describe('TCServer', function() {
    let tcServer;
    let onMultiple;
    beforeEach(function() {
        tcServer = new TCServer();
        onMultiple = stub(tcServer.channel, 'onMultiple');
    });

    describe('constructor()', function() {
        it('should have instantiated TCServer', function() {
            expect(tcServer).to.be.ok;
        });
    });

    describe('init()', function() {
        it('should do the required subscriptions', function() {
            // When
            tcServer.init('revealjs');
            // Then
            assert(onMultiple.calledWith(CONTROLLER_SERVER_CHANNEL, 'init'), 'not called with init');
            assert(onMultiple.calledWith(CONTROLLER_SERVER_CHANNEL, 'inputEvent'), 'not called with inputEvent');
            assert(onMultiple.calledWith(CONTROLLER_SERVER_CHANNEL, 'pluginEventIn'), 'not called with pluginEventIn');
        });
    });

    describe('broadcastStateChanges()', function() {
        it('should fire "gotoSlide" event', function() {
            const broadcast = stub(tcServer.eventBusServer, 'broadcast');
            // Given
            const state = {
                currentSlide: { h: 1, v: 0, f: 0 },
                slides: [
                    { h: 0, v: 0, f: 0, fMax: 0 },
                    { h: 1, v: 0, f: 0, fMax: 0 }
                ]
            };
            stub(store, 'getState').returns(state);
            // When
            tcServer.init('revealjs');
            tcServer.broadcastStateChanges();
            // Then
            assert(broadcast.calledOnceWith(CONTROLLER_SERVER_CHANNEL, 'gotoSlide'));
            store.getState.restore();
        });
    });
});
