'use strict';

import 'module-alias/register';
import { expect, assert } from 'chai';
import { stub } from 'sinon';
import socketIOClient from 'socket.io-client';
import { TCController } from '@client/tc-controller/tc-controller';
import { CONTROLLER_COMPONENT_CHANNEL } from '@event-bus/event-bus-resolver';
import config from '@config/config.json';

describe('TCController', function() {
    let tcController;

    before(function() {
        // Needed otherwise there will be an error because there is no server to connect to
        stub(socketIOClient, 'connect').returns({ on: stub() });
    });

    beforeEach(function() {
        tcController = new TCController(config.tcServer.urls.local);
    });

    after(function() {
        socketIOClient.connect.restore();
    });

    describe('constructor()', function() {
        it('should have instantiated TCController', function() {
            expect(tcController).to.be.ok;
        });
    });

    describe('init()', function() {
        it('should fire init when all iframes are loaded', function() {
            // Given
            const broadcast = stub(tcController.eventBusMaster, 'broadcast');
            stub(tcController, 'afterInitialisation');
            stub(tcController, 'forwardEvents');

            tcController.frames = [{}, {}, {}];
            tcController.focusFrame = { focus: stub() };
            // When
            tcController.init();
            tcController.frames.forEach(frame => frame.onload());
            // Then
            assert(broadcast.calledOnceWith(CONTROLLER_COMPONENT_CHANNEL, 'init'), 'init was not fired after all iframes loaded');
            broadcast.restore();
        });
    });
});
