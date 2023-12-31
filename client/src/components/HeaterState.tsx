import useHeaterGpoState from "../hooks/useHeaterGpoState";
import Card from "./Card";
import JsonCode from "./JsonCode";

export default function HeaterState({ chipId }: { chipId: string }) {
  const { heaterGpo } = useHeaterGpoState(chipId);

  return (
    <Card
      label={
        <div style={{ display: "flex" }}>
          <h2 style={{ marginRight: "1rem" }}>
            Heater:{" "}
            {heaterGpo.heaterPinVal === null ? (
              "-"
            ) : !!heaterGpo.heaterPinVal ? (
              <span
                className={`${!!heaterGpo.heaterPinVal ? "text-green" : ""}`}
              >
                on
              </span>
            ) : (
              "off"
            )}
          </h2>
        </div>
      }
      showContent={false}
      content={<JsonCode code={JSON.stringify(heaterGpo, null, 4)} />}
    />
  );
}
