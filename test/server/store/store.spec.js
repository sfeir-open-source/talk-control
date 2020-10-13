import { expect } from 'chai';
import { reducers } from '@server/store';
import { ACTIONS } from '@server/store/actions';

describe('redux store', function() {
    describe('reducers', function() {
        it('should return the initial state', function() {
            // Given
            const state = {
                currentSlide: {},
                slides: []
            };
            // Then
            expect(reducers(state, {})).to.eql(state);
        });

        it('should change state.currentSlide', function() {
            // Given
            const state = {
                currentSlide: { h: 1, v: 1, f: 3 },
                slides: []
            };
            const data = { h: 2, v: 0, f: 0 };
            // Then
            expect(reducers(state, { type: ACTIONS.GOTO_SLIDE, data })).to.eql({ ...state, currentSlide: data });
        });

        it('should handle INIT', function() {
            // Given
            const state = {
                currentSlide: {},
                slides: []
            };
            const data = {
                currentSlide: { h: 0, v: 0, f: 0 },
                slides: [
                    { h: 0, v: 0, f: 0, fMax: 3 },
                    { h: 0, v: 1, f: 0, fMax: 2 },
                    { h: 1, v: 0, f: 0, fMax: 1 },
                    { h: 2, v: 0, f: 0, fMax: 0 }
                ]
            };
            // Then
            expect(reducers(state, { type: ACTIONS.INIT, data })).to.eql({ ...state, ...data });
        });
    });
});
