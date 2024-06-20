import React, { useEffect, useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import { ContainerProvider } from './useThemeConfigProvider';
import type { ThemeProviderType } from './useThemeConfigProvider';
import { storage } from '../Utils';

type IThemeProvider = {
  algorithm: string;
  children?: React.ReactNode;
};

const ThemeProvider: React.FC<IThemeProvider> = props => {
  const { algorithm: defaultMode, children } = props;

  const [state, setState] = useState<ThemeProviderType>({
    components: storage.get('components'),
    token: storage.get('token'),
    algorithm: storage.get('algorithm') || 'defaultAlgorithm',
  });
  useEffect(() => {
    setState(preState => {
      return {
        ...preState,
        algorithm: defaultMode as ThemeProviderType['algorithm'],
      };
    });
  }, [defaultMode]);

  const { components, token, algorithm } = state;

  const isLight = algorithm === 'defaultAlgorithm';

  /** token 基础配置 */
  const tokenConfig = {
    colorBorder: isLight ? '#F0F0F0' : '#303030',
    colorBgBase: isLight ? '#fff' : 'rgba(12,12,12,1)',
    colorBgLayout: isLight ? '#f5f7f9' : 'rgba(43,43,43,1)',
  };
  /** components 基础配置 */
  const componentsConfig = {
    Menu: {
      itemBg: 'rgba(255, 255, 255, 0)',
      subMenuItemBg: 'rgba(255, 255, 255, 0)',
      iconMarginInlineEnd: 14,
      itemMarginInline: 4,
      iconSize: 14,
      collapsedWidth: 60,
    },
    Typography: {
      titleMarginBottom: '0.2em',
      titleMarginTop: '0.8em',
    },
    Table: {
      cellPaddingBlock: 4, //	单元格纵向内间距
      cellPaddingInline: 8, //单元格横向内间距（默认大尺寸）
    },
    Pagination: {
      itemSize: 20,
    },
    Result: {
      iconFontSize: 62,
      titleFontSize: 20,
      colorError: '#00000073',
    },
  };

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
      };
    });
  };

  return (
    <ContainerProvider
      value={{
        token: { ...tokenConfig, ...token },
        components: { ...componentsConfig, ...components },
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

export default ThemeProvider;
