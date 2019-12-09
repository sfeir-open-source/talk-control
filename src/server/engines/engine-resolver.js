import { RevealEngine } from './revealjs-server-engine';
import { GenericEngine } from './generic-server-engine';
import { SpectacleEngine } from './spectaclejs-server-engine';

/**
 * @class EngineResolver
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
