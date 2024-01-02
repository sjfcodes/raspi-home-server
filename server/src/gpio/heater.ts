import { DigitalOutput } from "raspi-gpio";
import { Server, Socket } from "socket.io";
import { WebSocketServer } from "ws";
import {
  CHANNEL,
  HEATER_GPO_DEFAULT_STATE,
  HEATER_OVERRIDE,
} from "../../../constant/constant";
import { HeaterCabState, HeaterManualOverride } from "../../../types/main";
import { clientMapState } from "../esp32/temperature";
import { writeLog } from "../logs/logger";
import { roomTempState } from "../room/temperature";

export const heaterGpo = new DigitalOutput("GPIO4");
export let heaterGpoState = HEATER_GPO_DEFAULT_STATE;
const options = {
  path: CHANNEL.HEATER_CAB_0,
  port: 3001,
};

const wssHeaterGpo = new WebSocketServer(options);
wssHeaterGpo.on("connection", (ws) => {
  console.log("wssHeaterGpo client connected");
  ws.send(JSON.stringify(heaterGpoState));
  ws.on("close", () => console.log("wssHeaterGpo client disconnected"));
  ws.on("message", (data) => {
    const input = JSON.parse(data.toString());
    heaterGpoState.cabHumidity = input.cabHumidity;
    heaterGpoState.cabTempF = input.cabTempF;
    if (input.heaterPinVal !== undefined) {
      heaterGpo.write(input.heaterPinVal ? 1 : 0);
      heaterGpoState.heaterPinVal = input.heaterPinVal;
    }
    console.log("newState", heaterGpoState);
    emitStateUpdate();
  });
  ws.onerror = function () {
    console.log("websocket error");
  };
});

const emitStateUpdate = () => {
  wssHeaterGpo.clients.forEach((client) => {
    client.send(JSON.stringify(heaterGpoState));
  });
};

// check heater status changes every x seconds
export const checkHeaterStatus = (io: Server, forceOn = false) => {
  let primaryThermostat = "9efc8ad4"; // THERMOSTAT.LIVING_ROOM_0
  const curTemp =
    clientMapState?.[primaryThermostat]?.tempF +
    clientMapState?.[primaryThermostat]?.calibrate;
  writeLog(`current temp is ${curTemp}`, io);

  // if heater off & current temp below below min
  const shouldTurnOn =
    !heaterGpoState.heaterPinVal && curTemp < roomTempState.min;
  // if heater on & current temp above max
  const shouldTurnOff =
    heaterGpoState.heaterPinVal && curTemp > roomTempState.max;

  if (forceOn || shouldTurnOn) {
    setHeaterGpioOn(io);
  } else if (shouldTurnOff) {
    setHeaterGpoOff(io);
  }
};

export const setHeaterGpoOff = (io?: Server, socket?: Socket) => {
  if (heaterGpoState.manualOverride?.status === HEATER_OVERRIDE.ON) {
    setHeaterGpioOn(io, socket);
    return;
  }

  heaterGpo.write(0);
  heaterGpoState.heaterPinVal = false;
  emitStateUpdate();
  writeLog("heater off", io, socket);
};

export const setHeaterGpioOn = (io?: Server, socket?: Socket) => {
  if (heaterGpoState.manualOverride?.status === HEATER_OVERRIDE.OFF) {
    setHeaterGpoOff(io, socket);
    return;
  }

  heaterGpo.write(1);
  heaterGpoState.heaterPinVal = true;
  emitStateUpdate();
  writeLog("heater on", io, socket);
};

let timeout: NodeJS.Timeout;
export const setHeaterManualOverride = (
  override: HeaterManualOverride | null,
  io?: Server,
  socket?: Socket
) => {
  if (override?.expireAt) {
    const ms = new Date(override?.expireAt).getTime();
    const remaining = ms - Date.now();
    // if new override has expired, do not set
    if (remaining < 0) {
      return;
    }

    if (override.status === HEATER_OVERRIDE.OFF) {
      setHeaterGpoOff(io, socket);
    } else if (override.status === HEATER_OVERRIDE.ON) {
      setHeaterGpioOn(io, socket);
    }

    // if override has not expired
    // clear previous override
    clearTimeout(timeout);
    // set new override
    timeout = setTimeout(() => {
      // when override expires, clear override & emit update
      heaterGpoState.manualOverride = null;
      emitStateUpdate();
    }, remaining);
  }

  // apply to global state
  heaterGpoState.manualOverride = override;
  emitStateUpdate();
};

// user updates pin state
export const setHeaterGpioState = (
  newState: HeaterCabState,
  io?: Server,
  socket?: Socket
) => {
  if (newState === undefined) {
    console.error(new Error("newState must be defined"));
    return;
  }

  if (
    typeof newState.heaterPinVal === "boolean" &&
    heaterGpoState.heaterPinVal !== newState.heaterPinVal
  ) {
    if (newState.heaterPinVal) {
      setHeaterGpioOn(io, socket);
    } else {
      setHeaterGpoOff(io, socket);
    }
  }

  heaterGpoState = newState;

  if (newState.manualOverride) {
    setHeaterManualOverride(newState.manualOverride, io, socket);
  } else {
    emitStateUpdate();
  }
};
