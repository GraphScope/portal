import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DatasetPage from './pages/DatasetPage';
import QueryPage from './pages/QueryPage';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';
import { ThemeProvider } from './utils/theme/';
import { LocaleProvider } from './utils/locale/';
import { useDynamicStyle } from './hooks/useDynamicStyle';
import { globalStyles } from './styles/dynamicStyles';
import { FormattedMessage } from 'react-intl';

const App: React.FC = () => {
  // 使用 useDynamicStyle 钩子注入全局样式
  useDynamicStyle(globalStyles, 'global-styles');

  return (
    <LocaleProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </LocaleProvider>
  );
};

const AppContent: React.FC = () => {
  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="logo">DuckDB CSV Query Tool</div>
          <nav className="nav">
            <Link to="/">
              <FormattedMessage id="home" />
            </Link>
            <Link to="/datasets">
              <FormattedMessage id="datasets" />
            </Link>
            <Link to="/query">
              <FormattedMessage id="query" />
            </Link>
            <Link to="/settings">
              <FormattedMessage id="settings" />
            </Link>
            <Link to="/about">
              <FormattedMessage id="about" />
            </Link>
          </nav>
        </div>
      </header>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/datasets" element={<DatasetPage />} />
          <Route path="/query" element={<QueryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
