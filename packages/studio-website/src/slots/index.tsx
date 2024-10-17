import React from 'react';
import type { MenuProps } from 'antd';

export const SLOTS: {
  /** 侧边栏 */
  SIDE_MEU: MenuProps['items'];
  /** 查询模块的头部 */
  QUERY_HEADER: string;
  /** 导入模块的配置 */
  IMPORT_CONFIG: React.ReactNode;
} = {
  SIDE_MEU: [],
  QUERY_HEADER: '',
  IMPORT_CONFIG: <></>,
};

export const registerSideMenuSlot = (slot: MenuProps['items']) => {
  SLOTS['SIDE_MEU'] = slot;
};
