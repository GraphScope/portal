import * as React from 'react';
import { Button, Form, Input, Radio, Tabs, Steps, Alert, Space, Row, Col, Select, Upload } from 'antd';
import type { UploadProps } from 'antd';
import { useImmer } from 'use-immer';
import Graphin, { Behaviors } from '@antv/graphin';
const { ZoomCanvas } = Behaviors;
const GraphIn = (props: { isAlert?: any; graphData?: any; }) => {
  const { isAlert ,graphData} = props;
  const [state, updateState] = useImmer({
    graphData: graphData || [],
  });
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
    <div style={{ backgroundColor: '#fff', padding: '16px', border: '1px solid #000', height: '65vh' }}>
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
