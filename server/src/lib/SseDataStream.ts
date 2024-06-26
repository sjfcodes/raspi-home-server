import { v4 } from 'uuid';
import { SSE_HEADERS } from '../../../constant/constant';
import { log } from '../utils/general';

type SseClient = { id: string; res: any };
class SseDataStream<T> {
    private path: string;
    private state: T;
    private sseClients: SseClient[];

    constructor(server: any, path: string, initalState: T) {
        this.path = path;
        this.state = initalState;
        this.sseClients = [];
        this.initialize(server);
    }

    private initialize(server: any) {
        // @ts-expect-error untyped express server
        server.get(this.path, (req, res) => {
            const clientId = v4();
            res.writeHead(200, SSE_HEADERS);
            res.write(`data: ${JSON.stringify(this.state)}\n\n`);
            this.subscribe({ id: clientId, res });
            req.on('close', () => this.unsubscribe(clientId));
        });
    }

    private subscribe(client: SseClient) {
        this.sseClients.push(client);
        log(client.id.toString(), 'subscribed');
    }

    private unsubscribe(clientId: string) {
        log(clientId.toString(), 'unsubscribe');
        this.sseClients = this.sseClients.filter(
            (client) => client.id !== clientId,
        );
    }

    // publish SSE to browsers
    publish() {
        log(this.path, 'publish', this.state);
        for (const client of this.sseClients) {
            client.res.write(`data: ${JSON.stringify(this.state)}\n\n`);
        }
    }

    getState(): T {
        return this.state;
    }

    setState(newState: T) {
        this.state = newState;
        this.publish();
    }
}

export default SseDataStream;
