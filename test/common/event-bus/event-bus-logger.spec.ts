import { eventBusLogger } from '@event-bus/event-bus-logger';

describe('Event bus logger', function () {
    describe('log', function () {
        const stubIsLoggerEnabled = function (returnValue: boolean) {
            vi.spyOn(eventBusLogger, 'isLoggerEnabled').mockImplementation(() => returnValue);
        };

        beforeEach(function () {
            vi.spyOn(console, 'error').mockImplementation(() => {});
            vi.spyOn(console, 'log').mockImplementation(() => {});
        });

        afterEach(function () {
            vi.restoreAllMocks();
        });

        it('should call console.log', function () {
            stubIsLoggerEnabled(true);
            eventBusLogger.log('log message');
            expect(console.log).toHaveBeenCalledWith('log message', '');
        });

        it('should not call console.log when logger is disabled', function () {
            stubIsLoggerEnabled(false);
            eventBusLogger.log('log message');
            expect(console.log).not.toHaveBeenCalledWith('log message', '');
        });

        it('should call console.log with params', function () {
            stubIsLoggerEnabled(true);
            const params = ['my', 'params'];
            eventBusLogger.log('log message', params);
            expect(console.log).toHaveBeenCalledWith('log message', params);
        });

        it('should call console.error', function () {
            stubIsLoggerEnabled(true);
            eventBusLogger.log('log error', '', true);
            expect(console.error).toHaveBeenCalledWith('log error', '');
        });

        it('should not call console.error when logger is disabled', function () {
            stubIsLoggerEnabled(false);
            eventBusLogger.log('log error');
            expect(console.error).not.toHaveBeenCalledWith('log error', '');
        });

        it('should call console.error with params', function () {
            stubIsLoggerEnabled(true);
            const params = ['my', 'params'];
            eventBusLogger.log('log error', params, true);
            expect(console.error).toHaveBeenCalledWith('log error', params);
        });
    });
});
