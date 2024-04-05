import { WebSocketServer } from "ws";
import {
    CHANNEL,
    HEATER_CAB,
    HEATER_GPO_DEFAULT_STATE,
    PRIMARY_THERMOSTAT,
    SSE_HEADERS,
} from "../../../../constant/constant";
import { HeaterCabState } from "../../../../types/main";
import { writeLog } from "../logs/logger";
import { roomTempState } from "../room/temperature";
import { clientMapState } from "./thermostat";
import { app } from "../server";
import { log } from "../../utils/general";

// state singleton
const state = HEATER_GPO_DEFAULT_STATE;

// wss connection to heater
const wssHeater = new WebSocketServer({
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

wssHeater.on("connection", (ws) => {
    log(CHANNEL.HEATER_CAB_0, "wss conneced");
    ws.on("message", handleMessageIn);
    ws.on("close", () => log(CHANNEL.HEATER_CAB_0, "wss disconnected"));
    ws.onerror = console.error;
});

const emitStateUpdate = () => {
    const stringified = JSON.stringify(state);
    wssHeater.clients.forEach((client) => client.send(stringified));
    publish(state);
    log(CHANNEL.HEATER_CAB_0, "EMIT");
};

const turnHeaterOff = () => {
    // if (state.manualOverride?.status === HEATER_OVERRIDE.ON) {
    //   turnHeaterOn();
    //   return;
    // }

    if (state.heaterPinVal === 0) return;
    state.heaterPinVal = 0;
    emitStateUpdate();
    writeLog("heater off");
};

const turnHeaterOn = () => {
    // if (state.manualOverride?.status === HEATER_OVERRIDE.OFF) {
    //   turnHeaterOff();
    //   return;
    // }

    if (state.heaterPinVal === 1) return;
    state.heaterPinVal = 1;
    emitStateUpdate();
    writeLog("heater on");
};

type HeaterClient = { id: number; res: any };
let heaterClients: HeaterClient[] = [];

function subscribe(client: HeaterClient) {
    heaterClients.push(client);
    log(client.id.toString(), 'subscribed');
  }
  
  function unsubscribe(clientId: number) {
    log(clientId.toString(), 'unsubscribe');
    heaterClients = heaterClients.filter((client) => client.id !== clientId);
}

app.get("/api/home", (req, res) => {
    const clientId = Date.now();
    res.writeHead(200, SSE_HEADERS);
    res.write(`data: ${JSON.stringify(state)}\n\n`);
    subscribe({ id: clientId, res });
    req.on("close", () => unsubscribe(clientId));
});

// publish SSE to browsers
const publish = (newState: HeaterCabState) => {
    for (const client of heaterClients) {
        client.res.write(`data: ${JSON.stringify(newState)}\n\n`);
    }
};

export function initHeaterApp() {
    const checkHeaterStatus = (forceOn = true) => {
        const curTemp =
            clientMapState?.[PRIMARY_THERMOSTAT]?.tempF +
            clientMapState?.[PRIMARY_THERMOSTAT]?.calibrate;
        writeLog(`current temp is ${curTemp}`);

        // if heater off & current temp below min
        const shouldTurnOn =
            state.heaterPinVal === 0 && curTemp < roomTempState.min;
        // if heater on & current temp above max
        const shouldTurnOff =
            state.heaterPinVal === 1 && curTemp > roomTempState.max;

        if (forceOn || shouldTurnOn) {
            turnHeaterOn();
        } else if (shouldTurnOff) {
            turnHeaterOff();
        }
    };

    setInterval(checkHeaterStatus, 1000);
}
