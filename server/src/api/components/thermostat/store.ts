import { HEATER_OVERRIDE_STATUS } from '../../../../../constant/constant';
import { ITEM_TYPE, THERMOSTAT_ID, ZONE_ID } from '../../../config/globals';
import { logger } from '../../../services/logger';
import { getDate } from '../../../services/utility';
import { SseManager } from '../sse';
import { onThermostatUpdate } from '../zone/actions';
import { Item, ItemMap } from './model';

export const thermostatStore = new SseManager({
    [ZONE_ID.HOME]: {
        thermostatId: THERMOSTAT_ID.HOME,
        zoneId: ZONE_ID.HOME,
        unit: 'F',
        max: 66,
        min: 66,
        updatedAt: new Date().toISOString(),
        itemType: ITEM_TYPE.THERMOSTAT,
    },
    [ZONE_ID.OFFICE.toString()]: {
        thermostatId: THERMOSTAT_ID.OFFICE,
        zoneId: ZONE_ID.OFFICE,
        unit: 'F',
        max: 66,
        min: 66,
        updatedAt: new Date().toISOString(),
        itemType: ITEM_TYPE.THERMOSTAT,
    },
} as ItemMap);

export function getThermostats(): ItemMap {
    return thermostatStore.getState();
}

export function getThermostatById(id: string): Item | undefined {
    const items = getThermostats();
    return items[id];
}

export function setThermostatById(id: string, payload: Item): void {
    if (!id) {
        logger.error('"id" must be defined');
        return;
    }
    if (!payload) {
        logger.error('payload must be defined');
        return;
    }
    if (payload?.min && typeof payload?.min !== 'number') {
        logger.error(`thermostat.min must be type number.`);
        return;
    }
    if (payload?.max && typeof payload?.max !== 'number') {
        logger.error(`thermostat.max must be type number.`);
        return;
    }

    if (payload.min && payload.max && payload.min > payload.max) {
        logger.error(`thermostat.min & thermostat.max pair out of range.`);
        return;
    }
    if(payload.heaterOverride) {
        if (payload.heaterOverride.status && !Object.values(HEATER_OVERRIDE_STATUS).includes(payload.heaterOverride.status)) {
            logger.error('thermostat.heaterOverride.status is invalid')
        }
    }

    const prevState = thermostatStore.getState()[id];
    if (!prevState) {
        logger.error('"prevState" must be defined');
    }

    // Only update if payload contains relevant changes
    if (prevState) {
        const nextState = {
            ...prevState,
            ...payload,
            updatedAt: getDate(),
        };
        thermostatStore.setState(nextState.thermostatId, nextState);
        onThermostatUpdate(nextState.zoneId);
    }
}
