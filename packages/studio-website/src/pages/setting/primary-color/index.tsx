import React from 'react';
import { ColorPicker, Flex, Row, Col, Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useContext } from '@/layouts/useContext';
import SelectColor from './select-color';
import localStorage from '@/components/utils/localStorage';
import { useThemeContainer } from '@graphscope/studio-components';

const { Title, Text } = Typography;
// type IPrimaryColorProps = {};
const PrimaryColor: React.FunctionComponent = () => {
  const { store, updateStore } = useContext();
  const { primaryColor } = store;
  const { handleTheme } = useThemeContainer();
  const { getItem } = localStorage;
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
            value={primaryColor}
            onChangeComplete={color => {
              const corner = getItem('corner');
              handleTheme({ token: { colorPrimary: color.toHexString(), borderRadius: corner } });
              updateStore(draft => {
                draft.primaryColor = color.toHexString();
              });
            }}
          />
          <SelectColor color={primaryColor} />
        </Flex>
      </Col>
    </Row>
  );
};

export default PrimaryColor;
