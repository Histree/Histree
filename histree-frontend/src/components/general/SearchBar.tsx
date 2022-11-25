import React, { SyntheticEvent } from 'react';
import { TextField, Autocomplete, Box, Typography, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import './SearchBar.scss';
import {
	AppDispatch,
	getRenderContent,
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
		var id = (value as string);
		if (value && typeof value !== 'string') {
			id = value.id
		}
		if (id && searchTerm === value) {
			return;
		}
		if (id && searchSuggestions[id]) {
			dispatch(setResultServiceState({ status: 'Loading' }));
			console.log(searchSuggestions[id]);
			appDispatch(fetchSearchResults(searchSuggestions[id].id));
		}
	};
	return (
		<div className="search_container">
			<Autocomplete
				onChange={(e, v) => handleSearch(e, v ? v : undefined)}
				value={searchTerm}
				sx={{
					height: '100%'
				}}
				freeSolo
				autoHighlight
				options={Object.values(searchSuggestions)}
				renderOption={(params, option) =>
					<div key={`${option.id}`}>
						<li {...params} style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'flex-start',
							alignItems: 'flex-start'
						}}>
							<Typography variant='h6'>{option.label}</Typography>
							<Typography variant='subtitle1'>{option.description}</Typography>
						</li>
						<Divider />
					</div>
				}
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
		</div >
	);
};
