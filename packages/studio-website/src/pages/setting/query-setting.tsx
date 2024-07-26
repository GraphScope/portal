import React from 'react';
import { Typography, Segmented, Divider } from 'antd';
import { useContext } from '@/layouts/useContext';
import { Utils } from '@graphscope/studio-components';
import SettingParcel from '@/components/setting-parcel';
interface ILocaleSwitchProps {
  value: string;
  onChange: (value: string) => void;
}

const { storage } = Utils;
const NavStyle: React.FunctionComponent = () => {
  const { store, updateStore } = useContext();
  const { displaySidebarPosition, displaySidebarType } = store;

  const onChangePosition = (value: 'right' | 'left') => {
    storage.set('displaySidebarPosition', value);
    updateStore(draft => {
      draft.displaySidebarPosition = value;
    });
  };
  const onChangeType = (value: 'Sidebar' | 'Segmented') => {
    storage.set('displaySidebarType', value);
    updateStore(draft => {
      draft.displaySidebarType = value;
    });
  };
  return (
    <>
      <SettingParcel title="Sidebar placement" text="Querying page sidebar placement">
        <Segmented
          options={[
            {
              label: 'left',
              value: 'left',
            },
            {
              label: 'right',
              value: 'right',
            },
          ]}
          value={displaySidebarPosition}
          //@ts-ignore
          onChange={onChangePosition}
        />
      </SettingParcel>
      <Divider />
      <SettingParcel title="Sidebar type" text="Querying page sidebar style">
        <Segmented
          options={[
            {
              label: 'Sidebar',
              value: 'Sidebar',
            },
            {
              label: 'Segmented',
              value: 'Segmented',
            },
          ]}
          value={displaySidebarType}
          //@ts-ignore
          onChange={onChangeType}
        />
      </SettingParcel>
    </>
  );
};

export default NavStyle;
