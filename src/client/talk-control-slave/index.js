'use strict';

import { TalkControlSlave } from './talk-control-slave';

// TODO: retrieve engineName from configuration
new TalkControlSlave({ engineName: 'revealjs' });

// Give the focus back to parent each time it goes to the iframe
document.addEventListener('click', () => {
    parent.focus();
});
