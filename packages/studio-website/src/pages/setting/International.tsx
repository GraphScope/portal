import React from 'react';
import { useContext } from '@/layouts/useContext';
import LocaleSwitch from '@/components/locale-switch';
import { useStudioProvier } from '@graphscope/studio-components';
import type { ILocaleSwitchProps } from '@/components/locale-switch';
import SettingParcel from '@/components/setting-parcel';

const International: React.FunctionComponent = () => {
  const { store, updateStore } = useContext();
  const { locale = 'zh-CN' } = store;
  const { handleThemeOrLocale } = useStudioProvier();

  const handleLocales = (value: ILocaleSwitchProps['value']) => {
    handleThemeOrLocale({ locale: value });
    updateStore(draft => {
      draft.locale = value;
    });
  };
  return (
    <SettingParcel title="International" text="Select language">
      <LocaleSwitch value={locale} onChange={value => handleLocales(value)}></LocaleSwitch>
    </SettingParcel>
  );
};

export default International;
