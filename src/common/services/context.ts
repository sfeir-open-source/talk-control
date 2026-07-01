import { config } from '@services/config';

export default {
    isClientSide(): boolean {
        return typeof window !== 'undefined';
    },

    isPresentationIframe(windowLocationHref: string): boolean {
        if (!windowLocationHref) {
            return false;
        }

        return windowLocationHref.indexOf(`:${config.tcController.port}`) === -1;
    },

    isUsingRemoteUrl(windowLocationHref: string): boolean {
        if (!windowLocationHref) {
            return false;
        }

        return !/(:\/\/localhost|:\/\/127.0.0.1)/.test(windowLocationHref);
    }
};
