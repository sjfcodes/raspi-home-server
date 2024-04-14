import { useEffect, useState } from "react";
import { RASP_PI } from "../../../constant/constant";
import { SytemInfo } from "../../../types/main";

const path = `http://${RASP_PI.ip}:${RASP_PI.serverPort}/api/v1/system/info`;
export default function useSystemInfo() {
  const [state, setState] = useState({} as SytemInfo);

  useEffect(() => {
    async function getInfo() {
      const response = await fetch(path, {
        headers: { Accept: "application/json" },
      });
      const {data} = await response.json();

      setState(data);
    }
    getInfo();
  }, []);

  return [state];
}
