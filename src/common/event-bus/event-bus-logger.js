import config from '@config/config';
import { logger } from '@services/logger';

export const eventBusLogger = {
    isLoggerEnabled() {
        return config.logger.eventBusEvents;
    },

    log(msg, values, isError = false) {
        if (this.isLoggerEnabled()) {
            logger.log(msg, values, isError);
        }
    }
};
