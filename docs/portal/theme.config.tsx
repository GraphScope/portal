import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';
import { Header } from '@graphscope/docs-components';

const config: DocsThemeConfig = {
  logo: <Header title="Portal" />,
  project: {
    link: 'https://github.com/GraphScope/portal',
  },
  docsRepositoryBase: 'https://github.com/GraphScope/portal/blob/main/docs',
  footer: {
    text: 'Made by Graphscope team',
  },
  head: () => {
    return (
      <>
        <meta name="msapplication-TileColor" content="#fff" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="description" content={'GraphScope Portal'} />
        <meta property="og:title" content={'GraphScope Portal'} />
        <meta property="og:description" content={'GraphScope Portal'} />
        <meta name="apple-mobile-web-app-title" content={'GraphScope Portal'} />
        <link
          rel="icon"
          type="image/x-icon"
          href="https://img.alicdn.com/imgextra/i4/O1CN01uhy1Yu1lO7HkUaW3K_!!6000000004808-2-tps-256-257.png"
        />
      </>
    );
  },
  feedback: {
    content: () => <>Question? Give me feedback →</>,
    labels: 'feedback',
  },
  i18n: [],
  useNextSeoProps: () => {
    return {
      description: 'xxxx',
      titleTemplate: '%s – GraphScope Portal',
    };
  },
};

export default config;
