import React, { ReactElement } from 'react';
import { Tooltip as MuiTooltip } from '@mui/material';

interface TooltipProps {
    title: string;
    children: ReactElement;
}

export default function Tooltip({ title, children }: TooltipProps) {
    return (
        <MuiTooltip title={title}>
            {/* Icon Component is a functional component, but MUI Tooltip requires a class component as a child, so wrapped it in a span tag. */}
            <span>{children}</span>
        </MuiTooltip>
    );
}
