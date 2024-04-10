import { WebSocketServer } from 'ws';
import { SseManager } from '../sse';
import { Item } from './model';
import { CHANNEL, HEATER_CAB } from '../../../../../constant/constant';
import { logger } from '../../../config/logger';
import { formatLog } from '../../../../src_old/utils/general';

export const sseManager = new SseManager({} as Record<string, Item>);

export function readAll(): Record<string, Item> {
    return sseManager.getState() as Record<string, Item>;
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
    logger.info(formatLog(CHANNEL.HEATER_CAB_0, 'wss conneced'));
    ws.on('message', handleMessageIn);
    ws.on('close', () =>
        logger.info(formatLog(CHANNEL.HEATER_CAB_0, 'wss disconnected'))
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
            updatedAt: new Date().toLocaleTimeString(),
        } as Item;

        writeOne(item);
    }
}
