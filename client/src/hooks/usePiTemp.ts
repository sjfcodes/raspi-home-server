import { useEffect, useState } from "react";
import { CHANNEL } from "../../../constant/constant";
import { PiTemp } from "../../../types/main";
import { socket, socketLogger } from "../utils/socket";

export default function usePiTemp() {
  const [piTemp, setPiTemp] = useState({} as PiTemp);

  useEffect(() => {
    socket.on(CHANNEL.PI_TEMP, (newState: PiTemp) => {
      setPiTemp(newState);
      socketLogger(CHANNEL.PI_TEMP, "in", newState);
    });
  }, []);

  return { piTemp };
}
