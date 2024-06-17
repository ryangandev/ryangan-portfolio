import React, { ReactElement } from 'react';
import { Tooltip as NextUITooltip } from '@nextui-org/react';

interface TooltipProps {
    title: string;
    children: ReactElement;
}

export default function Tooltip({ title, children }: TooltipProps) {
    return (
        <NextUITooltip content={title}>
            {/* Icon Component is a functional component, but MUI Tooltip requires a class component as a child, so wrapped it in a span tag. */}
            <span>{children}</span>
        </NextUITooltip>
    );
}
