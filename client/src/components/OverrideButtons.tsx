import { HEATER_OVERRIDE } from "../../../constant/constant";
import useHeaterGpioState from "../hooks/useHeaterGpioState";
import Card from "./Card";

const restTimes = [0.1, 15, 30, 60];

export default function OverrideButtons() {
  const { heaterGpio, setManualOverride } = useHeaterGpioState();

  const controlButtons = heaterGpio.manualOverride ? (
    <button
      className={`background-${heaterGpio?.isOn ? "on" : "off"}`}
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
        <h2>
          Timeout:{" "}
          {heaterGpio?.manualOverride?.expireAt
            ? ` until ${new Date(
                heaterGpio.manualOverride.expireAt
              ).toLocaleTimeString(undefined, { timeStyle: "short" })}`
            : ""}
        </h2>
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
