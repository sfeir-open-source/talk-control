import config from '@config/config.json';
import { logger } from '@services/logger';

export const eventBusLogger = {
    isLoggerEnabled(): boolean {
        return config.logger.eventBusEvents;
    },

    log(msg: string, values?: unknown, isError = false): void {
        if (this.isLoggerEnabled()) {
            logger.log(msg, values, isError);
        }
    }
};
