import React, { useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import { ThemeProvider } from './useThemeConfigProvider';
import type { ThemeProviderType } from './useThemeConfigProvider';
import { storage } from '../Utils';
import { getThemeConfig } from './getThemeConfig';
import { useCustomToken } from './useCustomToken';

type IThemeProvider = {
  children: React.ReactNode;
  algorithm?: 'defaultAlgorithm' | 'darkAlgorithm';
};

const Provider: React.FC<IThemeProvider> = props => {
  const { children } = props;
  const [state, setState] = useState<ThemeProviderType>(() => {
    let { algorithm } = props;
    if (!algorithm) {
      algorithm = storage.get('algorithm');
      if (!algorithm) {
        algorithm = 'defaultAlgorithm';
        storage.set('algorithm', algorithm);
      }
    }
    return {
      components: storage.get('components'),
      token: storage.get('token'),
      algorithm,
      locale,
    };
  });

  const { components, token, algorithm, locale } = state;
  const { componentsConfig, tokenConfig } = getThemeConfig(algorithm);
  const colorConfig = useCustomToken();
  const isLight = algorithm === 'defaultAlgorithm';

  const handleTheme = (themeConfig: Partial<ThemeProviderType>) => {
    const { components, token } = themeConfig;
    Object.keys(themeConfig).forEach(key => {
      storage.set(key, themeConfig[key]);
    });

    setState(preState => {
      // 特殊化处理,切token数据需初始化数据做基础
      storage.set('token', { ...preState.token, ...token });
      return {
        ...preState,
        components: { ...preState.components, ...components },
        token: { ...preState.token, ...token },
        algorithm: themeConfig.algorithm || preState.algorithm,
        locale: themeConfig.locale ?? storage.get('locale'),
      };
    });
  };


  return (
    <ThemeProvider
      value={{
        token: { ...tokenConfig, ...token },
        components: { ...componentsConfig, ...components },
        handleTheme,
        algorithm,
        isLight,
        ...colorConfig,
      }}
    >
        <ConfigProvider
          theme={{
            // 1. 单独使用暗色算法
            algorithm: isLight ? theme.defaultAlgorithm : theme.darkAlgorithm,
            components: {
              ...componentsConfig,
              ...components,
            },
            token: {
              ...tokenConfig,
              ...token,
            },
          }}
        >
          {children}
        </ConfigProvider>
    </ThemeProvider>
  );
};

export default Provider;
