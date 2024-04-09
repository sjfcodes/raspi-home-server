import { Request, Response } from 'express';
import { SSE_HEADERS } from '../../../constant/constant';
import { formatLog, log } from '../../src_old/utils/general';
import { logger } from '../config/logger';
import { generateUuid } from './utility';

type Subscriber = { id: string; res: Response };
export class SseManager<T> {
    private path: string;
    private state: T;
    private subs: Subscriber[];

    constructor(path: string, initalState: T) {
        this.path = path;
        this.state = initalState;
        this.subs = [];
    }

    public getState(): T {
        return structuredClone(this.state);
    }

    public setState(newState: T) {
        this.state = newState;
        this.publish();
    }

    public publish() {
        logger.info(formatLog(this.path, 'publish', this.getState()).join(''));
        for (const client of this.subs) {
            client.res.write(`data: ${JSON.stringify(this.state)}\n\n`);
            client.res.flush(); // required for sse with compression https://expressjs.com/en/resources/middleware/compression.html#:~:text=add%20all%20routes-,Server%2DSent%20Events,-Because%20of%20the
        }
    }

    public subscribe(req: Request, res: Response) {
        const id = generateUuid();

        res.writeHead(200, SSE_HEADERS);
        res.write(`data: ${JSON.stringify(this.state)}\n\n`);
        res.flush(); // required for sse with compression https://expressjs.com/en/resources/middleware/compression.html#:~:text=add%20all%20routes-,Server%2DSent%20Events,-Because%20of%20the

        req.on('close', () => this.unsubscribe(id));
        this.subs.push({ id, res });
        logger.info(formatLog(id.toString(), 'subscribed').join(''));
    }

    public unsubscribe(id: string) {
        logger.info(formatLog(id.toString(), 'unsubscribe').join(''));
        this.subs = this.subs.filter((sub) => sub.id !== id);
    }
}
