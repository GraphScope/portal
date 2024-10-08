import { ThemeProviderType } from './useThemeConfigProvider';
import { useThemeContainer } from './useThemeConfigProvider';
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

export const useCustomTheme = () => {
  const { algorithm } = useThemeContainer();
  const isLight = algorithm === 'defaultAlgorithm';
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
  return colorConfig;
};
