import * as React from 'react';
import { Button, Space, Upload } from 'antd';
import Graphin, { Behaviors ,Utils} from '@antv/graphin';
import { useContext } from '../../valtio/createGraph';
import {download,prop} from '../utils'
const { ZoomCanvas } = Behaviors;
const GraphIn = () => {
  const { store ,updateStore} = useContext();
  const { isAlert ,graphData,nodeItems,edgeItems} = store;
  React.useEffect(() => {
    getVertexEdges();
  }, [nodeItems,edgeItems]);
  const getVertexEdges = async () => {
    const result = {
      vertices: Object.values(nodeItems),
      edges: Object.values(edgeItems),
    };    
    let nodes: { id: string; label: string; style: any }[] = [];
    let edge: { source: string; target: string; style: any; label: string }[] = [];
    let edge_: { source: string; target: string; style: any; label: string }[] = [];
    result?.vertices?.map(v => {
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
    result?.edges?.map(e => {
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
        })
    }
    });
    let ed = Utils.processEdges([...edge, ...edge_], { poly: 30, loop: 20 });
    ed.forEach((edge, index) => {
      const { label } = edge;
      edge.style.label = {
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
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>Graph Schema View</h3>
        {!isAlert ? (
          <Space>
            <Upload {...prop} showUploadList={false}>
              <Button type="dashed">Import</Button>
            </Upload>
            <Button type="dashed" onClick={() => download(`xxx.json`, '')}>
              Export
            </Button>
          </Space>
        ) : null}
      </div>
      <Graphin data={graphData} layout={{ type: 'circular' }} fitView style={{ height: '60vh' }}>
        <ZoomCanvas enableOptimize minZoom={0.5} />
      </Graphin>
    </div>
  );
};

export default GraphIn;
