import React from 'react';
import { Segmented } from 'antd';
import { useContext } from '../../layouts/useContext';
import localStorage from '../../components/utils/localStorage';
import SettingParcel from '../../components/setting-parcel';
import { FormattedMessage } from 'react-intl';

interface ILocaleSwitchProps {}
interface INavStyleOption {
  label: React.ReactNode;
  value: string;
}
const NavStyle: React.FunctionComponent = () => {
  const { store, updateStore } = useContext();
  const { navStyle } = store;
  const { setItem, getItem } = localStorage;
  const onChange = (value: string) => {
    setItem('navStyle', value);
    const navStyle = getItem('navStyle');
    updateStore(draft => {
      draft.navStyle = navStyle;
    });
  };

  const options: INavStyleOption[] = [
    {
      label: <FormattedMessage id="Inline" />,
      value: 'inline',
    },
    {
      label: <FormattedMessage id="Menu" />,
      value: 'menu',
    },
  ];
  return (
    <SettingParcel title="Navigation Style" text="Select navigation style">
      <Segmented options={options} value={navStyle} onChange={onChange} />
    </SettingParcel>
  );
};

export default NavStyle;
