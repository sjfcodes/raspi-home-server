import { useEffect, useState } from "react";
import { RASP_PI } from "../../../constant/constant";
import { RemoteState } from "../../../types/main";

const path = `http://${RASP_PI.ip}:${RASP_PI.serverPort}/api/v1/remote`;

export default function useRemote() {
  const [state, setState] = useState(null as null | RemoteState);

  useEffect(() => {
    const sse = new EventSource(path + "?subscribe=true");
    sse.onmessage = (e) => setState(JSON.parse(e.data)["home"]);
    sse.onerror = console.error;
  }, []);

  function dispatch(newState: RemoteState) {
    const currState = JSON.stringify(state);
    fetch(path, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newState),
    }).catch((error) => {
      console.error(error);
      setState(JSON.parse(currState));
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

    fetch(path, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newState),
    }).catch((error) => {
      console.error(error);
      // setState(JSON.parse(currState));
    });
  };

  return {
    data: state,
    decrement,
    increment,
    setTargetMaxWithTrailingMin,
  };
}
