import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import type { ThemeConfig } from 'antd';
import { ThemeStyle, ThemeMode, THEME_STYLE_KEY, THEME_MODE_KEY } from './constants';
import { getShadcnTokens, getAntdTokens } from './tokens';
import { getComponentsConfig } from './components';
import { useDynamicStyle } from '../../hooks/useDynamicStyle';
import { shadcnStyles } from '../../styles/shadcnStyles';

// 主题上下文类型
interface ThemeContextType {
  themeStyle: ThemeStyle;
  themeMode: ThemeMode;
  setThemeStyle: (style: ThemeStyle) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

// 创建上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * 主题提供者组件
 * 管理主题状态并提供主题上下文
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 从本地存储中获取存储的主题，或使用默认值
  const [themeStyle, setThemeStyleState] = useState<ThemeStyle>(
    () => (localStorage.getItem(THEME_STYLE_KEY) as ThemeStyle) || 'shadcn',
  );
  const [themeMode, setThemeModeState] = useState<ThemeMode>(
    () => (localStorage.getItem(THEME_MODE_KEY) as ThemeMode) || 'light',
  );

  // 更新主题并保存到本地存储
  const setThemeStyle = (style: ThemeStyle) => {
    setThemeStyleState(style);
    localStorage.setItem(THEME_STYLE_KEY, style);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem(THEME_MODE_KEY, mode);
  };

  // 判断是否为深色模式和shadcn风格
  const isDarkMode = themeMode === 'dark';
  const isShadcn = themeStyle === 'shadcn';

  // 仅在使用shadcn风格时应用样式
  useDynamicStyle(isShadcn ? shadcnStyles : '', 'shadcn-override-styles');

  // 添加或移除dark类和shadcn-theme类用于CSS选择器
  useEffect(() => {
    // 管理深色模式类
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 管理shadcn主题类
    if (isShadcn) {
      document.documentElement.classList.add('shadcn-theme');
    } else {
      document.documentElement.classList.remove('shadcn-theme');
    }
  }, [isDarkMode, isShadcn]);

  // 根据当前风格选择合适的token
  const styleTokens = isShadcn ? getShadcnTokens(isDarkMode) : getAntdTokens(isDarkMode);

  // 获取组件级配置 - 仅在shadcn风格下应用额外配置
  const componentsConfig = isShadcn ? getComponentsConfig(themeStyle) : {};

  // 主题配置
  const themeConfig: ThemeConfig = {
    // 使用默认算法或暗色算法
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    // 应用风格特定的token
    token: styleTokens,
    // 组件级别的样式定制
    components: componentsConfig,
  };

  return (
    <ThemeContext.Provider value={{ themeStyle, themeMode, setThemeStyle, setThemeMode }}>
      <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
};

/**
 * 使用主题的自定义钩子
 * @returns 主题上下文
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme 必须在 ThemeProvider 内使用');
  }
  return context;
};
