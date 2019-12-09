import { RevealEngine } from './revealjs-client-engine';
import { GenericEngine } from './generic-client-engine';
import { SpectacleEngine } from './spectaclejs-client-engine';

/**
 * @class EngineResolver
 * @classdesc [client-side] Engine factory
 */
export class EngineResolver {
    /**
     * Instantiate a new Engine
     *
     * @param {string} engineName - Name of the engine to start
     * @returns {GenericEngine} An engine
     */
    static getEngine(engineName) {
        switch (engineName) {
            case 'revealjs':
                return new RevealEngine();
            case 'spectaclejs':
                return new SpectacleEngine();
            default:
                return new GenericEngine();
        }
    }
}
