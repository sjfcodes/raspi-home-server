import { MouseEventHandler, ReactNode, useState } from 'react';
import './zone.component.card.css';
import { IconType } from 'react-icons/lib';

export default function ZoneComponentCard({
    initialCardSize,
    toggledCardSize,
    ShowOnClick,
    componentName,
    Icon,
}: {
    initialCardSize: string;
    toggledCardSize: string;
    ShowOnClick: ReactNode;
    componentName: string;
    Icon: IconType;
}) {
    const [toggled, setToggled] = useState(false);

    const onClick: MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation();
        setToggled((curr) => !curr);
    };

    const content = toggled ? (
        ShowOnClick
    ) : (
        <div className="zone-component-cover text-medium">
            <div className="icon text-xlarge">
                <Icon />
            </div>
            <div>{componentName}</div>
        </div>
    );

    return (
        <div
            className={`${toggled ? toggledCardSize :initialCardSize} zone-component-card`}
            onClick={onClick}
        >
            {content}
        </div>
    );
}
