import { assert, expect } from 'chai';
import { stub } from 'sinon';
import { TCComponent } from '@client/tc-component/tc-component';

describe('TCComponent', function() {
    let tcComponent;
    let on, broadcast;
    beforeEach(function() {
        tcComponent = new TCComponent({ engineName: 'revealjs' });
        on = stub(tcComponent.channel, 'on');
        broadcast = stub(tcComponent.channel, 'broadcast');
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
    });
});
