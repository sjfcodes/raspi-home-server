import useRoomTemp from "../hooks/useRoomTemp";
import Card from "./Card";

export default function RoomTemp() {
  const { roomTemp, setRoomTempMax, setRoomTempMin } = useRoomTemp();

  const setTempMin: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setRoomTempMin(Number(e.target.value));
  };
  const setTempMax: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setRoomTempMax(Number(e.target.value));
  };
  const inputStyle = { width: "2.5rem", marginInline: ".5rem" };

  return (
    <Card
      label={
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2>Target temp: </h2>
          <input
            type="number"
            style={inputStyle}
            value={roomTemp.min}
            onChange={setTempMin}
            onClick={(e) => e.stopPropagation()}
          />
          -
          <input
            type="number"
            style={inputStyle}
            value={roomTemp.max}
            onChange={setTempMax}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      }
      showContent={false}
      content={
        <textarea
          rows={5}
          value={JSON.stringify(roomTemp, null, 4)}
          onChange={() => null}
        />
      }
    />
  );
}
