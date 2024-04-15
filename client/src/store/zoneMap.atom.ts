import { atom } from 'jotai';
import { ZoneMap } from '../../../types/main';
import { urls } from '../config.global';
import { store } from './store.global';

export const zoneMapAtom = atom({} as ZoneMap);

fetch(urls.zone.get)
    .then((response) => response.json())
    .then(({ data }) => {
        console.log;
        if (!data) {
            console.warn('data is undefined', { data });
            return;
        }

        store.set(zoneMapAtom, data); // Update atom's value
        //   console.log("From store.get", store.get(timeAtom)); // Read atom's value
    });
