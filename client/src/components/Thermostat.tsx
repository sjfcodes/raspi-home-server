import { Thermostat as _Thermostat } from "../../../types/main";
import Card from "./Card";
import JsonCode from "./JsonCode";

export default function Thermostat({
  thermostat,
}: {
  thermostat: _Thermostat;
}) {
  if (!thermostat) return null;

  const curTemp = thermostat?.tempF + thermostat?.calibrate;
  // let label = "";
  // Object.entries(THERMOSTAT).forEach(([key, val]) => {
  //   if (thermostat.chipId === val) label = key;
  // });

  const copy = structuredClone(thermostat);

  // @ts-ignore
  copy.tempFHistory = JSON.stringify(copy.tempFHistory);

  return (
    <Card
      label={
        <span style={{ fontSize: "1.5rem" }}>{`${copy.chipName}:  ${
          isNaN(curTemp) ? "-" : curTemp + "℉"
        }`}</span>
      }
      showContent={false}
      content={<JsonCode code={JSON.stringify(copy, null, 4)} />}
    />
  );
}
