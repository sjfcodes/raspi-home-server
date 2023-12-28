import useRoomTemp from "../hooks/useRoomTemp";
import Card from "./Card";
import JsonCode from "./JsonCode";

export default function RoomTemp() {
  const { roomTemp, setRoomTempMax, setRoomTempMin } = useRoomTemp();

  const setTempMin: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setRoomTempMin(Number(e.target.value));
  };
  const setTempMax: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setRoomTempMax(Number(e.target.value));
  };
  const inputStyle = {
    width: "3.5rem",
    marginInline: ".5rem",
    fontSize: "2rem",
  };

  return (
    <Card
      label={
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2>Target temp: </h2>
          <input
            type="number"
            style={inputStyle}
            value={roomTemp.min || 0}
            onChange={setTempMin}
            onClick={(e) => e.stopPropagation()}
          />
          -
          <input
            type="number"
            style={inputStyle}
            value={roomTemp.max || 0}
            onChange={setTempMax}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      }
      showContent={false}
      content={<JsonCode code={JSON.stringify(roomTemp, null, 4)} />}
    />
  );
}
