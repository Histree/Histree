import React from "react";
import { EdgeProps } from "reactflow";
import { getArcPath } from "../utils/utils";

const SpouseEdge = ({ 
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style={},
    data,
    markerEnd
}: EdgeProps) => {
    const edgePath: string = getArcPath(
		sourceX,
		sourceY,
		targetX,
		targetY,
	);
    return (
        <path
            id={id}
            style={style}
            d={edgePath}
            markerEnd={markerEnd}
            className="react-flow__edge-path"
        />
    )
}

export default SpouseEdge;