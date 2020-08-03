/**
 * Log message or error
 *
 * @param {string} msg - Message to log
 * @param {string} values - Variables to log
 * @param {string} isError - if true, log error
 */
export const logger = {
    log(msg, values, isError) {
        console[isError ? 'error' : 'log'](msg, values || '');
    }
};
