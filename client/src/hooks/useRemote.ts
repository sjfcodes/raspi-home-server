import { useEffect, useState } from "react";
import { RASP_PI } from "../../../constant/constant";
import { RemoteState, RemoteStateMap } from "../../../types/main";

const sseUrl = `http://${RASP_PI.ip}:${RASP_PI.serverPort}/api/v1/remote?subscribe=true`;
const putUrl = `http://${RASP_PI.ip}:${RASP_PI.serverPort}/api/v1/remote`;

export default function useRemote(remoteId?: string) {
  const [state, setState] = useState({} as RemoteStateMap);

  // Listen for server state changes
  useEffect(() => {
    const sse = new EventSource(sseUrl);
    sse.onerror = console.error;
    sse.onmessage = (e) => {
      console.log("onmessage", sseUrl);
      let data = JSON.parse(e.data);
      if (!data) {
        console.warn("data is undefined", { remoteId, data });
        return;
      }

      setState(data);
    };
  }, []);

  // Request server state change
  async function dispatch(newState: RemoteState) {
    fetch(putUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newState),
    });
  }

  function decrement(remoteId: string) {
    const target = state[remoteId];
    if (!target) return;
    dispatch({
      ...target,
      max: target.max - 1,
      min: target.max - 1,
    });
  }
  function increment(remoteId: string) {
    const target = state[remoteId];
    if (!target) return;
    dispatch({
      ...target,
      max: target.max + 1,
      min: target.max + 1,
    });
  }

  return {
    data: state,
    decrement,
    increment,
  };
}
