import React, { useEffect, useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import { IntlProvider } from 'react-intl';
import { ContainerProvider } from './useThemeConfigProvider';
import type { ThemeProviderType } from './useThemeConfigProvider';
import { storage } from '../Utils';
import { useStore } from './useStore';

type IThemeProvider = Pick<ThemeProviderType, 'locale' | 'algorithm'> & {
  messages?: { [key: string]: string };
  children?: React.ReactNode;
};

const Provider: React.FC<IThemeProvider> = props => {
  const { algorithm: defaultMode, messages, children } = props;
  const [state, setState] = useState<ThemeProviderType>({
    components: storage.get('components'),
    token: storage.get('token'),
    algorithm: (storage.get('algorithm') as ThemeProviderType['algorithm']) || 'defaultAlgorithm',
    locale: storage.get('locale') as ThemeProviderType['locale'],
  });
  const { components, token, algorithm, locale } = state;
  const { componentsConfig, tokenConfig, colorConfig } = useStore(algorithm);
  useEffect(() => {
    if (defaultMode) {
      setState(preState => {
        return {
          ...preState,
          algorithm: defaultMode as ThemeProviderType['algorithm'],
        };
      });
    }
  }, [defaultMode]);

  const isLight = algorithm === 'defaultAlgorithm';

  const handleTheme = (themeConfig: ThemeProviderType) => {
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
        locale: themeConfig.locale,
      };
    });
  };
  const locales = locale ? locale : 'en-US';
  return (
    <ContainerProvider
      value={{
        token: { ...tokenConfig, ...token },
        components: { ...componentsConfig, ...components },
        handleTheme,
        algorithm,
        locale: locales,
        ...colorConfig,
      }}
    >
      <IntlProvider messages={messages} locale={locales}>
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
      </IntlProvider>
    </ContainerProvider>
  );
};

export default Provider;
