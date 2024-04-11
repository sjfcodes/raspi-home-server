import { CSSProperties, useState } from "react";

export default function Card({
  label,
  content,
  preview,
  toggle = false,
  showContent: _init = true,
  style = {},
}: {
  label: string | JSX.Element;
  content: JSX.Element | null;
  preview?: JSX.Element;
  toggle?: boolean;
  showContent?: boolean;
  style?: CSSProperties;
}) {
  const [showContent, setShowContent] = useState(_init);

  const toggleContent: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    if (toggle) setShowContent((curr) => !curr);
  };

  return (
    <div
      className="card"
      style={{
        ...style,
        width: "calc(100% - 2rem)",
        margin: "0 auto",
        minHeight: "5rem",
        border: "1px solid orange",
        borderRadius: ".5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        padding: "1rem",
        boxSizing: "border-box",
      }}
      onClick={toggleContent}
    >
      <div
        style={{
          minWidth: "100%",
          overflow: "scroll",
        }}
      >
        <div style={{ width: "100%", textAlign: "center", fontSize: "1.5rem" }}>
          {label} {preview}
        </div>

        {showContent ? <>{content}</> : null}
      </div>
    </div>
  );
}
