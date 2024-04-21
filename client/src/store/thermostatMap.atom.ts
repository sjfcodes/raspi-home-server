import { atom } from 'jotai';
import { HeaterOverrideStatus, ThermostatMap } from '../../../types/main';
import { dispatch } from './dispatch';
import { urls } from '../config.global';
import { store } from './store.global';

export const thermostatMapAtom = atom({} as ThermostatMap);

const stream = new EventSource(urls.thermostat.get);
stream.onerror = console.error;
stream.onmessage = (e) => {
    let data = JSON.parse(e.data);
    if (!data) {
        console.warn('data is undefined', { data });
        return;
    }

    store.set(thermostatMapAtom, data); // Update atom's value
    //   console.log("From store.get", store.get(timeAtom)); // Read atom's value
};

export const thermostatControlUp = (thermostatId: string, step = 1) => {
    const thermostat = store.get(thermostatMapAtom)[thermostatId];
    if (!thermostat) return;

    dispatch(urls.thermostat.put, {
        ...thermostat,
        max: thermostat.max + step,
        min: thermostat.min + step,
    });
};

export const thermostatControlDown = (thermostatId: string, step = 1) => {
    const thermostat = store.get(thermostatMapAtom)[thermostatId];
    if (!thermostat) return;

    dispatch(urls.thermostat.put, {
        ...thermostat,
        max: thermostat.max - step,
        min: thermostat.min - step,
    });
};

export const thermostatControlSetHeaterOverride = (thermostatId:string, heaterOverride: HeaterOverrideStatus ) => {
    const thermostat = store.get(thermostatMapAtom)[thermostatId];
    if (!thermostat) return;

    dispatch(urls.thermostat.put, {
        ...thermostat,
        heaterOverride,
    });
}
