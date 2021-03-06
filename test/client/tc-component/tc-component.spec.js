import { expect, assert } from 'chai';
import { stub } from 'sinon';
import { TCComponent } from '@client/tc-component/tc-component';
import { CONTROLLER_COMPONENT_CHANNEL } from '@event-bus/event-bus-resolver';

describe('TCComponent', function() {
    let tcComponent;
    let on, broadcast;
    beforeEach(function() {
        tcComponent = new TCComponent({ engineName: 'revealjs' });
        on = stub(tcComponent.eventBusComponent, 'on');
        broadcast = stub(tcComponent.eventBusComponent, 'broadcast');
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
            assert(on.calledWith(CONTROLLER_COMPONENT_CHANNEL, 'gotoSlide'), '"on" not called with gotoSlide');
            assert(broadcast.calledWith(CONTROLLER_COMPONENT_CHANNEL, 'initialized'), '"broadcast" not called with initialized');
        });
    });
});
