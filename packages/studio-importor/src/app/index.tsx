import React, { useEffect } from 'react';

import { Flex, Col, Row } from 'antd';
import GraphEditor from './graph-editor';
import PropertiesEditor from './properties-editor';
import ImportSchema from './import-schema';
import ModeSwitch from './mode-switch';
import { ReactFlowProvider } from 'reactflow';

import 'reactflow/dist/style.css';

interface ImportAppProps {}

const ImportApp: React.FunctionComponent<ImportAppProps> = props => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Row gutter={[16, 16]} style={{ height: '100%' }}>
        <Col span={16}>
          <ReactFlowProvider>
            <ImportSchema style={{ position: 'absolute', left: '0px', top: '40px', zIndex: 999 }} />
            <ModeSwitch style={{ position: 'absolute', left: '0px', top: '100px', zIndex: 999 }} />
            <GraphEditor></GraphEditor>
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