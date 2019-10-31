'use strict';

import 'module-alias/register';
import { expect, assert } from 'chai';
import { stub } from 'sinon';
import socketIOClient from 'socket.io-client';
import { TalkControlMaster } from '@client/talk-control-master/talk-control-master';

describe('', function() {
    let talkControlMaster;

    before(function() {
        // Needed otherwise there will be an error because there is no server to connect to
        stub(socketIOClient, 'connect').returns({ on: stub() });
    });

    beforeEach(function() {
        talkControlMaster = new TalkControlMaster();
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
        let inputPresentation, btnValidate, iframe, urlError, formGroup;
        let eventBus;

        beforeEach(function() {
            // Display mock
            inputPresentation = { value: 'http://test.com:8080', addEventListener: stub() };
            btnValidate = { addEventListener: stub() };
            iframe = { style: { display: 'none' }, src: '' };
            urlError = { innerHTML: '' };
            formGroup = { style: { display: '' } };

            const getElementById = stub(document, 'getElementById');
            getElementById.withArgs('inputPresentation').returns(inputPresentation);
            getElementById.withArgs('btnValidate').returns(btnValidate);
            getElementById.withArgs('stageFrame').returns(iframe);
            getElementById.withArgs('urlError').returns(urlError);
            getElementById.withArgs('form-group').returns(formGroup);

            // Event mock
            stub(talkControlMaster.eventBus, 'emit');
            eventBus = talkControlMaster.eventBus;
        });

        afterEach(function() {
            document.getElementById.restore();
        });

        it('should have displayed the iframe when btnValidate is clicked', function() {
            // Given
            let btnCallback;
            btnValidate.addEventListener = (_, callback) => (btnCallback = callback);
            // When
            talkControlMaster.init();
            btnCallback();
            // Then
            expect(formGroup.style.display).to.be.equals('none');
            expect(iframe.style.display).to.be.equals('');
            expect(iframe.src).to.be.equals(inputPresentation.value);
        });

        it('should have displayed the iframe when enter is pushed on inputPresentation', function() {
            // Given
            let inputCallback;
            inputPresentation.addEventListener = (_, callback) => (inputCallback = callback);
            // When
            talkControlMaster.init();
            inputCallback({ keyCode: 13 });
            // Then
            expect(formGroup.style.display).to.be.equals('none');
            expect(iframe.style.display).to.be.equals('');
            expect(iframe.src).to.be.equals(inputPresentation.value);
        });

        it('should not displayed the iframe when another key is pushed on inputPresentation', function() {
            // Given
            let inputCallback;
            inputPresentation.addEventListener = (_, callback) => (inputCallback = callback);
            // When
            talkControlMaster.init();
            inputCallback({ keyCode: 12 });
            // Then
            expect(formGroup.style.display).to.be.equals('');
            expect(iframe.style.display).to.be.equals('none');
            expect(iframe.src).to.be.equals('');
        });

        it('should have shown an error because there is no URL given', function() {
            // Given
            let btnCallback;
            btnValidate.addEventListener = (_, callback) => (btnCallback = callback);
            inputPresentation.value = '';
            // When
            talkControlMaster.init();
            btnCallback();
            // Then
            expect(urlError.innerHTML).to.be.equals('URL is not valid');
            expect(iframe.style.display).to.be.equals('none');
        });

        it('should fire "up" event', function() {
            // Given
            const event = new Event('keyup');
            event.key = 'ArrowUp';
            // When
            talkControlMaster.init();
            document.dispatchEvent(event);
            // Then
            assert(eventBus.emit.calledOnceWith('movement', { data: 'up' }));
        });

        it('should fire "down" event', function() {
            // Given
            const event = new Event('keyup');
            event.key = 'ArrowDown';
            // When
            talkControlMaster.init();
            document.dispatchEvent(event);
            // Then
            assert(eventBus.emit.calledOnceWith('movement', { data: 'down' }));
        });

        it('should fire "left" event', function() {
            // Given
            const event = new Event('keyup');
            event.key = 'ArrowLeft';
            // When
            talkControlMaster.init();
            document.dispatchEvent(event);
            // Then
            assert(eventBus.emit.calledOnceWith('movement', { data: 'left' }));
        });

        it('should fire "right" event', function() {
            // Given
            const event = new Event('keyup');
            event.key = 'ArrowRight';
            // When
            talkControlMaster.init();
            document.dispatchEvent(event);
            // Then
            assert(eventBus.emit.calledOnceWith('movement', { data: 'right' }));
        });

        it("shouldn't fire any event", function() {
            // Given
            const event = new Event('keyup');
            event.key = undefined;
            // When
            talkControlMaster.init();
            document.dispatchEvent(event);
            // Then
            assert(eventBus.emit.notCalled);
        });
    });
});
