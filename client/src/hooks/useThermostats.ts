import { useEffect, useState } from "react";
import { CHANNEL } from "../../../constant/constant";
import { ThermostatMap } from "../../../types/main";
import { socket, socketLogger } from "../utils/socket";

export default function useThermostats() {
  const [thermostatMap, setThermostatMap] = useState({} as ThermostatMap);

  useEffect(() => {
    socket.on(CHANNEL.THERMOSTAT_MAP, (newState: ThermostatMap) => {
      setThermostatMap(newState);
      socketLogger(CHANNEL.THERMOSTAT_MAP, "in", newState);
    });
  }, []);

  return { thermostatMap };
}
