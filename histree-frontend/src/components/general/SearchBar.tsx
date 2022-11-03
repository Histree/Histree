import React, { SyntheticEvent } from "react";
import { Search } from '@mui/icons-material';
import { InputAdornment, TextField, MenuItem, Autocomplete } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import "./SearchBar.scss";
import { AppDispatch, getSearchSuggestions } from "../../stores";
import { fetchSearchSuggestions } from "../../services";

export const SearchBar = () => {
	const dispatch = useDispatch();
	const searchSuggestions = useSelector(getSearchSuggestions);
	const appDispatch = useDispatch<AppDispatch>();

	const handleAutocomplete = (e: SyntheticEvent) => {
		console.log('autocomplete event')
		console.log((e.target as HTMLInputElement).value);
		appDispatch(fetchSearchSuggestions((e.target as HTMLInputElement).value))
	};

	const handleSearch = (e: SyntheticEvent, value: string) => {
		console.log(value)
		// if ((e as React.KeyboardEvent<HTMLDivElement>).key !== 'Enter') {
		// 	return;
		// }
		// dispatch(setSearchTerm(value));
	};

	return (
		<div className="search_container">
			<Autocomplete
				onChange={(e, v) => v ? handleSearch(e, v) : () => { }}
				style={{
					height: '100%'
				}} freeSolo options={searchSuggestions.map(s => s[0])} renderInput={(params) =>
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
