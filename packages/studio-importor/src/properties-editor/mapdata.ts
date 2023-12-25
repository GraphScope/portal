import { createFromIconfontCN } from '@ant-design/icons';
export enum EditType {
    SWITCH = 'SWITCH',
    INPUT = 'INPUT',
    RADIO = 'RADIO',
    CASCADER = 'CASCADER',
    SELECT = 'SELECT',
    JSON = 'JSON',
    SQL = 'SQL',
    DATE_PICKER = 'DATE_PICKER',
    CUSTOM = 'CUSTOM',
    NULL = 'NULL',
  }

// 自定义字体图标
export const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/a/font_4377140_eryoeoa0lk5.js',
  });