import React from 'react';
import type { EdgeProps } from 'reactflow';
import { useContext } from '@graphscope/use-zustand';
import { usePathStyle } from './useStyle';
import Label from './label';

function LoopEdge(props: EdgeProps) {
  const { id, style, data, sourceX, sourceY } = props;
  const { _extra, label, filelocation } = data || {};
  const { index = 0 } = _extra || {};
  const { markerEnd, style: pathStyle } = usePathStyle(id);
  const edgePath = generateSelfLoopPath(sourceX, sourceY, { index });
  const labelPositon = getLabelPosition(sourceX, sourceY, { index });

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={{ ...style, ...pathStyle }}
      />

      <Label
        filelocation={filelocation}
        label={label}
        id={id}
        style={{
          transform: `translate(-50%, -50%) translate(${labelPositon.x}px,${labelPositon.y}px)`,
        }}
      />
    </>
  );
}
export default LoopEdge;
/**
 * 生成自环边的SVG path路径
 * @param {number} x - 节点的x坐标
 * @param {number} y - 节点的y坐标
 * @param {number} offset - 自环边的偏移量
 * @returns {string} - SVG path路径
 */
export function generateSelfLoopPath(sourceX, sourceY, { index }) {
  // TODO 需要根据R值计算x，y，现在有点 hard code

  const x = sourceX - 33;
  const y = sourceY - 40;
  const radius = 60 + index * 40; // radius for the loop
  const startX = x;
  const startY = y;
  const endX = x - 60;
  const endY = y;

  return `
        M ${startX} ${startY} 
        C ${startX + radius} ${startY - radius}, 
          ${endX - radius} ${endY - radius}, 
          ${endX} ${endY}`;
}

export function getLabelPosition(sourceX, sourceY, { index }) {
  const offset = index * 30;
  return {
    x: sourceX - 63,
    y: sourceY - offset - 80,
  };
}
