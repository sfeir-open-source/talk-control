'use strict';

import { EngineResolver } from '@server/engines/engine-resolver';

describe('EngineResolver', function () {
    describe('getEngine()', function () {
        it('should return a RevealEngine for "revealjs"', function () {
            // When
            const engine = EngineResolver.getEngine('revealjs');
            // Then
            expect(engine).toBeTruthy();
            expect(engine.store).toBeTruthy();
        });

        it('should return undefined for unknown engine name', function () {
            // When
            const engine = EngineResolver.getEngine('unknownEngine');
            // Then
            expect(engine).toBeUndefined();
        });

        it('should return undefined when no engine name is provided', function () {
            // When
            const engine = EngineResolver.getEngine();
            // Then
            expect(engine).toBeUndefined();
        });
    });
});
