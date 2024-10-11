import type { MenuProps } from 'antd';
export const SLOTS: {
  [id: string]: any;
} = {
  SIDE_MEU: [],
};

export const registerSideMenuSlot = (slot: MenuProps['items']) => {
  SLOTS['SIDE_MEU'] = slot;
};
