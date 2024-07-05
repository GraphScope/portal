import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Flex, Row, Col, InputNumber, Slider, Typography, theme } from 'antd';
import { useThemeContainer } from '@graphscope/studio-components';
const { Title, Text } = Typography;
// type IRoundedCornerProps = {};
const { useToken } = theme;
const RoundedCorner: React.FunctionComponent = () => {
  const { token } = useToken();
  const { borderRadius } = token;
  const { handleTheme } = useThemeContainer();

  const handleBorderRadiusChange: (newBorderRadius: number | null) => void = newBorderRadius => {
    handleTheme({ token: { ...token, borderRadius: newBorderRadius } });
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
        <InputNumber min={1} addonAfter="px" value={borderRadius} onChange={handleBorderRadiusChange} />
      </Col>
      <Col span={8}>
        <Slider
          min={1}
          onChange={handleBorderRadiusChange}
          value={typeof borderRadius === 'number' ? borderRadius : 0}
        />
      </Col>
    </Row>
  );
};

export default RoundedCorner;
