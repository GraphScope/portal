import React from 'react';
import locales from '../locales';
import { ContainerProvider, useThemeContainer } from '@graphscope/studio-components';
export default function Provider(props) {
  const { children } = props;
  const { algorithm, locale } = useThemeContainer();
  //@ts-ignore
  const messages = locales[locale];
  return (
    <ContainerProvider algorithm={algorithm} messages={messages}>
      {children}
    </ContainerProvider>
  );
}
