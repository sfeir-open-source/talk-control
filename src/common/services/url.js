/**
 * Return true if url is well formated
 *
 * @param {string} url - URL to test
 * @returns {boolean} true if the url is valid
 */
export const isUrlValid = url => {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
};
