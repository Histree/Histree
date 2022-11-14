import CloseIcon from '@mui/icons-material/Close';
import React, { forwardRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelected, getSelected } from '../../stores/base';
import { Selected } from '../../models';
import './DescriptorCard.scss';

interface DescriptorCardProps {
  children?: React.ReactNode;
  selectedItem: Selected;
}

export const DescriptorCard = forwardRef<HTMLDivElement, DescriptorCardProps>(
  (props, ref) => {
    const { selectedItem } = props;

    const dispatch = useDispatch();

    const closeWindow = () => {
      dispatch(setSelected(undefined));
    };

    return (
      <div ref={ref} className="descriptor-container">
        <Card
          className="descriptor-card"
          style={{ height: '100%', overflowY: 'scroll' }}
          variant="outlined"
        >
          {selectedItem.attributes &&
            selectedItem.attributes!['image'] &&
            selectedItem.attributes!['image'] !== 'undefined' && (
              <CardMedia
                className="descriptor-card-media"
                component="img"
                height="350"
                image={selectedItem.attributes!['image']}
                alt={selectedItem.attributes!['image']}
              />
            )}

          <CardHeader
            onClick={closeWindow}
            action={
              <IconButton aria-label="close">
                <CloseIcon></CloseIcon>
              </IconButton>
            }
            title={selectedItem.name}
          />

          <CardContent>
            <Box className="descriptor-container-body">
              {selectedItem.attributes &&
                Object.keys(selectedItem.attributes)
                  .filter((att) => {
                    return (
                      selectedItem.attributes![att] !== 'undefined' &&
                      att !== 'image'
                    );
                  })
                  .map((att) => {
                    const attrName = att.charAt(0).toUpperCase() + att.slice(1);
                    const attrVal = selectedItem.attributes![att];
                    const attrDesc =
                      attrVal === 'undefined'
                        ? 'Unknown'
                        : attrVal.charAt(0).toUpperCase() + attrVal.slice(1);

                    return (
                      <Typography key={att} variant="body2">
                        {`${attrName}: ${attrDesc}`}
                      </Typography>
                    );
                  })}
              <br />
              {selectedItem.description &&
              selectedItem.description !== 'undefined' ? (
                <Typography variant="body2">
                  {selectedItem.description.charAt(0).toUpperCase() +
                    selectedItem.description.slice(1)}
                </Typography>
              ) : (
                <Typography variant="body2">
                  Description not available.
                </Typography>
              )}
            </Box>
          </CardContent>
          <CardActions>
            <>
              {selectedItem.links &&
                Object.keys(selectedItem.links).map((linkName) => {
                  return (
                    <Button
                      key={linkName}
                      size="small"
                      href={selectedItem.links![linkName]}
                    >
                      {linkName}
                    </Button>
                  );
                })}
            </>
          </CardActions>
        </Card>
      </div>
    );
  }
);
