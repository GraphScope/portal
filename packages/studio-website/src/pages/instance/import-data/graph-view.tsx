import { FunctionComponent, ReactNode } from 'react';
import Graphin, { Utils } from '@antv/graphin';
import '@antv/graphin-icons/dist/index.css';
import { BindingEdge, BindingNode } from './useContext';
import { useDataMap, transformDataMap } from './useContext';
import { useContext } from '@/layouts/useContext';
interface Props {
  children?: ReactNode;
  viewdata: {
    nodeLists: BindingNode[];
    edgeLists: BindingEdge[];
  };
}

/** graphin 数据处理 */
const getVertexEdges = (source: any, mode: string) => {
  const nodes = source.nodes.map((item: BindingNode) => {
    const { key, label, isBind } = item;
    return {
      id: key,
      style: {
        label: {
          value: `${label} ${isBind ? '✅' : '☑️'}`,
          position: 'center',
          offset: [10, 5],
          fontSize: 14,
        },

        keyshape: {
          size: 50,
          stroke: '#5F646B',
          fillOpacity: 1,
          fill: mode === 'defaultAlgorithm' ? '#fff' : '#212121',
          lineWidth: 3,
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
          fill: mode === 'defaultAlgorithm' ? '#1C1D1F' : '#fff',
        },
        keyshape: {
          stroke: '#5F646B',
          lineWidth: 2,
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
  const { children } = props;
  const { store } = useContext();
  const { mode } = store;
  //@ts-ignore
  const source = transformDataMap(useDataMap());
  //@ts-ignore
  const graphData = getVertexEdges(source, mode);

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
