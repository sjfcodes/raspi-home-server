import { MouseEventHandler, ReactNode, useState } from 'react';
import './zone.component.card.css';
import { IconType } from 'react-icons/lib';

export default function ZoneComponentCard({
    initialCardSize,
    toggledCardSize,
    ShowOnToggle,
    componentName,
    Icon,
}: {
    initialCardSize: string;
    toggledCardSize: string;
    ShowOnToggle: ReactNode;
    componentName: string;
    Icon: IconType;
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
            <div className="zone-component-cover text-medium">
                <div className="icon text-xlarge">
                    <Icon />
                </div>
                <div>{componentName}</div>
            </div>
            {ShowOnToggle}
        </div>
    );
}
