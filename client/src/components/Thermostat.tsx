import { Thermostat as _Thermostat } from "../../../types/main";
import Card from "./Card";
import JsonCode from "./JsonCode";

export default function Thermostat({
  children,
  thermostat,
}: {
  children?: React.ReactNode;
  thermostat: _Thermostat;
}) {
  if (!thermostat) return null;

  const curTemp = thermostat?.tempF + thermostat?.calibrate;
  const copy = structuredClone(thermostat);

  return (
    <Card
      label={`${copy.chipName}:  ${isNaN(curTemp) ? "-" : curTemp + "℉"}`}
      content={
        <div style={{ width: "100%", overflow: "scroll" }}>
          {children}
          <JsonCode code={JSON.stringify(copy, null, 2)} />
        </div>
      }
    />
  );
}
