import { readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const configFilePath: string = require.resolve('../../../config/config.json');

export const setExternalUrl = (item: string, url: string): void => {
    const config = JSON.parse(readFileSync(configFilePath, 'utf8'));
    config[item].urls.external = url;
    writeFileSync(configFilePath, JSON.stringify(config, null, 4));
};

export default { setExternalUrl };
