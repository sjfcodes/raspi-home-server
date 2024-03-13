import { CSSProperties, useState } from "react";

export default function Card({
  label,
  content,
  preview,
  toggle = true,
  showContent: _init = true,
  style = {},
}: {
  label: string | JSX.Element;
  content: JSX.Element;
  preview?: JSX.Element;
  toggle?: boolean;
  showContent?: boolean;
  style?: CSSProperties;
}) {
  const [showContent, setShowContent] = useState(_init);

  const toggleContent = () => {
    if (toggle) setShowContent((curr) => !curr);
  };

  return (
    <div className="card" style={style}>
      <div
        onClick={toggleContent}
        style={{ display: "flex", alignItems: "center", gap: "1rem" }}
      >
        {label} {!showContent ? preview : null}
      </div>
      {showContent ? content : null}
    </div>
  );
}
