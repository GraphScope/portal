import { useLocaleProvider } from './useLocaleProvider';

export const useLocales = () => {
  const { locale = 'en-US', handleLocale } = useLocaleProvider();
  const handleLocales = () => {
    const updateTheValue = locale === 'en-US' ? 'zh-CN' : 'en-US';
    handleLocale(updateTheValue);
  };
  return {
    locale,
    handleLocales,
  };
};

