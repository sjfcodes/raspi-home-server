import { DigitalOutput } from "raspi-gpio";
import { Server, Socket } from "socket.io";
import { WebSocketServer } from "ws";
import {
  CHANNEL,
  HEATER_GPIO_DEFAULT_STATE,
  HEATER_OVERRIDE,
} from "../../../constant/constant";
import {
  HeaterGpioState,
  HeaterManualOverride,
  RoomTempState,
} from "../../../types/main";
import { clientMapState } from "../esp32/temperature";
import { writeLog } from "../logs/logger";

export const heaterGpio = new DigitalOutput("GPIO4");
export let heaterGpioState = HEATER_GPIO_DEFAULT_STATE;
const options = {
  path: CHANNEL.HEATER_GPIO_0,
  port: 3001,
};

const wssHeaterGpio = new WebSocketServer(options);
wssHeaterGpio.on("connection", (ws) => {
  console.log("New client connected!");
  ws.send(JSON.stringify(heaterGpioState));
  ws.on("close", () => console.log("Client has disconnected!"));
  ws.on("message", (data) => {
    const input = JSON.parse(data.toString());
    heaterGpioState.cabHumidity = input.cabHumidity;
    heaterGpioState.cabTempF = input.cabTempF;
    if (input.isOn !== undefined) {
      heaterGpio.write(input.isOn ? 1 : 0);
      heaterGpioState.isOn = input.isOn;
    }
    console.log("newState", heaterGpioState);
    emitStateUpdate();
  });
  ws.onerror = function () {
    console.log("websocket error");
  };
});

// [TODO]: delete this middleware function once browwser client migrate away from socket.io
const emitStateUpdate = () => {
  wssHeaterGpio.clients.forEach((client) => {
    client.send(JSON.stringify(heaterGpioState));
  });
};

// check heater status changes every x seconds
export const checkHeaterStatus = (
  io: Server,
  roomTempState: RoomTempState,
  forceOn = false
) => {
  let primaryThermostat = "9efc8ad4"; // THERMOSTAT.LIVING_ROOM_0
  const curTemp =
    clientMapState?.[primaryThermostat]?.tempF +
    clientMapState?.[primaryThermostat]?.calibrate;
  writeLog(`current temp is ${curTemp}`, io);

  // if heater off & current temp below below min
  const shouldTurnOn = !heaterGpioState.isOn && curTemp < roomTempState.min;
  // if heater on & current temp above max
  const shouldTurnOff = heaterGpioState.isOn && curTemp > roomTempState.max;

  if (forceOn || shouldTurnOn) {
    setHeaterGpioOn(io);
  } else if (shouldTurnOff) {
    setHeaterGpioOff(io);
  }
};

export const setHeaterGpioOff = (io?: Server, socket?: Socket) => {
  if (heaterGpioState.manualOverride?.status === HEATER_OVERRIDE.ON) {
    setHeaterGpioOn(io, socket);
    return;
  }

  heaterGpio.write(0);
  heaterGpioState.isOn = false;
  emitStateUpdate();
  writeLog("heater off", io, socket);
};

export const setHeaterGpioOn = (io?: Server, socket?: Socket) => {
  if (heaterGpioState.manualOverride?.status === HEATER_OVERRIDE.OFF) {
    setHeaterGpioOff(io, socket);
    return;
  }

  heaterGpio.write(1);
  heaterGpioState.isOn = true;
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
      setHeaterGpioOff(io, socket);
    } else if (override.status === HEATER_OVERRIDE.ON) {
      setHeaterGpioOn(io, socket);
    }

    // if override has not expired
    // clear previous override
    clearTimeout(timeout);
    // set new override
    timeout = setTimeout(() => {
      // when override expires, clear override & emit update
      heaterGpioState.manualOverride = null;
      emitStateUpdate();
    }, remaining);
  }

  // apply to global state
  heaterGpioState.manualOverride = override;
  emitStateUpdate();
};

// user updates pin state
export const setHeaterGpioState = (
  newState: HeaterGpioState,
  io?: Server,
  socket?: Socket
) => {
  if (newState === undefined) {
    console.error(new Error("newState must be defined"));
    return;
  }

  if (
    typeof newState.isOn === "boolean" &&
    heaterGpioState.isOn !== newState.isOn
  ) {
    if (newState.isOn) {
      setHeaterGpioOn(io, socket);
    } else {
      setHeaterGpioOff(io, socket);
    }
  }

  heaterGpioState = newState;

  if (newState.manualOverride) {
    setHeaterManualOverride(newState.manualOverride, io, socket);
  } else {
    emitStateUpdate();
  }
};
