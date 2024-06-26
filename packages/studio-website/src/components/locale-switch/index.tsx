import * as React from 'react';
import { Segmented } from 'antd';

export interface ILocaleSwitchProps {
  value: 'zh-CN' | 'en-US';
  onChange: (value: ILocaleSwitchProps['value']) => void;
}

const LocaleSwitch: React.FunctionComponent<ILocaleSwitchProps> = props => {
  const { value, onChange } = props;
  const options: { label: string; value: ILocaleSwitchProps['value'] }[] = [
    {
      label: 'English',
      value: 'en-US',
    },
    {
      label: '中文',
      value: 'zh-CN',
    },
  ];
  return (
    <>
      <Segmented
        options={options}
        value={value}
        //@ts-ignore
        onChange={onChange}
      />
    </>
  );
};

export default LocaleSwitch;
