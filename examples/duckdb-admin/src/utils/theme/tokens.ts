import { AliasToken } from 'antd/es/theme/interface';
import {
  SHADCN_LIGHT,
  SHADCN_DARK,
  ANTD_PRIMARY,
  ANTD_SUCCESS,
  ANTD_WARNING,
  ANTD_ERROR,
  ANTD_INFO,
  BASE_FONT_FAMILY,
  SHADCN_RADIUS,
} from './constants';

/**
 * 获取Shadcn风格的Token配置
 * @param isDarkMode 是否为深色模式
 * @returns Shadcn风格的Token配置
 */
export const getShadcnTokens = (isDarkMode: boolean): Partial<AliasToken> => {
  // 根据模式选择适当的颜色集
  const colors = isDarkMode ? SHADCN_DARK : SHADCN_LIGHT;

  return {
    // 基础颜色
    colorPrimary: colors.primary,
    colorSuccess: isDarkMode ? '#10b981' : '#22c55e', // 绿色
    colorWarning: isDarkMode ? '#f59e0b' : '#f59e0b', // 琥珀色
    colorError: colors.destructive,
    colorInfo: isDarkMode ? '#3b82f6' : '#3b82f6', // 蓝色
    colorLink: colors.primary,

    // 背景色系列
    colorBgContainer: colors.background,
    colorBgElevated: colors.card,
    colorBgLayout: colors.background,
    colorBgSpotlight: colors.muted,
    colorBgBase: colors.background,

    // 文本色系列
    colorText: colors.foreground,
    colorTextBase: colors.foreground,
    colorTextSecondary: colors.mutedForeground,
    colorTextTertiary: colors.mutedForeground,
    colorTextQuaternary: colors.mutedForeground,
    colorTextDisabled: isDarkMode ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.25)',

    // 边框色系列
    colorBorder: colors.border,
    colorBorderSecondary: colors.input,
    colorSplit: colors.border,

    // 字体相关
    fontFamily: BASE_FONT_FAMILY,
    fontSize: 14,

    // 圆角大小 - 使用shadcn标准值
    borderRadius: 8, // 0.5rem = 8px
    borderRadiusLG: 12, // 大号圆角
    borderRadiusSM: 6, // 小号圆角
    borderRadiusXS: 4, // 特小号圆角

    // 控件尺寸
    controlHeight: 40, // shadcn风格的标准高度
    controlHeightLG: 44,
    controlHeightSM: 36,

    // 交互状态
    colorPrimaryHover: isDarkMode ? '#f1f5f9' : '#1e293b',
    colorPrimaryActive: isDarkMode ? '#e2e8f0' : '#334155',

    // 禁用状态
    colorBgContainerDisabled: isDarkMode ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.6)',

    // 阴影 - 符合shadcn-ui的风格
    boxShadow: isDarkMode
      ? '0 1px 2px 0 rgb(0 0 0 / 0.3)'
      : '0 1px 2px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    boxShadowSecondary: isDarkMode
      ? '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)'
      : '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',

    // 按钮和输入框的过渡效果
    motion: true,
    wireframe: false,
  };
};

/**
 * 获取Ant Design风格的Token配置
 * 仅应用最小必要的token，让其余保持antd默认值
 * @param isDarkMode 是否为深色模式
 * @returns Ant Design风格的Token配置
 */
export const getAntdTokens = (isDarkMode: boolean): Partial<AliasToken> => {
  // 仅设置基本颜色和字体，其余使用antd默认值
  return {
    // 基础颜色
    colorPrimary: ANTD_PRIMARY,
    colorSuccess: ANTD_SUCCESS,
    colorWarning: ANTD_WARNING,
    colorError: ANTD_ERROR,
    colorInfo: ANTD_INFO,

    // 字体相关
    fontFamily: BASE_FONT_FAMILY,

    // 允许动画效果
    motion: true,
  };
};
