import { Position, MarkerType } from 'reactflow';

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(intersectionNode, targetNode) {
  // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
  const {
    width: intersectionNodeWidth,
    height: intersectionNodeHeight,
    positionAbsolute: intersectionNodePosition,
  } = intersectionNode;

  const targetPosition = targetNode.positionAbsolute;

  const w = intersectionNodeWidth / 2;
  const h = intersectionNodeHeight / 2;

  const x2 = intersectionNodePosition.x + w;
  const y2 = intersectionNodePosition.y + h;
  const x1 = targetPosition.x + targetNode.width / 2;
  const y1 = targetPosition.y + targetNode.height / 2;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
function getEdgePosition(node, intersectionPoint) {
  const n = { ...node.positionAbsolute, ...node };
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + n.width - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= n.y + n.height - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source, target) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}

/** Graph Edge */

export const getControlPoint = ({ sourceX, sourceY, targetX, targetY, offset }) => {
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

  // 计算控制点坐标
  const controlX = sourceX + dx / 2 + controlOffsetX;
  const controlY = sourceY + dy / 2 + controlOffsetY;
  return {
    x: controlX,
    y: controlY,
  };
};

export const getCustomPath = ({ source, P1, P2, P3, target }) => {
  return [`M ${source.x},${source.y} L ${P1.x},${P1.y} ${P2.x},${P2.y} ${P3.x},${P3.y} ${target.x},${target.y}`];
};

export const getSmoothPath = ({ source, P1, P2, P3, target }) => {
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

export const calculateDegree = (source, target) => {
  let deltaX = target.x - source.x;
  let deltaY = target.y - source.y;
  // 计算弧度
  let radian = Math.atan2(deltaY, deltaX);
  // 将弧度转换为度数
  let degree = radian * (180 / Math.PI);

  // 确保角度在 -90 到 90 度之间
  if (degree > 90) {
    degree -= 180;
  } else if (degree < -90) {
    degree += 180;
  }

  return degree;
};

export const getBezierPointsWithOffsetsCorrected = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  offset,
  R1 = 20,
  R2 = 20,
}) => {
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
