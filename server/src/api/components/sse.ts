import { Request, Response } from 'express';
import { SSE_HEADERS } from '../../../../constant/constant';
import { formatLog, log } from '../../../src_old/utils/general';
import { logger } from '../../config/logger';
import { generateUuid } from '../../services/utility';

type Subscriber = { id: string; itemId?: string; res: Response };
export class SseManager<T> {
    private path?: string;
    private state: Record<string, T>;
    private subs: Subscriber[];

    constructor(initalState: Record<string, T>) {
        this.state = initalState;
        this.subs = [];
    }

    public setPath(path: string) {
        this.path = path;
    }

    public getState(): Record<string, T> {
        const data = structuredClone(this.state);

        return data;
    }

    public setState(itemId: string, item: T) {
        if (!itemId) throw new Error('"itemId" must be defined');
        this.state[itemId] = item;
        this.publish(itemId);
    }

    public publish(itemId = '') {
        if (!this.path) {
            throw new Error('missing sse path');
        }

        logger.info(formatLog(this.path, 'publish', this.getState()).join(''));
        for (const sub of this.subs) {
            // ignore unmatched items when sub only listens for one item.
            if (sub.itemId && sub.itemId !== itemId) continue;

            // if sending to sub, check if sub wants one item or entire map.
            const data = itemId ? this.state[itemId] : this.state;
            sub.res.write(`data: ${JSON.stringify(data)}\n\n`);
            sub.res.flush(); // required for sse with compression https://expressjs.com/en/resources/middleware/compression.html#:~:text=add%20all%20routes-,Server%2DSent%20Events,-Because%20of%20the
        }
    }

    public subscribe(req: Request, res: Response) {
        const id = generateUuid();

        res.writeHead(200, SSE_HEADERS);
        res.write(`data: ${JSON.stringify(this.state)}\n\n`);
        res.flush(); // required for sse with compression https://expressjs.com/en/resources/middleware/compression.html#:~:text=add%20all%20routes-,Server%2DSent%20Events,-Because%20of%20the

        req.on('close', () => this.unsubscribe(id));
        this.subs.push({ id, res });
        logger.info(formatLog(id, 'subscribed', this.state).join(' '));
    }

    public unsubscribe(id: string) {
        logger.info(formatLog(id, 'unsubscribe').join(''));
        this.subs = this.subs.filter((sub) => sub.id !== id);
    }
}
