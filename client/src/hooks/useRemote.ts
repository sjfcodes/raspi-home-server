import { useEffect, useState } from "react";
import { RASP_PI } from "../../../constant/constant";
import { HeaterCabState } from "../../../types/main";

const path = `http://${RASP_PI.ip}:${RASP_PI.serverPort}/api/v1/remote?subscribe=true`;
export default function useRemote() {
  const [state, setState] = useState(null as null | HeaterCabState);

  useEffect(() => {
    const sse = new EventSource(path);
    sse.onmessage = (e) => setState(JSON.parse(e.data));
    sse.onerror = console.error;
  }, []);

  return [state];
}
