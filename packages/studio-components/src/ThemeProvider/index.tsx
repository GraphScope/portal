import React, { useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import { ContainerProvider } from './useThemeConfigProvider';
import type { ThemeProviderType } from './useThemeConfigProvider.tsx';

type IThemeProvider = {
  mode: string;
  children?: React.ReactNode;
};
const ThemeProvider: React.FC<IThemeProvider> = props => {
  const { mode, children } = props;
  const isLight = mode === 'defaultAlgorithm';
  const [state, setState] = useState<ThemeProviderType>({
    components: {},
    token: {},
  });
  const { components, token } = state;

  const handleTheme = (themeConfig: ThemeProviderType) => {
    const { components, token } = themeConfig;
    setState(preState => {
      return {
        ...preState,
        components,
        token,
      };
    });
  };

  return (
    <ContainerProvider value={{ ...state, handleTheme }}>
      <ConfigProvider
        theme={{
          // 1. 单独使用暗色算法
          algorithm: isLight ? theme.defaultAlgorithm : theme.darkAlgorithm,
          components: {
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
            ...components,
          },
          token: {
            colorBorder: isLight ? '#F0F0F0' : '#303030',
            colorBgBase: isLight ? '#fff' : 'rgba(12,12,12,1)',
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
