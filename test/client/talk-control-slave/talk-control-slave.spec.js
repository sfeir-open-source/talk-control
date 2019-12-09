import { expect, assert } from 'chai';
import { stub } from 'sinon';
import { TalkControlSlave } from '@client/talk-control-slave/talk-control-slave';
import { MASTER_SLAVE_CHANNEL } from '@event-bus/event-bus-resolver';

describe('TalkControlSlave', function() {
    let talkControlSlave;
    let on, emit;
    beforeEach(function() {
        talkControlSlave = new TalkControlSlave({ engineName: 'revealjs' });
        on = stub(talkControlSlave.eventBusSlave, 'on');
        emit = stub(talkControlSlave.eventBusSlave, 'emit');
    });

    describe('constructor()', function() {
        it('should have instantiated TalkControlServer', function() {
            expect(talkControlSlave).to.be.ok;
        });
    });

    describe('init()', function() {
        it('should do the required subscriptions', async function() {
            // When
            await talkControlSlave.init();
            // Then
            assert(emit.calledOnceWith(MASTER_SLAVE_CHANNEL, 'initialized'), '"emit" not called with initialized');
            assert(on.calledOnceWith(MASTER_SLAVE_CHANNEL, 'gotoSlide'), '"on" not called with gotoSlide');
        });
    });
});
