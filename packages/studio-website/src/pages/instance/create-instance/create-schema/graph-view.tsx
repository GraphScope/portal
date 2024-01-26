import { useEffect, memo, FunctionComponent } from 'react';
import Graphin, { Utils } from '@antv/graphin';
import { useContext, NodeSchema, EdgeSchema } from '../useContext';
import { theme } from 'antd';
const { useToken } = theme;
interface Props {
  children?: JSX.Element;
}

/** graphin 数据处理 */
const getVertexEdges = (nodeList: NodeSchema[], edgeList: EdgeSchema[], token: any) => {
  const nodesMap = new Map();
  const nodes = nodeList.map(item => {
    const { key, label } = item;
    nodesMap.set(key, item);
    return {
      id: key,
      style: {
        label: {
          value: label,
        },
        fontSize: 14,
        keyshape: {
          size: 50,
          stroke: token.colorPrimary,
          fillOpacity: 1,
          fill: token.colorPrimary,
        },
      },
    };
  });

  const edges = edgeList
    .map(item => {
      const { key, label, source, target } = item;
      return {
        id: key,
        source,
        target,
        label,
        style: {
          label: {
            value: label,
            fill: token.colorPrimary,
            offset: [0, 0],
          },
        },
      };
    })
    .filter(item => {
      const { source, target } = item;
      if (nodesMap.get(source) && nodesMap.get(target)) {
        return true;
      }
      return false;
    });
  // //@ts-ignore
  const processEdges = Utils.processEdges(edges, { poly: 30, loop: 20 });
  /** TODO：这个地方是Graphin的BUG，一旦走了processEdge，Offset应该不做改变 */
  processEdges.forEach(item => {
    if (item.style?.label) {
      item.style.label.offset = [0, 0];
    }
  });

  return { nodes, edges: processEdges };
};

const GraphInsight: FunctionComponent<Props> = props => {
  const { children = <></> } = props;
  const { token } = useToken();
  const { store } = useContext();
  const { nodeList, edgeList } = store;
  //@ts-ignore
  const graphData = getVertexEdges(nodeList, edgeList, token);

  return (
    <>
      {children}
      <Graphin data={graphData} layout={{ type: 'circular' }} fitView fitCenter style={{ paddingBottom: '3px' }} />
    </>
  );
};

export default memo(GraphInsight);
