import { useEffect ,memo, FunctionComponent} from 'react';
import Graphin, { Utils } from '@antv/graphin';
import { useContext } from '../useContext';
interface Props {
  children?: JSX.Element;
}
const GraphInsight:FunctionComponent<Props> = props => {
  const { children = <></> } = props;
  const { store, updateStore } = useContext();
  const { graphData, nodeItems, edgeItems } = store;
  useEffect(() => {
    getVertexEdges();
  }, [nodeItems, edgeItems]);
  /** graphin 数据处理 */
  const getVertexEdges = () => {
    const result: { vertices: { label: string }[]; edges: { label: string; src_label: string; dst_label: string }[] } =
      {
        vertices: Object.values(nodeItems),
        edges: Object.values(edgeItems),
      };
    let nodes: { id: string; label: string; style: any }[] = [];
    let edge: { source: string; target: string; label: string }[] = [];
    let edge_: { source: string; target: string; style: any; label: string }[] = [];
    result.vertices.map(v => {
      nodes.push({
        id: v.label,
        label: v.label,
        style: {
          label: {
            value: v.label,
          },
          fontSize: 14,
          keyshape: {
            size: 50,
          },
        },
      });
    });
    result.edges.map(e => {
      if (e['src_label'] !== e['dst_label']) {
        edge_.push({
          source: e['src_label'],
          target: e['dst_label'],
          label: e.label,
          style: {
            keyshape: {
              lineWidth: 1,
              startArrow: false,
            },
          },
        });
      } else {
        edge_.push({
          source: e['src_label'],
          target: e['dst_label'],
          label: e.label,
          style: {
            keyshape: {
              lineWidth: 1,
              endArrow: {
                path: 'M 0,1 L -3,7 L 3,6 Z',
                fill: '#dedede',
              },
              startArrow: false,
            },
          },
        });
      }
    });
    let ed = Utils.processEdges([...edge, ...edge_], { poly: 30, loop: 20 });
    ed.forEach((item: any) => {
      const { label, style } = item;
      style.label = {
        value: label,
        fill: 'block',
        fontSize: 12,
      };
    });
    let arr = { nodes, edges: ed };
    updateStore(draft => {
      draft.graphData = arr;
    });
  };
  return (
    <div
      style={{ backgroundColor: '#fff', padding: '16px', border: '1px solid #000', height: '65vh', overflow: 'hidden' }}
    >
      <div>{children}</div>
      <Graphin data={graphData} layout={{ type: 'circular' }} fitView style={{ height: '60vh' }} />
    </div>
  );
};

export default memo(GraphInsight);
