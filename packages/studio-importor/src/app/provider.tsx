import React from 'react';
import { IntlProvider } from 'react-intl';

import locales from '../locales';
import { ThemeProvider } from '@graphscope/studio-components';

export default function Provider(props) {
  const { locale, theme, children } = props;
  const { mode, inputNumber = '6px' } = theme;
  //@ts-ignore
  const messages = locales[locale];
  return (
    <IntlProvider messages={messages} locale={locale}>
      <ThemeProvider mode={mode}>{children}</ThemeProvider>
    </IntlProvider>
  );
}
