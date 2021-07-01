/**
 * Return true if url is well formatted
 *
 * @param {string} url - URL to test
 * @returns {boolean} true if the url is valid
 */
export const isValidUrl = url => {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
};
