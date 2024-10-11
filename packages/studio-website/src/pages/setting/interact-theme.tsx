import * as React from 'react';
import SelectCards from '@/components/select-cards';
import { FormattedMessage } from 'react-intl';
import { useStudioProvier } from '@graphscope/studio-components';
import { ICard } from '@/components/select-cards';
import SettingParcel from '@/components/setting-parcel';

const engines: any = [
  {
    id: 'defaultAlgorithm',
    title: 'Light',
    avatar: 'https://gw.alipayobjects.com/zos/bmw-prod/ae669a89-0c65-46db-b14b-72d1c7dd46d6.svg',
    desc: <FormattedMessage id="Lighttime theme" />,
    primaryBGgColor: '#f5f7f9',
  },
  {
    id: 'darkAlgorithm',
    title: 'Dark',
    avatar: 'https://gw.alipayobjects.com/zos/bmw-prod/0f93c777-5320-446b-9bb7-4d4b499f346d.svg',
    desc: <FormattedMessage id="Nighttime theme" />,
    primaryBGgColor: '#000',
  },
];
const InteractTheme: React.FunctionComponent = () => {
  const { algorithm = 'defaultAlgorithm', handleThemeOrLocale } = useStudioProvier();
  const changeEngineType = (item: { id: string }) => {
    handleThemeOrLocale({
      algorithm: item.id as 'defaultAlgorithm' | 'darkAlgorithm',
    });
  };
  return (
    <SettingParcel style={{ margin: '0px' }} title="Select theme" text="Select or customize your UI theme">
      <SelectCards value={algorithm} items={engines} onChange={changeEngineType} />
    </SettingParcel>
  );
};

export default InteractTheme;
