'use strict';

import config from '@config/config';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { ACTIONS } from './actions';

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

/**
 *
 */
export function createTcStore() {
    return createStore(reducers, initialState, config.logger.redux ? applyMiddleware(createLogger()) : undefined);
}
