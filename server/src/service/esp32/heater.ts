import { v4 as uuidV4 } from "uuid";
import { WebSocketServer } from "ws";
import {
    CHANNEL,
    HEATER_CAB,
    HEATER_GPO_DEFAULT_STATE,
    SSE_HEADERS,
} from "../../../../constant/constant";
import { HeaterCabState } from "../../../../types/main";
import { writeLog } from "../logs/logger";
import { app } from "../server";
import { log } from "../../utils/general";

const path = "/api/home/heater";

// state singleton
const state = HEATER_GPO_DEFAULT_STATE;
// wss connection to heater
const wss = new WebSocketServer({
    path: CHANNEL.HEATER_CAB_0,
    port: 3001,
});

function handleMessageIn(data: string) {
    const input: HeaterCabState = JSON.parse(data.toString());
    if (input.chipId === HEATER_CAB.HOME) {
        state.cabHumidity = input.cabHumidity;
        state.cabTempF = input.cabTempF;
        state.chipId = input.chipId;
        state.updatedAt = new Date().toLocaleTimeString();

        if (input.heaterPinVal !== undefined) {
            state.heaterPinVal = input.heaterPinVal;
        }
        emitStateUpdate();
    }
}

wss.on("connection", (ws) => {
    log(CHANNEL.HEATER_CAB_0, "wss conneced");
    ws.on("message", handleMessageIn);
    ws.on("close", () => log(CHANNEL.HEATER_CAB_0, "wss disconnected"));
    ws.onerror = console.error;
});

const emitStateUpdate = () => {
    const stringified = JSON.stringify(state);
    wss.clients.forEach((client) => client.send(stringified));
    publish(state);
    log(CHANNEL.HEATER_CAB_0, "publish");
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

app.get(path, (req, res) => {
    const clientId = uuidV4();
    res.writeHead(200, SSE_HEADERS);
    res.write(`data: ${JSON.stringify(state)}\n\n`);
    subscribe({ id: clientId, res });
    req.on("close", () => unsubscribe(clientId));
});

// publish SSE to browsers
const publish = (newState: HeaterCabState) => {
    log(path, "publish");
    for (const client of sseClients) {
        client.res.write(`data: ${JSON.stringify(newState)}\n\n`);
    }
};

export function turnHeaterOff() {
    // if (state.manualOverride?.status === HEATER_OVERRIDE.ON) {
    //   turnHeaterOn();
    //   return;
    // }

    if (state.heaterPinVal === 0) return;
    state.heaterPinVal = 0;
    emitStateUpdate();
    writeLog("heater off");
}

export function turnHeaterOn() {
    // if (state.manualOverride?.status === HEATER_OVERRIDE.OFF) {
    //   turnHeaterOff();
    //   return;
    // }

    if (state.heaterPinVal === 1) return;
    state.heaterPinVal = 1;
    emitStateUpdate();
    writeLog("heater on");
}

export const heaterState = state;

export function initHomeHeater() {
    log(path, "start");
}