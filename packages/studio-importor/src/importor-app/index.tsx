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
      <ImportSchema style={{ position: 'absolute', right: '30px', top: '100px' }} />
      <ModeSwitch style={{ position: 'absolute', right: '230px', top: '100px' }} />
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <ReactFlowProvider>
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
