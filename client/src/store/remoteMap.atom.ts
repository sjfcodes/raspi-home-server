import { atom } from 'jotai';
import { RemoteMap } from '../../../types/main';
import { dispatch } from './dispatch';
import { urls } from '../config.global';
import { store } from './store.global';

export const remoteMapAtom = atom({} as RemoteMap);

const stream = new EventSource(urls.remote.get);
stream.onerror = console.error;
stream.onmessage = (e) => {
    let data = JSON.parse(e.data);
    if (!data) {
        console.warn('data is undefined', { data });
        return;
    }

    store.set(remoteMapAtom, data); // Update atom's value
    //   console.log("From store.get", store.get(timeAtom)); // Read atom's value
};

export const remoteControlUp = (remoteId: string, step = 1) => {
    const remote = store.get(remoteMapAtom)[remoteId];
    if (!remote) return;

    dispatch(urls.remote.put, {
        ...remote,
        max: remote.max + step,
        min: remote.min + step,
    });
};

export const remoteControlDown = (remoteId: string, step = 1) => {
    const remote = store.get(remoteMapAtom)[remoteId];
    if (!remote) return;

    dispatch(urls.remote.put, {
        ...remote,
        max: remote.max - step,
        min: remote.min - step,
    });
};
