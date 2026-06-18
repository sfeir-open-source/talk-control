'use strict';

import { expect, assert } from 'chai';
import { EngineResolver } from '@server/engines/engine-resolver';

describe('EngineResolver', function () {
    describe('getEngine()', function () {
        it('should return a RevealEngine for "revealjs"', function () {
            // When
            const engine = EngineResolver.getEngine('revealjs');
            // Then
            expect(engine).to.be.ok;
            expect(engine.store).to.be.ok;
        });

        it('should return undefined for unknown engine name', function () {
            // When
            const engine = EngineResolver.getEngine('unknownEngine');
            // Then
            assert.isUndefined(engine);
        });

        it('should return undefined when no engine name is provided', function () {
            // When
            const engine = EngineResolver.getEngine();
            // Then
            assert.isUndefined(engine);
        });
    });
});
