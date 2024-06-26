import { useEffect, useState } from "react";
import { RASP_PI } from "../../../constant/constant";
import { ThermostatMap } from "../../../types/main";

const path = `http://${RASP_PI.ip}:${RASP_PI.serverPort}/api/home/thermostat`;
export default function useThermostatMap() {
  const [state, setState] = useState({} as ThermostatMap);

  useEffect(() => {
    const sse = new EventSource(path);
    sse.onmessage = (e) => setState(JSON.parse(e.data));
    sse.onerror = console.error;
  }, []);

  return [state];
}
