import { createTcStore, TcState } from '@server/store';
import { Store } from 'redux';

export class GenericEngine {
    store: Store<TcState>;

    constructor() {
        this.store = createTcStore();
    }

    init(_params: unknown): void {}

    handleInput(_event: { key: string }): void {}

    handleTouch(_event: { direction: string }): void {}

    slideEquals(_slide1: unknown, _slide2: unknown, _includeFragment?: boolean): boolean {
        return false;
    }
}
