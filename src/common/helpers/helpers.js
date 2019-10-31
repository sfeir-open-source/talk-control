/**
 * Return true if url is well formated
 *
 * @param {string} url - URL to test
 * @returns {boolean} true if the url is valid
 */
export const isUrlValid = url => {
    if (!url) {
        return false;
    }
    // eslint-disable-next-line no-useless-escape
    const urlRegexp = RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/);
    return urlRegexp.test(url);
};
