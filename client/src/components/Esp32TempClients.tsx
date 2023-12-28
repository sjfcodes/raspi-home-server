import useEsp32TempClientMap from "../hooks/useEsp32TempClientMap";
import Card from "./Card";

export default function Esp32TempClients() {
  const { esp32TempClientMap } = useEsp32TempClientMap();

  // esp32 board id for living room is "abe342a8"
  const curTemp =
    esp32TempClientMap?.abe342a8?.tempF +
    esp32TempClientMap?.abe342a8?.calibrate;

  const value = JSON.stringify(esp32TempClientMap, null, 4);
  return (
    <Card
      label={<h2>{`House temp:  ${isNaN(curTemp) ? "-" : curTemp + "℉"}`}</h2>}
      showContent={false}
      content={
        <textarea
          value={value}
          rows={value.split("\n").length}
          onChange={() => null}
        />
      }
    />
  );
  // const temps = Object.values(esp32TempClientMap).map(client => `${client.tempF}℉`).join(', ')
  // return (
  //     <Card label={`ESP32 Temp Clients: ${temps}`} showContent={false} content={<textarea rows={8} value={JSON.stringify(esp32TempClientMap, null, 4)} onChange={() => null} />} />
  // )
}
