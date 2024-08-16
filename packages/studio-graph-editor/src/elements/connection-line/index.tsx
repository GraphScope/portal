import React from 'react';

export default ({ fromX, fromY, toX, toY }) => {
  return (
    <g style={{ zIndex: -1, position: 'absolute' }}>
      <path
        fill="none"
        stroke={'#000'}
        strokeWidth={1}
        className="animated"
        d={`M${fromX},${fromY} L ${toX},${toY}`}
        markerEnd="url(#arrow-dragging)"
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={50}
        className="animated"
        stroke={'#000'}
        strokeWidth={1}
        strokeDasharray={'10, 5'}
      />
    </g>
  );
};
