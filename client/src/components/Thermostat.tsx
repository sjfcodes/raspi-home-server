import { Thermostat as _Thermostat } from "../../../types/main";
import Card from "./Card";
import JsonCode from "./JsonCode";

export default function Thermostat({
  thermostat,
}: {
  thermostat: _Thermostat;
}) {
  const curTemp = thermostat?.tempF + thermostat?.calibrate;
  // let label = "";
  // Object.entries(THERMOSTAT).forEach(([key, val]) => {
  //   if (thermostat.chipId === val) label = key;
  // });

  return (
    <Card
      label={
        <h2>{`${thermostat.chipName}:  ${
          isNaN(curTemp) ? "-" : curTemp + "℉"
        }`}</h2>
      }
      showContent={false}
      content={<JsonCode code={JSON.stringify(thermostat, null, 4)} />}
    />
  );
}
