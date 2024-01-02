import * as React from 'react';
import Graphin, { Behaviors } from '@antv/graphin';
import { Button, Space } from 'antd';
import { useImmer } from 'use-immer';
interface IViewSchemaProps {graphData?:any}
const { ZoomCanvas } = Behaviors;
const ViewSchema: React.FunctionComponent<IViewSchemaProps> = props => {
  const { graphData } = props;
  const [state, updateState] = useImmer({
    graphData: graphData ||[]
  });
  return (
    <div style={{padding:'0 24px',border:'1px solid #000'}}>
      <div style={{display:'flex',justifyContent:'space-between'}}>
        <h3>Graph Schema View</h3>
        <Space>
          <Button type='dashed'>Import</Button>
          <Button type='dashed'>Export</Button>
        </Space>
      </div>
      <Graphin
        data={state.graphData}
        layout={{ type: 'circular' }}
        fitView
        fitCenter
      >
        <ZoomCanvas enableOptimize minZoom={0.5} />
      </Graphin>
    </div>
  );
};

export default ViewSchema;
