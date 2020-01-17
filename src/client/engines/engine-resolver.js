import { RevealEngine } from './revealjs-client-engine';
import { GenericEngine } from './generic-client-engine';

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
            default:
                return new GenericEngine();
        }
    }
}
