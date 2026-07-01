import { RevealEngine } from './revealjs-server-engine';
import { GenericEngine } from './generic-server-engine';

export class EngineResolver {
    static getEngine(engineName: string): GenericEngine | undefined {
        switch (engineName) {
            case 'revealjs':
                return new RevealEngine();
        }
    }
}
