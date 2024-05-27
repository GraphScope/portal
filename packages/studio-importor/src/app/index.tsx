import React, { useEffect } from 'react';

import { Col, Row } from 'antd';
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
interface ImportAppProps {}
import { useStore } from './useContext';

const ImportApp: React.FunctionComponent<ImportAppProps> = props => {
  const { collapsed } = useStore();
  const { left, right } = collapsed;
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
          <PropertiesEditor />
        </div>
      </div>
    </div>
  );
};

export default ImportApp;
