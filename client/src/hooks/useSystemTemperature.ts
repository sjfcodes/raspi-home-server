import { useEffect, useState } from "react";
import { RASP_PI } from "../../../constant/constant";
import { SystemTemperatureState } from "../../../types/main";

const path = `http://${RASP_PI.ip}:${RASP_PI.serverPort}/api/v1/system/temperature?subscribe=true`;
export default function useSystemTemperature() {
  const [state, setState] = useState({} as SystemTemperatureState);

  useEffect(() => {
    const sse = new EventSource(path);
    sse.onmessage = (e) => {
      console.log("onmessage", path);
      setState(JSON.parse(e.data));
    };
    sse.onerror = console.error;
  }, []);

  return [state];
}
