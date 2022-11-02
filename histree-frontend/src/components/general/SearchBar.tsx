import React, { SyntheticEvent } from "react";
import { Search } from '@mui/icons-material';
import { InputAdornment, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { setSearchTerm } from "../../stores";
import { SelectedPerson } from "../../models";
import "./SearchBar.scss";

export const SearchBar = () => {
	const dispatch = useDispatch();

	const handleSearch = (e: SyntheticEvent) => {
		if ((e as React.KeyboardEvent<HTMLDivElement>).key !== 'Enter') {
			return;
		}
		dispatch(setSearchTerm((e.target as HTMLInputElement).value));
		console.log((e.target as HTMLInputElement).value);
	};

	return (
		<div className="search_container">
			<TextField InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						<Search />
					</InputAdornment>
				),
				style: {
					backgroundColor: 'white'
				}
			}} label="Search Someone!" variant="outlined" fullWidth onKeyPress={(e) => handleSearch(e)} />
		</div>
	);
};

