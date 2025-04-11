import React from 'react';
import { Card, Typography, Radio, Space, Switch, Divider } from 'antd';
import { useTheme } from '../utils/theme/';
import { useLocale } from '../utils/locale/';
import LocaleSwitch from '../components/LocaleSwitch';
import { FormattedMessage } from 'react-intl';
import type { ThemeStyle, ThemeMode } from '../utils/theme/';

const { Title, Paragraph } = Typography;

const SettingsPage: React.FC = () => {
  const { themeStyle, themeMode, setThemeStyle, setThemeMode } = useTheme();
  const { locale, setLocale } = useLocale();

  const handleStyleChange = (e: any) => {
    setThemeStyle(e.target.value as ThemeStyle);
  };

  const handleModeChange = (checked: boolean) => {
    setThemeMode(checked ? 'dark' : 'light');
  };

  return (
    <div>
      <Title level={2}>
        <FormattedMessage id="settings.title" />
      </Title>
      <Paragraph>
        <FormattedMessage id="settings.description" />
      </Paragraph>

      <Card title={<FormattedMessage id="appearance.settings" />} className="settings-card">
        <div className="setting-item">
          <Title level={4}>
            <FormattedMessage id="ui.style" />
          </Title>
          <Paragraph>
            <FormattedMessage id="ui.style.description" />
          </Paragraph>
          <Radio.Group value={themeStyle} onChange={handleStyleChange}>
            <Space direction="vertical">
              <Radio value="antd">
                <FormattedMessage id="antd.style" />
              </Radio>
              <Radio value="shadcn">
                <FormattedMessage id="shadcn.style" />
              </Radio>
            </Space>
          </Radio.Group>
        </div>

        <Divider />

        <div className="setting-item">
          <Title level={4}>
            <FormattedMessage id="theme.mode" />
          </Title>
          <Paragraph>
            <FormattedMessage id="theme.mode.description" />
          </Paragraph>
          <div className="theme-switch">
            <span>
              <FormattedMessage id="light" />
            </span>
            <Switch checked={themeMode === 'dark'} onChange={handleModeChange} />
            <span>
              <FormattedMessage id="dark" />
            </span>
          </div>
        </div>
      </Card>

      <Card title={<FormattedMessage id="language.settings" />} className="settings-card" style={{ marginTop: '20px' }}>
        <div className="setting-item">
          <Title level={4}>
            <FormattedMessage id="language.selection" />
          </Title>
          <Paragraph>
            <FormattedMessage id="language.description" />
          </Paragraph>
          <LocaleSwitch value={locale} onChange={setLocale} />
        </div>
      </Card>

      <Card title={<FormattedMessage id="about.info" />} className="settings-card" style={{ marginTop: '20px' }}>
        <Paragraph>
          <FormattedMessage id="about.description" />
        </Paragraph>
        <Paragraph>
          <FormattedMessage id="built.with" />{' '}
          <a href="https://duckdb.org/" target="_blank" rel="noopener noreferrer">
            DuckDB
          </a>{' '}
          <FormattedMessage id="and" />{' '}
          <a href="https://ant.design/" target="_blank" rel="noopener noreferrer">
            Ant Design
          </a>
          , <FormattedMessage id="style.inspiration" />{' '}
          <a href="https://ui.shadcn.com/" target="_blank" rel="noopener noreferrer">
            shadcn/ui
          </a>
          .
        </Paragraph>
      </Card>
    </div>
  );
};

export default SettingsPage;
