import * as React from 'react';
import { Segmented } from 'antd';

interface ILocaleSwitchProps {
  value: string;
  onChange: (value: string) => void;
}

const LocaleSwitch: React.FunctionComponent<ILocaleSwitchProps> = props => {
  const { value, onChange } = props;
  const options = [
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
