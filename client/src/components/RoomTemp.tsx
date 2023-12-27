import useRoomTemp from "../hooks/useRoomTemp";
import Card from "./Card";

export default function RoomTemp() {
    const { roomTemp, setRoomTempMax, setRoomTempMin } = useRoomTemp();

    return (
        <Card label={`Target temp: ${roomTemp.min || ''} - ${roomTemp.max || ''}℉`} showContent={false} content={
            <>
                <div>
                    <label>
                        min:
                        <input type="number" value={roomTemp.min} onChange={(e) => setRoomTempMin(Number(e.target.value))} />
                    </label>
                    <label>
                        max:
                        <input type="number" value={roomTemp.max} onChange={(e) => setRoomTempMax(Number(e.target.value))} />
                    </label>
                </div>
                <textarea rows={5} value={JSON.stringify(roomTemp, null, 4)} onChange={() => null} />
            </>
        } />
    )
}