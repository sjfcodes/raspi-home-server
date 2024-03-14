import { HEATER_OVERRIDE } from "../../../constant/constant";
import useHeaterGpoState from "../hooks/useHeaterGpoState";
import Card from "./Card";

const restTimes = [0.1, 15, 30, 60];

export default function OverrideButtons() {
  const { heaterGpo, setManualOverride } = useHeaterGpoState();

  const controlButtons = heaterGpo.manualOverride ? (
    <button
      className={`background-${heaterGpo?.heaterPinVal ? "on" : "off"}`}
      onClick={() => setManualOverride(HEATER_OVERRIDE.OFF, null)}
    >
      cancel timeout
    </button>
  ) : (
    <>
      {restTimes.map((time) => (
        <button
          key={time}
          className="background-off"
          onClick={() => setManualOverride(HEATER_OVERRIDE.OFF, time)}
          style={{ margin: ".5rem" }}
        >
          {time} {`minute${time > 1 ? "s" : ""}`}
        </button>
      ))}
    </>
  );

  return (
    <Card
      label={
        <span style={{ fontSize: "1.5rem" }}>
          Timeout:{" "}
          {heaterGpo?.manualOverride?.expireAt
            ? ` until ${new Date(
                heaterGpo.manualOverride.expireAt
              ).toLocaleTimeString(undefined, { timeStyle: "short" })}`
            : ""}
        </span>
      }
      showContent={true}
      content={
        <div
          style={{
            maxWidth: "375px",
            display: "flex",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
          }}
        >
          {controlButtons}
        </div>
      }
    />
  );
}
