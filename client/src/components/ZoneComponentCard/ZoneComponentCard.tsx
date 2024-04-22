import { MouseEventHandler, ReactNode, useState } from 'react';
import './zone.component.card.css';

export default function ZoneComponentCard({
    initialCardSize,
    toggledCardSize,
    ShowOnToggle,
    Header,
}: {
    initialCardSize: string;
    toggledCardSize: string;
    ShowOnToggle: ReactNode;
    Header: ReactNode;
}) {
    const [toggled, setToggled] = useState(false);

    const onClick: MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation();
        setToggled((curr) => !curr);
    };

    return (
        <div
            className={`${
                toggled ? toggledCardSize : initialCardSize
            } zone-component-card`}
            onClick={onClick}
        >
            <div className="zone-component-header text-medium">{Header}</div>
            {ShowOnToggle}
        </div>
    );
}
