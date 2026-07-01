import config from '@config/config.json';
import { createStore, applyMiddleware, Store } from 'redux';
import { createLogger } from 'redux-logger';
import { ACTIONS } from './actions';

export interface Slide {
    h: number;
    v: number;
    f: number;
    fMax: number;
}

export interface TcState {
    currentSlide: Partial<Slide>;
    slides: Slide[];
}

type TcAction = { type: string; data?: unknown };

const initialState: TcState = {
    currentSlide: {},
    slides: []
};

export const reducers = (state: TcState = initialState, action: TcAction): TcState => {
    const { data } = action;
    switch (action.type) {
        case ACTIONS.INIT: {
            const initData = data as { currentSlide: Partial<Slide>; slides: Slide[] };
            return { ...state, currentSlide: initData.currentSlide, slides: initData.slides };
        }
        case ACTIONS.GOTO_SLIDE:
            return { ...state, currentSlide: data as Partial<Slide> };
    }
    return state;
};

export function createTcStore(): Store<TcState> {
    return createStore(reducers, initialState, config.logger.redux ? applyMiddleware(createLogger()) : undefined);
}
