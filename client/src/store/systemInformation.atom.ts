import { atom } from 'jotai';
import { SytemInformation } from '../../../types/main';
import { urls } from '../config.global';
import { store } from './store.global';

export const systemInformationAtom = atom({} as SytemInformation);

const startTime = Date.now();
// [TODO] if fetch returns 404, retry until 200 response, or 1 minute passes;
function init() {
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
}
init();
