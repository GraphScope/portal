import React from 'react';
import { ColorPicker, Flex, Row, Col, Typography, theme } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useContext } from '@/layouts/useContext';
import SelectColor from './select-color';
const { useToken } = theme;
import { useThemeContainer } from '@graphscope/studio-components';

const { Title, Text } = Typography;

const PrimaryColor: React.FunctionComponent = () => {
  const { handleTheme } = useThemeContainer();
  const { token } = useToken();
  const { colorPrimary } = token;
  console.log(theme);

  return (
    <Row>
      <Col span={8}>
        <Flex vertical>
          <Title level={3} style={{ margin: '0px 24px 0px 0px' }}>
            <FormattedMessage id="Primary color" />
          </Title>
          <Text>
            <FormattedMessage id="Set the primary color" />
          </Text>
        </Flex>
      </Col>
      <Col span={16}>
        <Flex align="center">
          <ColorPicker
            showText
            value={colorPrimary}
            onChangeComplete={color => {
              handleTheme({ token: { colorPrimary: color.toHexString() } });
            }}
          />
          <SelectColor value={colorPrimary} />
        </Flex>
      </Col>
    </Row>
  );
};

export default PrimaryColor;
