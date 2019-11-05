'use strict';

export const ACTIONS = {
    INIT: 'INIT',
    MOVEMENT: 'MOVEMENT',
    NEXT: 'NEXT',
    PREV: 'PREV'
};

export const init = data => ({ type: ACTIONS.INIT, data });
export const movement = ({ direction }) => {
    let type = '';
    switch (direction) {
        case 'left':
            type = ACTIONS.PREV;
            break;
        case 'right':
            type = ACTIONS.NEXT;
            break;
    }
    return { type };
};
