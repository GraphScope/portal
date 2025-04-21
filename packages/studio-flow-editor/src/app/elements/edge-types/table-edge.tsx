import React from 'react';
import { getBezierPath, BaseEdge, useStore, EdgeProps, ReactFlowState, EdgeLabelRenderer } from 'reactflow';

export type GetSpecialPathParams = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};

export const getSpecialPath = ({ sourceX, sourceY, targetX, targetY }: GetSpecialPathParams, offset: number) => {
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  return `M ${sourceX} ${sourceY} Q ${centerX} ${centerY + offset} ${targetX} ${targetY}`;
};

export default function TableEdge(props: EdgeProps) {
  const { source, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, data, style } =
    props;

  //@ts-ignore
  const { _isLoop = false, _isPoly = false, _isRevert = false, _offset = 0 } = style || {};

  const edgePathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  };

  const path = getSpecialPath(edgePathParams, _offset);

  return (
    <>
      <BaseEdge path={path} markerEnd={markerEnd} />
    </>
  );
}
