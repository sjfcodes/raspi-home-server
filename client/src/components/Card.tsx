import { useState } from "react";

export default function Card({ label, content, toggle = true, showContent: _init = true }: { label: string, content: JSX.Element, toggle?: boolean, showContent?: boolean }) {
    const [showContent, setShowContent] = useState(_init);

    const toggleContent = () => {
        if (toggle) setShowContent(curr => !curr);
    }

    return (
        <div className="card">
            <h2 onClick={toggleContent}>{label}</h2>
            {showContent ? content : <br />}
        </div>
    )
}