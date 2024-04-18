import { SseManager } from '../sse';
import { Item, ItemMap } from './model';
import { logger } from '../../../services/logger';
import { getDate } from '../../../services/utility';
import {
    WSS_CHANNEL,
    HEATER_ID,
    ZONE_ID,
    ITEM_TYPE,
    env,
} from '../../../config/globals';
import { writeHeaterLog } from '../../../services/pi';
import { HeaterPinVal } from '../../../../../types/main';
import { getWss } from './wss';

export const heaterStore = new SseManager({} as ItemMap);

export function getHeaters(): ItemMap {
    return heaterStore.getState() as ItemMap;
}

export function getHeaterById(heaterId: string): Item | undefined {
    const heaters = getHeaters();
    return heaters[heaterId];
}

export function setHeaterById(item: Item): void {
    heaterStore.setState(item.chipId, item);
    writeHeaterLog(item);
}

const logPrefix = `WSS:${env.WSS_PORT} ${WSS_CHANNEL.HEATER_CAB_0}`

const wss = getWss();
wss.on('connection', (ws) => {
    logger.info(`${logPrefix} CONNETED`);
    ws.on('message', handleMessageIn);
    ws.on('close', () =>
        logger.info(`${logPrefix}  DISCONNECTED`)
    );
    ws.onerror = console.error;
});

function handleMessageIn(data: string) {
    const input: Item = JSON.parse(data.toString());
    if (input.chipId !== HEATER_ID.HOME) return;
    logger.info(
        `${logPrefix}  MESSAGE-IN ${data.toString()}`
    );

    const item: Item = {
        zoneId: ZONE_ID.HOME,
        chipId: input.chipId,
        heaterPinVal: input.heaterPinVal ?? null,
        cabTempF: input.cabTempF,
        cabHumidity: input.cabHumidity,
        updatedAt: getDate(),
        itemType: ITEM_TYPE.HEATER,
    };

    setHeaterById(item);
}

export const handleMessageOut = (heaterPinVal: HeaterPinVal) => {
    /**
     * [NOTE] Keep messages small when sending to esp32 boards
     */
    const message = { heaterPinVal };
    const stringified = JSON.stringify(message);
    wss.clients.forEach((client) => client.send(stringified));
    logger.info(
        `${logPrefix}  MESSAGE-OUT ${stringified}`
    );
};
