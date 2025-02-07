import React from 'react';
import { Flex, Col, Row, ColProps } from 'antd';

interface ISplitSectionProps {
  styles?: React.CSSProperties;
  leftSide?: React.ReactNode;
  rightSide?: React.ReactNode;
  children?: React.ReactNode;
  splitNumber?: number;
}

const getColProps = (size: number): Partial<ColProps> => ({
  xs: size,
  sm: size,
  lg: 12,
  xl: 12,
});
const SplitSection: React.FC<ISplitSectionProps> = ({ styles, leftSide, rightSide, children, splitNumber = 12 }) => {
  return (
    <Row style={styles} gutter={[24, 24]} justify="center" align="middle">
      {!!leftSide && <Col {...getColProps(splitNumber)}>{leftSide}</Col>}
      {!!rightSide && <Col {...getColProps(24 - splitNumber)}>{rightSide}</Col>}
      {!!children && (
        <Col span={24}>
          <Flex justify="center">{children}</Flex>
        </Col>
      )}
    </Row>
  );
};

export default SplitSection;
