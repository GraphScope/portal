import { notification as notifications } from 'antd';
import { createTheme } from '@uiw/codemirror-themes';
import { useThemeProvider, useCustomToken } from '@graphscope/studio-components';
export const getSearchParams = (location: Location) => {
  const { hash } = location;
  const [path, search] = hash.split('?');
  const searchParams = new URLSearchParams(search);
  return {
    path,
    searchParams,
  };
};

export const notification = (type: string, data: any, defaultData?: string) => {
  if (type === 'success') {
    try {
      notifications.success({ message: `${data}` });
    } catch (error) {
      notifications.success({ message: `${defaultData}` });
    }
  }
  if (type === 'error') {
    const { response, message } = data;
    if (response) {
      const msg = response.data;
      try {
        notifications.error({ message, description: `${msg}` });
      } catch (error) {
        notifications.error({ message, description: `${defaultData}` });
      }
    }
  }
};

//@ts-ignore
export const useEditorTheme = (isEdit: boolean): any => {
  const { algorithm } = useThemeProvider();
  const { editorBackground, editorForeground } = useCustomToken();
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
