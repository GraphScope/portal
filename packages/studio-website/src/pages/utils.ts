import { notification as notifications } from 'antd';
import { createTheme } from '@uiw/codemirror-themes';
import { useStudioProvier, useCustomToken } from '@graphscope/studio-components';
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

//@ts-ignore
export const useEditorTheme = (isEdit: boolean): any => {
  const { algorithm } = useStudioProvier();
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
