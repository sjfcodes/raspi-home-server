import { DigitalOutput } from "raspi-gpio";
import { WebSocketServer } from "ws";
import {
  CHANNEL,
  HEATER_GPO_DEFAULT_STATE,
  HEATER_OVERRIDE,
} from "../../../../constant/constant";
import { HeaterCabState } from "../../../../types/main";
import { writeLog } from "../logs/logger";
import { roomTempState } from "../room/temperature";
import { clientMapState } from "./temperature";

export const heaterGpo = new DigitalOutput("GPIO4");
export let heaterGpoState = HEATER_GPO_DEFAULT_STATE;
const options = {
  path: CHANNEL.HEATER_CAB_0,
  port: 3001,
};

const wssHeaterGpo = new WebSocketServer(options);
wssHeaterGpo.on("connection", (ws) => {
  console.log("wssHeaterGpo client connected");
  /**
   * [NOTE]: Don't send server state to client on connect
   * instead, wait until esp32 sends new state which will
   * then broadcast to all connected clients.
   */
  // ws.send(JSON.stringify(heaterGpoState));
  ws.on("close", () => console.log("wssHeaterGpo client disconnected"));
  ws.on("message", (data) => {
    const input = JSON.parse(data.toString());
    heaterGpoState.cabHumidity = input.cabHumidity;
    heaterGpoState.cabTempF = input.cabTempF;
    heaterGpoState.chipId = input.chipId;
    if (input.heaterPinVal !== undefined) {
      heaterGpo.write(input.heaterPinVal ? 1 : 0);
      heaterGpoState.heaterPinVal = input.heaterPinVal;
    }
    emitStateUpdate();
  });
  ws.onerror = function () {
    console.log("websocket error");
  };
});

const emitStateUpdate = () => {
  const stringified = JSON.stringify(heaterGpoState);
  wssHeaterGpo.clients.forEach((client) => client.send(stringified));
  console.log("newState", stringified);
};

// check heater status changes every x seconds
export const checkHeaterStatus = (forceOn = false) => {
  let primaryThermostat = "9efc8ad4"; // THERMOSTAT.LIVING_ROOM_0
  const curTemp =
    clientMapState?.[primaryThermostat]?.tempF +
    clientMapState?.[primaryThermostat]?.calibrate;
  writeLog(`current temp is ${curTemp}`);

  // if heater off & current temp below below min
  const shouldTurnOn =
    heaterGpoState.heaterPinVal === 0 && curTemp < roomTempState.min;
  // if heater on & current temp above max
  const shouldTurnOff =
    heaterGpoState.heaterPinVal === 1 && curTemp > roomTempState.max;

  if (forceOn || shouldTurnOn) {
    setHeaterGpioOn();
  } else if (shouldTurnOff) {
    setHeaterGpoOff();
  }
};

export const setHeaterGpoOff = (emit = true) => {
  if (heaterGpoState.manualOverride?.status === HEATER_OVERRIDE.ON) {
    setHeaterGpioOn();
    return;
  }

  heaterGpo.write(0);
  heaterGpoState.heaterPinVal = 0;
  if (emit) emitStateUpdate();
  writeLog("heater off");
};

export const setHeaterGpioOn = (emit = true) => {
  if (heaterGpoState.manualOverride?.status === HEATER_OVERRIDE.OFF) {
    setHeaterGpoOff();
    return;
  }

  heaterGpo.write(1);
  heaterGpoState.heaterPinVal = 1;
  if (emit) emitStateUpdate();
  writeLog("heater on");
};

// let timeout: NodeJS.Timeout;
// export const setHeaterManualOverride = (
//   override: HeaterManualOverride | null
// ) => {
//   if (override?.expireAt) {
//     const ms = new Date(override?.expireAt).getTime();
//     const remaining = ms - Date.now();
//     // if new override has expired, do not set
//     if (remaining < 0) {
//       return;
//     }

//     if (override.status === HEATER_OVERRIDE.OFF) {
//       setHeaterGpoOff(false);
//     } else if (override.status === HEATER_OVERRIDE.ON) {
//       setHeaterGpioOn(false);
//     }

//     // if override has not expired
//     // clear previous override
//     clearTimeout(timeout);
//     // set new override
//     timeout = setTimeout(() => {
//       // when override expires, clear override & emit update
//       heaterGpoState.manualOverride = null;
//       emitStateUpdate();
//     }, remaining);
//   }

//   // apply to global state
//   heaterGpoState.manualOverride = override;
//   emitStateUpdate();
// };

// user updates pin state
export const setHeaterGpioState = (newState: HeaterCabState) => {
  if (newState === undefined) {
    console.error(new Error("newState must be defined"));
    return;
  }

  if (
    typeof newState.heaterPinVal === "number" &&
    heaterGpoState.heaterPinVal !== newState.heaterPinVal
  ) {
    if (newState.heaterPinVal) {
      setHeaterGpioOn();
    } else {
      setHeaterGpoOff();
    }
  }

  heaterGpoState = newState;

  if (newState.manualOverride) {
    // setHeaterManualOverride(newState.manualOverride);
  } else {
    emitStateUpdate();
  }
};
