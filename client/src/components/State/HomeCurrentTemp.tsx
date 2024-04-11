import useThermostat from "../../hooks/useThermostat";
import Card from "../Card";
import JsonCode from "../JsonCode";

export default function HomeCurrentTemp({
  thermostatId,
}: {
  thermostatId: string;
}) {
  const [thermostatMap] = useThermostat();

  const thermostat = thermostatMap[thermostatId];
  if (!thermostat) return null;

  const curTemp = thermostat?.tempF + thermostat?.calibrate;
  const copy = structuredClone(thermostat);

  // @ts-ignore
  copy.tempFHistory = JSON.stringify(copy.tempFHistory);

  const label = (
    <div style={{ fontSize: "1.5rem", width: "100%", textAlign: "center" }}>
      {`${copy.chipName}:  ${isNaN(curTemp) ? "-" : curTemp + "℉"}`}
    </div>
  );

  return (
    <Card
      label={label}
      content={
        <>
          <div style={{ width: "100%", overflowX: "scroll" }}>
            <JsonCode code={JSON.stringify(copy, null, 2)} />
          </div>
        </>
      }
    />
  );
}
