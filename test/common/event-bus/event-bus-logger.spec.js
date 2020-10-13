'use strict';

import 'module-alias/register';
import { assert } from 'chai';
import sinon from 'sinon';
import { eventBusLogger } from '@event-bus/event-bus-logger';

describe('Event bus logger', function() {
    describe('log', function() {
        let sinonSandbox;

        const stubConsole = function() {
            sinonSandbox.stub(console, 'error');
            sinonSandbox.stub(console, 'log');
        };

        const stubIsLoggerEnabled = function(returnValue) {
            sinonSandbox.stub(eventBusLogger, 'isLoggerEnabled').callsFake(() => returnValue);
        };

        beforeEach(function(done) {
            sinonSandbox = sinon.createSandbox();
            stubConsole();
            done();
        });

        afterEach(function(done) {
            sinonSandbox.restore();
            // restoreConsole();
            done();
        });

        it('should call console.log', function() {
            stubIsLoggerEnabled(true);
            eventBusLogger.log('log message');
            assert.isOk(console.log.calledWith('log message'));
        });

        it('should not call console.log when logger is disabled', function() {
            stubIsLoggerEnabled(false);
            eventBusLogger.log('log message');
            assert.isOk(console.log.neverCalledWith('log message'));
        });

        it('should call console.log with params', function() {
            stubIsLoggerEnabled(true);
            const params = ['my', 'params'];
            eventBusLogger.log('log message', params);
            assert.isOk(console.log.calledWith('log message', params));
        });

        it('should call console.error', function() {
            stubIsLoggerEnabled(true);
            eventBusLogger.log('log error', '', true);
            assert.isOk(console.error.calledWith('log error'));
        });

        it('should not call console.error when logger is disabled', function() {
            stubIsLoggerEnabled(false);
            eventBusLogger.log('log error');
            assert.isOk(console.error.neverCalledWith('log error'));
        });

        it('should call console.error with params', function() {
            stubIsLoggerEnabled(true);
            const params = ['my', 'params'];
            eventBusLogger.log('log error', params, true);
            assert.isOk(console.error.calledWith('log error', params));
        });
    });
});
