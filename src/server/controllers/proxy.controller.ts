import express, { Request, Response } from 'express';
import httpProxy from 'http-proxy';

const router = express.Router();
const proxy = httpProxy.createProxyServer();

router.all('/{*splat}', (req, res) => forwardTraffic(req, res, proxy));

export function forwardTraffic(req: Request, res: Response, proxy: ReturnType<typeof httpProxy.createProxyServer>): void {
    const presentationUrl = req.cookies && req.cookies['tc-presentation-url'];
    let target;
    try {
        target = new URL(presentationUrl).origin;
    } catch {
        res.status(400).send('Invalid presentation URL');
        return;
    }

    req.url = req.originalUrl.replace('/proxy', '');
    proxy.web(req, res, { target, secure: false });
}

export default router;
