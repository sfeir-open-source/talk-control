import config from '../../../config/config.json';
import ngrok from 'ngrok';

export const getUrl = async (port: number): Promise<string> => {
    if (!config.ngrok.authToken) {
        return '';
    }

    return await ngrok.connect({
        authtoken: config.ngrok.authToken,
        proto: 'http',
        addr: port,
        bind_tls: true
    });
};

export default { getUrl };
