import useEsp32TempClientMap from "./hooks/useEsp32TempClientMap";

export default function Esp32TempClients() {
    const { esp32TempClientMap } = useEsp32TempClientMap();

    return (
        <div>
            <h2>ESP32 Temp Clients</h2>
            <textarea rows={8} value={JSON.stringify(esp32TempClientMap, null, 4)} onChange={() => null} />
        </div>
    )
}