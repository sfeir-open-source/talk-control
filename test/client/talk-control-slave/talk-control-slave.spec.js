import { expect, assert } from 'chai';
import { stub } from 'sinon';
import { TalkControlSlave } from '@client/talk-control-slave/talk-control-slave';
import { SECONDARY_CHANNEL } from '@event-bus/event-bus-resolver';

describe('TalkControlSlave', function() {
    let talkControlSlave;
    let on, emit;
    beforeEach(function() {
        talkControlSlave = new TalkControlSlave({ engineName: 'revealjs' });
        on = stub(talkControlSlave.eventBus, 'on');
        emit = stub(talkControlSlave.eventBus, 'emit');
    });

    describe('constructor()', function() {
        it('should have instantiated TalkControlServer', function() {
            expect(talkControlSlave).to.be.ok;
        });
    });

    describe('init()', function() {
        it('should do the required subscriptions', function() {
            // When
            talkControlSlave.init('revealjs');
            // Then
            assert(emit.calledOnceWith(SECONDARY_CHANNEL, 'initialized'), '"emit" not called with initialized');
            assert(on.calledOnceWith(SECONDARY_CHANNEL, 'gotoSlide'), '"on" not called with gotoSlide');
        });
    });
});
