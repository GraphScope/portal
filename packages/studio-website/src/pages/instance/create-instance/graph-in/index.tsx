import * as React from 'react';
import { Button, Space, Upload } from 'antd';
import type { UploadProps } from 'antd';
import { useImmer } from 'use-immer';
import { cloneDeep } from 'lodash';
import Graphin, { Utils, Behaviors } from '@antv/graphin';
import { setLocalData, getLocalData } from '../../localStorage';
const { ZoomCanvas } = Behaviors;
const GraphIn = (props: { isAlert?: any; graphData?: any }) => {
  const { isAlert, graphData } = props;
  const [state, updateState] = useImmer({
    graphData: graphData || [],
  });
  React.useEffect(() => {
    getVertexEdges();
  }, [getLocalData('nodeList'),getLocalData('edgeList')]);
  const getVertexEdges = async () => {
    const result = {
      vertices: Object.values(cloneDeep(getLocalData('nodeList'))),
      edges: Object.values(cloneDeep(getLocalData('edgeList'))),
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
      edge_.push({
        source: e['src_label'],
        target: e['dst_label'],
        label: e.label,
        style: {
          keyshape: {
            lineWidth: 1,
            startArrow: false,
          }
        },
      });
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
    updateState(draft => {
      draft.graphData = arr;
    });
  };
  // 导入数据
  const prop: UploadProps = {
    beforeUpload(file: Blob) {
      let reader = new FileReader();
      reader.readAsText(file, 'utf-8');
      reader.onload = async () => {
        // let res = await importSchema({ name: props.importName, data: reader.result });
        // if (!res.success) return message.error(res?.message, 3);
        // message.success('import successfully !', 3);
      };
    },
    capture: undefined,
  };
  // 导出
  const download = (queryData: string, states: BlobPart) => {
    const eleLink = document.createElement('a');
    eleLink.download = queryData;
    eleLink.style.display = 'none';
    const blob = new Blob([states]);
    eleLink.href = URL.createObjectURL(blob);
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
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
      <Graphin data={state.graphData} layout={{ type: 'circular' }} fitView fitCenter style={{ height: '60vh' }}>
        <ZoomCanvas enableOptimize minZoom={0.5} />
      </Graphin>
    </div>
  );
};

export default GraphIn;
