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
import { useColSpan } from './useContext';
import LeftButton from './layout-controller/left-button';
interface ImportAppProps {}

const ImportApp: React.FunctionComponent<ImportAppProps> = props => {
  const [left, main, right] = useColSpan();
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Row gutter={[16, 16]} style={{ height: '100%' }}>
        <Col span={left}>
          <ImportSchema />
        </Col>
        <Col span={main}>
          <ReactFlowProvider>
            <Toolbar>
              <LeftButton />
              <AddNode style={{}} />
              <ImportSchema displayType="model" />
              <ModeSwitch />
            </Toolbar>
            <GraphCanvas />
          </ReactFlowProvider>
        </Col>
        <Col span={right}>
          <PropertiesEditor />
        </Col>
      </Row>
    </div>
  );
};

export default ImportApp;
