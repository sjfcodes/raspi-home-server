import { atom } from 'jotai';
import { SystemTemperatureMap } from '../../../types/main';
import { urls } from '../config.global';
import { store } from './store.global';

export const systemTemperatureAtom = atom({} as SystemTemperatureMap);

const stream = new EventSource(urls.system.temperature.get);
stream.onerror = console.error;
stream.onmessage = (e) => {
    console.log('onmessage', urls.system.temperature.get);
    let data = JSON.parse(e.data);
    if (!data) {
        console.warn('data is undefined', { data });
        return;
    }

    store.set(systemTemperatureAtom, data); // Update atom's value
    //   console.log("From store.get", store.get(timeAtom)); // Read atom's value
};
