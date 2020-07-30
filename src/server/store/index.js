'use strict';

import { createStore } from 'redux';
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

export default createStore(reducers, initialState, applyMiddleware(logger));
