import usePiTemp from "../hooks/usePiTemp";
import Card from "./Card";

export default function PiTemp() {
    const { piTemp } = usePiTemp();

    // 85℃ (185℉) max rasbperry pi temp
    const percentage = (piTemp.tempF / 185) * 100

    return (
        <Card label={`Pi Temp: ${piTemp.tempF}℉ (${percentage.toFixed(0)}%)`} showContent={false} content={<textarea rows={6} value={JSON.stringify(piTemp, null, 4)} onChange={() => null} />} />
    )
}