import { useEffect, useState } from "react";
import { RASP_PI } from "../../../constant/constant";
import { RemoteState } from "../../../types/main";

const sseUrl = `http://${RASP_PI.ip}:${RASP_PI.serverPort}/api/v1/remote?subscribe=true`;
const putUrl = `http://${RASP_PI.ip}:${RASP_PI.serverPort}/api/v1/remote`;

export default function useRemote(remoteKey = "home") {
  const [state, setState] = useState(null as null | RemoteState);

  // Listen for server state changes
  useEffect(() => {
    const sse = new EventSource(sseUrl);
    sse.onmessage = (e) => {
      console.log("onmessage", sseUrl);
      setState(JSON.parse(e.data)[remoteKey]);
    };
    sse.onerror = console.error;
  }, []);

  // Request server state change
  async function dispatch(newState: RemoteState) {
    fetch(putUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newState),
    });
  }

  function decrement() {
    if (!state) return;
    dispatch({
      ...state,
      max: state.max - 1,
      min: state.max - 1,
    });
  }
  function increment() {
    if (!state) return;
    dispatch({
      ...state,
      max: state.max + 1,
      min: state.max + 1,
    });
  }

  const setTargetMaxWithTrailingMin = (target: number, trailing = 0) => {
    if (!state) return;
    const newState: RemoteState = {
      ...state,
      max: target,
      min: target - trailing,
    };

    dispatch(newState);
  };

  return {
    data: state,
    decrement,
    increment,
    setTargetMaxWithTrailingMin,
  };
}
