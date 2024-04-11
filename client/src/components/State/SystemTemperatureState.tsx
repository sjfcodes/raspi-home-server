import { PiSytemTemperature } from "../../../../types/main";
import useSystemTemperature from "../../hooks/useSystemTemperature";
import Card from "../Card";
import JsonCode from "../JsonCode";

export default function SystemTemperatureState() {
  const [piTemp] = useSystemTemperature();

  const pi = piTemp["system"] as PiSytemTemperature;

  if (!pi) return null;

  // 85℃ (185℉) max rasbperry pi temp
  const percentage = (pi.tempF / 185) * 100;

  const json = JSON.stringify(piTemp, null, 2);

  return (
    <Card
      label={`Pi Temp: ${pi.tempF ? pi.tempF + "℉" : "-"} (${
        isNaN(percentage) ? "-" : Math.trunc(percentage) + "%"
      })`}
      content={<JsonCode code={json} />}
    />
  );
}
