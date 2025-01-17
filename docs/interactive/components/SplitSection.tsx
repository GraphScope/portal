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
    <>
      <Row style={{ padding: '2% 17%', ...styles }}>
        <Flex vertical gap={24}>
          <Flex align="center" gap={60}>
            <Col xs={splitNumber} sm={splitNumber} lg={splitNumber} xl={12}>
              {leftSide}
            </Col>
            <Col xs={24 - splitNumber} sm={24 - splitNumber} lg={24 - splitNumber} xl={12}>
              {rightSide}
            </Col>
          </Flex>
          <Col xs={24} sm={24} lg={24} xl={24}>
            <Flex justify="center">{children && children}</Flex>
          </Col>
        </Flex>
      </Row>
    </>
  );
};

export default SplitSection;
