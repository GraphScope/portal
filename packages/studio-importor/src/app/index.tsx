import React, { useEffect } from 'react';
import GraphCanvas from './graph-canvas';
import PropertiesEditor from './properties-editor';
import ImportSchema from './import-schema';
import ModeSwitch from './mode-switch';
import { ReactFlowProvider } from 'reactflow';
import Toolbar from '../components/Toolbar';
import AddNode from './graph-canvas/add-node';
import 'reactflow/dist/style.css';
import RightButton from './layout-controller/right-button';
import LeftButton from './layout-controller/left-button';
interface ImportAppProps {
  view: string;
}
import { useStore, useContext } from './useContext';
import { Button } from 'antd';

const ImportApp: React.FunctionComponent<ImportAppProps> = props => {
  const { view } = props;
  const { collapsed } = useStore();
  const { left, right } = collapsed;
  const { store } = useContext();
  const { nodes, edges } = store;
  const handleSubmit = () => {
    /** 创建服务 「props.createGraph(params)」*/
    console.log('edges', edges);
    console.log('nodes', nodes);
    //@ts-ignore
    // props.createGraph(2, 'test', nodes, edges);
  };
  /** 数据绑定 */
  const handleBind = () => {
    const dataMap = [...nodes, ...edges];
    console.log(dataMap);
    //@ts-ignore
    props.createDataloadingJob(1, dataMap);
  };
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ height: '100%', display: 'flex' }}>
        <div
          style={{
            width: left ? '0px' : '300px',
            padding: left ? '0px' : '12px',
            overflow: 'hidden',
            transition: 'width 0.2s ease',
          }}
        >
          <ImportSchema />
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <ReactFlowProvider>
            <Toolbar>
              <LeftButton />
              <AddNode />
              <ImportSchema displayType="model" />
              <ModeSwitch />
            </Toolbar>
            <Toolbar style={{ top: '18px', right: '70px', left: 'unset', padding: 0 }}>
              {view === 'import_data' ? (
                <Button type="primary" onClick={handleBind}>
                  Start Import
                </Button>
              ) : (
                <Button type="primary" onClick={handleSubmit}>
                  Save
                </Button>
              )}
            </Toolbar>
            <Toolbar style={{ top: '12px', right: '24px', left: 'unset' }}>
              <RightButton />
            </Toolbar>
            <GraphCanvas />
          </ReactFlowProvider>
        </div>
        <div
          style={{
            width: right ? '0px' : '350px',
            padding: right ? '0px' : '12px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'width 0.2s ease',
          }}
        >
          <PropertiesEditor {...props} />
        </div>
      </div>
    </div>
  );
};

export default ImportApp;
