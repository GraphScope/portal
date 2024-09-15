import { create } from 'zustand';
import { Properties } from '../types/property';

interface PropertiesStore {
  properties: Properties[];
  updateProperties: (properties: Properties[]) => void;
  clearProperties: () => void;
}

export const usePropertiesStore = create<PropertiesStore>()(set => ({
  properties: [],

  // 对相同的 belongId 进行一次去重
  updateProperties: (properties: Properties[]) =>
    set(state => {
      return {
        properties: [...new Map([...state.properties, ...properties].map(item => [item.belongId, item])).values()],
      };
    }),

  // 清空所有属性
  clearProperties: () => set({ properties: [] }),
}));
