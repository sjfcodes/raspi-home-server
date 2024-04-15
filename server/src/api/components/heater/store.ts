import { WebSocketServer } from 'ws';
import { SseManager } from '../sse';
import { Item, ItemMap } from './model';
import { CHANNEL, HEATER_CAB } from '../../../../../constant/constant';
import { logger } from '../../../config/logger';
import { getDate } from '../../../services/utility';

export const sseManager = new SseManager({} as ItemMap);

export function readAll(): ItemMap {
    return sseManager.getState() as ItemMap;
}

export function writeOne(item: Item): void {
    sseManager.setState(item.chipId, item);
}

// wss connection to heater
const wss = new WebSocketServer({
    path: CHANNEL.HEATER_CAB_0,
    port: 3001,
});

wss.on('connection', (ws) => {
    logger.info(`WSS:3001 ${CHANNEL.HEATER_CAB_0} connected`);
    ws.on('message', handleMessageIn);
    ws.on('close', () =>
        logger.info(`WSS:3001 ${CHANNEL.HEATER_CAB_0} disconnected`)
    );
    ws.onerror = console.error;
});

function handleMessageIn(data: string) {
    const input: Item = JSON.parse(data.toString());

    if (input.chipId === HEATER_CAB.HOME) {
        const item = {
            chipId: input.chipId,
            cabHumidity: input.cabHumidity,
            cabTempF: input.cabTempF,
            heaterPinVal: input.heaterPinVal ?? null,
            updatedAt: getDate(),
        } as Item;

        writeOne(item);
    }
}
