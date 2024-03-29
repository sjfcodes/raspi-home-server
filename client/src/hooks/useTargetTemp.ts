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
      if (min > curr.max) newState.max++
      console.log("out:", newState);
      socket.emit(CHANNEL.TARGET_TEMP, newState);
      return newState;
    });
  };

  const setTargetTempMax = (max: number) => {
    setRoomTemp((curr) => {
      const newState: RoomTempState = { ...curr, max };
      if (max < curr.min) newState.min--;
      console.log("out:", newState);
      socket.emit(CHANNEL.TARGET_TEMP, newState);
      return newState;
    });
  };

  const setTargetMaxWithTrailingMin = (target: number, trailing = 0) => {
    setRoomTemp((curr) => {
      const newState: RoomTempState = {
        ...curr,
        max: target,
        min: target - trailing,
      };
      console.log("out:", newState);
      socket.emit(CHANNEL.TARGET_TEMP, newState);
      return newState;
    });
  };

  return {
    targetTemp,
    setTargetMaxWithTrailingMin,
    setTargetTempMin,
    setTargetTempMax,
  };
}
