import { useEffect, useState } from "react";
import { RASP_PI } from "../../../constant/constant";
import { RoomTempState } from "../../../types/main";

const path = `http://${RASP_PI.ip}:${RASP_PI.serverPort}/api/home/temperature/target`;

export default function useHomeTempTarget() {
  const [state, setState] = useState({} as RoomTempState);

  useEffect(() => {
    const sse = new EventSource(path);

    sse.onmessage = (e) => {
      console.log("useHomeTempTarget", e.data);
      setState(JSON.parse(e.data));
    };
  }, []);

  function dispatch(newState: RoomTempState) {
    fetch(path, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newState),
    }).catch((error) => {
      console.error(error);
      // setState(JSON.parse(currState));
    });
  }

  function decrement() {
    dispatch({
      ...state,
      max: state.max - 1,
      min: state.max - 1,
    });
  }
  function increment() {
    dispatch({
      ...state,
      max: state.max + 1,
      min: state.max + 1,
    });
  }

  const setTargetMaxWithTrailingMin = (target: number, trailing = 0) => {
    // const currState = JSON.stringify(state);
    const newState: RoomTempState = {
      ...state,
      max: target,
      min: target - trailing,
    };

    // setState(newState);

    fetch(path, {
      method: "POST",
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
