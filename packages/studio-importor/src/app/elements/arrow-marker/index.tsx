import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { theme } from 'antd';
const { useToken } = theme;

interface IArrowMarkerProps {
  selectedColor?: string;
  color?: string;
}

const ArrowMarker: React.FunctionComponent<IArrowMarkerProps> = props => {
  const { selectedColor = 'red', color = '#000' } = props;

  return (
    <svg
      id="arrow-marker-svg"
      width="200"
      height="200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
    >
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill={color} />
        </marker>
        <marker
          id="arrow-selected"
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill={selectedColor} />
        </marker>
        <marker
          id="arrow-dragging"
          markerWidth="10"
          markerHeight="10"
          refX="60"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill={color} className="animated" strokeDasharray={'10, 5'} />
        </marker>
      </defs>
    </svg>
  );
};

export default ArrowMarker;
