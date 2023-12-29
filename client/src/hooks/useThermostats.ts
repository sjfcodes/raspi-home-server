import { useEffect, useState } from "react";
import { CHANNEL } from "../../../constant/constant";
import { ThermostatMap } from "../../../types/main";
import { socket } from "../utils/socket";

export default function useThermostats() {
  const [thermostatMap, setThermostatMap] = useState({} as ThermostatMap);

  useEffect(() => {
    socket.on(CHANNEL.THERMOSTAT_MAP, (newState: ThermostatMap) => {
      // console.log('in :', newState)
      setThermostatMap(newState);
    });
  }, []);

  return { thermostatMap };
}
