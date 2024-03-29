import { useEffect, useState } from "react";
import { CHANNEL } from "../../../constant/constant";
import { RoomTempState } from "../../../types/main";
import { socket, socketLogger } from "../utils/socket";

export default function useRoomTemp() {
  const [roomTemp, setRoomTemp] = useState<RoomTempState | null>(null);

  useEffect(() => {
    socket.on(CHANNEL.TARGET_TEMP, (newState: RoomTempState) => {
      setRoomTemp(newState);
      socketLogger(CHANNEL.TARGET_TEMP, "in", newState);
    });
  }, []);

  const setTargetTempMin = (min: number) => {
    setRoomTemp((curr) => {
      if (!curr) return curr;

      const newState: RoomTempState = { ...curr, min };
      if (min > curr.max) newState.max++;
      socket.emit(CHANNEL.TARGET_TEMP, newState);
      socketLogger(CHANNEL.TARGET_TEMP, "out", newState);
      return newState;
    });
  };

  const setTargetTempMax = (max: number) => {
    setRoomTemp((curr) => {
      if (!curr) return curr;

      const newState: RoomTempState = { ...curr, max };
      if (max < curr.min) newState.min--;
      socket.emit(CHANNEL.TARGET_TEMP, newState);
      socketLogger(CHANNEL.TARGET_TEMP, "out", newState);
      return newState;
    });
  };

  const setTargetMaxWithTrailingMin = (target: number, trailing = 0) => {
    setRoomTemp((curr) => {
      if (!curr) return curr;

      const newState: RoomTempState = {
        ...curr,
        max: target,
        min: target - trailing,
      };
      socket.emit(CHANNEL.TARGET_TEMP, newState);
      socketLogger(CHANNEL.TARGET_TEMP, "out", newState);
      return newState;
    });
  };

  return {
    roomTemp,
    setTargetMaxWithTrailingMin,
    setTargetTempMin,
    setTargetTempMax,
  };
}
