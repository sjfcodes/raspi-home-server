import useTargetTemp from "../hooks/useTargetTemp";
import Card from "./Card";
import JsonCode from "./JsonCode";

export default function TargetTemp() {
  const { gap, targetTemp, setTargetMinMaxWithRange } = useTargetTemp();

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
              <div style={{ marginInline: "1rem" }}>
                <h2>({targetTemp.min} - {targetTemp.max})℉</h2>
              </div>
              <button
                style={buttonStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  setTargetMinMaxWithRange(targetTemp.max - gap);
                }}
              >
                -
              </button>
              <div style={{width: '1rem'}} />
              <button
                style={buttonStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  setTargetMinMaxWithRange(targetTemp.max + gap);
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
