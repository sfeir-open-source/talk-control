import { expect, assert } from 'chai';
import { spy } from 'sinon';
import { GenericEngine } from '../../src/engines/generic-client-engine';

describe('GenericEngine', function() {
    let engine;
    before(function() {
        global.window = { addEventListener: spy() };
    });

    beforeEach(function() {
        engine = new GenericEngine();
    });

    after(function() {
        global.window = undefined;
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
    });
});
