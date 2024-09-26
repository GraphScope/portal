import ReactDOM from 'react-dom/client';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ConfigProvider } from 'antd';

import { IntlProvider } from 'react-intl';
import App from './app';

interface IPagesProps {}

const GraphApps: React.FunctionComponent<IPagesProps> = props => {
  const locale = 'en-US';
  const messages = {};
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
        <BrowserRouter>
          <Routes>
            <Route key={'/'} path={'/'} element={<App />} />
          </Routes>
        </BrowserRouter>
      </IntlProvider>
    </ConfigProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<GraphApps />);
