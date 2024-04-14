import { useEffect, useState } from "react";
import { RASP_PI } from "../../../constant/constant";
import { HeaterCabMap } from "../../../types/main";

const path = `http://${RASP_PI.ip}:${RASP_PI.serverPort}/api/v1/heater?subscribe=true`;
export default function useHeater() {
  const [state, setState] = useState({} as HeaterCabMap);

  useEffect(() => {
    const sse = new EventSource(path);
    sse.onmessage = (e) => {
      console.log("onmessage", path);
      setState(JSON.parse(e.data));
    };
    sse.onerror = console.error;
  }, []);

  return { data: state };
}
