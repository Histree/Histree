import { Drawer, Box, Typography } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelected, getSelected } from '../stores/base';
import {
  mockAttributes,
  mockDescription,
  mockImg,
  mockLinks,
  NodeInfo
} from '../models';
import './TreeNodeCard.scss';

const TreeNodeCard = (props: { details: NodeInfo }) => {
  const dispatch = useDispatch();
  const selected = useSelector(getSelected);
  const { details } = props;

  const expandWindow = () => {
    dispatch(
      setSelected({
        name: details.name,
        image: details?.image,
        attributes: details.petals,
        description: details?.description
        // links: details?.links,
      })
    );
    console.log(selected);
  };

  return (
    <div className="treenodecard" onClick={expandWindow}>
      {details.name}
    </div>
  );
};

export default TreeNodeCard;
