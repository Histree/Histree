import { CardContent, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import React from "react";

export const FilterToggle = ({ title, values, align, setAlign, exclusive }: {
    title: string,
    values: Array<string>,
    align: string,
    setAlign: React.Dispatch<React.SetStateAction<string>>,
    exclusive: boolean
}) => {
    const handleChangeAlign = (e: React.MouseEvent<HTMLElement>, newAlignment: string) => {
        setAlign(newAlignment);
    }

    return (
        <CardContent>
            <div className="filter-title-container">
                <Typography>{title}</Typography>
            </div>
            <ToggleButtonGroup
                color="primary"
                value={align}
                onChange={handleChangeAlign}
                exclusive={exclusive}
            >
                <ToggleButton value="Off">Off</ToggleButton>
                {values.map((value) => {
                    return (
                        <ToggleButton value={value}>{value}</ToggleButton>
                    );
                })}
            </ToggleButtonGroup>
        </CardContent>
    );
}