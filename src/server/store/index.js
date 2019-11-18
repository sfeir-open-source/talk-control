'use strict';

import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { ACTIONS } from './actions';

const logger = createLogger();
const initialState = {
    currentSlide: {},
    slides: []
};

export const reducers = (state, action) => {
    const { data } = action;
    switch (action.type) {
        case ACTIONS.INIT:
            return { ...state, currentSlide: data.currentSlide, slides: data.slides };
        case ACTIONS.GOTO_SLIDE:
            return { ...state, currentSlide: data };
    }
    return state;
};

export default createStore(reducers, initialState, applyMiddleware(logger));
