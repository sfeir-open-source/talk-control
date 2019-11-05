'use strict';

import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { ACTIONS } from './actions';

const logger = createLogger();
const initialState = {
    currentSlide: 0,
    slideNumber: 0
};

export const reducers = (state, action) => {
    switch (action.type) {
        case ACTIONS.INIT:
            return { ...state, slideNumber: action.data.slideNumber };
        case ACTIONS.NEXT:
            if (state.currentSlide < state.slideNumber) return { ...state, currentSlide: state.currentSlide + 1 };
            break;
        case ACTIONS.PREV:
            if (state.currentSlide > 0) return { ...state, currentSlide: state.currentSlide - 1 };
            break;
    }
    return state;
};

export default createStore(reducers, initialState, applyMiddleware(logger));
