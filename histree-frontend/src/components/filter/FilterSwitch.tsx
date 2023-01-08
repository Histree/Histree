import { CardContent, Switch, Typography } from "@mui/material";
import { SwitchType } from "../../models";
import React from "react";

export const FilterSwitch = ({ title, value, setValue }: {
    title: string, value: SwitchType, setValue: React.Dispatch<React.SetStateAction<SwitchType>>
}) => {
    const handleValueChange = () => setValue(!value);

    return (
        <CardContent>
            <div className="filter-title-container">
                <Typography>{title}</Typography>
                <Switch
                    checked={value === true}
                    onChange={handleValueChange}
                />
            </div>
        </CardContent>
    )
}