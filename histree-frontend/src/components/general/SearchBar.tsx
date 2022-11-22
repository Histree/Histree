import React, { SyntheticEvent } from 'react';
import { TextField, Autocomplete } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import './SearchBar.scss';
import {
	AppDispatch,
	getSearchSuggestions,
	resetSearch,
	setResultServiceState,
	setSearchValue
} from '../../stores';
import { fetchSearchResults, fetchSearchSuggestions } from '../../services';
import { AutoCompleteData } from '../../models';

export const SearchBar = () => {
	const dispatch = useDispatch();
	const { searchTerm, searchSuggestions } = useSelector(getSearchSuggestions);
	const appDispatch = useDispatch<AppDispatch>();
	const handleChangeWithDebounce = debounce(async (e) => {
		dispatch(setSearchValue((e.target as HTMLInputElement).value))
		handleAutocomplete(e);
	}, 1000);
	const handleAutocomplete = (e: SyntheticEvent) => {
		console.log('autocomplete event');
		console.log((e.target as HTMLInputElement).value);
		const searchValue = (e.target as HTMLInputElement).value;
		if (searchValue !== '') {
			appDispatch(fetchSearchSuggestions((e.target as HTMLInputElement).value));
		} else {
			dispatch(resetSearch());
		}
	};

	const handleSearch = (e: SyntheticEvent, value?: string | AutoCompleteData) => {
		console.log('handleSearch');
		console.log(value);
		if (value && typeof value === 'string' && searchSuggestions[value]) {
			dispatch(setResultServiceState({ status: 'Loading' }));
			console.log(searchSuggestions[value]);
			appDispatch(fetchSearchResults(searchSuggestions[value].id));
		} else if (value && typeof value !== 'string' && searchSuggestions[value.id]) {
			dispatch(setResultServiceState({ status: 'Loading' }));
			console.log(searchSuggestions[value.id]);
			appDispatch(fetchSearchResults(searchSuggestions[value.id].id));
		} else {
			console.log('Resetting');
			dispatch(resetSearch());
		}
	};
	return (
		<div className="search_container">
			<Autocomplete
				onChange={(e, v) => handleSearch(e, v ? v : undefined)}
				value={searchTerm}
				style={{
					height: '100%'
				}}
				freeSolo
				options={Object.values(searchSuggestions)}
				renderInput={(params) => (
					<TextField
						onChange={(e) => {
							handleChangeWithDebounce(e);
						}}
						onFocus={(e) => handleChangeWithDebounce(e)}
						label="Search Someone!"
						variant="outlined"
						{...params}
						style={{
							backgroundColor: 'white',
							height: '100%'
						}}
					/>
				)}
			/>
		</div>
	);
};
