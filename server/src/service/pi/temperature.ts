import { readFileSync } from "node:fs";
import { SSE_HEADERS } from "../../../../constant/constant";
import { PiTemp } from "../../../../types/main";
import { log } from "../../utils/general";
import { app } from "../server";
import { v4 } from "uuid";

const path = "/api/home/pi";
const state = {
    tempC: 0,
    tempF: 0,
    message: "default",
    updatedAt: new Date().toLocaleTimeString(),
} as PiTemp;

export const setPiTemp = () => {
    const temp = Number(
        readFileSync("/sys/class/thermal/thermal_zone0/temp", {
            encoding: "utf8",
        })
    );

    state.message = "ok";
    state.updatedAt = new Date().toLocaleTimeString();
    if (isNaN(temp)) {
        state.message = "temp must be number";
    } else {
        const tempC = Math.trunc(temp / 1000);
        state.tempC = tempC;
        state.tempF = Math.trunc((tempC * 9) / 5 + 32);
    }

    publish(state);
};

type SseClient = { id: string; res: any };
let sseClients: SseClient[] = [];

function subscribe(client: SseClient) {
    sseClients.push(client);
    log(client.id.toString(), "subscribed");
}

function unsubscribe(clientId: string) {
    log(clientId.toString(), "unsubscribe");
    sseClients = sseClients.filter((client) => client.id !== clientId);
}
// publish SSE to browsers
const publish = (newState: any) => {
    log(path, "publish");
    for (const client of sseClients) {
        client.res.write(`data: ${JSON.stringify(newState)}\n\n`);
    }
};

app.get(path, (req, res) => {
    const clientId = v4();
    res.writeHead(200, SSE_HEADERS);
    res.write(`data: ${JSON.stringify(state)}\n\n`);
    subscribe({ id: clientId, res });
    req.on("close", () => unsubscribe(clientId));
});

// [NOTE] must export & call this function in index.ts BEFORE app.listen()
export function initPiState() {
    setInterval(setPiTemp, 1000);
    log(path, "start");
}
