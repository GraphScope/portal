import { ThemeStyle } from './constants';
import type { ThemeConfig } from 'antd';
import { SHADCN_RADIUS } from './constants';

/**
 * 获取组件级别的样式配置
 * 在shadcn风格下返回自定义配置，在antd风格下返回空对象
 * @param themeStyle 当前主题风格
 * @returns 组件级别的样式配置
 */
export const getComponentsConfig = (themeStyle: ThemeStyle): ThemeConfig['components'] => {
  const isShadcn = themeStyle === 'shadcn';

  if (!isShadcn) {
    // 在antd风格下返回空对象，使用antd的默认样式
    return {};
  }

  // 以下配置仅在shadcn风格下应用
  // 圆角值为固定像素值
  const radius = 8; // shadcn默认圆角 (0.5rem = 8px)
  const radiusLG = 12; // 大号圆角
  const radiusSM = 6; // 小号圆角

  return {
    Button: {
      // shadcn按钮更方正，边框更细，内部填充更大
      borderRadius: radius,
      controlHeight: 40,
      controlHeightLG: 44,
      controlHeightSM: 36,
      paddingContentHorizontal: 16,
      paddingInlineSM: 12,
      paddingInlineLG: 20,
      lineWidth: 1,
      // 按钮动画更柔和
      motionDurationMid: '0.2s',
      // 更明显的悬停效果
      colorPrimaryHover: 'rgba(15, 23, 42, 0.9)',
    },
    Card: {
      borderRadius: radiusLG,
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
      colorBorderSecondary: 'transparent',
      paddingLG: 24,
    },
    Input: {
      borderRadius: radius,
      controlHeight: 40,
      controlHeightLG: 44,
      controlHeightSM: 36,
      lineWidth: 1,
      activeShadow: '0 0 0 2px rgba(15, 23, 42, 0.1)',
    },
    Select: {
      borderRadius: radius,
      controlHeight: 40,
      controlHeightLG: 44,
      controlHeightSM: 36,
      optionSelectedBg: 'rgba(15, 23, 42, 0.06)',
    },
    Table: {
      borderRadius: radiusLG,
      headerBg: 'transparent',
      headerSplitColor: 'rgba(0, 0, 0, 0.05)',
      rowHoverBg: 'rgba(15, 23, 42, 0.03)',
      colorBgContainer: 'transparent',
    },
    Modal: {
      borderRadius: radiusLG,
      titleFontSize: 18,
      paddingMD: 24,
    },
    Dropdown: {
      borderRadius: radius,
      controlItemBgHover: 'rgba(15, 23, 42, 0.05)',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
      padding: 6,
    },
    Tabs: {
      cardHeight: 40,
      horizontalItemGutter: 16,
      colorBorderSecondary: 'transparent',
      inkBarColor: 'currentColor',
    },
    Checkbox: {
      borderRadius: radiusSM,
      colorPrimary: 'currentColor',
    },
    Radio: {
      borderRadius: 9, // 保持圆形
      colorPrimary: 'currentColor',
    },
    Switch: {
      trackHeight: 24,
      trackPadding: 2,
      trackMinWidth: 48,
    },
  };
};
