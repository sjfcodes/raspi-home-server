import { useEffect, useState } from "react";
import { RASP_PI } from "../../../constant/constant";
import { HeaterCabState } from "../../../types/main";

export default function useHomeHeater() {
  const [state, setState] = useState(null as null | HeaterCabState);

  useEffect(() => {
    const sse = new EventSource(
      `http://${RASP_PI.ip}:${RASP_PI.serverPort}/api/home/heater`
    );

    sse.onmessage = (e) => {
      setState(JSON.parse(e.data));
    };
  }, []);

  return [state];
}
