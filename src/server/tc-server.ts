import http from 'http';
import { EngineResolver } from './engines/engine-resolver';
import { GenericEngine } from './engines/generic-server-engine';
import { Channels, EventBusResolver } from '@event-bus/event-bus-resolver';
import { EventBus } from '@event-bus/event-bus';
import { plugins } from '@services/config';

export class TCServer {
    controllerServerChannel: EventBus;
    engine!: GenericEngine;

    constructor(server: http.Server) {
        this.controllerServerChannel = EventBusResolver.channel(Channels.CONTROLLER_SERVER, { server });
    }

    init(engineName: string): void {
        this.engine = EngineResolver.getEngine(engineName)!;
        this.controllerServerChannel.onMultiple('init', data => {
            this.engine.init(data);
            this.controllerServerChannel.broadcast('pluginsList', plugins);
        });
        this.controllerServerChannel.onMultiple('inputEvent', input => this.engine.handleInput(input as { key: string }));
        this.controllerServerChannel.onMultiple('pluginStartingIn', data => this.controllerServerChannel.broadcast('pluginStartingOut', data));
        this.controllerServerChannel.onMultiple('pluginEndingIn', data => this.controllerServerChannel.broadcast('pluginEndingOut', data));
        this.controllerServerChannel.onMultiple('pluginEventIn', data => this.controllerServerChannel.broadcast('pluginEventOut', data));

        this.engine.store.subscribe(() => this._broadcastStateChanges());
    }

    _broadcastStateChanges(): void {
        this.controllerServerChannel.broadcast('gotoSlide', { slide: this.engine.store.getState().currentSlide });
    }
}
