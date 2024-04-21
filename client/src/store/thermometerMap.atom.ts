import { atom } from 'jotai';
import { ThermometerMap } from '../../../types/main';
import { urls } from '../config.global';
import { store } from './store.global';

export const thermometerMapAtom = atom({} as ThermometerMap);

const stream = new EventSource(urls.thermometer.get);
stream.onerror = console.error;
stream.onmessage = (e) => {
    let data = JSON.parse(e.data);
    if (!data) {
        console.warn('data is undefined', { data });
        return;
    }

    store.set(thermometerMapAtom, data); // Update atom's value
    //   console.log("From store.get", store.get(timeAtom)); // Read atom's value
};
