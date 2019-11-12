import { expect } from 'chai';
import { init, gotoSlide, ACTIONS } from '@server/store/actions';

describe('redux actions', function() {
    describe('init()', function() {
        it('should create a "init" action', function() {
            // Given
            const data = { slideNumber: 15 };
            // Then
            expect(init(data)).to.eql({ type: ACTIONS.INIT, data });
        });
    });

    describe('gotoSlide()', function() {
        it('should create a "gotoSlide" action', function() {
            // Given
            const data = { h: 1, v: 4, f: 3 };
            // Then
            expect(gotoSlide(data)).to.eql({ type: ACTIONS.GOTO_SLIDE, data });
        });
    });
});
