import React from 'react';
import { useCallback } from 'react';
import { useStore, getBezierPath, getStraightPath, EdgeLabelRenderer } from 'reactflow';

import { getEdgeParams } from './utils';
import { useContext } from '../../useContext';
import EditableText from '../../../components/EditableText';

const getControlPoint = ({ sourceX, sourceY, targetX, targetY, offset }) => {
  // 计算两点之间的向量
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;

  // 计算向量的长度（即两点间的距离）
  const distance = Math.sqrt(dx * dx + dy * dy);

  // 计算单位向量（方向向量）
  const unitDX = dx / distance;
  const unitDY = dy / distance;

  // 使用单位向量和给定的偏移量来找到控制点
  // 注意：这里的offset是控制点偏离直线的垂直距离，因此我们分别对dx和dy进行操作
  // 为了简化并考虑到各种方向，我们将offset应用到与目标点连线的垂直方向上
  const controlOffsetX = -unitDY * offset; // 偏移控制点到目标连线的垂直左侧或右侧
  const controlOffsetY = unitDX * offset; // 根据dx和dy的正负自动适应上下
  console.log('controlOffsetX,controlOffsetY', controlOffsetX, controlOffsetY);

  // 计算控制点坐标
  const controlX = sourceX + dx / 2 + controlOffsetX;
  const controlY = sourceY + dy / 2 + controlOffsetY;
  return {
    x: controlX,
    y: controlY,
  };
};
const getCustomPath = ({ source, P1, P2, P3, target }) => {
  return [`M ${source.x},${source.y} L ${P1.x},${P1.y} ${P2.x},${P2.y} ${P3.x},${P3.y} ${target.x},${target.y}`];
};

const getSmoothPath = ({ source, P1, P2, P3, target }) => {
  // 计算控制点
  const controlPoint1 = {
    x: P1.x + (source.x - P1.x) / 3,
    y: P1.y + (source.y - P1.y) / 3,
  };
  const controlPoint2 = {
    x: P1.x + (P2.x - P1.x) / 3,
    y: P1.y + (P2.y - P1.y) / 3,
  };
  const controlPoint3 = {
    x: P3.x + (P2.x - P3.x) / 3,
    y: P3.y + (P2.y - P3.y) / 3,
  };
  const controlPoint4 = {
    x: P3.x + (target.x - P3.x) / 3,
    y: P3.y + (target.y - P3.y) / 3,
  };

  return [
    [
      `M ${source.x},${source.y}`, // 移动到起点source
      `L ${controlPoint1.x},${controlPoint1.y}`, // 绘制从source到控制点1的直线
      `Q ${P1.x},${P1.y} ${controlPoint2.x},${controlPoint2.y}`, // 从控制点1经过P1到控制点2的贝塞尔曲线（使得在P1处平滑过渡）
      `L ${P2.x},${P2.y}`, // 绘制从控制点2到P2的直线
      `L ${controlPoint3.x},${controlPoint3.y}`, // 绘制从P2到控制点3的直线
      `Q ${P3.x},${P3.y} ${controlPoint4.x},${controlPoint4.y}`, // 从控制点3经过P3到控制点4的贝塞尔曲线（使得在P3处平滑过渡）
      `L ${target.x},${target.y}`, // 绘制从控制点4到target的直线
    ].join(' '),
  ];
};

export const calculateDagree = (source, target) => {
  let deltaX = target.x - source.x;
  let deltaY = target.y - source.y;
  // 计算弧度
  let radian = Math.atan2(deltaY, deltaX);
  // 将弧度转换为度数
  return radian * (180 / Math.PI);
};

const getBezierPointsWithOffsetsCorrected = ({ sourceX, sourceY, targetX, targetY, offset, R1 = 20, R2 = 20 }) => {
  // 计算控制点P
  const controlPoint = getControlPoint({ sourceX, sourceY, targetX, targetY, offset });

  // 计算方向向量
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const directionLength = Math.sqrt(dx * dx + dy * dy);

  // 单位方向向量
  const unitDX = dx / directionLength;
  const unitDY = dy / directionLength;

  // 计算P1，确保P1到source的距离为R1且方向平行
  const p1DX = unitDX * R1;
  const p1DY = unitDY * R1;
  const p1X = sourceX + p1DX + offset * -unitDY; // 在平行方向上加上偏移
  const p1Y = sourceY + p1DY + offset * unitDX;

  const p2DX = -(unitDX * R2); // 负号确保向左移动
  const p2DY = -(unitDY * R2);
  const p2X = targetX + p2DX + offset * -unitDY;
  const p2Y = targetY + p2DY + offset * unitDX;

  return { P1: { x: p1X, y: p1Y }, P2: { x: p2X, y: p2Y }, controlPoint };
};

function GraphEdge({ id, source, target, markerEnd, style, data }) {
  const { _offset = 0 } = data || { _offset: 0 };
  const { label } = data || {};
  console.log('markend', markerEnd);
  const sourceNode = useStore(useCallback(store => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback(store => store.nodeInternals.get(target), [target]));
  const { store, updateStore } = useContext();
  const { currentId, theme } = store;
  if (!sourceNode || !targetNode) {
    return null;
  }
  const isSelected = id === currentId;

  const {
    sx: sourceX,
    sy: sourceY,
    tx: targetX,
    ty: targetY,
    sourcePos,
    targetPos,
  } = getEdgeParams(sourceNode, targetNode);
  const controlPoint = getControlPoint({ sourceX, sourceY, targetX, targetY, offset: _offset });

  const { P1, P2 } = getBezierPointsWithOffsetsCorrected({
    sourceX,
    sourceY,
    targetX,
    targetY,
    offset: _offset,
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
  const onEdgeClick = () => {
    updateStore(draft => {
      draft.currentId = id;
      draft.currentType = 'edges';
    });
  };
  const onLabelChange = value => {
    updateStore(draft => {
      //@ts-ignore
      const match = draft.edges.find(edge => edge.id === id);
      if (match) {
        match.label = value;
      }
    });
  };

  /** 计算标签和标签背景的旋转角度 */
  let degree = calculateDagree({ x: sourceX, y: sourceY }, { x: targetX, y: targetY });
  console.log('degree', label);
  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={isSelected ? 'url(#arrow-selected)' : 'url(#arrow)'}
        style={{ ...style, stroke: isSelected ? theme.primaryColor : '#ddd', strokeWidth: isSelected ? '2px' : '1px' }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            cursor: 'pointer',
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${controlPoint.x}px,${controlPoint.y}px) rotate(${degree}deg)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <div
            className="edgebutton"
            onClick={onEdgeClick}
            style={{
              borderRadius: '4px',
              color: isSelected ? '#fff' : '#000',
              background: isSelected ? `${theme.primaryColor}` : '#fff',
              border: isSelected ? `2px solid ${theme.primaryColor}` : '1px solid #ddd',
            }}
          >
            <EditableText text={label || id} onTextChange={onLabelChange} />
          </div>
        </div>
        {/* <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: 'green',
            position: 'absolute',
            transform: `translate(${controlPoint.x}px,${controlPoint.y}px)`,
          }}
        ></div> */}
        {/* <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: 'red',
            position: 'absolute',
            transform: `translate(${P1.x}px,${P1.y}px)`,
          }}
        ></div> */}
        {/* <div
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: 'blue',
          position: 'absolute',
          transform: `translate(${P2.x}px,${P2.y}px)`,
        }}
      ></div> */}
      </EdgeLabelRenderer>
    </>
  );
}

export default GraphEdge;
