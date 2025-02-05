import React from 'react';
import { Col, Row, Flex } from 'antd';

interface ISplitSectionProps {
  styles?: React.CSSProperties;
  leftSide?: React.ReactNode;
  rightSide?: React.ReactNode;
  children?: React.ReactNode;
  splitNumber?: number;
}

const SplitSection: React.FunctionComponent<ISplitSectionProps> = props => {
  const { styles, leftSide, rightSide, children, splitNumber = 0 } = props;
  return (
    <Row style={{ ...styles }} gutter={[0, 24]}>
      <Flex align="center">
        <Col xs={splitNumber} sm={splitNumber} lg={12} xl={12}>
          {leftSide}
        </Col>
        <Col xs={24 - splitNumber} sm={24 - splitNumber} lg={12} xl={12}>
          {rightSide}
        </Col>
      </Flex>
      <Col xs={24} sm={24} lg={24} xl={24}>
        <Flex justify="center">{children && children}</Flex>
      </Col>
    </Row>
  );
};

export default SplitSection;
