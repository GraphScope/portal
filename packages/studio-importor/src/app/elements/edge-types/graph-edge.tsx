import React from 'react';
import { useCallback } from 'react';
import { useStore } from 'reactflow';
import type { EdgeProps } from 'reactflow';
import {
  getEdgeParams,
  getBezierPointsWithOffsetsCorrected,
  getControlPoint,
  getSmoothPath,
  calculateDegree,
} from './utils';
import { useContext } from '../../useContext';
import LoopEdge from './loop-edge';
import Label from './label';

function GraphEdge(props: EdgeProps) {
  const { id, source, target, style, data } = props;
  const { _extra, label } = data || {};
  const { offset = 0 } = _extra || {};
  const sourceNode = useStore(useCallback(store => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback(store => store.nodeInternals.get(target), [target]));
  const { store } = useContext();
  const { currentId, theme } = store;
  if (!sourceNode || !targetNode) {
    return null;
  }
  const isLoop = source === target;
  if (isLoop) {
    return <LoopEdge {...props} />;
  }

  const isSelected = id === currentId;

  const { sx: sourceX, sy: sourceY, tx: targetX, ty: targetY } = getEdgeParams(sourceNode, targetNode);

  const controlPoint = getControlPoint({ sourceX, sourceY, targetX, targetY, offset });

  const { P1, P2 } = getBezierPointsWithOffsetsCorrected({
    sourceX,
    sourceY,
    targetX,
    targetY,
    offset,
  });

  const [edgePath] = getSmoothPath({
    source: {
      x: sourceX,
      y: sourceY,
    },
    target: {
      x: targetX,
      y: targetY,
    },
    P1: P1,
    P2: controlPoint,
    P3: P2,
  });

  /** 计算标签和标签背景的旋转角度 */
  let degree = calculateDegree({ x: sourceX, y: sourceY }, { x: targetX, y: targetY });

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={isSelected ? 'url(#arrow-selected)' : 'url(#arrow)'}
        style={{ ...style, stroke: isSelected ? theme.primaryColor : '#000', strokeWidth: isSelected ? '2px' : '1px' }}
      />
      <Label
        id={id}
        label={label}
        style={{
          transform: `translate(-50%, -50%) translate(${controlPoint.x}px,${controlPoint.y}px) rotate(${degree}deg)`,
        }}
      />
    </>
  );
}

export default GraphEdge;
