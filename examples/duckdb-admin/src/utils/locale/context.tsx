import React, { createContext, useContext, useState, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import locales from '../../locales';
import { LocaleType } from '../../components/LocaleSwitch';

// 本地存储键
const LOCALE_KEY = 'duckdb-admin-locale';

// 上下文类型
interface LocaleContextType {
  locale: LocaleType;
  setLocale: (locale: LocaleType) => void;
}

// 创建上下文
const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

/**
 * 语言提供者组件
 */
export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 从本地存储获取语言设置，默认为英文
  const [locale, setLocaleState] = useState<LocaleType>(
    () => (localStorage.getItem(LOCALE_KEY) as LocaleType) || 'en-US',
  );

  // 更新语言并保存到本地存储
  const setLocale = (newLocale: LocaleType) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_KEY, newLocale);
  };

  // 获取当前语言的消息
  const messages = locales[locale];

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <IntlProvider messages={messages} locale={locale} defaultLocale="en-US">
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
};

/**
 * 使用语言的自定义钩子
 */
export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale 必须在 LocaleProvider 内使用');
  }
  return context;
};
