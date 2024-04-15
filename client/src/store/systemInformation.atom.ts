import { atom } from 'jotai';
import { SytemInformation } from '../../../types/main';
import { urls } from '../config.global';
import { store } from './store.global';

export const systemInformationAtom = atom({} as SytemInformation);

fetch(urls.system.information.get)
    .then((response) => response.json())
    .then(({ data }) => {
        console.log;
        if (!data) {
            console.warn('data is undefined', { data });
            return;
        }
        store.set(systemInformationAtom, data);
    });
