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

interface ImportAppProps {}

const ImportApp: React.FunctionComponent<ImportAppProps> = props => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Row gutter={[16, 16]} style={{ height: '100%' }}>
        <Col span={16}>
          <ReactFlowProvider>
            <Toolbar>
              <AddNode style={{}} />
              <ImportSchema />
              <ModeSwitch />
            </Toolbar>
            <GraphCanvas />
          </ReactFlowProvider>
        </Col>
        <Col span={8}>
          <PropertiesEditor />
        </Col>
      </Row>
    </div>
  );
};

export default ImportApp;
