export const ACTIONS = {
    INIT: 'INIT',
    GOTO_SLIDE: 'GOTO_SLIDE'
} as const;

export const init = (data: unknown) => ({ type: ACTIONS.INIT, data });
export const gotoSlide = (slide: unknown) => ({ type: ACTIONS.GOTO_SLIDE, data: slide });
