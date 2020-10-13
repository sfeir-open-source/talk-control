'use strict';

import 'module-alias/register';
import { assert } from 'chai';
import { stub } from 'sinon';
import { logger } from '@services/logger';

describe('Logger service', function() {
    describe('log', function() {
        const stubConsole = function() {
            stub(console, 'error');
            stub(console, 'log');
        };

        const restoreConsole = function() {
            console.log.restore();
            console.error.restore();
        };

        beforeEach(stubConsole);
        afterEach(restoreConsole);

        it('should call console.log', function() {
            logger.log('log message');
            assert.isOk(console.log.calledWith('log message'));
        });

        it('should call console.log with params', function() {
            const params = ['my', 'params'];
            logger.log('log message', params);
            assert.isOk(console.log.calledWith('log message', params));
        });

        it('should call console.error', function() {
            logger.log('log error', '', true);
            assert.isOk(console.error.calledWith('log error'));
        });

        it('should call console.error with params', function() {
            const params = ['my', 'params'];
            logger.log('log error', params, true);
            assert.isOk(console.error.calledWith('log error', params));
        });
    });
});
