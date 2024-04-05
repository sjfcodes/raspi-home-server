import { useEffect, useState } from "react";
import { RASP_PI } from "../../../constant/constant";
import { ThermostatMap } from "../../../types/main";

export default function useThermostatSse() {
  const [state, setState] = useState({} as ThermostatMap);

  useEffect(() => {
    const sse = new EventSource(
      `http://${RASP_PI.ip}:${RASP_PI.serverPort}/api/home/thermostat`
    );

    sse.onmessage = (e) => {
      setState(JSON.parse(e.data));
    };
  }, []);

  return [state];
}
