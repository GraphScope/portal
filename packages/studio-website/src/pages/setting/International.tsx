import React from 'react';
import { Col } from 'antd';
import { useContext } from '@/layouts/useContext';
import LocaleSwitch from '@/components/locale-switch';
import { useThemeContainer } from '@graphscope/studio-components';
import type { ILocaleSwitchProps } from '@/components/locale-switch';
import SettingParcel from '@/components/setting-parcel';

const International: React.FunctionComponent = () => {
  const { updateStore } = useContext();
  const { handleTheme, locale = 'zh-CN' } = useThemeContainer();
  const handleLocale = (value: ILocaleSwitchProps['value']) => {
    handleTheme({ locale: value });
    updateStore(draft => {
      draft.locale = value;
    });
  };
  return (
    <SettingParcel style={{ margin: '0px  24px 0px 0px' }} title="International" text="Select language">
      <LocaleSwitch value={locale} onChange={value => handleLocale(value)}></LocaleSwitch>
    </SettingParcel>
  );
};

export default International;
