import * as React from 'react';
import { ColorPicker } from 'antd';
import { useContext } from '@/layouts/useContext';
import Section from '@/components/section';
import LocaleSwitch from '@/components/locale-switch';
interface ISettingProps {}

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
        title="navbar.setting"
        desc="Listing all setting on the website"
      >
        WIP
        <div>
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
        <LocaleSwitch
          value={locale}
          onChange={value => {
            updateStore(draft => {
              draft.locale = value;
            });
          }}
        ></LocaleSwitch>
      </Section>
    </div>
  );
};

export default Setting;
