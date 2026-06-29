import { RevealEngine } from './revealjs-client-engine';
import { GenericEngine } from './generic-client-engine';

export class EngineResolver {
    static getEngine(engineName: string): GenericEngine {
        switch (engineName) {
            case 'revealjs':
                return new RevealEngine();
            default:
                return new GenericEngine();
        }
    }
}
