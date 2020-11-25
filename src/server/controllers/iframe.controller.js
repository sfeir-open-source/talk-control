'use strict';

const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
import config from '@config/config.json';
import contextService from '@services/context';

const urlValidator = function(url) {
    // regex found here : https://mathiasbynens.be/demo/url-regex who points to this gist : https://gist.github.com/dperini/729294
    const urlRegex = new RegExp(
        '^' +
            // protocol identifier (optional)
            // short syntax // still required
            '(?:(?:(?:https?|ftp):)?\\/\\/)' +
            // user:pass BasicAuth (optional)
            '(?:\\S+(?::\\S*)?@)?' +
            '(?:' +
            // IP address exclusion
            // private & local networks
            '(?!(?:10|127)(?:\\.\\d{1,3}){3})' +
            '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
            '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
            // IP address dotted notation octets
            // excludes loopback network 0.0.0.0
            // excludes reserved space >= 224.0.0.0
            // excludes network & broadcast addresses
            // (first & last IP address of each class)
            '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
            '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
            '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
            '|' +
            // host & domain names, may end with dot
            // can be replaced by a shortest alternative
            // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
            '(?:' +
            '(?:' +
            '[a-z0-9\\u00a1-\\uffff]' +
            '[a-z0-9\\u00a1-\\uffff_-]{0,62}' +
            ')?' +
            '[a-z0-9\\u00a1-\\uffff]\\.' +
            ')+' +
            // TLD identifier name, may end with dot
            '(?:[a-z\\u00a1-\\uffff]{2,}\\.?)' +
            ')' +
            // port number (optional)
            '(?::\\d{2,5})?' +
            // resource path (optional)
            '(?:[/?#]\\S*)?' +
            '$',
        'i'
    );
    return urlRegex.test(url);
};

const replaceByServer = function(arrayOfSplit, srcOrHref, quoteCharacter, tcServerUrl) {
    const modifySplit = [];
    let index = 0;
    for (let potentialUrl of arrayOfSplit) {
        if (index === 0) {
            modifySplit.push(`${srcOrHref}=${quoteCharacter}${potentialUrl}`);
            index++;
            continue;
        }
        const url = potentialUrl.substring(0, potentialUrl.indexOf(quoteCharacter));
        if (urlValidator(url)) {
            modifySplit.push(`${srcOrHref}=${quoteCharacter}${potentialUrl}`);
        } else {
            modifySplit.push(`${srcOrHref}=${quoteCharacter}${tcServerUrl}/${potentialUrl}`);
        }
        index++;
    }
    return modifySplit.join('');
};

const replaceRelativeUrlsByServer = function(originalHtml, tcServerUrl) {
    let replaceText = replaceByServer(originalHtml.split('href="/'), 'href', '"', tcServerUrl);
    replaceText = replaceByServer(replaceText.split("href='/"), 'href', "'", tcServerUrl);
    replaceText = replaceByServer(replaceText.split('href="'), 'href', '"', tcServerUrl);
    replaceText = replaceByServer(replaceText.split("href='"), 'href', "'", tcServerUrl);
    replaceText = replaceByServer(replaceText.split('src="/'), 'src', '"', tcServerUrl);
    replaceText = replaceByServer(replaceText.split("src='/"), 'src', "'", tcServerUrl);
    replaceText = replaceByServer(replaceText.split('src="'), 'src', '"', tcServerUrl);
    replaceText = replaceByServer(replaceText.split("src='"), 'src', "'", tcServerUrl);
    return replaceText;
};

router.get('/', (req, res) => {
    const urlPresentation = new URL(req.query['tc-presentation-url']);
    const isRemote = contextService.isUsingRemoteUrl(urlPresentation.href);
    console.log('Recieve request ', req.query);
    console.log('href ', urlPresentation.href);
    console.log('isRemote ', isRemote);
    const tcControllerUrl = isRemote ? config.tcController.urls.external : config.tcController.urls.local;
    const tcServerUrl = isRemote ? config.tcServer.urls.external : config.tcServer.urls.local;
    console.log('tcControllerUrl ', tcControllerUrl);
    console.log('tcServerUrl ', tcServerUrl);
    fetch(urlPresentation.href)
        .then(response => response.text())
        .then(text => {
            text = replaceRelativeUrlsByServer(text, tcServerUrl);
            text = text.replace('<head>', `<head><base href="${urlPresentation.origin}"/>`);
            text = text.replace(
                '</body>',
                `
<script type="application/javascript">
    // Configure the url of the server serving the tc-component and other split shunks
    window.tcResourcePath = '${tcControllerUrl}/'
</script>
<script src="${tcControllerUrl}/tc-component.bundle.js"></script></body>
`
            );
            res.send(text);
        });
});

module.exports = router;
