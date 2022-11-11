import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelected, getSelected } from '../stores/base';
import { NodeInfo } from '../models';
import './TreeNode.scss';
import { Handle, Position } from 'reactflow';

const TreeNode = ({ data }: { data: NodeInfo }) => {
  const dispatch = useDispatch();
  const selected = useSelector(getSelected);

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

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable
        onClick={() => console.log('clicked top handle')}
      />
      <div className="treenodecard" onClick={expandWindow}>
        <div className="treenodechild">{data.name}</div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable
        onClick={() => console.log('clicked bottom handle')}
      />
    </>
  );
};

export default TreeNode;
