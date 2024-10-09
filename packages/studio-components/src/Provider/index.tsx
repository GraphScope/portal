import React, { useEffect, useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import { IntlProvider } from 'react-intl';
import { ContainerProvider } from './useThemeConfigProvider';
import type { ThemeProviderType } from './useThemeConfigProvider';
import { storage } from '../Utils';
import { getThemeConfig } from './getThemeConfig';
import { useCustomToken } from './useCustomToken';

type IThemeProvider = {
  locales: {
    'zh-CN': Record<string, string>;
    'en-US': Record<string, string>;
  };
  children: React.ReactNode;
  locale?: 'zh-CN' | 'en-US';
  algorithm?: 'defaultAlgorithm' | 'darkAlgorithm';
};

const Provider: React.FC<IThemeProvider> = props => {
  const { children, locales } = props;
  const [state, setState] = useState<ThemeProviderType>(() => {
    let { algorithm, locale } = props;
    if (!locale) {
      locale = storage.get('locale');
      if (!locale) {
        locale = 'en-US';
        storage.set('locale', locale);
      }
    }
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

  const handleThemeOrLocale = (themeConfig: Partial<ThemeProviderType>) => {
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
        locale: themeConfig.locale ?? storage.get('locale'),
      };
    });
  };

  const messages = locales[locale || 'en-US'];

  return (
    <ContainerProvider
      value={{
        token: { ...tokenConfig, ...token },
        components: { ...componentsConfig, ...components },
        handleThemeOrLocale,
        algorithm,
        locale: locale,
        isLight,
        ...colorConfig,
      }}
    >
      <IntlProvider messages={messages} locale={locale as 'zh-CN' | 'en-US'}>
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
