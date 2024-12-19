import React from 'react';
import type { MenuProps } from 'antd';
// import { SIDE_MENU } from '../layouts/const';
// import { ROUTES } from '../pages/index';
export const SLOTS: {
  /** 侧边栏 */
  SIDE_MEU: { [id: string]: MenuProps['items'] };
  /** 路由 */
  ROUTES: {
    [id: string]: any[];
  };
} = {
  SIDE_MEU: {
    studio: [],
  },
  ROUTES: {
    studio: [],
  },
};

export type SlotType = 'SIDE_MEU' | 'ROUTES';
export const installSlot = (slotType: SlotType, appId: string, slot: any) => {
  SLOTS[slotType] = {
    ...SLOTS[slotType],
    [appId]: slot,
  };
  console.log('SLOTS', SLOTS);
};
export const unInstallSlot = (slotType: SlotType, appId: string) => {
  delete SLOTS[slotType][appId];
};

export const getSlots = (slotType: SlotType) => {
  const slots = SLOTS[slotType];
  //@ts-ignore
  return Object.keys(slots).reduce((acc, appId) => {
    //@ts-ignore
    return [...acc, ...slots[appId]];
  }, []);
};
export const registerSideMenuSlot = (appId: string, slot: MenuProps['items']) => {
  SLOTS['SIDE_MEU'] = {
    ...SLOTS['SIDE_MEU'],
    [appId]: slot,
  };
};

export const registerRoutesSlot = (appId: string, slot: any) => {
  SLOTS['ROUTES'] = {
    ...SLOTS['ROUTES'],
    [appId]: slot,
  };
};
