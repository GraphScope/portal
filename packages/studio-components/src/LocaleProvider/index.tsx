import React, { useState } from 'react';
import { IntlProvider } from 'react-intl';
import { LocaleProvider } from './useLocaleProvider';
import { storage } from '../Utils';

type localeType = 'zh-CN' | 'en-US';

type ILocaleProvider = {
  locales: {
    'zh-CN': Record<string, string>;
    'en-US': Record<string, string>;
  };
  children: React.ReactNode;
  locale?: localeType;
};

const Provider: React.FC<ILocaleProvider> = props => {
  const { children, locales } = props;
  const [currentLocale, setCurrentLocale] = useState<'zh-CN' | 'en-US'>(() => {
    let { locale } = props;
    if (!locale) {
      locale = storage.get('locale');
      if (!locale) {
        locale = 'en-US';
        storage.set('locale', locale);
      }
    }
    return locale;
  });

  const handleLocale = (localeConfig: localeType) => {
    storage.set('locale', localeConfig);
    setCurrentLocale(localeConfig);
  };

  const messages = locales[currentLocale || 'en-US'];

  return (
    <LocaleProvider
      value={{
        handleLocale,
        locale: currentLocale,
      }}
    >
      <IntlProvider messages={messages} locale={currentLocale as 'zh-CN' | 'en-US'}>
        {children}
      </IntlProvider>
    </LocaleProvider>
  );
};

export default Provider;
