import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelected,
  getSelected,
  getRenderContent,
  getNodeLookup,
  setNodeLookup,
  AppDispatch
} from '../stores/base';
import { NodeInfo } from '../models';
import './TreeNode.scss';
import { Handle, Position } from 'reactflow';
import { fetchSelectedExpansion } from '../services';

const TreeNode = ({ data }: { data: NodeInfo }) => {
  const dispatch = useDispatch();
  const selected = useSelector(getSelected);
  const renderContent = useSelector(getRenderContent);
  const nodeLookup = useSelector(getNodeLookup);
  const appDispatch = useDispatch<AppDispatch>();

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
      const { branches } = renderContent.content!;
      const nodes = { ...nodeLookup };

      if (!nodes[data.id].searched) {
        appDispatch(
          fetchSelectedExpansion({ searchedQid: data.id, direction: 'up' })
        );
      } else {
        Object.keys(branches).forEach((parentId) => {
          if (branches[parentId].includes(data.id)) {
            const parent = { ...nodes[parentId] };
            parent.visible = true;
            nodes[parentId] = parent;
          }
        });

        dispatch(setNodeLookup(nodes));
      }
    }
  };

  const handleExpandChildren = (): void => {
    if (renderContent.status === 'Success') {
      const { branches } = renderContent.content!;
      const nodes = { ...nodeLookup };

      if (!nodes[data.id].searched) {
        appDispatch(
          fetchSelectedExpansion({ searchedQid: data.id, direction: 'down' })
        );
      } else {
        branches[data.id].forEach((childId) => {
          console.log(nodes[childId]);
          const child = { ...nodes[childId] };
          child.visible = true;
          nodes[childId] = child;
        });
        dispatch(setNodeLookup(nodes));
      }
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
