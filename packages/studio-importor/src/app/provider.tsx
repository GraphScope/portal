import React from 'react';
import { IntlProvider } from 'react-intl';

import locales from '../locales';
import { ThemeProvider, useThemeContainer } from '@graphscope/studio-components';

export default function Provider(props) {
  const { locale, children } = props;
  const { algorithm } = useThemeContainer();
  //@ts-ignore
  const messages = locales[locale];
  return (
    <IntlProvider messages={messages} locale={locale}>
      <ThemeProvider algorithm={algorithm}>{children}</ThemeProvider>
    </IntlProvider>
  );
}
