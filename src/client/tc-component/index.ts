import { TCComponent } from './tc-component';

window.addEventListener('DOMContentLoaded', function () {
    // Uses the query string rather than the hash: Reveal's own hash-based slide
    // routing reads and rewrites location.hash during initialization, racing
    // with this deferred module script and wiping out params passed via `#`.
    const search = window.location.search || '?delta=0';
    const params = parseParams(search);
    new TCComponent({ engineName: 'revealjs', ...params });
});

const parseParams = (search: string): Record<string, string | boolean | number> => {
    const paramsTab = search.replace('?', '').split('&');
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
