import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as React from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  IconButtonProps,
  Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelected, getSelected } from '../../stores/base';
import { Selected } from '../../models';
import './DescriptorCard.scss';
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';



interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));



interface DescriptorCardProps {
  children?: React.ReactNode;
  selectedItem: Selected;
}

export const DescriptorCard = React.forwardRef<HTMLDivElement, DescriptorCardProps>(
  (props, ref) => {
    const { selectedItem } = props;

    const dispatch = useDispatch();

    const closeWindow = () => {
      dispatch(setSelected(undefined));
    };

    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    }

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
            subheader={selectedItem.description &&
              selectedItem.description !== 'undefined' ? (
                <Typography variant="body2" color="text.secondary">
                  {selectedItem.description.charAt(0).toUpperCase() +
                    selectedItem.description.slice(1)}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Description not available.
                </Typography>
            )}
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
                    // make this nicer code
                    var attrDesc = ''
                  
                    if (attrVal === 'undefined') {
                      attrDesc = 'Unknown'
                    } else if (typeof attrVal === 'string') {
                      attrDesc = attrVal.charAt(0).toUpperCase() + attrVal.slice(1);
                    } else {
                      // case for locations with their own sub-jsons
                      attrDesc = attrVal['name'];
                    }
                    
                    return (
                      <Typography key={att} variant="body2">
                        {`${attrName.replace(/_/g, ' ')}: ${attrDesc}`}
                      </Typography>
                    );
                  })}
              <br />
              
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
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="View relevant locations"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>Click to see relevant locations</Typography>
            </CardContent>
          </Collapse>
        </Card>
      </div>
    );
  }
);

