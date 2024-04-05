import { v4 } from "uuid";
import { SSE_HEADERS } from "../../../constant/constant";
import { log } from "../utils/general";

type SseClient = { id: string; res: any };
class SseDataStream {
    private path: string;
    private state: any;
    private sseClients: SseClient[];

    constructor(app: any, path: string, initalState: any) {
        this.path = path;
        this.state = initalState;
        this.sseClients = [];
        this.initialize(app);
    }

    private initialize(app: any) {
        // @ts-expect-error untyped express app
        app.get(this.path, (req, res) => {
            const clientId = v4();
            res.writeHead(200, SSE_HEADERS);
            res.write(`data: ${JSON.stringify(this.state)}\n\n`);
            this.subscribe({ id: clientId, res });
            req.on("close", () => this.unsubscribe(clientId));
        });
    }

    private subscribe(client: SseClient) {
        this.sseClients.push(client);
        log(client.id.toString(), "subscribed");
    }

    private unsubscribe(clientId: string) {
        log(clientId.toString(), "unsubscribe");
        this.sseClients = this.sseClients.filter(
            (client) => client.id !== clientId
        );
    }

    // publish SSE to browsers
    publish(newState: any) {
        log(this.path, "publish");
        for (const client of this.sseClients) {
            client.res.write(`data: ${JSON.stringify(newState)}\n\n`);
        }
    }
}

export default SseDataStream;
