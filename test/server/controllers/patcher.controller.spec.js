import contextService from '@services/context';
import * as configModule from '@services/config';
import { patchPresentation } from '@server/controllers/patcher.controller';

vi.mock('@services/config', async orig => ({ ...(await orig()) }));

describe('PatcherController', function () {
    let req, res;
    let configSpy, fetchMock, isUsingRemoteUrl;
    const presentationUrl = 'http://test.com/presentation';
    const presentation = `
    <html>
        <head></head>
        <body>
            <p> Presentation content </p>
        </body>
    </html>
    `;

    beforeAll(function () {
        fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
        configSpy = vi.spyOn(configModule, 'config', 'get');
        isUsingRemoteUrl = vi.spyOn(contextService, 'isUsingRemoteUrl').mockImplementation(() => {});
    });

    afterAll(function () {
        vi.unstubAllGlobals();
        configSpy.mockRestore();
        isUsingRemoteUrl.mockRestore();
    });

    beforeEach(function () {
        fetchMock.mockReset();
        fetchMock.mockResolvedValue({ status: 200, text: () => Promise.resolve(presentation) });
        configSpy.mockReturnValue({
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
        isUsingRemoteUrl.mockReturnValue(true);
        req = { query: { 'tc-presentation-url': presentationUrl } };
        res = { send: vi.fn(), cookie: vi.fn(), status: vi.fn().mockReturnThis() };
    });

    describe('patchPresentation', function () {
        it('should fetch and patch requested presentation', async function () {
            // When
            await patchPresentation(req, res);
            // Then
            expect(fetchMock).toHaveBeenCalledExactlyOnceWith(presentationUrl);
        });

        it('should error if requested presentation url is invalid', async function () {
            // Given
            req.query['tc-presentation-url'] = 'INVALID_URL';
            // When
            await patchPresentation(req, res);
            // Then
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Invalid presentation URL');
        });

        it('should error if presentation not found', async function () {
            // Given
            fetchMock.mockResolvedValue({ status: 404, text: () => Promise.resolve('Empty') });
            // When
            await patchPresentation(req, res);
            // Then
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('Presentation not found');
        });

        it('should send fixed presentation when presentation is missing <body>', async function () {
            // Given
            const pres = '<html><head></head>Content</html>';
            fetchMock.mockResolvedValue({ status: 200, text: () => Promise.resolve(pres) });
            // When
            await patchPresentation(req, res);
            // Then
            expect(res.send.mock.calls[0][0]).toMatch(/<html><head[\s\S]*<\/head><body[\s\S]*Content[\s\S]*<\/body><\/html>/);
        });

        it('should send fixed presentation when presentation is missing <head>', async function () {
            // Given
            const pres = '<html><body>Content</body></html>';
            fetchMock.mockResolvedValue({ status: 200, text: () => Promise.resolve(pres) });
            // When
            await patchPresentation(req, res);
            // Then
            expect(res.send.mock.calls[0][0]).toMatch(/<html><head[\s\S]*<\/head><body[\s\S]*Content[\s\S]*<\/body><\/html>/);
        });

        it('should send fixed presentation when presentation is missing <html>', async function () {
            // Given
            const pres = '<body>Content</body>';
            fetchMock.mockResolvedValue({ status: 200, text: () => Promise.resolve(pres) });
            // When
            await patchPresentation(req, res);
            // Then
            expect(res.send.mock.calls[0][0]).toMatch(/<html><head[\s\S]*<\/head><body[\s\S]*Content[\s\S]*<\/body><\/html>/);
        });

        it('should send fixed presentation when presentation with only content', async function () {
            // Given
            const pres = 'Content';
            fetchMock.mockResolvedValue({ status: 200, text: () => Promise.resolve(pres) });
            // When
            await patchPresentation(req, res);
            // Then
            expect(res.send.mock.calls[0][0]).toMatch(/<html><head[\s\S]*<\/head><body[\s\S]*Content[\s\S]*<\/body><\/html>/);
        });

        it('should send presentation with "no-cache" head metadata', async function () {
            // When
            await patchPresentation(req, res);
            // Then
            expect(res.send.mock.calls[0][0]).toMatch(
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

        it('should send presentation with local proxy server url as base when presentation is local', async function () {
            // Given
            isUsingRemoteUrl.mockReturnValue(false);
            // When
            await patchPresentation(req, res);
            // Then
            expect(res.send.mock.calls[0][0]).toContain('<base href="LOCAL_SERVER/proxy/"/>');
        });

        it('should send presentation with remote proxy server url as base when presentation is remote', async function () {
            // Given
            isUsingRemoteUrl.mockReturnValue(true);
            // When
            await patchPresentation(req, res);
            // Then
            expect(res.send.mock.calls[0][0]).toContain('<base href="EXTERNAL_SERVER/proxy/"/>');
        });

        it('should send presentation with tc component script from local server if presentation is local', async function () {
            // Given
            isUsingRemoteUrl.mockReturnValue(false);
            // When
            await patchPresentation(req, res);
            // Then
            expect(res.send.mock.calls[0][0]).toMatch(
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

        it('should send presentation with tc component script from remote server if presentation is remote', async function () {
            // Given
            isUsingRemoteUrl.mockReturnValue(true);
            // When
            await patchPresentation(req, res);
            // Then
            expect(res.send.mock.calls[0][0]).toMatch(
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

        it('should send presentation origin url as cookie', async function () {
            // When
            await patchPresentation(req, res);
            // then
            expect(res.cookie).toHaveBeenCalledExactlyOnceWith('tc-presentation-url', presentationUrl);
        });
    });
});
