import { useEffect, useState } from "react";
import {
  CHANNEL,
  HEATER_GPIO_DEFAULT_STATE,
  HEATER_OVERRIDE,
  RASP_PI,
} from "../../../constant/constant";
import { HeaterGpioState, HeaterManualOverride } from "../../../types/main";
import { socket } from "../utils/socket";

export default function useHeaterGpioState() {
  const [heaterGpio, setHeaterGpio] = useState(HEATER_GPIO_DEFAULT_STATE);
  const [ws, setWs] = useState(null as WebSocket | null);

  useEffect(() => {
    // connect to ws server
    const ws = new WebSocket(
      `ws://${RASP_PI.ip}:${RASP_PI.wsPort}${CHANNEL.HEATER_GPIO_0}`
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

  const togglePin = (forceOn = false) => {
    setHeaterGpio((curr) => {
      if (ws) {
        const newState: HeaterGpioState = {
          ...curr,
          isOn: forceOn || !curr?.isOn,
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
      const newState: HeaterGpioState = { ...curr, manualOverride };
      console.log("out:", newState);
      socket.emit(CHANNEL.HEATER_GPIO_0, newState);
      return newState;
    });
  };

  return { heaterGpio, togglePin, setManualOverride };
}
