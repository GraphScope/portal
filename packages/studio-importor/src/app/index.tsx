import React, { useEffect } from 'react';
import GraphCanvas from './graph-canvas';
import PropertiesEditor from './properties-editor';
import ImportSchema from './import-schema';
import ModeSwitch from './mode-switch';
import { ReactFlowProvider } from 'reactflow';
import { Toolbar } from '@graphscope/studio-components';
import AddNode from './graph-canvas/add-node';
import Delete from './graph-canvas/delete';
import 'reactflow/dist/style.css';
import RightButton from './layout-controller/right-button';
import LeftButton from './layout-controller/left-button';
interface ImportAppProps {
  appMode: 'DATA_MODELING' | 'DATA_IMPORTING';
  handleUploadFile: (file: File) => Promise<string>;
  handleModeling: (graphId: string, params: any) => void;
  handleImporting: (graphId: string, params: any) => void;
}
import { useStore, useContext } from './useContext';
import { Button } from 'antd';

const ImportApp: React.FunctionComponent<ImportAppProps> = props => {
  const { appMode, handleImporting, handleModeling } = props;
  const { collapsed } = useStore();
  const { left, right } = collapsed;
  const { store } = useContext();
  const { nodes, edges } = store;
  const _handleModeling = () => {
    /** 创建服务 「props.createGraph(params)」*/
    console.log('edges', edges);
    console.log('nodes', nodes);
    if (handleModeling) {
      handleModeling('2', { graphName: 'test', nodes, edges });
    }
  };
  /** 数据绑定 */
  const _handleImporting = () => {
    const dataMap = [...nodes, ...edges];
    console.log(dataMap);
    if (handleImporting) {
      handleImporting('1', dataMap);
    }
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
              <Delete />
              {/* <ModeSwitch /> */}
            </Toolbar>
            <Toolbar style={{ top: '18px', right: '70px', left: 'unset', padding: 0 }}>
              {appMode === 'DATA_IMPORTING' ? (
                <Button type="primary" onClick={_handleImporting}>
                  Start Importing
                </Button>
              ) : (
                <Button type="primary" onClick={_handleModeling}>
                  Save Modeling
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
