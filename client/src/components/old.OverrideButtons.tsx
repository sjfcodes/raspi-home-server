import { HEATER_STATE } from "../../../constant/constant";
import useHeaterGpoState from "../hooks/old.useHeaterGpoState";
import Card from "./Card";

const restTimes = [0.1, 15, 30, 60];

export default function OverrideButtons() {
  const { heaterGpo, setManualOverride } = useHeaterGpoState();

  const controlButtons = heaterGpo.state ? (
    <button
      className={`background-${heaterGpo?.heaterPinVal ? "on" : "off"}`}
      onClick={() => setManualOverride(HEATER_STATE.FORCE_OFF, null)}
    >
      cancel timeout
    </button>
  ) : (
    <>
      {restTimes.map((time) => (
        <button
          key={time}
          className="background-off"
          onClick={() => setManualOverride(HEATER_STATE.FORCE_OFF, time)}
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
          {heaterGpo?.state?.expireAt
            ? ` until ${new Date(
                heaterGpo.state.expireAt,
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
