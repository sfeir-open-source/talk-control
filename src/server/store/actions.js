'use strict';

export const ACTIONS = {
    INIT: 'INIT',
    GOTO_SLIDE: 'GOTO_SLIDE'
};

export const init = data => ({ type: ACTIONS.INIT, data });
export const gotoSlide = slide => ({ type: ACTIONS.GOTO_SLIDE, data: slide });
