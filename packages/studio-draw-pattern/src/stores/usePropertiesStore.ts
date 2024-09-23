import { create } from 'zustand';
import { PropertySet } from '../types/property';

interface PropertiesStore {
  properties: PropertySet[];
  updateProperties: (properties: PropertySet[]) => void;
  clearProperties: () => void;
  editProperties: (property: PropertySet) => void;
}

export const usePropertiesStore = create<PropertiesStore>()(set => ({
  properties: [],

  // 对相同的 belongId 进行一次去重
  updateProperties: (properties: PropertySet[]) =>
    set(state => {
      return {
        properties: [...new Map([...state.properties, ...properties].map(item => [item.belongId, item])).values()],
      };
    }),

  // 清空所有属性
  clearProperties: () => set({ properties: [] }),

  // 编辑属性
  editProperties: (property: PropertySet) =>
    set(state => {
      const existingProperty = state.properties.find(item => item.belongId === property.belongId);

      if (existingProperty) {
        // If the property exists, update it
        return {
          properties: state.properties.map(item =>
            item.belongId === property.belongId ? { ...item, ...property } : item,
          ),
        };
      } else {
        // If the property doesn't exist, add it
        return {
          properties: [...state.properties, property],
        };
      }
    }),
}));
