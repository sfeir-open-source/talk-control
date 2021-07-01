import contextService from '@services/context';
import { config } from '@services/config';
import presentationService from '@services/presentation';
import { TCController } from '@client/tc-controller/tc-controller';

/**
 * Bootstraps Talk Control Controller
 */
export function bootstrapTcController() {
    const isRemote = contextService.isUsingRemoteUrl(window.location.href);
    const serverUrl = isRemote ? config.tcServer.urls.external : config.tcServer.urls.local;

    const presentationUrl = presentationService.resolveUrl(serverUrl);
    new TCController(serverUrl).init(presentationUrl);
}
