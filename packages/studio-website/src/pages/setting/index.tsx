import * as React from 'react';
import { ColorPicker, Flex, Row, Col, Typography, Divider } from 'antd';
import { useContext } from '@/layouts/useContext';
import Section from '@/components/section';
import LocaleSwitch from '@/components/locale-switch';
import InteractTheme from './interact-theme';
import { FormattedMessage } from 'react-intl';
interface ISettingProps {}
const { Title, Text } = Typography;
const Setting: React.FunctionComponent<ISettingProps> = props => {
  const { store, updateStore } = useContext();
  const { primaryColor, locale } = store;
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
              <ColorPicker
                showText
                value={primaryColor}
                onChangeComplete={color => {
                  updateStore(draft => {
                    draft.primaryColor = color.toHexString();
                  });
                }}
              />
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
