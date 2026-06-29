import config from '../../config/config.json';
import tunnelService from './services/tunnel.js';
import configFileService from './services/config-file.js';

const configItems = ['tcServer', 'tcController', 'tcShowcase'] as const;

const setTunnels = async (): Promise<void> => {
    for (const item of configItems) {
        try {
            const url = await tunnelService.getUrl(config[item].port);
            configFileService.setExternalUrl(item, url);
        } catch (e) {
            console.error(`Unable to set ${item} external url`, e);
        }
    }
};

setTunnels();
