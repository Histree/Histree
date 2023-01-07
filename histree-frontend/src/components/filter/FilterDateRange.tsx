import { CardContent, TextField, Typography } from "@mui/material"
import React from "react"

export const FilterDateRange = ({ title, startDate, endDate, setStartDate, setEndDate }: 
    { title: string, startDate: string, endDate: string, 
        setStartDate: React.Dispatch<React.SetStateAction<string>>,
        setEndDate: React.Dispatch<React.SetStateAction<string>> }) => {

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value);
	const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value);

    return (
        <CardContent>
            <div className="filter-title-container">
                <Typography>{title}</Typography>
            </div>
            <div className="filter-born-container">
                <div className="filter-input">
                    <TextField
                        type="date"
                        label="Start"
                        InputLabelProps={{ shrink: true }}
                        value={startDate}
                        onChange={handleStartDateChange}
                    />
                </div>
                <div className="filter-input">
                    <TextField
                        type="date"
                        label="End"
                        InputLabelProps={{ shrink: true }}
                        value={endDate}
                        onChange={handleEndDateChange}
                    />
                </div>
            </div>
		</CardContent>
    )
}