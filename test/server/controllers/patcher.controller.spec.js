import { expect } from 'chai';
import { assert, stub } from 'sinon';
import contextService from '@services/context';
import * as fetchContext from 'node-fetch';
import * as configService from '@services/config';
import { patchPresentation } from '@server/controllers/patcher.controller';

describe('PatcherController', function() {
    let req, res;
    let config, fetch, isUsingRemoteUrl;
    const presentationUrl = 'http://test.com/presentation';
    const presentation = `
    <html>
        <head></head>
        <body>
            <p> Presentation content </p>  
        </body>
    </html>
    `;

    before(function() {
        config = stub(configService, 'config');
        fetch = stub(fetchContext, 'default');
        isUsingRemoteUrl = stub(contextService, 'isUsingRemoteUrl');
    });

    after(function() {
        fetch.restore();
        config.restore();
        isUsingRemoteUrl.restore();
    });

    beforeEach(function() {
        fetch.resetHistory();
        fetch.returns(Promise.resolve({ status: 200, text: () => Promise.resolve(presentation) }));
        config.value({
            tcServer: {
                urls: {
                    external: 'EXTERNAL_SERVER',
                    local: 'LOCAL_SERVER'
                }
            },
            tcController: {
                urls: {
                    external: 'EXTERNAL_CONTROLLER',
                    local: 'LOCAL_CONTROLLER'
                }
            }
        });
        isUsingRemoteUrl.returns(true);
        req = { query: { 'tc-presentation-url': presentationUrl } };
        res = { send: stub(), cookie: stub() };
    });

    describe('patchPresentation', function() {
        it('should fetch and patch requested presentation', async function() {
            // When
            await patchPresentation(req, res);
            // Then
            assert.calledOnceWithExactly(fetch, presentationUrl);
        });

        it('should error if requested presentation url is invalid', async function() {
            // Given
            req.query['tc-presentation-url'] = 'INVALID_URL';
            // When
            await patchPresentation(req, res);
            // Then
            assert.calledWithExactly(res.send, 'Invalid presentation URL', 400);
        });

        it('should error if presentation not found', async function() {
            // Given
            fetch.returns(Promise.resolve({ status: 404, text: () => Promise.resolve('Empty') }));
            // When
            await patchPresentation(req, res);
            // Then
            assert.calledWithExactly(res.send, 'Presentation not found', 404);
        });

        it('should send fixed presentation when presentation is missing <body>', async function() {
            // Given
            const pres = '<html><head></head>Content</html>';
            fetch.returns(Promise.resolve({ status: 200, text: () => Promise.resolve(pres) }));
            // When
            await patchPresentation(req, res);
            // Then
            expect(res.send.args[0][0]).to.match(/<html><head[\s\S]*<\/head><body[\s\S]*Content[\s\S]*<\/body><\/html>/);
        });

        it('should send fixed presentation when presentation is missing <head>', async function() {
            // Given
            const pres = '<html><body>Content</body></html>';
            fetch.returns(Promise.resolve({ status: 200, text: () => Promise.resolve(pres) }));
            // When
            await patchPresentation(req, res);
            // Then
            expect(res.send.args[0][0]).to.match(/<html><head[\s\S]*<\/head><body[\s\S]*Content[\s\S]*<\/body><\/html>/);
        });

        it('should send fixed presentation when presentation is missing <html>', async function() {
            // Given
            const pres = '<body>Content</body>';
            fetch.returns(Promise.resolve({ status: 200, text: () => Promise.resolve(pres) }));
            // When
            await patchPresentation(req, res);
            // Then
            expect(res.send.args[0][0]).to.match(/<html><head[\s\S]*<\/head><body[\s\S]*Content[\s\S]*<\/body><\/html>/);
        });

        it('should send fixed presentation when presentation with only content', async function() {
            // Given
            const pres = 'Content';
            fetch.returns(Promise.resolve({ status: 200, text: () => Promise.resolve(pres) }));
            // When
            await patchPresentation(req, res);
            // Then
            expect(res.send.args[0][0]).to.match(/<html><head[\s\S]*<\/head><body[\s\S]*Content[\s\S]*<\/body><\/html>/);
        });

        it('should send presentation with "no-cache" head metadata', async function() {
            // When
            await patchPresentation(req, res);
            // Then
            expect(res.send.args[0][0]).to.match(
                new RegExp(
                    [
                        '<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />',
                        '[\\s\\t\\n]*',
                        '<meta http-equiv="Pragma" content="no-cache" />',
                        '[\\s\\t\\n]*',
                        '<meta http-equiv="Expires" content="0" />'
                    ].join('')
                )
            );
        });

        it('should send presentation with local proxy server url as base when presentation is local', async function() {
            // Given
            isUsingRemoteUrl.returns(false);
            // When
            await patchPresentation(req, res);
            // Then
            expect(res.send.args[0][0]).to.include('<base href="LOCAL_SERVER/proxy/"/>');
        });

        it('should send presentation with remote proxy server url as base when presentation is remote', async function() {
            // Given
            isUsingRemoteUrl.returns(true);
            // When
            await patchPresentation(req, res);
            // Then
            expect(res.send.args[0][0]).to.include('<base href="EXTERNAL_SERVER/proxy/"/>');
        });

        it('should send presentation with tc component script from local server if presentation is local', async function() {
            // Given
            isUsingRemoteUrl.returns(false);
            // When
            await patchPresentation(req, res);
            // Then
            expect(res.send.args[0][0]).to.match(
                new RegExp(
                    [
                        '<script type="application/javascript">',
                        '[\\s\\t\\n]*',
                        '// Configure the url of the server serving the tc-component and other split shunks',
                        '[\\s\\t\\n]*',
                        "window.tcResourcePath = 'LOCAL_CONTROLLER/'",
                        '[\\s\\t\\n]*',
                        '</script>',
                        '[\\s\\t\\n]*',
                        '<script src="LOCAL_CONTROLLER/tc-component.bundle.js"></script>'
                    ].join('')
                )
            );
        });

        it('should send presentation with tc component script from remote server if presentation is remote', async function() {
            // Given
            isUsingRemoteUrl.returns(true);
            // When
            await patchPresentation(req, res);
            // Then
            expect(res.send.args[0][0]).to.match(
                new RegExp(
                    [
                        '<script type="application/javascript">',
                        '[\\s\\t\\n]*',
                        '// Configure the url of the server serving the tc-component and other split shunks',
                        '[\\s\\t\\n]*',
                        "window.tcResourcePath = 'EXTERNAL_CONTROLLER/'",
                        '[\\s\\t\\n]*',
                        '</script>',
                        '[\\s\\t\\n]*',
                        '<script src="EXTERNAL_CONTROLLER/tc-component.bundle.js"></script>'
                    ].join('')
                )
            );
        });

        it('should send presentation origin url as cookie', async function() {
            // When
            await patchPresentation(req, res);
            // then
            assert.calledOnceWithExactly(res.cookie, 'tc-presentation-url', presentationUrl);
        });
    });
});
