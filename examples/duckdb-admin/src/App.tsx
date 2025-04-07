import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import HomePage from './pages/HomePage';
import DatasetPage from './pages/DatasetPage';
import QueryPage from './pages/QueryPage';
import AboutPage from './pages/AboutPage';
import { shadcnAlgorithmTheme } from './utils/theme';
import { useDynamicStyle } from './hooks/useDynamicStyle';
import { globalStyles } from './styles/dynamicStyles';

const App: React.FC = () => {
  // 使用 useDynamicStyle 钩子注入全局样式
  useDynamicStyle(globalStyles, 'global-styles');

  return (
    <ConfigProvider theme={shadcnAlgorithmTheme}>
      <header className="header">
        <div className="header-content">
          <div className="logo">DuckDB CSV Query Tool</div>
          <nav className="nav">
            <Link to="/">首页</Link>
            <Link to="/datasets">数据集</Link>
            <Link to="/query">查询</Link>
            <Link to="/about">关于</Link>
          </nav>
        </div>
      </header>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/datasets" element={<DatasetPage />} />
          <Route path="/query" element={<QueryPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </ConfigProvider>
  );
};

export default App;
