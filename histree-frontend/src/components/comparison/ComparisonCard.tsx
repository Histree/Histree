import React, { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import {
  TextField,
  Autocomplete,
  Card,
  CardHeader,
  CardContent,
  Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import './ComparisonCard.scss';
import {
  AppDispatch,
  getCompareNodes,
  getSearchSuggestions,
  resetSearch,
  setResultServiceState
} from '../../stores';
import ComparisonFlow from './ComparisonFlow';
import { ReactFlowProvider } from 'reactflow';

export const ComparisonCard = () => {
  // const appDispatch = useDispatch<AppDispatch>();
  // const handleChangeWithDebounce = debounce(async (e) => {
  // 	handleAutocomplete(e);
  // }, 500);
  return (
    <div className="comparison-container">
      <Card>
        <CardHeader title="Find relationship" />
        <CardContent>
          <div style={{ height: '150px', width: 'auto' }}>
            <ReactFlowProvider>
              <ComparisonFlow />
            </ReactFlowProvider>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
