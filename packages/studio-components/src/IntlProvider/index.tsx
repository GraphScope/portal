import React, { useState } from 'react';
import { IntlProvider } from 'react-intl';
import { storage } from '../Utils';
import { IntlContainerProvider } from './useIntlConfigProvider';

type IThemeProvider = {
  locales: {
    'zh-CN': Record<string, string>;
    'en-US': Record<string, string>;
  };
  children: React.ReactNode;
  locale?: 'zh-CN' | 'en-US';
};

const Provider: React.FC<IThemeProvider> = props => {
  const { children, locales } = props;
  const [state, setState] = useState<{ locale?: 'zh-CN' | 'en-US' }>(() => {
    let { locale = storage.get('locale') } = props;
    if (!locale) {
      locale = 'en-US';
    }
    storage.set('locale', locale);
    return {
      locale,
    };
  });

  const { locale } = state;

  const messages = locales[locale || 'en-US'];

  const handleLocale = themeConfig => {
    const { locale } = themeConfig;
    storage.set('locale', locale);
    setState(preState => {
      return {
        ...preState,
        locale,
      };
    });
  };
  console.log('locale111', locale);

  return (
    <IntlContainerProvider value={{ handleLocale }}>
      <IntlProvider messages={messages} locale={locale as 'zh-CN' | 'en-US'}>
        {children}
      </IntlProvider>
    </IntlContainerProvider>
  );
};

export default Provider;
