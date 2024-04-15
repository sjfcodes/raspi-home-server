import { WebSocketServer } from 'ws';
import { SseManager } from '../sse';
import { Item, ItemMap } from './model';
import { logger } from '../../../config/logger';
import { getDate } from '../../../services/utility';
import {
    WSS_CHANNEL,
    HEATER_ID,
    ZONE_ID,
    ITEM_TYPE,
} from '../../../config/globals';
import { writeHeaterLog } from '../../../services/pi';

export const sseManager = new SseManager({} as ItemMap);

export function readAll(): ItemMap {
    return sseManager.getState() as ItemMap;
}

export function readOne(heaterId: string): Item | undefined {
    const heaters = readAll();
    return heaters[heaterId];
}

export function writeOne(item: Item): void {
    sseManager.setState(item.chipId, item);
    writeHeaterLog(item);
}

// wss connection to heater
const wss = new WebSocketServer({
    path: WSS_CHANNEL.HEATER_CAB_0,
    port: 3001,
});

wss.on('connection', (ws) => {
    logger.info(`WSS:3001 ${WSS_CHANNEL.HEATER_CAB_0} connected`);
    ws.on('message', handleMessageIn);
    ws.on('close', () =>
        logger.info(`WSS:3001 ${WSS_CHANNEL.HEATER_CAB_0} disconnected`)
    );
    ws.onerror = console.error;
});

function handleMessageIn(data: string) {
    const input: Item = JSON.parse(data.toString());

    if (input.chipId === HEATER_ID.HOME) {
        const item: Item = {
            zoneId: ZONE_ID.HOME,
            chipId: input.chipId,
            cabHumidity: input.cabHumidity,
            cabTempF: input.cabTempF,
            heaterPinVal: input.heaterPinVal ?? null,
            updatedAt: getDate(),
            itemType: ITEM_TYPE.HEATER,
        };

        writeOne(item);
    }
}

export function turnHeaterOff(heaterId: string) {
    const heater = readOne(heaterId);
    if (!heater || heater.heaterPinVal === 0) return;

    writeOne({ ...heater, heaterPinVal: 0 });
    emitStateUpdate(heaterId);
}

export function turnHeaterOn(heaterId: string) {
    const heater = readOne(heaterId);
    if (!heater || heater.heaterPinVal === 1) return;

    writeOne({ ...heater, heaterPinVal: 1 });
    emitStateUpdate(heaterId);
}

const emitStateUpdate = (heaterId: string) => {
    const heater = readOne(heaterId);
    if (!heater) return;

    const stringified = JSON.stringify(heater);
    wss.clients.forEach((client) => client.send(stringified));
    // log(WSS_CHANNEL.HEATER_CAB_0, 'publish', state);
};
