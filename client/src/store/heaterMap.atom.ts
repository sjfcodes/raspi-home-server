import { atom } from 'jotai';
import { HeaterMap } from '../../../types/main';
import { dispatch } from './dispatch';
import { urls } from '../config.global';
import { store } from './store.global';
import { HEATER_OVERRIDE_STATUS } from '../../../constant/constant';

export const heaterMapAtom = atom({} as HeaterMap);

const stream = new EventSource(urls.heater.get);
stream.onerror = console.error;
stream.onmessage = (e) => {
    console.log('onmessage', urls.heater.get);
    let data = JSON.parse(e.data);
    if (!data) {
        console.warn('data is undefined', { data });
        return;
    }

    store.set(heaterMapAtom, data); // Update atom's value
    //   console.log("From store.get", store.get(timeAtom)); // Read atom's value
};

const minuteSeconds = 60 * 1000;
export const overrideOn = (heaterId: string, step = 10) => {
    const heater = store.get(heaterMapAtom)[heaterId];
    if (!heater) return;

    dispatch(urls.heater.put, {
        ...heater,
        state: {
            status: HEATER_OVERRIDE_STATUS.FORCE_ON,
            expireAt: Date.now() + minuteSeconds * step,
        },
    });
};

export const overrideOff = (heaterId: string, step = 10) => {
    const heater = store.get(heaterMapAtom)[heaterId];
    if (!heater) return;

    dispatch(urls.heater.put, {
        ...heater,
        state: {
            status: HEATER_OVERRIDE_STATUS.FORCE_OFF,
            expireAt: Date.now() + minuteSeconds * step,
        },
    });
};
