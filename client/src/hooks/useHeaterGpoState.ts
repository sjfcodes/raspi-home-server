import { useEffect, useState } from "react";
import {
  CHANNEL,
  HEATER_GPO_DEFAULT_STATE,
  HEATER_OVERRIDE,
  RASP_PI,
} from "../../../constant/constant";
import { HeaterCabState, HeaterManualOverride } from "../../../types/main";

export default function useHeaterGpoState() {
  const [heaterGpo, setHeaterGpio] = useState(HEATER_GPO_DEFAULT_STATE);
  const [ws, setWs] = useState(null as WebSocket | null);

  useEffect(() => {
    // connect to ws server
    const ws = new WebSocket(
      `ws://${RASP_PI.ip}:${RASP_PI.wsPort}${CHANNEL.HEATER_CAB_0}`
    );

    // add event listener reacting when message is received
    ws.onmessage = ({ data }: MessageEvent) => {
      const newState = JSON.parse(data);
      console.log("in :", newState);
      setHeaterGpio(newState);
    };

    ws.onerror = (event: Event) => {
      console.error("ws error", event);
    };

    setWs(ws);
  }, []);

  const togglePin = (forceOn: 1 | 0 = 0) => {
    setHeaterGpio((curr) => {
      if (ws) {
        let heaterPinValue: 1 | 0 | null = null;
        if (curr?.heaterPinVal === 1) heaterPinValue = 0;
        else if (curr?.heaterPinVal === 0) heaterPinValue = 1;

        const newState: HeaterCabState = {
          ...curr,
          heaterPinVal: forceOn || heaterPinValue,
        };

        console.log("out:", newState);
        ws.send(JSON.stringify(newState));
        return newState;
      }
      return curr;
    });
  };

  const setManualOverride = (status: HEATER_OVERRIDE, mins: number | null) => {
    let manualOverride: HeaterManualOverride | null = null;
    if (typeof mins === "number" && mins > 0) {
      manualOverride = {
        status,
        expireAt: new Date(60 * mins * 1000 + Date.now()).toISOString(),
      };
    }

    setHeaterGpio((curr) => {
      if (ws) {
        const newState: HeaterCabState = { ...curr, manualOverride };
        console.log("out:", newState);
        ws.send(JSON.stringify(newState));
        return newState;
      }
      return curr;
    });
  };

  return { heaterGpo, togglePin, setManualOverride };
}
