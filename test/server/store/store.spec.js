import { expect } from 'chai';
import { reducers } from '@server/store';
import { ACTIONS } from '@server/store/actions';

describe('redux store', function() {
    describe('reducers', function() {
        it('should return the initial state', function() {
            // Given
            const state = {
                currentSlide: 0,
                slideNumber: 0
            };
            // Then
            expect(reducers(state, {})).to.eql(state);
        });

        it('should increment state.currentSlide', function() {
            // Given
            const state = {
                currentSlide: 1,
                slideNumber: 15
            };
            // Then
            expect(reducers(state, { type: ACTIONS.NEXT })).to.eql({ ...state, currentSlide: 2 });
        });

        it('should not increment state.currentSlide', function() {
            // Given
            const state = {
                currentSlide: 15,
                slideNumber: 15
            };
            // Then
            expect(reducers(state, { type: ACTIONS.NEXT })).to.eql(state);
        });

        it('should decrement state.currentSlide', function() {
            // Given
            const state = {
                currentSlide: 1,
                slideNumber: 15
            };
            // Then
            expect(reducers(state, { type: ACTIONS.PREV })).to.eql({ ...state, currentSlide: 0 });
        });

        it('should not decrement state.currentSlide', function() {
            // Given
            const state = {
                currentSlide: 0,
                slideNumber: 15
            };
            // Then
            expect(reducers(state, { type: ACTIONS.PREV })).to.eql(state);
        });

        it('should handle INIT', function() {
            // Given
            const state = {
                currentSlide: 0,
                slideNumber: 0
            };
            // Then
            expect(reducers(state, { type: ACTIONS.INIT, data: { slideNumber: 15 } })).to.eql({ ...state, slideNumber: 15 });
        });
    });
});
