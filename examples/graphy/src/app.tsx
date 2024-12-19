import ReactDOM from 'react-dom/client';

import React, { Suspense, useEffect } from 'react';
import { Routes, HashRouter, Route } from 'react-router-dom';

import { ConfigProvider } from 'antd';

import { IntlProvider } from 'react-intl';
import { ROUTES, locales } from './index';
import { Layout } from '@graphscope/studio-components';
import { SIDE_MENU } from './pages/const';

interface IPagesProps {}

const App: React.FunctionComponent<IPagesProps> = props => {
  const locale = 'en-US';
  const messages = locales[locale];

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemSelectedBg: '#ececec',
            itemSelectedColor: '#191919',
            collapsedWidth: 50,
            collapsedIconSize: 14,
          },
        },
      }}
    >
      <IntlProvider messages={messages} locale={locale}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout sideMenu={[SIDE_MENU]} />}>
              {ROUTES}
            </Route>
          </Routes>
        </HashRouter>
      </IntlProvider>
    </ConfigProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
