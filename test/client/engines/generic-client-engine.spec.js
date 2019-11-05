'use strict';

import 'module-alias/register';
import { expect, assert } from 'chai';
import { spy, stub } from 'sinon';
import { GenericEngine } from '@client/engines/generic-client-engine';

describe('GenericEngine', function() {
    let engine;
    before(function() {
        // global.window = { addEventListener: spy() };
        stub(window, 'addEventListener');
    });

    beforeEach(function() {
        engine = new GenericEngine();
    });

    after(function() {
        // global.window = undefined;
        window.addEventListener.restore();
    });

    describe('constructor()', function() {
        it('should have instantiated GenericEngine', function() {
            expect(engine).to.be.ok;
        });
    });

    describe('receiveMessageFromRemote()', function() {
        it('should call forwardMessageFromRemote()', function() {
            // Given
            const data = { text: 'test' };
            engine.forwardMessageFromRemote = spy();
            // When
            engine.receiveMessageFromRemote({ data: JSON.stringify(data) });
            // Then
            assert(engine.forwardMessageFromRemote.calledOnceWith(data));
        });

        it("shouldn't call forwardMessageFromRemote()", function() {
            // Given
            const data = 'test';
            engine.forwardMessageFromRemote = spy();
            // When
            engine.receiveMessageFromRemote({ data });
            // Then
            assert(engine.forwardMessageFromRemote.notCalled);
        });
    });
});
