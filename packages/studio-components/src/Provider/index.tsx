import React, { useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import { ContainerProvider } from './useThemeConfigProvider';
import type { ThemeProviderType } from './useThemeConfigProvider';
import { storage } from '../Utils';
import { getThemeConfig } from './getThemeConfig';

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
    };
  });

  const { components, token, algorithm } = state;
  const { componentsConfig, tokenConfig } = getThemeConfig(algorithm);

  const isLight = algorithm === 'defaultAlgorithm';

  const handleTheme = (themeConfig: Partial<ThemeProviderType>) => {
    const { components, token } = themeConfig;
    Object.keys(themeConfig).forEach(key => {
      storage.set(key, themeConfig[key]);
    });

    setState(preState => {
      return {
        ...preState,
        components: { ...preState.components, ...components },
        token: { ...preState.token, ...token },
        algorithm: themeConfig.algorithm || preState.algorithm,
      };
    });
  };

  return (
    <ContainerProvider
      value={{
        token: { ...tokenConfig, ...token },
        handleTheme,
        algorithm,
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
    </ContainerProvider>
  );
};

export default Provider;
