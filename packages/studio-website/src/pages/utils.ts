import { notification as notifications } from 'antd';
import { createTheme } from '@uiw/codemirror-themes';
import { useThemeContainer, useCustomTheme } from '@graphscope/studio-components';
export const getSearchParams = (location: Location) => {
  const { hash } = location;
  const [path, search] = hash.split('?');
  const searchParams = new URLSearchParams(search);
  return {
    path,
    searchParams,
  };
};

export const notification = (type: string, data: any) => {
  if (type === 'success') {
    notifications.success({ message: `${data}` });
  }
  if (type === 'error') {
    const { response, message } = data;
    if (response) {
      const msg = response.data;
      notifications.error({ message, description: `${msg}` });
    }
  }
};

export const useEditorTheme = (isEdit: boolean) => {
  const { algorithm } = useThemeContainer();
  const { editorBackground, editorForeground } = useCustomTheme();
  const background = isEdit ? '#F5F5F5' : editorBackground;
  //@ts-ignore
  return createTheme({
    theme: algorithm === 'defaultAlgorithm' ? 'light' : 'dark',
    settings: {
      background,
      backgroundImage: '',
      foreground: editorForeground,
      gutterBackground: background,
    },
  });
};
