import * as React from 'react';
import { ColorPicker, Flex, Row, Col, Typography, Divider, InputNumber, Slider } from 'antd';
import { useContext } from '@/layouts/useContext';
import Section from '@/components/section';
import LocaleSwitch from '@/components/locale-switch';
import InteractTheme from './interact-theme';
import { FormattedMessage } from 'react-intl';
import SelectColor from './select-color';
interface ISettingProps {}
const { Title, Text } = Typography;
const Setting: React.FunctionComponent<ISettingProps> = props => {
  const { store, updateStore } = useContext();
  const { primaryColor, locale, inputNumber } = store;
  const handleChange = val => {
    console.log(val);

    updateStore(draft => {
      draft.inputNumber = val;
    });
  };
  return (
    <div>
      <Section
        breadcrumb={[
          {
            title: 'Home',
          },
          {
            title: 'Setting',
          },
        ]}
        title="Appearance Setting"
        desc="Change how Untitled UI looks and feels in your browser"
      >
        <>
          <InteractTheme />
          <Divider />
          <Row>
            <Col span={8}>
              <Flex vertical>
                <Title level={3} style={{ margin: '0px 24px 0px 0px' }}>
                  <FormattedMessage id="Theme color" />
                </Title>
                <Text>
                  <FormattedMessage id="Set the theme color" />
                </Text>
              </Flex>
            </Col>
            <Col span={16}>
              <Flex align="center">
                <ColorPicker
                  showText
                  value={primaryColor}
                  onChangeComplete={color => {
                    updateStore(draft => {
                      draft.primaryColor = color.toHexString();
                    });
                  }}
                />
                <SelectColor color={primaryColor} />
              </Flex>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col span={8}>
              <Flex vertical>
                <Title level={3}>
                  <FormattedMessage id="Rounded corners" />
                </Title>
                <Text>
                  <FormattedMessage id="Corner radians" />
                </Text>
              </Flex>
            </Col>
            <Col span={16}>
              <Row>
                <Col span={4}>
                  <InputNumber min={1} addonAfter="px" value={inputNumber} onChange={handleChange} />
                </Col>
                <Col span={12}>
                  <Slider min={1} onChange={handleChange} value={typeof inputNumber === 'number' ? inputNumber : 0} />
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col span={8}>
              <Flex vertical>
                <Title level={3} style={{ margin: '0px  24px 0px 0px' }}>
                  <FormattedMessage id="International" />
                </Title>
                <Text>
                  <FormattedMessage id="Select national language" />
                </Text>
              </Flex>
            </Col>
            <Col span={8}>
              <LocaleSwitch
                value={locale}
                onChange={value => {
                  updateStore(draft => {
                    draft.locale = value;
                  });
                }}
              ></LocaleSwitch>
            </Col>
          </Row>
        </>
      </Section>
    </div>
  );
};

export default Setting;
