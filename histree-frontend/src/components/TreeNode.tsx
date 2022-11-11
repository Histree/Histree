import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelected,
  getSelected,
  getRenderContent,
  getVisible,
  setVisible
} from '../stores/base';
import { NodeInfo } from '../models';
import './TreeNode.scss';
import { Handle, Position } from 'reactflow';

const TreeNode = ({ data }: { data: NodeInfo }) => {
  const dispatch = useDispatch();
  const selected = useSelector(getSelected);
  const renderContent = useSelector(getRenderContent);
  const visible = useSelector(getVisible);

  const expandWindow = () => {
    dispatch(
      setSelected({
        name: data.name,
        image: data?.image,
        attributes: data.petals,
        description: data?.description
        // links: details?.links,
      })
    );
    console.log(selected);
  };

  const handleExpandParents = (): void => {
    if (renderContent.status === 'Success') {
      const adjList = renderContent.content!.branches;
      const newVis = { ...visible };

      Object.keys(adjList).forEach((parentId) => {
        if (adjList[parentId].includes(data.id)) {
          newVis[parentId] = true;
        }
      });

      dispatch(setVisible(newVis));
    }
  };

  const handleExpandChildren = (): void => {
    if (renderContent.status === 'Success') {
      const adjList = renderContent.content!.branches;
      const newVis = { ...visible };

      adjList[data.id].forEach((childId) => {
        newVis[childId] = true;
      });

      dispatch(setVisible(newVis));
    }
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable
        onClick={handleExpandParents}
      />
      <div className="treenodecard" onClick={expandWindow}>
        <div className="treenodechild">{data.name}</div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable
        onClick={handleExpandChildren}
      />
    </>
  );
};

export default TreeNode;
