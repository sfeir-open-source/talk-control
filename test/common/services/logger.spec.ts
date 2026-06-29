import { logger } from '@services/logger';

describe('Logger service', function () {
    describe('log', function () {
        beforeEach(function () {
            vi.spyOn(console, 'error').mockImplementation(() => {});
            vi.spyOn(console, 'log').mockImplementation(() => {});
        });

        afterEach(function () {
            (console.log as ReturnType<typeof vi.fn>).mockRestore();
            (console.error as ReturnType<typeof vi.fn>).mockRestore();
        });

        it('should call console.log', function () {
            logger.log('log message');
            expect(console.log).toHaveBeenCalledWith('log message', '');
        });

        it('should call console.log with params', function () {
            const params = ['my', 'params'];
            logger.log('log message', params);
            expect(console.log).toHaveBeenCalledWith('log message', params);
        });

        it('should call console.error', function () {
            logger.log('log error', '', true);
            expect(console.error).toHaveBeenCalledWith('log error', '');
        });

        it('should call console.error with params', function () {
            const params = ['my', 'params'];
            logger.log('log error', params, true);
            expect(console.error).toHaveBeenCalledWith('log error', params);
        });
    });
});
