import * as React from 'react';
import { ColorPicker, Flex, Segmented, Image, Typography, Space, Divider } from 'antd';
import { useContext } from '@/layouts/useContext';
import Section from '@/components/section';
import LocaleSwitch from '@/components/locale-switch';
import dark from './img/dark.jpg';
interface ISettingProps {}
const { Text } = Typography;
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
        <Flex vertical gap="middle">
          <div>
            Interact theme
            <Segmented<string>
              options={[
                { label: 'System preference', value: 'system preference' },
                { label: 'Light', value: 'defaultAlgorithm' },
                { label: 'Dark', value: 'darkAlgorithm' },
              ]}
              onChange={value => {
                updateStore(draft => {
                  draft.mode = value;
                });
              }}
            />
            <Flex gap="small" justify="space-between">
              <Text> Interact theme</Text>
              <Space>
                <Flex vertical gap="small">
                  <Image width={200} src={dark} preview={false} />
                  <Text>System preference</Text>
                </Flex>
                <Flex vertical gap="small">
                  <Image width={200} src={dark} preview={false} />
                  <Text>Light</Text>
                </Flex>
                <Flex vertical gap="small">
                  <Image width={200} src={dark} preview={false} />
                  <Text>Dark</Text>
                </Flex>
              </Space>
            </Flex>
          </div>
          <Divider />
          <div>
            <Text>主题颜色：</Text>
            <ColorPicker
              showText
              value={primaryColor}
              onChangeComplete={color => {
                updateStore(draft => {
                  draft.primaryColor = color.toHexString();
                });
              }}
            />
          </div>
          <Divider />
          <div>
            <Text>国际化：</Text>
            <LocaleSwitch
              value={locale}
              onChange={value => {
                updateStore(draft => {
                  draft.locale = value;
                });
              }}
            ></LocaleSwitch>
          </div>
        </Flex>
      </Section>
    </div>
  );
};

export default Setting;
