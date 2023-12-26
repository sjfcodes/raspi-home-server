import usePiTemp from "./hooks/usePiTemp";

export default function PiTemp() {
    const { piTemp } = usePiTemp();

    return (
        <div>
            <h2>Pi Temp</h2>
            <textarea style={{ width: '300px' }} rows={6} value={JSON.stringify(piTemp, null, 4)} onChange={() => null} />
        </div>
    )
}