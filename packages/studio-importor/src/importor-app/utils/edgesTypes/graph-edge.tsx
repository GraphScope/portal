import React from 'react';
import { getBezierPath, BaseEdge, useStore, EdgeProps, ReactFlowState, EdgeLabelRenderer } from 'reactflow';

export type GetSpecialPathParams = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};

function calculateBezierPath(params, offset) {
  const { sourceX: c1x, sourceY: c1y, sourceR: r1, targetX: c2x, targetY: c2y, targetR: r2 } = params;
  // Calculate the intersection points
  const dx = c2x - c1x;
  const dy = c2y - c1y;
  const a = Math.pow(r1 + r2, 2);
  const b = (Math.pow(dx, 2) + Math.pow(dy, 2) - (r1 - r2)) ^ 2;
  const h = (a - b) / (2 * dx);
  const k = c1y + h;

  const x1 = c1x + (dx * h) / dy;
  const y1 = k;
  const x2 = c1x + (dx * (k - dy)) / dy;
  const y2 = c1y + r1;

  // Calculate the control points
  const cx1 = [c1x, c1y];
  const cy1 = [(x1 - c1x) / offset, (y1 - c1y) / offset];
  const cx2 = [c2x, c2y];
  const cy2 = [(x2 - c2x) / offset, (y2 - c2y) / offset];

  // Create the Bezier curve path string
  const bezierPath = `M ${cx1[0]} ${cx1[1]} C ${cy1[0] + cx1[0]} ${
    cy1[1] + cx1[1]
  }, ${x1} ${y1}, ${cy2[0] + cx2[0]} ${cy2[1] + cx2[1]} S ${x2} 
${y2} Z`;

  return bezierPath;
}

function generateSmoothCurvePath({ sourceX, sourceY, sourceR, targetX, targetY, targetR }, offset) {
  // 计算两圆之间中心点的坐标
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  // 计算两圆心之间的距离 d
  const d = Math.sqrt((targetX - sourceX) ** 2 + (targetY - sourceY) ** 2);

  // 修改半径以考虑偏移量
  const updatedSourceRadius = sourceR + offset;
  const updatedTargetRadius = targetR + offset;

  // 确保不会计算出非法曲线
  if (updatedSourceRadius < 0 || updatedTargetRadius < 0) {
    console.error('Offset is too large, resulting in negative radii.');
    return '';
  }

  // 角度 theta 用于计算圆上交点的位置
  const theta = Math.atan2(targetY - sourceY, targetX - sourceX);

  // 计算两个交点的坐标
  const sourceIntersectionX = sourceX + Math.cos(theta) * updatedSourceRadius;
  const sourceIntersectionY = sourceY + Math.sin(theta) * updatedSourceRadius;
  const targetIntersectionX = targetX - Math.cos(theta) * updatedTargetRadius;
  const targetIntersectionY = targetY - Math.sin(theta) * updatedTargetRadius;

  // 创建路径命令
  return `M ${sourceIntersectionX} ${sourceIntersectionY} Q ${centerX} ${centerY + offset} ${targetIntersectionX} ${targetIntersectionY}`;
}

export const getSpecialPath = ({ sourceX, sourceY, targetX, targetY }: GetSpecialPathParams, offset: number) => {
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  return `M ${sourceX} ${sourceY} Q ${centerX} ${centerY + offset} ${targetX} ${targetY}`;
};

export default function GraphEdge(props: EdgeProps) {
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
    sourceR: 50,
    targetR: 50,
  };

  const path = getSpecialPath(edgePathParams, _offset);

  return (
    <>
      <BaseEdge path={path} markerEnd={markerEnd} />{' '}
    </>
  );
}
