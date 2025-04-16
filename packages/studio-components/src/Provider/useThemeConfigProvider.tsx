import { createContext, useContext } from 'react';
import type { IColorStore } from './getThemeConfig';

export interface ThemeProviderType extends IColorStore {
  algorithm?: 'defaultAlgorithm' | 'darkAlgorithm';
  components?: { [key: string]: { [key: string]: string | number } };
  token?: { [key: string]: string | number };
  locale?: 'zh-CN' | 'en-US';
  isLight?: boolean;
}

export interface IContainerContext extends ThemeProviderType {
  updateStudio: (value: ThemeProviderType) => void;
}

export const ContainerContext = createContext<IContainerContext>({
  components: {},
  token: {},
  updateStudio: ({}) => {},
  locale: 'en-US',
  algorithm: 'defaultAlgorithm',
  isLight: false,
});

export const ContainerProvider = ContainerContext.Provider;

/**
 * 主题配置 Hook
 *
 * 用于获取和更新主题配置
 * 必须在 ContainerProvider 内部使用
 */
export const useStudioProvider = () => {
  const context = useContext(ContainerContext);

  if (context === undefined || Object.keys(context).length === 0) {
    throw new Error(`useContext must be used within a ContainerProvider`);
  }
  return context;
};

// 为了向后兼容，保留旧的拼写错误
export const useStudioProvier = useStudioProvider;
