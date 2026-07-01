export const logger = {
    log(msg: string, values?: unknown, isError?: boolean): void {
        console[isError ? 'error' : 'log'](msg, values ?? '');
    }
};
