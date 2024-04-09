import { THERMOSTAT } from '../../../../../constant/constant';
import { ThermostatMap } from '../../../../../types/main';
import {SseManager} from '../../../services/sse';
import { Thermostat } from './model';

const manager = new SseManager('api/thermostat', {} as ThermostatMap)

export async function getManager() {
    return manager;
}

export async function readAll(): Promise<ThermostatMap> {
    return manager.getState();
}


export async function writeOne(item: Thermostat): Promise<Thermostat | void> {
    const state = manager.getState();
    if (item === undefined) {
        console.error(new Error('item must be defined'));
        return;
    }

    if (!item.chipId) {
        console.error(new Error('item.chipId must be defined'));
        return;
    }

    const maxLen = 60;
    const temp = Math.trunc(item.tempF);
    let tempFHistory = state[item.chipId]?.tempFHistory || [];
    if (tempFHistory.length < maxLen) tempFHistory.unshift(temp);
    else tempFHistory = [temp, ...tempFHistory.slice(0, maxLen - 1)];

    const tempAverage =
        tempFHistory.reduce((acc, curr) => acc + curr, 0) / tempFHistory.length;

    const newItem: Thermostat = {
        chipId: item.chipId,
        // @ts-ignore
        chipName: THERMOSTAT[item.chipId] || item.chipName,
        tempF: Math.trunc(tempAverage),
        calibrate: item.calibrate || 0,
        updatedAt: new Date().toLocaleTimeString(),
        tempFHistory,
    };

    state[item.chipId] = newItem;
    manager.setState(state);
}
