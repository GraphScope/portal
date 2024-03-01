import * as React from 'react';
import { ColorPicker, Flex, Segmented, Image, Typography, Space, Divider } from 'antd';
import { useContext } from '@/layouts/useContext';
import Section from '@/components/section';
import LocaleSwitch from '@/components/locale-switch';
import InteractTheme from './interact-theme';
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
          <Flex justify="start">
            <Flex vertical>
              <Title level={3} style={{ margin: '0px 24px 0px 0px' }}>
                主题颜色：
              </Title>
              <Text>Set the theme color</Text>
            </Flex>
            <ColorPicker
              showText
              value={primaryColor}
              onChangeComplete={color => {
                updateStore(draft => {
                  draft.primaryColor = color.toHexString();
                });
              }}
            />
          </Flex>
          <Divider />
          <Flex justify="start">
            <Title level={3} style={{ margin: '0px' }}>
              国际化：
            </Title>
            <LocaleSwitch
              value={locale}
              onChange={value => {
                updateStore(draft => {
                  draft.locale = value;
                });
              }}
            ></LocaleSwitch>
          </Flex>
        </>
      </Section>
    </div>
  );
};

export default Setting;
