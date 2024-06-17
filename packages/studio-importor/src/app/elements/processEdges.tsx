import type { ISchemaEdge } from '../typing';
function isEven(number: number) {
  return number % 2 === 0;
}

function isOdd(number: number) {
  return !isEven(number);
}

const POLY_DEFAULT = 30;
const LOOP_DEFAULT = 10;
const LOOP_LABEL_POSITION_DEFAULT = 1;

/**
 *
 * @param edges 边的集合
 * @param {poly,loop} 设置多边和自环多边的distance
 */
const processEdges = (
  edges: ISchemaEdge[],
  {
    poly = POLY_DEFAULT,
    loop = LOOP_DEFAULT,
    loopLabelPosition = LOOP_LABEL_POSITION_DEFAULT,
  }: {
    /** poly distance */
    poly?: number;
    /** loop distance */
    loop?: number;
    /** loop label position based on loop edge */
    loopLabelPosition?: number;
  } = {
    poly: POLY_DEFAULT,
    loop: LOOP_DEFAULT,
    loopLabelPosition: LOOP_LABEL_POSITION_DEFAULT,
  },
) => {
  const edgesMap: { [edgeId: string]: ISchemaEdge[] } = {};
  /** 计算得到 edgesMap */
  edges.forEach((item, index) => {
    const edge = { ...item };
    const { source, target } = edge;
    const groupId = `${source}-${target}`;
    const revertGroupId = `${target}-${source}`;
    /** 存储edge */
    if (edgesMap[groupId]) {
      edgesMap[groupId].push(edge);
    } else if (edgesMap[revertGroupId]) {
      edgesMap[revertGroupId].push(edge);
    } else {
      edgesMap[groupId] = [edge];
    }
  });

  const edgeGroups = Object.values(edgesMap);
  const newEdges: ISchemaEdge[] = [];
  edgeGroups.forEach(edges => {
    const isMultipleEdge = edges.length > 1;
    // 说明是多边的情况
    if (isMultipleEdge) {
      const isEvenCount = isEven(edges.length);
      edges.forEach((edge, i: number) => {
        const { source, target, data } = edge;

        const revertGroupId = `${target}-${source}`;
        const isLoop = source === target;
        const isRevert = !!edgesMap[revertGroupId];
        const index = i;
        let distance;
        if (isEvenCount) {
          // 奇数
          const idx = Math.ceil((index + 1) / 2);
          distance = poly * idx;
        } else {
          // 偶数
          const calculateIdx = isOdd(index) ? index + 1 : index;
          const idx = Math.ceil(calculateIdx / 2);
          distance = poly * idx;
        }
        let offset = isEven(index) ? distance : -distance;
        let type = 'poly';
        // // 反向边需要revert
        if (isRevert) {
          offset = -offset;
        }
        if (isLoop) {
          type = 'loop';
          offset = index * loop;
        }
        newEdges.push({
          ...edge,
          data: {
            ...data,
            _extra: {
              count: edges.length,
              index: index,
              type: type,
              isPoly: true,
              isLoop: isLoop,
              offset: offset,
              isRevert: isRevert,
            },
          },
        });
      });
    } else {
      const [edge] = edges;
      const { source, target, data } = edge;
      newEdges.push({
        ...edge,
        data: {
          ...data,
          _extra: {
            count: 1,
            index: 0,
            isLoop: source === target,
          },
        },
      });
    }
  });

  return newEdges;
};

export default processEdges;
