import { readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const configFilePath = require.resolve('../../../config/config.json');

/**
 * Update service item with external url in config file
 *
 * @param {string} item - service item in config (tc-server, tc-controller, ...)
 * @param {string} url - url external to write in config for service item
 */
export const setExternalUrl = (item, url) => {
    const config = JSON.parse(readFileSync(configFilePath, 'utf8'));
    config[item].urls.external = url;
    writeFileSync(configFilePath, JSON.stringify(config, null, 4));
};

export default { setExternalUrl };
