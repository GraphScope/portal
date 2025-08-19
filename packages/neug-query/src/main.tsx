import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { StudioProvier } from '@graphscope/studio-components';
import App from './App';

// 导入国际化配置
import locales from './locales';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StudioProvier locales={locales}>
      <HashRouter>
        <App />
      </HashRouter>
    </StudioProvier>
  </React.StrictMode>,
);
