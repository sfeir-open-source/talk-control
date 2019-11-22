'use strict';

import 'module-alias/register';
import { expect } from 'chai';
import { stub } from 'sinon';
import { GenericEngine } from '@client/engines/generic-client-engine';

describe('GenericEngine', function() {
    describe('constructor()', function() {
        it('should have instantiated GenericEngine', function() {
            stub(window, 'addEventListener');
            const engine = new GenericEngine();
            window.addEventListener.restore();
            expect(engine).to.be.ok;
        });
    });
});
