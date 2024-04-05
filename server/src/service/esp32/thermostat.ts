import { v4 } from "uuid";
import { SSE_HEADERS, THERMOSTAT } from "../../../../constant/constant";
import { Thermostat, ThermostatMap } from "../../../../types/main";
import { getSortedObject, log } from "../../utils/general";
import { emitStateUpdate } from "../websocket/emit";
import { app } from "../server";

const path = "/api/home/thermostat";
let state: ThermostatMap = {};

export const setThermostatClient = (client: Thermostat) => {
    if (client === undefined) {
        console.error(new Error("client must be defined"));
        return;
    }

    if (!client.chipId) {
        console.error(new Error("client.chipId must be defined"));
        return;
    }

    const maxLen = 60;
    const temp = Math.trunc(client.tempF);
    let tempFHistory = state[client.chipId]?.tempFHistory || [];
    if (tempFHistory.length < maxLen) tempFHistory.unshift(temp);
    else tempFHistory = [temp, ...tempFHistory.slice(0, maxLen - 1)];

    const tempAverage =
        tempFHistory.reduce((acc, curr) => acc + curr, 0) / tempFHistory.length;

    state = getSortedObject({
        ...state,
        [client.chipId]: {
            chipId: client.chipId,
            // @ts-ignore
            chipName: THERMOSTAT[client.chipId] || client.chipName,
            tempF: Math.trunc(tempAverage),
            calibrate: client.calibrate || 0,
            updatedAt: new Date().toLocaleTimeString(),
            tempFHistory,
        },
    });

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

app.post("/api/temperature", (req, res) => {
    if (req.body) setThermostatClient(req.body);
    res.status(200).send({ ...req.body, serverName: "raspi-home-server" });
});

// [NOTE] must export & call this function in index.ts BEFORE app.listen()
export function initAllThermostats() {
    log(path, "start");
}

export const clientMapState = state;
