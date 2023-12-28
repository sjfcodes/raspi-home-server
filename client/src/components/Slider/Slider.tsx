import "./style.css";

export default function Slider({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (args: any) => void;
}) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="slider round"></span>
    </label>
  );
}
