import { log } from '../../src_old/utils/general';

type Subscriber = { id: string; res: any };
class SubscriptionManager<T> {
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
        log(this.path, 'publish', this.state);
        for (const client of this.subs) {
            client.res.write(`data: ${JSON.stringify(this.state)}\n\n`);
            client.res.flush(); // required for sse with compression https://expressjs.com/en/resources/middleware/compression.html#:~:text=add%20all%20routes-,Server%2DSent%20Events,-Because%20of%20the
        }
    }

    public subscribe(client: Subscriber) {
        this.subs.push(client);
        log(client.id.toString(), 'subscribed');
    }

    public unsubscribe(clientId: string) {
        log(clientId.toString(), 'unsubscribe');
        this.subs = this.subs.filter((client) => client.id !== clientId);
    }
}

export default SubscriptionManager;
