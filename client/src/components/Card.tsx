import { useState } from "react";

export default function Card({
  label,
  content,
  toggle = true,
  showContent: _init = true,
}: {
  label: string | JSX.Element;
  content: JSX.Element;
  toggle?: boolean;
  showContent?: boolean;
}) {
  const [showContent, setShowContent] = useState(_init);

  const toggleContent = () => {
    if (toggle) setShowContent((curr) => !curr);
  };

  return (
    <div className="card">
      <span onClick={toggleContent}>{label}</span>
      {showContent ? content : <br />}
    </div>
  );
}
