import React from 'react';
import { Typography, Flex, Row, Col } from 'antd';
import { GenAI } from '../Icons';
import SplitSection from '../SplitSection';
import StyledButton from './StyledButton';
import CodeMirror from './Codemirror';

const { Title, Text, Link } = Typography;

const Realize: React.FC = () => {
  return (
    <Row gutter={48} align="middle" style={{ padding: '3% 17%' }}>
      <Col xs={0} sm={0} md={14} lg={14} xl={14}>
        <CodeMirror />
      </Col>
      <Col xs={24} sm={24} md={10} lg={10} xl={10}>
        <Flex vertical gap={24}>
          <Title level={3}>Running GraphScope Interactive Engine on Local</Title>
          <Text type="secondary">
            It’s fairly straightforward to run interactive queries using the graphscope package on your local machine.
            First of all, you import graphscope in a Python session, and load the modern graph, which has been widely
            used in &nbsp;
            <Link href="https://tinkerpop.apache.org/docs/3.6.2/tutorials/getting-started/" target="_blank">
              Tinkerpop
            </Link>
            &nbsp; demos.
          </Text>
          {/* <Flex>
            <StyledButton url="https://tinkerpop.apache.org/docs/3.6.2/tutorials/getting-started/">
              Learn more
            </StyledButton>
          </Flex> */}
        </Flex>
      </Col>
    </Row>
  );
};

export default Realize;
