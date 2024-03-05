import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useContext } from '@/layouts/useContext';
import { Flex, Row, Col, InputNumber, Slider, Typography } from 'antd';
const { Title, Text } = Typography;
type IRoundedCornerProps = {};
const RoundedCorner: React.FunctionComponent<IRoundedCornerProps> = props => {
  const { store, updateStore } = useContext();
  const { inputNumber } = store;
  const handleChange: (val: number) => void = val => {
    updateStore(draft => {
      draft.inputNumber = val;
    });
  };
  return (
    <Row>
      <Col span={8}>
        <Flex vertical>
          <Title level={3} style={{ margin: '0px' }}>
            <FormattedMessage id="Rounded corners" />
          </Title>
          <Text>
            <FormattedMessage id="Corner radians" />
          </Text>
        </Flex>
      </Col>
      <Col span={4}>
        <InputNumber min={1} addonAfter="px" value={inputNumber} onChange={handleChange} />
      </Col>
      <Col span={8}>
        <Slider min={1} onChange={handleChange} value={typeof inputNumber === 'number' ? inputNumber : 0} />
      </Col>
    </Row>
  );
};

export default RoundedCorner;
