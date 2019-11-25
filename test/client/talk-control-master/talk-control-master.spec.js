'use strict';

import 'module-alias/register';
import { expect, assert } from 'chai';
import { stub } from 'sinon';
import socketIOClient from 'socket.io-client';
import { TalkControlMaster } from '@client/talk-control-master/talk-control-master';
import { MASTER_SERVER_CHANNEL } from '@event-bus/event-bus-resolver';
import { MASTER_SLAVE_CHANNEL } from '../../../src/common/event-bus/event-bus-resolver';

describe('', function() {
    let talkControlMaster;

    before(function() {
        // Needed otherwise there will be an error because there is no server to connect to
        stub(socketIOClient, 'connect').returns({ on: stub() });
    });

    beforeEach(function() {
        talkControlMaster = new TalkControlMaster('http://localhost:3000');
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
            const emit = stub(talkControlMaster.eventBus, 'emit');
            stub(talkControlMaster, 'afterInitialisation');
            stub(talkControlMaster, 'forwardEvents');

            talkControlMaster.frames = [{}, {}, {}];
            // When
            talkControlMaster.init();
            talkControlMaster.frames.forEach(frame => frame.onload());
            // Then
            assert(emit.calledOnceWith(MASTER_SLAVE_CHANNEL, 'init'), 'init was not fired after all iframes loaded');
            emit.restore();
        });
    });

    describe('_onKeyUp', function() {
        let mainChannel;
        beforeEach(function() {
            // Event mock
            mainChannel = talkControlMaster.eventBus.channels[MASTER_SERVER_CHANNEL];
            stub(mainChannel, 'emit');
        });

        afterEach(function() {
            mainChannel.emit.restore();
        });

        it('should fire "arrowUp" event', function() {
            // Given
            const event = new Event('keyup');
            event.key = 'ArrowUp';
            // When
            talkControlMaster._onKeyUp(event);
            // Then
            assert(mainChannel.emit.calledOnceWith('keyPressed', { key: 'arrowUp' }));
        });

        it('should fire "arrowDown" event', function() {
            // Given
            const event = new Event('keyup');
            event.key = 'ArrowDown';
            // When
            talkControlMaster._onKeyUp(event);
            // Then
            assert(mainChannel.emit.calledOnceWith('keyPressed', { key: 'arrowDown' }));
        });

        it('should fire "arrowLeft" event', function() {
            // Given
            const event = new Event('keyup');
            event.key = 'ArrowLeft';
            // When
            talkControlMaster._onKeyUp(event);
            // Then
            assert(mainChannel.emit.calledOnceWith('keyPressed', { key: 'arrowLeft' }));
        });

        it('should fire "arrowRight" event', function() {
            // Given
            const event = new Event('keyup');
            event.key = 'ArrowRight';
            // When
            talkControlMaster._onKeyUp(event);
            // Then
            assert(mainChannel.emit.calledOnceWith('keyPressed', { key: 'arrowRight' }));
        });

        it("shouldn't fire any event", function() {
            // Given
            const event = new Event('keyup');
            event.key = undefined;
            // When
            talkControlMaster._onKeyUp(event);
            // Then
            assert(mainChannel.emit.notCalled);
        });
    });
});
