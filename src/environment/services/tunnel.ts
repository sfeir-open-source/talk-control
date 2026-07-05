import config from '../../../config/config.json';
import ngrok from '@ngrok/ngrok';

export const getUrl = async (port: number): Promise<string> => {
    if (!config.ngrok.authToken) {
        return '';
    }

    const listener = await ngrok.forward({
        authtoken: config.ngrok.authToken,
        proto: 'http',
        addr: port
    });

    return listener.url() ?? '';
};

export default { getUrl };
