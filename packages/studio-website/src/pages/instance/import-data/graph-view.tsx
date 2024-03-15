import { FunctionComponent, ReactNode } from 'react';
import Graphin, { Utils } from '@antv/graphin';
import '@antv/graphin-icons/dist/index.css';
import { theme } from 'antd';
import { BindingEdge, BindingNode } from './useContext';
import { useDataMap, transformDataMap } from './useContext';
import { useContext } from '@/layouts/useContext';
const { useToken } = theme;
interface Props {
  children?: ReactNode;
  viewdata: {
    nodeLists: BindingNode[];
    edgeLists: BindingEdge[];
  };
}

/** graphin 数据处理 */
const getVertexEdges = (source: any, token: any) => {
  const nodes = source.nodes.map((item: BindingNode) => {
    const { key, label, isBind } = item;
    return {
      id: key,
      style: {
        label: {
          value: `${label} ${isBind ? '✅' : '☑️'}`,
          position: 'center',
        },
        fontSize: 14,
        keyshape: {
          size: 50,
          stroke: '#000',
          fillOpacity: 1,
          fill: '#fff',
        },
      },
    };
  });

  const edges = source.edges.map((item: BindingEdge) => {
    const { key, label, source, target, isBind } = item;
    return {
      id: key,
      source,
      target,
      label: `${label} ${isBind ? '✅' : '☑️'}`,
      style: {
        label: {
          value: `${label} ${isBind ? '✅' : '☑️'}`,
          fill: '#000',
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
  const { children, viewdata } = props;
  const { store } = useContext();
  const { mode } = store;
  const { token } = useToken();
  //@ts-ignore
  const source = transformDataMap(useDataMap());
  //@ts-ignore
  const graphData = getVertexEdges(source, token);

  return (
    <>
      {children}
      {/** @ts-ignore */}
      <Graphin
        theme={{ mode: mode === 'defaultAlgorithm' ? 'light' : 'dark' }}
        data={graphData}
        layout={{ type: 'force2' }}
        fitCenter
        style={{ paddingBottom: '3px' }}
      />
    </>
  );
};

export default GraphInsight;
