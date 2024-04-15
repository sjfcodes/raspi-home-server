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
import { Heater, HeaterPinVal } from '../../../../../types/main';

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

// [NOTE] This is set on heater as well
const PORT = 3001;

// wss connection to heater
const wss = new WebSocketServer({
    path: WSS_CHANNEL.HEATER_CAB_0,
    port: PORT,
});

wss.on('connection', (ws) => {
    logger.info(`WSS:${PORT} ${WSS_CHANNEL.HEATER_CAB_0} CONNETED`);
    ws.on('message', handleMessageIn);
    ws.on('close', () =>
        logger.info(`WSS:${PORT} ${WSS_CHANNEL.HEATER_CAB_0} DISCONNECTED`)
    );
    ws.onerror = console.error;
});

function handleMessageIn(data: string) {
    const input: Item = JSON.parse(data.toString());
    if (input.chipId !== HEATER_ID.HOME) return;
    logger.info(`WSS:${PORT} ${WSS_CHANNEL.HEATER_CAB_0} MESSAGE-IN ${input}`);

    const item: Item = {
        zoneId: ZONE_ID.HOME,
        chipId: input.chipId,
        heaterPinVal: input.heaterPinVal ?? null,
        cabTempF: input.cabTempF,
        cabHumidity: input.cabHumidity,
        updatedAt: getDate(),
        itemType: ITEM_TYPE.HEATER,
    };

    writeOne(item);
}

export function turnHeaterOff(heaterId: string) {
    const heater = readOne(heaterId);
    if (!heater || heater.heaterPinVal === 0) return;

    const nextState: Heater = { ...heater, heaterPinVal: 0 };
    writeOne(nextState);
    handleMessageOut(nextState.heaterPinVal);
}

export function turnHeaterOn(heaterId: string) {
    const heater = readOne(heaterId);
    if (!heater || heater.heaterPinVal === 1) return;

    const nextState: Heater = { ...heater, heaterPinVal: 1 };
    writeOne(nextState);
    handleMessageOut(nextState.heaterPinVal);
}

const handleMessageOut = (heaterPinVal: HeaterPinVal) => {
    /**
     * [NOTE] Keep messages small when sending to esp32 boards
     */
    const message = { heaterPinVal };
    const stringified = JSON.stringify(message);
    wss.clients.forEach((client) => client.send(stringified));
    logger.info(
        `WSS:${PORT} ${WSS_CHANNEL.HEATER_CAB_0} MESSAGE-OUT ${stringified}`
    );
};
