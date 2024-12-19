import * as React from 'react';
import { Segmented } from 'antd';
import { FormattedMessage } from 'react-intl';
// Define the props interface for LocaleSwitch
export interface ILocaleSwitchProps {
  value: 'zh-CN' | 'en-US';
  onChange: (value: ILocaleSwitchProps['value']) => void;
}

// Predefined options for the language switcher
const options: { label: string; value: ILocaleSwitchProps['value'] }[] = [
  { label: 'English', value: 'en-US' },
  { label: '中文', value: 'zh-CN' },
];

/**
 * LocaleSwitch provides a segmented control to switch between different locales.
 */
const LocaleSwitch: React.FC<ILocaleSwitchProps> = ({ value, onChange }) => {
  return <Segmented options={options} value={value} onChange={onChange} />;
};

export default LocaleSwitch;
