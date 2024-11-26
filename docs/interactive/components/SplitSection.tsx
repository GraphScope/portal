import React from 'react';
import { Col, Row, Flex } from 'antd';

interface ISplitSectionProps {
  leftSide?: React.ReactNode;
  rightSide?: React.ReactNode;
}

const SplitSection: React.FunctionComponent<ISplitSectionProps> = props => {
  const { leftSide, rightSide } = props;
  return (
    <Row style={{ width: '60%' }}>
      <Flex gap={48} align="center">
        <Col span={12}>{leftSide}</Col>
        <Col span={12}>{rightSide}</Col>
      </Flex>
    </Row>
  );
};

export default SplitSection;
