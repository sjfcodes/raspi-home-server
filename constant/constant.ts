import { HeaterGpioState, RoomTempState } from "../types/main";

export enum CHANNEL {
    HEATER_GPIO_0 = "gpio-heater-0",
    ESP32_TEMP_CLIENT_MAP = "esp32-temp-0",
    PI_TEMP = "pi-temp-0",
    ROOM_TEMP = 'target-temp-0'
};

export enum HEATER_OVERRIDE {
    OFF = 'OFF',
    ON = 'ON',
}

export const HEATER_GPIO_DEFAULT_STATE: HeaterGpioState = { isOn: false, manualOverride: null };
export const ROOM_TEMP_DEFAULT_STATE: RoomTempState = { type: 'F', min: 65, max: 70 };