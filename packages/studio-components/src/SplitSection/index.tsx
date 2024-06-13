import React, { useEffect, useState } from 'react';
import { Modal, Result, Button, Col, Row, Flex, Divider } from 'antd';

interface ISplitSectionProps {
  splitText?: string;
  leftSide: React.ReactNode;
  rightSide: React.ReactNode;
}

const SplitSection: React.FunctionComponent<ISplitSectionProps> = props => {
  const { splitText = 'OR', leftSide, rightSide } = props;
  return (
    <Row>
      <Col span={11}>{leftSide}</Col>
      <Col span={2}>
        <Flex vertical style={{ height: '100%' }}>
          <Divider type="vertical" style={{ flex: 1 }} />
          {splitText}
          <Divider type="vertical" style={{ flex: 1 }} />
        </Flex>
      </Col>
      <Col span={11}>{rightSide}</Col>
    </Row>
  );
};

export default SplitSection;
