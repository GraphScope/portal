import React from 'react';
import { Card, Typography, Radio, Space, Switch, Divider } from 'antd';
import { useTheme } from '../utils/theme/';
import type { ThemeStyle, ThemeMode } from '../utils/theme/';

const { Title, Paragraph } = Typography;

const SettingsPage: React.FC = () => {
  const { themeStyle, themeMode, setThemeStyle, setThemeMode } = useTheme();

  const handleStyleChange = (e: any) => {
    setThemeStyle(e.target.value as ThemeStyle);
  };

  const handleModeChange = (checked: boolean) => {
    setThemeMode(checked ? 'dark' : 'light');
  };

  return (
    <div>
      <Title level={2}>设置</Title>
      <Paragraph>在这里您可以自定义 DuckDB CSV Query Tool 的外观。</Paragraph>

      <Card title="外观设置" className="settings-card">
        <div className="setting-item">
          <Title level={4}>UI 风格</Title>
          <Paragraph>选择应用程序的设计风格。</Paragraph>
          <Radio.Group value={themeStyle} onChange={handleStyleChange}>
            <Space direction="vertical">
              <Radio value="antd">Ant Design 风格 - 默认样式</Radio>
              <Radio value="shadcn">Shadcn UI 风格 - 现代简约</Radio>
            </Space>
          </Radio.Group>
        </div>

        <Divider />

        <div className="setting-item">
          <Title level={4}>主题模式</Title>
          <Paragraph>切换浅色或深色模式。</Paragraph>
          <div className="theme-switch">
            <span>浅色</span>
            <Switch checked={themeMode === 'dark'} onChange={handleModeChange} />
            <span>深色</span>
          </div>
        </div>
      </Card>

      <Card title="相关信息" className="settings-card" style={{ marginTop: '20px' }}>
        <Paragraph>
          DuckDB CSV Query Tool 是一个基于浏览器的工具，用于在客户端使用 DuckDB 查询 CSV 文件。
          此应用程序不会将您的数据发送到任何服务器，所有处理都在您的浏览器中完成。
        </Paragraph>
        <Paragraph>
          使用{' '}
          <a href="https://duckdb.org/" target="_blank" rel="noopener noreferrer">
            DuckDB
          </a>{' '}
          和
          <a href="https://ant.design/" target="_blank" rel="noopener noreferrer">
            {' '}
            Ant Design
          </a>{' '}
          构建， 样式灵感来自{' '}
          <a href="https://ui.shadcn.com/" target="_blank" rel="noopener noreferrer">
            shadcn/ui
          </a>
          。
        </Paragraph>
      </Card>
    </div>
  );
};

export default SettingsPage;
