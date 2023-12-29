import { useEffect, useState } from "react";
import { CHANNEL } from "../../../constant/constant";
import { RoomTempState } from "../../../types/main";
import { socket } from "../utils/socket";

export default function useTargetTemp() {
  const [targetTemp, setRoomTemp] = useState({} as RoomTempState);

  useEffect(() => {
    socket.on(CHANNEL.TARGET_TEMP, (newState: RoomTempState) => {
      console.log("in :", newState);
      setRoomTemp(newState);
    });
  }, []);

  const setTargetTempMin = (min: number) => {
    setRoomTemp((curr) => {
      const newState: RoomTempState = { ...curr, min };
      console.log("out:", newState);
      socket.emit(CHANNEL.TARGET_TEMP, newState);
      return newState;
    });
  };

  const setTargetTempMax = (max: number) => {
    setRoomTemp((curr) => {
      const newState: RoomTempState = { ...curr, max };
      console.log("out:", newState);
      socket.emit(CHANNEL.TARGET_TEMP, newState);
      return newState;
    });
  };

  return { targetTemp, setTargetTempMin, setTargetTempMax };
}
