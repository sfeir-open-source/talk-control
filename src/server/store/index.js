'use strict';

import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { ACTIONS } from './actions';

const logger = createLogger();
const initialState = {
    currentSlide: {},
    slides: [],
    slideNumber: 0
};

export const reducers = (state, action) => {
    const { data } = action;
    switch (action.type) {
        case ACTIONS.INIT:
            return { ...state, currentSlide: data.currentSlide, slides: data.slides || state.slides, slideNumber: data.slideNumber || data.slides.length };
        case ACTIONS.GOTO_SLIDE:
            return { ...state, currentSlide: data };
    }
    return state;
};

export default createStore(reducers, initialState, applyMiddleware(logger));
