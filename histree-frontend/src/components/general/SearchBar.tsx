import React, { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from 'lodash';
import './SearchBar.scss';
import {
  AppDispatch,
  getSearchSuggestions,
  resetSearch,
  setResultServiceState
} from '../../stores';
import { fetchSearchResults, fetchSearchSuggestions } from '../../services';

export const SearchBar = () => {
	const dispatch = useDispatch();
	const searchSuggestions = useSelector(getSearchSuggestions);
	const appDispatch = useDispatch<AppDispatch>();
	const handleChangeWithDebounce = debounce(async (e) => {
		handleAutocomplete(e);
	}, 500);
	const handleAutocomplete = (e: SyntheticEvent) => {
		console.log('autocomplete event')
		console.log((e.target as HTMLInputElement).value);
		const searchValue = (e.target as HTMLInputElement).value;
		if (searchValue !== '') {
			appDispatch(fetchSearchSuggestions((e.target as HTMLInputElement).value))
		}
		else {
			dispatch(resetSearch());
		}
	};

	const handleSearch = (e: SyntheticEvent, value?: string) => {
		console.log('handleSearch');
		console.log(value)
		if (value && searchSuggestions[value]) {
			dispatch(setResultServiceState({ status: 'Loading' }));
			console.log(searchSuggestions[value])
			appDispatch(fetchSearchResults(searchSuggestions[value].id));
		}
		console.log('Resetting')
		dispatch(resetSearch());

	};
	return (
		<div className="search_container">
			<Autocomplete
				onChange={(e, v) => handleSearch(e, v ? v : undefined)}
				style={{
					height: '100%'
				}} freeSolo options={Object.keys(searchSuggestions)} renderInput={(params) =>
					<TextField
						onChange={(e) => handleChangeWithDebounce(e)}
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
