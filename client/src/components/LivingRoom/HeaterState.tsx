import useHeaterSse from "../../hooks/useHeaterSse";

export default function HeaterState() {
  const [state] = useHeaterSse();

  return <pre>{JSON.stringify(state, null, 4)}</pre>;
}
