import React, { SyntheticEvent } from "react";
import { Search } from '@mui/icons-material';
import { InputAdornment, TextField, MenuItem, Autocomplete } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm, getSearchTerm, getSearchSuggestions } from "../../stores";
import "./SearchBar.scss";

export const SearchBar = () => {
	const dispatch = useDispatch();
	const searchTerm = useSelector(getSearchTerm);
	const searchSuggestions = useSelector(getSearchSuggestions);

	const handleAutocomplete = (e: SyntheticEvent) => {
		console.log('autocomplete event')
		console.log((e.target as HTMLInputElement).value);
		dispatch(setSearchTerm((e.target as HTMLInputElement).value))
	};

	const handleSearch = (e: SyntheticEvent, value: string) => {
		// if ((e as React.KeyboardEvent<HTMLDivElement>).key !== 'Enter') {
		// 	return;
		// }
		dispatch(setSearchTerm(value));
		// console.log('search event')
		console.log(searchTerm);
	};

	return (
		<div className="search_container">
			<Autocomplete
				onChange={(e, v) => v ? handleSearch(e, v) : () => { }}
				style={{
					height: '100%'
				}} freeSolo options={searchSuggestions} renderInput={(params) =>
					<TextField
						onChange={(e) => handleAutocomplete(e)}
						label="Search Someone!"
						variant="outlined"
						{...params}
						style={{
							backgroundColor: 'white',
							height: '100%'
						}} />} />
		</div >
	);
};

