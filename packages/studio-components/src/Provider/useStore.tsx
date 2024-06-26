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

export const useStore = (algorithm: ThemeProviderType['algorithm']) => {
  const isLight = algorithm === 'defaultAlgorithm';
  /** components 基础配置 */
  const componentsConfig = {
    Menu: {
      itemBg: 'rgba(255, 255, 255, 0)',
      subMenuItemBg: 'rgba(255, 255, 255, 0)',
      iconMarginInlineEnd: 14,
      itemMarginInline: 4,
      iconSize: 14,
      collapsedWidth: 60,
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
      colorError: '#00000073',
    },
  };
  /** token 基础配置 */
  const tokenConfig = {
    colorBorder: isLight ? '#F0F0F0' : '#303030',
    colorBgBase: isLight ? '#fff' : 'rgba(12,12,12,1)',
    colorBgLayout: isLight ? '#f5f7f9' : 'rgba(43,43,43,1)',
  };
  /** 特殊颜色配置 */
  const colorConfig = {
    sectionBackground: isLight ? '#fff' : '#0D0D0D',
    containerBackground: isLight ? '#f5f7f9' : '#020202',
    instanceBackground: isLight ? '#FCFCFC' : '',
    jobDetailBorder: isLight ? '#efefef' : '#323232',
    jobDetailColor: isLight ? '#1F1F1F' : '#808080',
    pluginBorder: isLight ? '#efefef' : '#323232',
    editorBackground: isLight ? '#fff' : '#151515',
    editorForeground: isLight ? '#212121' : '#FFF',
  };
  return { componentsConfig, tokenConfig, colorConfig };
};
