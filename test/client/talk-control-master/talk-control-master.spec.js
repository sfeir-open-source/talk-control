'use strict';

import 'module-alias/register';
import { expect, assert } from 'chai';
import { stub } from 'sinon';
import socketIOClient from 'socket.io-client';
import { TalkControlMaster } from '@client/talk-control-master/talk-control-master';
import { MASTER_SERVER_CHANNEL } from '@event-bus/event-bus-resolver';
import { MASTER_SLAVE_CHANNEL } from '../../../src/common/event-bus/event-bus-resolver';
import config from '@config/config.json';

describe('', function() {
    let talkControlMaster;

    before(function() {
        // Needed otherwise there will be an error because there is no server to connect to
        stub(socketIOClient, 'connect').returns({ on: stub() });
    });

    beforeEach(function() {
        talkControlMaster = new TalkControlMaster(config.tcServer.urls.local);
    });

    after(function() {
        socketIOClient.connect.restore();
    });

    describe('constructor()', function() {
        it('should have instantiated TalkControlMaster', function() {
            expect(talkControlMaster).to.be.ok;
        });
    });

    describe('init()', function() {
        it('should fire init when all iframes are loaded', function() {
            // Given
            const broadcast = stub(talkControlMaster.eventBusMaster, 'broadcast');
            stub(talkControlMaster, 'afterInitialisation');
            stub(talkControlMaster, 'forwardEvents');

            talkControlMaster.frames = [{}, {}, {}];
            talkControlMaster.focusFrame = { focus: stub() };
            // When
            talkControlMaster.init();
            talkControlMaster.frames.forEach(frame => frame.onload());
            // Then
            assert(broadcast.calledOnceWith(MASTER_SLAVE_CHANNEL, 'init'), 'init was not fired after all iframes loaded');
            broadcast.restore();
        });
    });
});
