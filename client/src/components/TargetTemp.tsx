import useTargetTemp from "../hooks/useTargetTemp";
import Card from "./Card";
import JsonCode from "./JsonCode";

export default function TargetTemp() {
  const { targetTemp, setTargetMinMaxWithRange } = useTargetTemp();

  const buttonStyle = {
    width: "2.5rem",
    padding: 0,
    fontSize: "2rem",
  };

  return (
    <Card
      label={
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2>Target temp: </h2>
          {typeof targetTemp.min === "number" ? (
            <>
              <button
                style={buttonStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  setTargetMinMaxWithRange(targetTemp.max - 1);
                }}
              >
                -
              </button>
              <div style={{ marginInline: "1rem", fontSize: "2rem" }}>
                {targetTemp.max}
              </div>
              <button
                style={buttonStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  setTargetMinMaxWithRange(targetTemp.max + 1);
                }}
              >
                +
              </button>
            </>
          ) : (
            "-"
          )}
        </div>
      }
      showContent={false}
      content={<JsonCode code={JSON.stringify(targetTemp, null, 4)} />}
    />
  );
}
