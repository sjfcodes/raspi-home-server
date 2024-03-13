import useTargetTemp from "../hooks/useTargetTemp";
import Card from "./Card";
import JsonCode from "./JsonCode";

export default function TargetTemp() {
  const { targetTemp, setTargetMinMaxWithRange } = useTargetTemp();

  const buttonStyle = {
    width: "5.5rem",
    height: "5.5rem",
    padding: 0,
    fontSize: "3rem",
    border: "1px solid orange",
  };

  const isTempAvailable = typeof targetTemp.min === "number";

  return (
    <Card
      label={
        <div style={{ width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h2>Target temp: </h2>
            {isTempAvailable ? (
              <div style={{ marginInline: "1rem" }}>
                <h2>
                  {targetTemp.min}-{targetTemp.max}℉
                </h2>
              </div>
            ) : (
              "-"
            )}
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              marginBlock: "3rem",
              gap: '3rem'
            }}
          >
            <button
              style={buttonStyle}
              onClick={(e) => {
                e.stopPropagation();
                setTargetMinMaxWithRange(targetTemp.max - 1);
              }}
            >
              -
            </button>
            <button
              style={buttonStyle}
              onClick={(e) => {
                e.stopPropagation();
                setTargetMinMaxWithRange(targetTemp.max + 1);
              }}
            >
              +
            </button>
          </div>
        </div>
      }
      showContent={false}
      content={<JsonCode code={JSON.stringify(targetTemp, null, 4)} />}
    />
  );
}
