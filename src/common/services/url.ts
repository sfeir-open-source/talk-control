/**
 * Return true if url is well formatted
 *
 * @param {string} url - URL to test
 * @returns {boolean} true if the url is valid
 */
export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};
