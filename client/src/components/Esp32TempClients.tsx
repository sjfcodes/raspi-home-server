import { THERMOSTAT } from "../../../constant/constant";
import useEsp32TempClientMap from "../hooks/useEsp32TempClientMap";
import Card from "./Card";
import JsonCode from "./JsonCode";

export default function Esp32TempClients() {
  const { esp32TempClientMap } = useEsp32TempClientMap();

  const curTemp =
    esp32TempClientMap?.[THERMOSTAT.PRIMARY]?.tempF +
    esp32TempClientMap?.[THERMOSTAT.PRIMARY]?.calibrate;

  const value = JSON.stringify(esp32TempClientMap, null, 4);
  return (
    <Card
      label={<h2>{`House temp:  ${isNaN(curTemp) ? "-" : curTemp + "℉"}`}</h2>}
      showContent={false}
      content={<JsonCode code={value} />}
    />
  );
  // const temps = Object.values(esp32TempClientMap).map(client => `${client.tempF}℉`).join(', ')
  // return (
  //     <Card label={`ESP32 Temp Clients: ${temps}`} showContent={false} content={<textarea rows={8} value={JSON.stringify(esp32TempClientMap, null, 4)} onChange={() => null} />} />
  // )
}
