import React, { SyntheticEvent } from "react";
import { Search } from '@mui/icons-material';
import { InputAdornment, TextField, MenuItem, Autocomplete } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import "./SearchBar.scss";
import { AppDispatch, getSearchSuggestions, resetSearch, setResultServiceState } from "../../stores";
import { fetchSearchResults, fetchSearchSuggestions } from "../../services";

export const SearchBar = () => {
	const dispatch = useDispatch();
	const searchSuggestions = useSelector(getSearchSuggestions);
	const appDispatch = useDispatch<AppDispatch>();

	const handleAutocomplete = (e: SyntheticEvent) => {
		console.log('autocomplete event')
		console.log((e.target as HTMLInputElement).value);
		const searchValue = (e.target as HTMLInputElement).value;
		if (searchValue !== '') {
			appDispatch(fetchSearchSuggestions((e.target as HTMLInputElement).value))
		}
		else {
			dispatch(resetSearch);
		}
	};

	const handleSearch = (e: SyntheticEvent, value?: string) => {
		console.log('handleSearch');
		console.log(value)
		if (value && searchSuggestions[value]) {
			console.log(searchSuggestions[value])
			appDispatch(fetchSearchResults(searchSuggestions[value]));
		}
		else {
			dispatch(resetSearch);
		}
		// if ((e as React.KeyboardEvent<HTMLDivElement>).key !== 'Enter') {
		// 	return;
		// }
		// dispatch(setSearchTerm(value));
	};

	return (
		<div className="search_container">
			<Autocomplete
				onChange={(e, v) => handleSearch(e, v ? v : undefined)}
				style={{
					height: '100%'
				}} freeSolo options={Object.keys(searchSuggestions)} renderInput={(params) =>
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
