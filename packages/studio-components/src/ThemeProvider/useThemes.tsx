import { useThemeProvider } from './useThemeConfigProvider';

export const useThemes = () => {
  const { algorithm = 'defaultAlgorithm', handleTheme } = useThemeProvider();
  const isDark = algorithm === 'darkAlgorithm';
  const updateTheme = () => {
    const updateTheValue = isDark ? 'defaultAlgorithm' : 'darkAlgorithm';
    handleTheme({
      algorithm: updateTheValue,
    });
  };
  return {
    algorithm,
    updateTheme,
    isDark
  };
};
