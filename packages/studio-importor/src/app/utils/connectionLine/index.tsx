import React from 'react';
import { useStore } from 'reactflow';

export default ({ fromX, fromY, toX, toY }) => {
  return (
    <g>
      <path
        fill="none"
        stroke={'rgb(221, 221, 221)'}
        strokeWidth={2}
        className="animated"
        d={`M${fromX},${fromY} L ${toX},${toY}`}
        markerEnd="url(#arrow)"
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={50}
        stroke={'rgb(221, 221, 221)'}
        strokeWidth={1}
        strokeDasharray={'10, 5'}
      />
    </g>
  );
};
