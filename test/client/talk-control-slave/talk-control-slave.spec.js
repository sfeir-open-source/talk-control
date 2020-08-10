import { expect, assert } from 'chai';
import { stub } from 'sinon';
import { TalkControlSlave } from '@client/talk-control-slave/talk-control-slave';
import { MASTER_SLAVE_CHANNEL } from '@event-bus/event-bus-resolver';

describe('TalkControlSlave', function() {
    let talkControlSlave;
    let on, broadcast;
    beforeEach(function() {
        talkControlSlave = new TalkControlSlave({ engineName: 'revealjs' });
        on = stub(talkControlSlave.eventBusSlave, 'on');
        broadcast = stub(talkControlSlave.eventBusSlave, 'broadcast');
    });

    describe('constructor()', function() {
        it('should have instantiated TalkControlServer', function() {
            expect(talkControlSlave).to.be.ok;
        });
    });

    describe('init()', function() {
        it('should do the required subscriptions', function() {
            // When
            talkControlSlave.init();
            // Then
            assert(broadcast.calledOnceWith(MASTER_SLAVE_CHANNEL, 'initialized'), '"broadcast" not called with initialized');
            assert(on.calledWith(MASTER_SLAVE_CHANNEL, 'gotoSlide'), '"on" not called with gotoSlide');
            assert(on.calledWith(MASTER_SLAVE_CHANNEL, 'registerPlugin'), '"on" not called with registerPlugin');
        });
    });
});
