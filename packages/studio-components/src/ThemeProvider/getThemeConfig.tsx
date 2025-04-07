import { ThemeProviderType } from './useThemeConfigProvider';
export interface IColorStore {
  sectionBackground?: string;
  containerBackground?: string;
  instanceBackground?: string;
  jobDetailBorder?: string;
  jobDetailColor?: string;
  pluginBorder?: string;
  editorBackground?: string;
  editorForeground?: string;
}

export const getThemeConfig = (algorithm: ThemeProviderType['algorithm']) => {
  const isLight = algorithm === 'defaultAlgorithm';
  /** components 基础配置 */
  const componentsConfig = {
    Menu: {
      itemBg: 'rgba(255, 255, 255, 0)',
      subMenuItemBg: 'rgba(255, 255, 255, 0)',
      iconMarginInlineEnd: 14,
      itemMarginInline: 4,
      iconSize: 14,
      collapsedWidth: 56,
      horizontalLineHeight: 32,
      itemHeight: 32,
    },
    Typography: {
      titleMarginBottom: '0.2em',
      titleMarginTop: '0.8em',
    },
    Table: {
      cellPaddingBlock: 4, //	单元格纵向内间距
      cellPaddingInline: 8, //单元格横向内间距（默认大尺寸）
    },
    Pagination: {
      itemSize: 20,
    },
    Result: {
      iconFontSize: 62,
      titleFontSize: 20,
      colorError: isLight ? '#00000073' : '#ddd',
    },
  };
  /** token 基础配置 */
  const tokenConfig = {
    colorBorder: isLight ? '#F0F0F0' : '#303030',
    colorBgBase: isLight ? '#fff' : '#1d1d1d',
    colorBgLayout: isLight ? '#f5f7f9' : 'rgba(43,43,43,1)',
    fontFamily: "'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  };
  return { componentsConfig, tokenConfig };
};
