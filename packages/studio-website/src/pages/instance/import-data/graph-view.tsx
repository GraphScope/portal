import { FunctionComponent, ReactNode } from 'react';
import Graphin, { Utils } from '@antv/graphin';
import '@antv/graphin-icons/dist/index.css';
import { theme } from 'antd';
import { PropertyType } from './index';
const { useToken } = theme;
interface Props {
  children?: ReactNode;
  // 命名修改为 data / nodes/edges
  pdata: {
    nodeLists: PropertyType[];
    edgeLists: PropertyType[];
  };
}

/** graphin 数据处理 */
const getVertexEdges = (nodeList: any[], edgeList: any[], token: any) => {
  const nodes = nodeList.map((item: PropertyType) => {
    const { key, label, isBind } = item;
    return {
      id: label,
      style: {
        label: {
          value: `${label} ${isBind ? '✅' : '☑️'}`,
          fill: token.colorPrimary,
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

  const edges = edgeList.map((item: PropertyType) => {
    const { key, label, source, target, isBind } = item;
    return {
      id: key,
      source,
      target,
      label: `${label} ${isBind ? '✅' : '☑️'}`,
      style: {
        label: {
          value: `${label} ${isBind ? '✅' : '☑️'}`,
          fill: token.colorPrimary,
          offset: [0, 0],
        },
      },
    };
  });

  //@ts-ignore
  const processEdges = Utils.processEdges(edges, { poly: 30, loop: 20 });
  /** TODO：这个地方是Graphin的BUG，一旦走了processEdge，Offset应该不做改变 */
  processEdges.forEach(item => {
    if (item.style?.label) {
      item.style.label.offset = [0, 0];
    }
  });

  return { nodes, edges: processEdges };
};

// 改名为 graphview
const GraphInsight: FunctionComponent<Props> = props => {
  const { children, pdata } = props;
  const { token } = useToken();
  //@ts-ignore
  const graphData = getVertexEdges(pdata.nodeLists, pdata.edgeLists, token);

  return (
    <>
      {children}
      <Graphin data={graphData} layout={{ type: 'force2' }} fitView fitCenter style={{ paddingBottom: '3px' }} />
    </>
  );
};

export default GraphInsight;
