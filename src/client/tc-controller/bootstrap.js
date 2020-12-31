import contextService from '@services/context';
import { config } from '@services/config';
import presentationService from '@services/presentation';
import { TCController } from '@client/tc-controller/tc-controller';

/**
 *
 */
export function bootstrapTcController() {
    const isRemote = contextService.isUsingRemoteUrl(window.location.href);
    const server = isRemote ? config.tcServer.urls.external : config.tcServer.urls.local;

    const presentationUrl = presentationService.resolveUrl(server);
    new TCController(server).init(presentationUrl);
}
