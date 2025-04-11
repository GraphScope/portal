import React from 'react';
import { Segmented } from 'antd';

export type LocaleType = 'zh-CN' | 'en-US';

export interface LocaleSwitchProps {
  value: LocaleType;
  onChange: (value: LocaleType) => void;
}

// 预定义的语言选项
const options: { label: string; value: LocaleType }[] = [
  { label: 'English', value: 'en-US' },
  { label: '中文', value: 'zh-CN' },
];

/**
 * 语言切换组件
 */
const LocaleSwitch: React.FC<LocaleSwitchProps> = ({ value, onChange }) => {
  return <Segmented options={options} value={value} onChange={v => onChange(v as LocaleType)} />;
};

export default LocaleSwitch;
