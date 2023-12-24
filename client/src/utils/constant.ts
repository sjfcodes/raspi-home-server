import { AppState, PinState } from "../../../types/main";

export const CHANNEL_LED_PIN_STATE = "led-pin-state";
export const DEFAULT_PIN_STATE: PinState = { isOn: false };
export const DEFAULT_APP_STATE: AppState = { ledPinState: { isOn: false }, client: {} };
