import { CardContent, TextField, Typography } from "@mui/material";
import React from "react";
import { TextType } from "../../models";

export const FilterText = ({ title, value, setValue }: { 
    title: string, value: TextType, setValue: React.Dispatch<React.SetStateAction<TextType>>
 }) => {

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);
    
    return (
        <CardContent>
            <div className="filter-title-container">
                <Typography>{title}</Typography>
            </div>
            <div className="filter-input">
                <TextField 
                    variant="outlined"
                    label="Input search"
                    value={value ? value : ""}
                    onChange={handleValueChange}
                />
            </div>
        </CardContent>
    )
}