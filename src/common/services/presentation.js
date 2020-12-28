/**
 * Resolve what the controlled presentation URL should be and returns it
 *
 * @param {string} patcherUrl - patcher server base url
 * @returns {string} presentation URL
 * @private
 */
function resolveUrl(patcherUrl) {
    const url = sessionStorage.getItem('presentationUrl');

    if (url.includes('tc-presentation-url')) {
        const presentationUrl = url.split('tc-presentation-url=')[1];
        return `${patcherUrl}/patcher?tc-presentation-url=${presentationUrl}`;
    }
    return url;
}

/**
 * Save presentation URL to be resolve as patcher URL on next fetch
 *
 * @param {string} url - Presentation URL
 */
function saveUrlForPatching(url) {
    let magicUrl = url;
    if (!url.includes('tc-presentation-url')) magicUrl = `tc-presentation-url=${url}`;
    sessionStorage.setItem('presentationUrl', magicUrl);
}

export default { resolveUrl, saveUrlForPatching };
