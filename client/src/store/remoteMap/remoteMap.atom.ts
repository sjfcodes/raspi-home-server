import { atom, createStore } from "jotai";
import { RemoteStateMap } from "../../../../types/main";
import { dispatch } from "../dispatch";
import { urls } from "../../config.global";

// see docs for more info: https://jotai.org/docs/guides/using-store-outside-react
/**
 *                  Read this,
 *  then this.      |
 *           |      |
 *           V      V
 */
export const mato = atom({} as RemoteStateMap);
export const store = createStore();

const stream = new EventSource(urls.remote.get);
stream.onerror = console.error;
stream.onmessage = (e) => {
  console.log("onmessage", urls.remote.get);
  let data = JSON.parse(e.data);
  if (!data) {
    console.warn("data is undefined", { data });
    return;
  }

  store.set(mato, data); // Update atom's value
  //   console.log("From store.get", store.get(timeAtom)); // Read atom's value
};

export const remoteTempUp = (remoteId: string, step = 1) => {
  const remote = store.get(mato)[remoteId];
  if (!remote) return;

  dispatch(urls.remote.put, {
    ...remote,
    max: remote.max + step,
    min: remote.min + step,
  });
};

export const remoteTempDown = (remoteId: string, step = 1) => {
  const remote = store.get(mato)[remoteId];
  if (!remote) return;

  dispatch(urls.remote.put, {
    ...remote,
    max: remote.max - step,
    min: remote.min - step,
  });
};

export const remoteMapAtom = mato;
export const remoteMapStore = store;
