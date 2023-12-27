import useEsp32TempClientMap from "../hooks/useEsp32TempClientMap";
import Card from "./Card";

export default function Esp32TempClients() {
    const { esp32TempClientMap } = useEsp32TempClientMap();

    const temps = Object.values(esp32TempClientMap).map(client => `${client.tempF}℉`).join(', ')
    return (
        <Card label={`ESP32 Temp Clients: ${temps}`} content={<textarea rows={8} value={JSON.stringify(esp32TempClientMap, null, 4)} onChange={() => null} />} />
    )
}