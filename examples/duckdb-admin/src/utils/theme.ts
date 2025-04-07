import { theme, type ThemeConfig } from 'antd';

// 导出自定义的 shadcn-ui 主题配置
export const shadcnTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#1a1a1e',
    borderRadius: 6,
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f8fafc',
    colorText: '#0f172a',
    colorTextSecondary: '#64748b',
    colorBorder: '#e2e8f0',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  components: {
    Button: {
      borderRadius: 6,
      controlHeight: 36,
      paddingContentHorizontal: 16,
    },
    Card: {
      borderRadius: 8,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    },
    Table: {
      borderRadius: 8,
      headerBg: '#f8fafc',
      headerColor: '#0f172a',
      rowHoverBg: '#f1f5f9',
    },
    Input: {
      borderRadius: 6,
      controlHeight: 36,
    },
    Select: {
      borderRadius: 6,
      controlHeight: 36,
    },
    Tabs: {
      cardBg: '#ffffff',
      cardGutter: 8,
      cardPadding: '8px 16px',
      inkBarColor: '#1a1a1e',
      itemSelectedColor: '#1a1a1e',
      itemHoverColor: '#1a1a1e',
    },
  },
};

// 创建自定义算法的函数
export function getShadcnAlgorithm() {
  const shadcnAlgorithm = (seedToken: any, mapToken: any) => {
    const mergedMapToken = { ...mapToken };

    // shadcn-ui 风格的调整
    mergedMapToken.borderRadius = 6;
    mergedMapToken.colorPrimary = '#1a1a1e';
    mergedMapToken.colorBgContainer = '#ffffff';
    mergedMapToken.colorBgElevated = '#ffffff';
    mergedMapToken.colorBgLayout = '#f8fafc';
    mergedMapToken.colorText = '#0f172a';
    mergedMapToken.colorTextSecondary = '#64748b';
    mergedMapToken.colorBorder = '#e2e8f0';
    mergedMapToken.controlHeight = 36;
    mergedMapToken.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';

    return mergedMapToken;
  };

  return shadcnAlgorithm;
}

// 使用自定义算法的配置示例
export const shadcnAlgorithmTheme: ThemeConfig = {
  algorithm: [getShadcnAlgorithm(), theme.defaultAlgorithm],
  token: {
    colorPrimary: '#1a1a1e',
  },
};
