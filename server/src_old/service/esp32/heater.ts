import { WebSocketServer } from 'ws';
import {
    CHANNEL,
    HEATER_CAB,
    HEATER_GPO_DEFAULT_STATE,
} from '../../../../constant/constant';
import { HeaterCabState } from '../../../../types/main';
import { writeLog } from '../pi/logs';
import { server } from '../server';
import { log } from '../../utils/general';
import SseDataStream from '../../lib/SseDataStream';

const path = '/api/home/heater';

// wss connection to heater
const wss = new WebSocketServer({
    path: CHANNEL.HEATER_CAB_0,
    port: 3001,
});

const stream = new SseDataStream(server, path, HEATER_GPO_DEFAULT_STATE);

function handleMessageIn(data: string) {
    const state = stream.getState();
    const input: HeaterCabState = JSON.parse(data.toString());
    if (input.chipId === HEATER_CAB.HOME) {
        state.cabHumidity = input.cabHumidity;
        state.cabTempF = input.cabTempF;
        state.chipId = input.chipId;
        state.updatedAt = new Date().toLocaleTimeString();

        if (input.heaterPinVal !== undefined) {
            state.heaterPinVal = input.heaterPinVal;
        }

        stream.setState(state);
        emitStateUpdate();
    }
}

wss.on('connection', (ws) => {
    log(CHANNEL.HEATER_CAB_0, 'wss conneced');
    ws.on('message', handleMessageIn);
    ws.on('close', () => log(CHANNEL.HEATER_CAB_0, 'wss disconnected'));
    ws.onerror = console.error;
});

const emitStateUpdate = () => {
    const state = stream.getState();
    const stringified = JSON.stringify(state);
    wss.clients.forEach((client) => client.send(stringified));
    log(CHANNEL.HEATER_CAB_0, 'publish', state);
};

export function turnHeaterOff() {
    const state = stream.getState();
    // if (state.manualOverride?.status === HEATER_OVERRIDE.ON) {
    //   turnHeaterOn();
    //   return;
    // }

    if (state.heaterPinVal === 0) return;
    state.heaterPinVal = 0;
    stream.setState(state);
    emitStateUpdate();
    writeLog('heater off');
}

export function turnHeaterOn() {
    const state = stream.getState();
    // if (state.manualOverride?.status === HEATER_OVERRIDE.OFF) {
    //   turnHeaterOff();
    //   return;
    // }

    if (state.heaterPinVal === 1) return;
    state.heaterPinVal = 1;
    stream.setState(state);
    emitStateUpdate();
    writeLog('heater on');
}

export const homeHeaterStream = stream;

export function initHomeHeater() {
    log(path, 'start');
}
