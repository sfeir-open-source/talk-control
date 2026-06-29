import { TCComponent } from './tc-component';

window.addEventListener('DOMContentLoaded', function () {
    const hash = window.location.hash || '#delta=0';
    const params = parseParams(hash);
    new TCComponent({ engineName: 'revealjs', ...params });
});

const parseParams = (hash: string): Record<string, string | boolean | number> => {
    const paramsTab = hash.replace('#', '').split('&');
    const params: Record<string, string | boolean | number> = {};
    for (const paramStr of paramsTab) {
        const [key, rawValue] = paramStr.split('=');
        let value: string | boolean | number;
        if (!rawValue) {
            value = true;
        } else if (!isNaN(Number(rawValue))) {
            value = parseInt(rawValue);
        } else {
            value = rawValue;
        }
        params[key] = value;
    }
    return params;
};
