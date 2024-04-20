import { atom } from 'jotai';
import { ThermostatMap } from '../../../types/main';
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
