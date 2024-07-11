import React, { useEffect, useState } from 'react';
import { Modal, Result, Button, Col, Row, Flex, Divider } from 'antd';

interface ISplitSectionProps {
  splitText?: string;
  span?: number;
  splitDivider?: number;
  leftSide: React.ReactNode;
  rightSide?: React.ReactNode;
}

const SplitSection: React.FunctionComponent<ISplitSectionProps> = props => {
  const { splitText = 'OR', span = 11, splitDivider = 2, leftSide, rightSide } = props;
  if (!rightSide) {
    return <>{leftSide}</>;
  }
  return (
    <Row>
      <Col span={span}>{leftSide}</Col>
      <Col span={splitDivider}>
        <Flex vertical style={{ height: '100%', alignItems: 'center' }}>
          <Divider type="vertical" style={{ flex: 1 }} />
          {splitText}
          <Divider type="vertical" style={{ flex: 1 }} />
        </Flex>
      </Col>
      <Col span={24 - span - splitDivider}>{rightSide}</Col>
    </Row>
  );
};

export default SplitSection;
