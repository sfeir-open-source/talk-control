import { expect } from 'chai';
import { init, movement, ACTIONS } from '@server/store/actions';

describe('redux actions', function() {
    describe('init()', function() {
        it('should create a "init" action', function() {
            // Given
            const data = { slideNumber: 15 };
            // Then
            expect(init(data)).to.eql({ type: ACTIONS.INIT, data });
        });
    });

    describe('movement()', function() {
        it('should create a "next" action', function() {
            // Given
            const direction = 'right';
            // Then
            expect(movement({ direction })).to.eql({ type: ACTIONS.NEXT });
        });

        it('should create a "prev" action', function() {
            // Given
            const direction = 'left';
            // Then
            expect(movement({ direction })).to.eql({ type: ACTIONS.PREV });
        });

        it('should create a void action', function() {
            // Given
            const direction = '';
            // Then
            expect(movement({ direction })).to.eql({ type: '' });
        });
    });
});
