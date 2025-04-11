// 主题类型定义
export type ThemeStyle = 'antd' | 'shadcn';
export type ThemeMode = 'light' | 'dark';

// 本地存储键
export const THEME_STYLE_KEY = 'duckdb_theme_style';
export const THEME_MODE_KEY = 'duckdb_theme_mode';

// Shadcn UI 风格的基础颜色 (基于slate色系)
// 浅色模式
export const SHADCN_LIGHT = {
  background: '#ffffff',
  foreground: '#0f172a',
  card: '#ffffff',
  cardForeground: '#0f172a',
  popover: '#ffffff',
  popoverForeground: '#0f172a',
  primary: '#0f172a',
  primaryForeground: '#f8fafc',
  secondary: '#f1f5f9',
  secondaryForeground: '#0f172a',
  muted: '#f1f5f9',
  mutedForeground: '#64748b',
  accent: '#f1f5f9',
  accentForeground: '#0f172a',
  destructive: '#ef4444',
  destructiveForeground: '#f8fafc',
  border: '#e2e8f0',
  input: '#e2e8f0',
  ring: '#94a3b8',
};

// 深色模式
export const SHADCN_DARK = {
  background: '#0f172a',
  foreground: '#f8fafc',
  card: '#1e293b',
  cardForeground: '#f8fafc',
  popover: '#1e293b',
  popoverForeground: '#f8fafc',
  primary: '#f8fafc',
  primaryForeground: '#0f172a',
  secondary: '#334155',
  secondaryForeground: '#f8fafc',
  muted: '#334155',
  mutedForeground: '#94a3b8',
  accent: '#334155',
  accentForeground: '#f8fafc',
  destructive: '#ef4444',
  destructiveForeground: '#f8fafc',
  border: 'rgba(255, 255, 255, 0.1)',
  input: 'rgba(255, 255, 255, 0.15)',
  ring: '#94a3b8',
};

// Ant Design 风格的基础颜色
export const ANTD_PRIMARY = '#1677ff';
export const ANTD_SUCCESS = '#52c41a';
export const ANTD_WARNING = '#faad14';
export const ANTD_ERROR = '#ff4d4f';
export const ANTD_INFO = '#1677ff';

// 字体设置
export const BASE_FONT_FAMILY = "'Geist', -apple-system, BlinkSans, sans-serif";

// Shadcn特有的圆角设置
export const SHADCN_RADIUS = '6'; // 标准圆角值
