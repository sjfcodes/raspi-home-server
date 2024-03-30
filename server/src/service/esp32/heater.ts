import { DigitalOutput } from "raspi-gpio";
import { WebSocketServer } from "ws";
import {
  CHANNEL,
  HEATER_CAB,
  HEATER_GPO_DEFAULT_STATE,
  HEATER_OVERRIDE,
  PRIMARY_THERMOSTAT,
} from "../../../../constant/constant";
import { HeaterCabState } from "../../../../types/main";
import { writeLog } from "../logs/logger";
import { roomTempState } from "../room/temperature";
import { clientMapState } from "./temperature";

export const heaterGpo = new DigitalOutput("GPIO4");
export let heaterGpoState = HEATER_GPO_DEFAULT_STATE;

const wssHeaterGpo = new WebSocketServer({
  path: CHANNEL.HEATER_CAB_0,
  port: 3001,
});

const log = (message: string, data: any = '') => {
  console.log(`[${CHANNEL.HEATER_CAB_0}]:`, message, data);
};

wssHeaterGpo.on("connection", (ws) => {
  log("wss client connection");
  /**
   * [NOTE]: Don't send server state to client on connect.
   * Instead, wait for esp32 state update to broadcast to connected clients.
   */
  // ws.send(JSON.stringify(heaterGpoState));
  ws.on("close", () => console.log("wssHeaterGpo client disconnected"));
  ws.on("message", (data) => {
    const input: HeaterCabState = JSON.parse(data.toString());
    // console.log('input', input)
    if (input.chipId === HEATER_CAB.HOME) {
      heaterGpoState.cabHumidity = input.cabHumidity;
      heaterGpoState.cabTempF = input.cabTempF;
      heaterGpoState.chipId = input.chipId;
      if (input.heaterPinVal !== undefined) {
        heaterGpo.write(input.heaterPinVal ? 1 : 0);
        heaterGpoState.heaterPinVal = input.heaterPinVal;
      }
      emitStateUpdate();
    }
  });
  ws.onerror = function (error) {
    console.error(error);
  };
});

const emitStateUpdate = () => {
  const stringified = JSON.stringify(heaterGpoState);
  wssHeaterGpo.clients.forEach((client) => client.send(stringified));
  log("EMIT:", stringified);
};

// check heater status changes every x seconds
export const checkHeaterStatus = (forceOn = false) => {
  const curTemp =
    clientMapState?.[PRIMARY_THERMOSTAT]?.tempF +
    clientMapState?.[PRIMARY_THERMOSTAT]?.calibrate;
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
