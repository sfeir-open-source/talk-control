import { RevealEngine } from './revealjs-server-engine';
import { GenericEngine } from './generic-server-engine';

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
        }
    }
}
